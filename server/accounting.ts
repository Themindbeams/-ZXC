import { db } from './db';
import {
  JournalEntry,
  JournalLine,
  ChartOfAccount,
  FiscalPeriod,
  ModuleName
} from './types';

export interface CreateJournalParams {
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  date: string;
  sourceModule: ModuleName;
  sourceReference: string;
  memo: string;
  lines: {
    accountCode: string;
    debitMinorUnits: number;
    creditMinorUnits: number;
    memo?: string;
  }[];
  createdByUserId: string;
}

export function postJournal(params: CreateJournalParams): { success: boolean; error?: string; journal?: JournalEntry } {
  const data = db.getData();

  // 1. Validate Lines exist
  if (!params.lines || params.lines.length < 2) {
    return { success: false, error: 'Double-entry requires at least two journal lines.' };
  }

  // 2. Validate Fixed-Precision Debits and Credits Balance
  let totalDebit = 0;
  let totalCredit = 0;

  for (const line of params.lines) {
    if (line.debitMinorUnits < 0 || line.creditMinorUnits < 0) {
      return { success: false, error: 'Negative debit or credit amounts are not permitted. Use offsetting entries.' };
    }
    if (line.debitMinorUnits > 0 && line.creditMinorUnits > 0) {
      return { success: false, error: 'A journal line cannot contain both debit and credit. Split into separate lines.' };
    }
    totalDebit += Math.round(line.debitMinorUnits);
    totalCredit += Math.round(line.creditMinorUnits);
  }

  if (totalDebit !== totalCredit) {
    return {
      success: false,
      error: `Unbalanced journal: Total Debits (${totalDebit}) do not equal Total Credits (${totalCredit}). Variance: ${totalDebit - totalCredit}.`
    };
  }

  if (totalDebit <= 0) {
    return { success: false, error: 'Journal amount must be greater than zero.' };
  }

  // 3. Fiscal Period Validation & Period Lock Check
  const journalDate = params.date || new Date().toISOString().substring(0, 10);
  const matchingPeriod = data.fiscalPeriods.find(
    fp => fp.tenantId === params.tenantId &&
          fp.legalEntityId === params.legalEntityId &&
          journalDate >= fp.startDate &&
          journalDate <= fp.endDate
  );

  if (matchingPeriod && matchingPeriod.isLocked) {
    return {
      success: false,
      error: `Posting Rejected: Fiscal period '${matchingPeriod.periodName}' is locked for audit. Transactions cannot be posted into closed periods.`
    };
  }

  const fiscalPeriodId = matchingPeriod ? matchingPeriod.id : 'fp_open';

  // 4. Validate all referenced accounts exist in tenant/entity
  const resolvedLines: JournalLine[] = [];
  for (let i = 0; i < params.lines.length; i++) {
    const l = params.lines[i];
    const acct = data.accounts.find(
      a => a.tenantId === params.tenantId &&
           a.legalEntityId === params.legalEntityId &&
           a.code === l.accountCode
    );

    if (!acct) {
      return { success: false, error: `Account code '${l.accountCode}' does not exist in chart of accounts for this entity.` };
    }

    resolvedLines.push({
      id: `jl_${Date.now()}_${i}`,
      accountId: acct.id,
      accountCode: acct.code,
      debitMinorUnits: Math.round(l.debitMinorUnits),
      creditMinorUnits: Math.round(l.creditMinorUnits),
      memo: l.memo || params.memo
    });
  }

  // 5. Check Idempotency: prevent duplicate posting for same source reference
  if (params.sourceReference) {
    const existing = data.journalEntries.find(
      j => j.tenantId === params.tenantId &&
           j.sourceModule === params.sourceModule &&
           j.sourceReference === params.sourceReference &&
           j.status === 'Posted'
    );
    if (existing) {
      return {
        success: false,
        error: `Duplicate Posting Prevented: Source event '${params.sourceReference}' has already posted as journal ${existing.entryNumber}.`
      };
    }
  }

  // 6. Generate sequential entry number
  const nextNum = String(data.journalEntries.length + 101).padStart(5, '0');
  const entryNumber = `JNL-2026-${nextNum}`;

  const newJournal: JournalEntry = {
    id: `jnl_${Date.now()}`,
    tenantId: params.tenantId,
    legalEntityId: params.legalEntityId,
    branchId: params.branchId,
    entryNumber,
    date: journalDate,
    fiscalPeriodId,
    sourceModule: params.sourceModule,
    sourceReference: params.sourceReference,
    lines: resolvedLines,
    memo: params.memo,
    status: 'Posted',
    isReversal: false,
    createdBy: params.createdByUserId,
    postedAt: new Date().toISOString(),
    totalDebitMinor: totalDebit,
    totalCreditMinor: totalCredit
  };

  // 7. Update account balances (Debit increases Assets & Expenses, decreases Liab/Eq/Rev)
  for (const line of resolvedLines) {
    const acct = data.accounts.find(a => a.id === line.accountId)!;
    const isDebitNormal = acct.type === 'Asset' || acct.type === 'Expense';
    if (isDebitNormal) {
      acct.balanceMinorUnits += (line.debitMinorUnits - line.creditMinorUnits);
    } else {
      acct.balanceMinorUnits += (line.creditMinorUnits - line.debitMinorUnits);
    }
  }

  data.journalEntries.unshift(newJournal);
  db.save();

  return { success: true, journal: newJournal };
}

// Controlled Reversal: Posted journals cannot be silently deleted or edited
export function reverseJournal(
  journalId: string,
  tenantId: string,
  reversalReason: string,
  reversingUserId: string
): { success: boolean; error?: string; reversalJournal?: JournalEntry } {
  const data = db.getData();
  const original = data.journalEntries.find(j => j.id === journalId && j.tenantId === tenantId);

  if (!original) {
    return { success: false, error: 'Original journal entry not found.' };
  }

  if (original.status === 'Reversed') {
    return { success: false, error: 'This journal entry has already been reversed.' };
  }

  if (original.isReversal) {
    return { success: false, error: 'Cannot reverse an entry that is already a reversal.' };
  }

  // Invert lines: debits become credits, credits become debits
  const invertedLines = original.lines.map(line => ({
    accountCode: line.accountCode,
    debitMinorUnits: line.creditMinorUnits,
    creditMinorUnits: line.debitMinorUnits,
    memo: `Reversal of ${original.entryNumber}: ${line.memo}`
  }));

  const res = postJournal({
    tenantId: original.tenantId,
    legalEntityId: original.legalEntityId,
    branchId: original.branchId,
    date: new Date().toISOString().substring(0, 10),
    sourceModule: original.sourceModule,
    sourceReference: `REV-${original.entryNumber}`,
    memo: `REVERSAL of ${original.entryNumber} — ${reversalReason}`,
    lines: invertedLines,
    createdByUserId: reversingUserId
  });

  if (!res.success || !res.journal) {
    return { success: false, error: res.error || 'Failed generating reversal entry.' };
  }

  res.journal.isReversal = true;
  res.journal.reversedJournalId = original.id;
  original.status = 'Reversed';

  db.save();
  return { success: true, reversalJournal: res.journal };
}

// Financial Statements Generation with Precision Balance Validation
export function generateFinancialReports(tenantId: string, legalEntityId: string) {
  const data = db.getData();
  const accounts = data.accounts.filter(
    a => a.tenantId === tenantId && a.legalEntityId === legalEntityId
  );

  // 1. Trial Balance
  let totalDebits = 0;
  let totalCredits = 0;

  const trialBalanceRows = accounts.map(a => {
    const isDebitNormal = a.type === 'Asset' || a.type === 'Expense';
    let debit = 0;
    let credit = 0;

    if (isDebitNormal) {
      if (a.balanceMinorUnits >= 0) {
        debit = a.balanceMinorUnits;
      } else {
        credit = Math.abs(a.balanceMinorUnits);
      }
    } else {
      if (a.balanceMinorUnits >= 0) {
        credit = a.balanceMinorUnits;
      } else {
        debit = Math.abs(a.balanceMinorUnits);
      }
    }

    totalDebits += debit;
    totalCredits += credit;

    return {
      code: a.code,
      name: a.name,
      type: a.type,
      debitMinor: debit,
      creditMinor: credit,
      balanceMinor: a.balanceMinorUnits
    };
  });

  // 2. Income Statement (P&L)
  const revenueAccounts = accounts.filter(a => a.type === 'Revenue');
  const expenseAccounts = accounts.filter(a => a.type === 'Expense');

  const totalRevenueMinor = revenueAccounts.reduce((sum, a) => sum + Math.max(0, a.balanceMinorUnits), 0);
  const totalExpenseMinor = expenseAccounts.reduce((sum, a) => sum + Math.max(0, a.balanceMinorUnits), 0);
  const netIncomeMinor = totalRevenueMinor - totalExpenseMinor;

  // 3. Balance Sheet
  const assetAccounts = accounts.filter(a => a.type === 'Asset');
  const liabilityAccounts = accounts.filter(a => a.type === 'Liability');
  const equityAccounts = accounts.filter(a => a.type === 'Equity');

  const totalAssetsMinor = assetAccounts.reduce((sum, a) => sum + Math.max(0, a.balanceMinorUnits), 0);
  const totalLiabilitiesMinor = liabilityAccounts.reduce((sum, a) => sum + Math.max(0, a.balanceMinorUnits), 0);
  const totalBaseEquityMinor = equityAccounts.reduce((sum, a) => sum + Math.max(0, a.balanceMinorUnits), 0);

  // Total Equity includes current period Net Income
  const totalEquityMinor = totalBaseEquityMinor + netIncomeMinor;
  const isBalanceSheetBalanced = Math.abs(totalAssetsMinor - (totalLiabilitiesMinor + totalEquityMinor)) === 0;

  return {
    trialBalance: {
      rows: trialBalanceRows,
      totalDebitsMinor: totalDebits,
      totalCreditsMinor: totalCredits,
      isBalanced: totalDebits === totalCredits
    },
    incomeStatement: {
      revenueAccounts: revenueAccounts.map(a => ({ code: a.code, name: a.name, amountMinor: a.balanceMinorUnits })),
      expenseAccounts: expenseAccounts.map(a => ({ code: a.code, name: a.name, amountMinor: a.balanceMinorUnits })),
      totalRevenueMinor,
      totalExpenseMinor,
      netIncomeMinor
    },
    balanceSheet: {
      assetAccounts: assetAccounts.map(a => ({ code: a.code, name: a.name, amountMinor: a.balanceMinorUnits })),
      liabilityAccounts: liabilityAccounts.map(a => ({ code: a.code, name: a.name, amountMinor: a.balanceMinorUnits })),
      equityAccounts: equityAccounts.map(a => ({ code: a.code, name: a.name, amountMinor: a.balanceMinorUnits })),
      totalAssetsMinor,
      totalLiabilitiesMinor,
      totalEquityMinor,
      isBalanced: isBalanceSheetBalanced
    }
  };
}
