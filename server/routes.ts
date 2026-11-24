import { Router, Request, Response } from 'express';
import { db } from './db';
import {
  authenticateUser,
  revokeSession,
  switchSessionBranch,
  sanitizeUser,
  logAudit,
  hashPassword
} from './auth';
import { requireAuth, requirePermission } from './middleware';
import { postJournal, reverseJournal, generateFinancialReports } from './accounting';
import {
  POSTillShift,
  POSSaleTransaction,
  RetailReturnRecord,
  AutomotiveJobCard,
  WeighbridgeIntakeTicket,
  AgribusinessProcessingBatch,
  AgribusinessProduceSale,
  FreightDispatchTrip,
  PassengerRouteTrip,
  FuelPumpShiftRecord,
  PayrollRunBatch,
  PayoutDisbursement
} from './types';

export const apiRouter = Router();

// ============================================================================
// 1. AUTHENTICATION, STAFF ACCESS & SESSIONS
// ============================================================================

// POST /api/auth/login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'MissingCredentials', message: 'Username/email and password required.' });
  }

  const result = authenticateUser(usernameOrEmail, password, ipAddress, userAgent);

  if (!result.success || !result.context || !result.token) {
    return res.status(401).json({ error: 'AuthFailed', message: result.error || 'Authentication failed.' });
  }

  // Set HTTP-only session cookie
  res.cookie('zeex_session', result.token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000
  });

  return res.json({
    message: 'Authentication successful',
    token: result.token,
    user: result.context.user,
    roles: result.context.roles,
    activeBranch: result.context.activeBranch,
    authorizedBranches: result.context.authorizedBranches
  });
});

// GET /api/auth/me
apiRouter.get('/auth/me', requireAuth, (req: Request, res: Response) => {
  const ctx = req.auth!;
  return res.json({
    user: ctx.user,
    roles: ctx.roles,
    activeBranch: ctx.activeBranch,
    authorizedBranches: ctx.authorizedBranches,
    session: {
      id: ctx.session.id,
      expiresAt: ctx.session.expiresAt,
      createdAt: ctx.session.createdAt
    }
  });
});

// POST /api/auth/logout
apiRouter.post('/auth/logout', requireAuth, (req: Request, res: Response) => {
  const ctx = req.auth!;
  revokeSession(ctx.session.id, ctx.user.id);
  res.clearCookie('zeex_session');
  return res.json({ message: 'Session logged out successfully' });
});

// POST /api/auth/switch-branch
apiRouter.post('/auth/switch-branch', requireAuth, (req: Request, res: Response) => {
  const { branchId } = req.body;
  if (!branchId) {
    return res.status(400).json({ error: 'MissingBranchId', message: 'Target branchId required.' });
  }

  const result = switchSessionBranch(req.auth!.session.token, branchId);
  if (!result.success) {
    return res.status(403).json({ error: 'BranchSwitchDenied', message: result.error });
  }

  return res.json({
    message: 'Branch switched successfully',
    activeBranch: result.activeBranch
  });
});

// GET /api/auth/sessions (User can view their own active sessions; Admin can view all)
apiRouter.get('/auth/sessions', requireAuth, (req: Request, res: Response) => {
  const data = db.getData();
  const isDirector = req.auth!.roles.some(r => r.role === 'OwnerDirector' || r.role === 'OrgAdmin');

  const visibleSessions = data.sessions
    .filter(s => s.tenantId === req.auth!.user.tenantId && (isDirector || s.userId === req.auth!.user.id))
    .map(s => {
      const u = data.users.find(x => x.id === s.userId);
      const b = data.branches.find(x => x.id === s.activeBranchId);
      return {
        id: s.id,
        userName: u ? u.fullName : 'Unknown',
        username: u ? u.username : 'Unknown',
        branchName: b ? b.name : 'Unknown Branch',
        deviceType: s.userAgent.slice(0, 40),
        ipAddress: s.ipAddress,
        loginTime: s.createdAt,
        lastActiveTime: s.lastActiveAt,
        status: s.status,
        isCurrent: s.id === req.auth!.session.id
      };
    });

  return res.json({ sessions: visibleSessions });
});

// POST /api/auth/revoke-session
apiRouter.post('/auth/revoke-session', requireAuth, (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const data = db.getData();
  const target = data.sessions.find(s => s.id === sessionId && s.tenantId === req.auth!.user.tenantId);

  if (!target) {
    return res.status(404).json({ error: 'NotFound', message: 'Session not found.' });
  }

  const isDirector = req.auth!.roles.some(r => r.role === 'OwnerDirector' || r.role === 'OrgAdmin');
  if (!isDirector && target.userId !== req.auth!.user.id) {
    return res.status(403).json({ error: 'Denied', message: 'Cannot revoke another user session.' });
  }

  revokeSession(sessionId, req.auth!.user.id);
  return res.json({ message: 'Session revoked successfully.' });
});

// GET /api/staff (Staff & Access Management — NO plaintext passwords or raw PINs exposed!)
apiRouter.get('/staff', requireAuth, requirePermission('organization', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const staff = data.users
    .filter(u => u.tenantId === req.auth!.user.tenantId)
    .map(u => {
      const roles = data.roleAssignments.filter(ra => ra.userId === u.id);
      return {
        id: u.id,
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        primaryDepartment: u.primaryDepartment,
        status: u.status,
        mfaEnabled: u.mfaEnabled,
        lastLoginAt: u.lastLoginAt,
        lastLoginIp: u.lastLoginIp,
        roles: roles.map(r => ({
          role: r.role,
          branchId: r.branchId,
          legalEntityId: r.legalEntityId
        }))
      };
    });

  return res.json({ staff });
});

// POST /api/staff/invite (Create new staff account with hashed password)
apiRouter.post('/staff/invite', requireAuth, requirePermission('organization', 'manage'), (req: Request, res: Response) => {
  const { username, email, fullName, temporaryPassword, role, branchId, department } = req.body;
  const data = db.getData();

  if (!username || !email || !fullName || !temporaryPassword || !role) {
    return res.status(400).json({ error: 'MissingFields', message: 'Required fields missing.' });
  }

  const existing = data.users.find(u => u.tenantId === req.auth!.user.tenantId && (u.username === username || u.email === email));
  if (existing) {
    return res.status(400).json({ error: 'Conflict', message: 'User with this username or email already exists.' });
  }

  const { hash, salt } = hashPassword(temporaryPassword);
  const newUser = {
    id: `usr_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    username,
    email,
    fullName,
    passwordHash: hash,
    salt,
    primaryDepartment: department || 'General',
    status: 'Active' as const,
    mfaEnabled: false,
    failedLoginAttempts: 0,
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);

  data.roleAssignments.push({
    id: `ra_${Date.now()}`,
    userId: newUser.id,
    tenantId: req.auth!.user.tenantId,
    branchId: branchId || undefined,
    role,
    grantedBy: req.auth!.user.id,
    grantedAt: new Date().toISOString()
  });

  db.save();

  logAudit(
    req.auth!.user.tenantId,
    'STAFF_INVITED',
    'User',
    newUser.id,
    `Invited ${fullName} (${username}) with role ${role}`,
    req.ip || '127.0.0.1',
    'Success',
    req.auth!.user.id,
    req.auth!.user.fullName
  );

  return res.status(201).json({ message: 'Staff created successfully', user: sanitizeUser(newUser) });
});

// ============================================================================
// 2. ORGANIZATION, LEGAL ENTITIES & BRANCH STRUCTURE
// ============================================================================

// GET /api/organization/hierarchy
apiRouter.get('/organization/hierarchy', requireAuth, (req: Request, res: Response) => {
  const data = db.getData();
  const tenantId = req.auth!.user.tenantId;

  const tenant = data.tenants.find(t => t.id === tenantId);
  const legalEntities = data.legalEntities.filter(e => e.tenantId === tenantId);
  const branches = data.branches.filter(b => b.tenantId === tenantId);
  const warehouses = data.warehouseLocations.filter(w => w.tenantId === tenantId);
  const operatingUnits = data.operatingUnits.filter(u => u.tenantId === tenantId);

  return res.json({
    tenant,
    legalEntities,
    branches,
    warehouses,
    operatingUnits
  });
});

// ============================================================================
// 3. ACCOUNTING & DOUBLE-ENTRY LEDGER
// ============================================================================

// GET /api/accounting/accounts
apiRouter.get('/accounting/accounts', requireAuth, requirePermission('accounting', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const accounts = data.accounts.filter(
    a => a.tenantId === req.auth!.user.tenantId && a.legalEntityId === req.auth!.activeBranch.legalEntityId
  );
  return res.json({ accounts });
});

// GET /api/accounting/journals
apiRouter.get('/accounting/journals', requireAuth, requirePermission('accounting', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const journals = data.journalEntries.filter(
    j => j.tenantId === req.auth!.user.tenantId && j.legalEntityId === req.auth!.activeBranch.legalEntityId
  );
  return res.json({ journals });
});

// POST /api/accounting/journals
apiRouter.post('/accounting/journals', requireAuth, requirePermission('accounting', 'create'), (req: Request, res: Response) => {
  const { date, memo, lines, sourceModule, sourceReference } = req.body;

  const result = postJournal({
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    date,
    memo: memo || 'Manual Journal Posting',
    sourceModule: sourceModule || 'accounting',
    sourceReference: sourceReference || `MANUAL-${Date.now()}`,
    lines: lines || [],
    createdByUserId: req.auth!.user.id
  });

  if (!result.success) {
    return res.status(400).json({ error: 'PostingFailed', message: result.error });
  }

  logAudit(
    req.auth!.user.tenantId,
    'JOURNAL_POSTED',
    'JournalEntry',
    result.journal!.id,
    `Posted journal ${result.journal!.entryNumber} for amount ${result.journal!.totalDebitMinor}`,
    req.ip || '127.0.0.1',
    'Success',
    req.auth!.user.id,
    req.auth!.user.fullName
  );

  return res.status(201).json({ message: 'Journal posted successfully', journal: result.journal });
});

// POST /api/accounting/journals/:id/reverse (Controlled reversal, no silent edits or deletes)
apiRouter.post('/accounting/journals/:id/reverse', requireAuth, requirePermission('accounting', 'reverse'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: 'MissingReason', message: 'Reversal reason is mandatory for audit trail.' });
  }

  const result = reverseJournal(id, req.auth!.user.tenantId, reason, req.auth!.user.id);
  if (!result.success) {
    return res.status(400).json({ error: 'ReversalFailed', message: result.error });
  }

  return res.json({
    message: 'Journal reversed successfully',
    reversalJournal: result.reversalJournal
  });
});

// GET /api/accounting/reports
apiRouter.get('/accounting/reports', requireAuth, requirePermission('accounting', 'view'), (req: Request, res: Response) => {
  const reports = generateFinancialReports(req.auth!.user.tenantId, req.auth!.activeBranch.legalEntityId);
  return res.json(reports);
});

// GET /api/accounting/fiscal-periods
apiRouter.get('/accounting/fiscal-periods', requireAuth, requirePermission('accounting', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const periods = data.fiscalPeriods.filter(
    fp => fp.tenantId === req.auth!.user.tenantId && fp.legalEntityId === req.auth!.activeBranch.legalEntityId
  );
  return res.json({ fiscalPeriods: periods });
});

// POST /api/accounting/fiscal-periods/:id/lock
apiRouter.post('/accounting/fiscal-periods/:id/lock', requireAuth, requirePermission('accounting', 'manage'), (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const period = data.fiscalPeriods.find(fp => fp.id === id && fp.tenantId === req.auth!.user.tenantId);

  if (!period) {
    return res.status(404).json({ error: 'NotFound', message: 'Fiscal period not found.' });
  }

  period.isLocked = true;
  period.lockedAt = new Date().toISOString();
  period.lockedBy = req.auth!.user.id;
  db.save();

  logAudit(
    req.auth!.user.tenantId,
    'FISCAL_PERIOD_LOCKED',
    'FiscalPeriod',
    period.id,
    `Locked period ${period.periodName}`,
    req.ip || '127.0.0.1',
    'Success',
    req.auth!.user.id,
    req.auth!.user.fullName
  );

  return res.json({ message: `Fiscal period ${period.periodName} is now locked.` });
});

// ============================================================================
// 4. TREASURY & PAYOUT APPROVALS
// ============================================================================

// GET /api/treasury/bank-accounts
apiRouter.get('/treasury/bank-accounts', requireAuth, requirePermission('treasury', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const accounts = data.bankAccounts.filter(
    b => b.tenantId === req.auth!.user.tenantId && b.legalEntityId === req.auth!.activeBranch.legalEntityId
  );
  return res.json({ bankAccounts: accounts });
});

// GET /api/treasury/payouts
apiRouter.get('/treasury/payouts', requireAuth, requirePermission('treasury', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const payouts = data.payouts.filter(p => p.tenantId === req.auth!.user.tenantId);
  return res.json({ payouts });
});

// POST /api/treasury/payouts (Request payout)
apiRouter.post('/treasury/payouts', requireAuth, requirePermission('treasury', 'create'), (req: Request, res: Response) => {
  const { beneficiaryName, bankName, accountMasked, amountMinor, currency, purpose, category } = req.body;
  const data = db.getData();

  if (!beneficiaryName || !amountMinor || amountMinor <= 0) {
    return res.status(400).json({ error: 'InvalidAmount', message: 'Beneficiary and positive amount required.' });
  }

  // Look up rule for this currency
  const rule = data.payoutRules.find(
    r => r.tenantId === req.auth!.user.tenantId && r.currency === (currency || 'NGN')
  );

  const threshold = rule ? rule.dualApprovalThresholdMinor : 50000000; // default 500k NGN
  const requiresChecker = amountMinor >= threshold;

  const newPayout: PayoutDisbursement = {
    id: `pay_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    beneficiaryName,
    bankName: bankName || 'Standard Commercial Bank',
    accountMasked: accountMasked || '••••••••4920',
    amountMinor: Math.round(amountMinor),
    currency: currency || 'NGN',
    purpose: purpose || 'Operational Disbursement',
    category: category || 'Supplier',
    status: requiresChecker ? 'PendingApproval' : 'Approved',
    makerUserId: req.auth!.user.id,
    makerName: req.auth!.user.fullName,
    approvalPolicyVersion: 'v2.1-configurable',
    idempotencyKey: `IDEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };

  data.payouts.unshift(newPayout);
  db.save();

  return res.status(201).json({
    message: requiresChecker ? 'Payout submitted for checker approval' : 'Payout authorized',
    payout: newPayout
  });
});

// POST /api/treasury/payouts/:id/approve (Checker approval: maker CANNOT approve own payout!)
apiRouter.post('/treasury/payouts/:id/approve', requireAuth, requirePermission('treasury', 'approve'), (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const payout = data.payouts.find(p => p.id === id && p.tenantId === req.auth!.user.tenantId);

  if (!payout) {
    return res.status(404).json({ error: 'NotFound', message: 'Payout request not found.' });
  }

  // Strict Separation of Duties: Self-approval restriction!
  if (payout.makerUserId === req.auth!.user.id) {
    const isOwner = req.auth!.roles.some(r => r.role === 'OwnerDirector');
    if (!isOwner) {
      logAudit(
        req.auth!.user.tenantId,
        'SELF_APPROVAL_VIOLATION_DENIED',
        'PayoutDisbursement',
        payout.id,
        `Maker ${req.auth!.user.fullName} attempted to self-approve payout of ${payout.amountMinor}`,
        req.ip || '127.0.0.1',
        'Denied',
        req.auth!.user.id,
        req.auth!.user.fullName
      );

      return res.status(403).json({
        error: 'SelfApprovalForbidden',
        message: 'Segregation of Duties: The creator (maker) of a payout request cannot act as checker to approve their own disbursement.'
      });
    }
  }

  payout.status = 'Approved';
  payout.checkerUserId = req.auth!.user.id;
  payout.checkerName = req.auth!.user.fullName;
  db.save();

  logAudit(
    req.auth!.user.tenantId,
    'PAYOUT_APPROVED',
    'PayoutDisbursement',
    payout.id,
    `Checker ${req.auth!.user.fullName} approved payout of ${payout.amountMinor} ${payout.currency}`,
    req.ip || '127.0.0.1',
    'Success',
    req.auth!.user.id,
    req.auth!.user.fullName
  );

  return res.json({ message: 'Payout approved successfully', payout });
});

// ============================================================================
// 5. RETAIL SUPERMARKET & POS TILL WORKFLOW
// ============================================================================

// GET /api/retail/products
apiRouter.get('/retail/products', requireAuth, requirePermission('retail', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const products = data.retailProducts.filter(p => p.tenantId === req.auth!.user.tenantId);
  return res.json({ products });
});

// POST /api/retail/shifts/open (Open cashier till shift with float custody)
apiRouter.post('/retail/shifts/open', requireAuth, requirePermission('retail', 'create'), (req: Request, res: Response) => {
  const { tillUnitId, tillNumber, openingFloatMinor, notes } = req.body;
  const data = db.getData();

  // Check if cashier already has an open shift
  const existingOpen = data.posShifts.find(
    s => s.tenantId === req.auth!.user.tenantId && s.cashierUserId === req.auth!.user.id && s.status === 'Open'
  );

  if (existingOpen) {
    return res.status(400).json({
      error: 'ShiftAlreadyOpen',
      message: `You already have an open till shift (${existingOpen.tillNumber}). Close it before opening a new one.`,
      shift: existingOpen
    });
  }

  const shift: POSTillShift = {
    id: `shift_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    tillUnitId: tillUnitId || 'unit_till_01',
    tillNumber: tillNumber || 'Till 01 Storefront',
    cashierUserId: req.auth!.user.id,
    cashierName: req.auth!.user.fullName,
    openedAt: new Date().toISOString(),
    openingFloatMinor: Math.round(openingFloatMinor || 1500000), // 15,000 NGN
    cashCollectedMinor: 0,
    cardCollectedMinor: 0,
    transferCollectedMinor: 0,
    expectedCashMinor: Math.round(openingFloatMinor || 1500000),
    status: 'Open',
    ordersCount: 0,
    notes: notes || 'Morning shift open'
  };

  data.posShifts.unshift(shift);
  db.save();

  logAudit(
    req.auth!.user.tenantId,
    'TILL_SHIFT_OPENED',
    'POSTillShift',
    shift.id,
    `Cashier ${shift.cashierName} opened shift with float ${shift.openingFloatMinor}`,
    req.ip || '127.0.0.1',
    'Success',
    req.auth!.user.id,
    req.auth!.user.fullName
  );

  return res.status(201).json({ message: 'Till shift opened', shift });
});

// GET /api/retail/shifts/current
apiRouter.get('/retail/shifts/current', requireAuth, requirePermission('retail', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const current = data.posShifts.find(
    s => s.tenantId === req.auth!.user.tenantId && s.cashierUserId === req.auth!.user.id && s.status === 'Open'
  );
  return res.json({ shift: current || null });
});

// POST /api/retail/checkout (POS Checkout: Cash, Card, Bank Transfer with pending check, Split payment, Immediate Ledger)
apiRouter.post('/retail/checkout', requireAuth, requirePermission('retail', 'create'), (req: Request, res: Response) => {
  const { shiftId, items, tenderSplit, bankTransferReference } = req.body;
  const data = db.getData();

  // Validate active shift
  const shift = data.posShifts.find(s => s.id === shiftId && s.status === 'Open' && s.tenantId === req.auth!.user.tenantId);
  if (!shift) {
    return res.status(400).json({ error: 'NoActiveShift', message: 'An open till shift is required to checkout orders.' });
  }

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'EmptyCart', message: 'Cart items required.' });
  }

  // Stock availability check & deduction
  let subtotal = 0;
  let taxTotal = 0;
  const resolvedItems = [];

  for (const item of items) {
    const product = data.retailProducts.find(p => p.id === item.productId && p.tenantId === req.auth!.user.tenantId);
    if (!product) {
      return res.status(400).json({ error: 'ProductNotFound', message: `Product ${item.productId} not found.` });
    }

    if (!product.allowNegativeStock && product.totalStock < item.quantity) {
      return res.status(400).json({
        error: 'InsufficientStock',
        message: `Insufficient inventory for '${product.name}'. Available: ${product.totalStock}, Requested: ${item.quantity}.`
      });
    }

    // Deduct stock
    product.totalStock -= item.quantity;
    const locId = 'loc_vi_store';
    if (product.stockByLocation[locId] !== undefined) {
      product.stockByLocation[locId] = Math.max(0, product.stockByLocation[locId] - item.quantity);
    }

    const lineTotal = item.quantity * product.sellingPriceMinor;
    const lineTax = Math.round(lineTotal * (product.taxRatePercent / 100));

    subtotal += lineTotal;
    taxTotal += lineTax;

    resolvedItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPriceMinor: product.sellingPriceMinor,
      taxMinor: lineTax,
      totalMinor: lineTotal + lineTax
    });
  }

  const grandTotal = subtotal + taxTotal;

  // Validate tender split matches grand total
  const cashPaid = Math.round(tenderSplit?.cashMinor || 0);
  const cardPaid = Math.round(tenderSplit?.cardMinor || 0);
  const transferPaid = Math.round(tenderSplit?.bankTransferMinor || 0);
  const totalTendered = cashPaid + cardPaid + transferPaid;

  if (totalTendered !== grandTotal) {
    return res.status(400).json({
      error: 'TenderMismatch',
      message: `Total tendered (${totalTendered}) does not match order grand total (${grandTotal}).`
    });
  }

  // Bank transfer verification status: never automatically assume paid without reference!
  let bankStatus: 'NotApplicable' | 'PendingVerification' | 'VerifiedSettled' = 'NotApplicable';
  if (transferPaid > 0) {
    bankStatus = bankTransferReference ? 'VerifiedSettled' : 'PendingVerification';
  }

  const receiptNum = `RCP-2026-${String(data.posTransactions.length + 801).padStart(5, '0')}`;
  const transaction: POSSaleTransaction = {
    id: `txn_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    shiftId: shift.id,
    receiptNumber: receiptNum,
    cashierUserId: req.auth!.user.id,
    cashierName: req.auth!.user.fullName,
    timestamp: new Date().toISOString(),
    items: resolvedItems,
    subtotalMinor: subtotal,
    taxMinor: taxTotal,
    totalMinor: grandTotal,
    tenderSplit: {
      cashMinor: cashPaid,
      cardMinor: cardPaid,
      bankTransferMinor: transferPaid
    },
    bankTransferStatus: bankStatus,
    bankTransferReference,
    isRefunded: false
  };

  // Update shift figures
  shift.cashCollectedMinor += cashPaid;
  shift.cardCollectedMinor += cardPaid;
  shift.transferCollectedMinor += transferPaid;
  shift.expectedCashMinor += cashPaid; // physical cash expected in drawer!
  shift.ordersCount += 1;

  data.posTransactions.unshift(transaction);

  // Automatic double-entry ledger posting: Debit Cash/Bank/Card, Credit Retail Revenue (4010)
  const journalLines = [];
  if (cashPaid > 0) {
    journalLines.push({ accountCode: '1010', debitMinorUnits: cashPaid, creditMinorUnits: 0, memo: `POS Cash: ${receiptNum}` });
  }
  if (cardPaid > 0 || transferPaid > 0) {
    journalLines.push({ accountCode: '1020', debitMinorUnits: cardPaid + transferPaid, creditMinorUnits: 0, memo: `POS Card/Transfer: ${receiptNum}` });
  }
  journalLines.push({ accountCode: '4010', debitMinorUnits: 0, creditMinorUnits: grandTotal, memo: `POS Sales Revenue: ${receiptNum}` });

  postJournal({
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    date: new Date().toISOString().substring(0, 10),
    sourceModule: 'retail',
    sourceReference: receiptNum,
    memo: `Point of Sale Checkout — Receipt ${receiptNum}`,
    lines: journalLines,
    createdByUserId: req.auth!.user.id
  });

  db.save();

  return res.status(201).json({
    message: 'Checkout complete',
    transaction,
    receiptNumber: receiptNum
  });
});

// POST /api/retail/returns (Process return, exchange or refund)
apiRouter.post('/retail/returns', requireAuth, requirePermission('retail', 'refund'), (req: Request, res: Response) => {
  const { originalReceiptNumber, returnedItems, refundMethod, reason } = req.body;
  const data = db.getData();

  const originalTxn = data.posTransactions.find(
    t => t.receiptNumber === originalReceiptNumber && t.tenantId === req.auth!.user.tenantId
  );

  if (!originalTxn) {
    return res.status(404).json({ error: 'ReceiptNotFound', message: `Receipt ${originalReceiptNumber} not found.` });
  }

  let totalRefund = 0;
  const returnLines = [];

  for (const item of returnedItems) {
    const prod = data.retailProducts.find(p => p.id === item.productId && p.tenantId === req.auth!.user.tenantId);
    if (!prod) continue;

    // Restock
    prod.totalStock += item.quantity;
    const locId = 'loc_vi_store';
    if (prod.stockByLocation[locId] !== undefined) {
      prod.stockByLocation[locId] += item.quantity;
    }

    const refundLineAmount = item.quantity * prod.sellingPriceMinor;
    totalRefund += refundLineAmount;

    returnLines.push({
      productId: prod.id,
      productName: prod.name,
      returnedQty: item.quantity,
      refundAmountMinor: refundLineAmount,
      restockLocationId: locId
    });
  }

  const returnRecord: RetailReturnRecord = {
    id: `ret_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    returnNumber: `RET-2026-${Date.now().toString().slice(-4)}`,
    originalReceiptNumber,
    items: returnLines,
    totalRefundMinor: totalRefund,
    refundMethod: refundMethod || 'Cash',
    reason: reason || 'Customer returned undamaged merchandise',
    authorizedByUserId: req.auth!.user.id,
    processedAt: new Date().toISOString()
  };

  originalTxn.isRefunded = true;
  originalTxn.refundedAmountMinor = (originalTxn.refundedAmountMinor || 0) + totalRefund;

  data.retailReturns.unshift(returnRecord);

  // Accounting reversal: Debit Sales Revenue (4010), Credit Cash (1010)
  postJournal({
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    date: new Date().toISOString().substring(0, 10),
    sourceModule: 'retail',
    sourceReference: returnRecord.returnNumber,
    memo: `Return Refund for ${originalReceiptNumber} — ${reason}`,
    lines: [
      { accountCode: '4010', debitMinorUnits: totalRefund, creditMinorUnits: 0, memo: 'Return Sales Debit' },
      { accountCode: '1010', debitMinorUnits: 0, creditMinorUnits: totalRefund, memo: 'Cash Till Refund' }
    ],
    createdByUserId: req.auth!.user.id
  });

  db.save();

  return res.status(201).json({
    message: 'Return processed and stock reinstated',
    returnRecord
  });
});

// POST /api/retail/shifts/close (Close shift with physical cash count vs expected & variance)
apiRouter.post('/retail/shifts/close', requireAuth, requirePermission('retail', 'create'), (req: Request, res: Response) => {
  const { shiftId, actualCashCountedMinor, notes } = req.body;
  const data = db.getData();

  const shift = data.posShifts.find(s => s.id === shiftId && s.tenantId === req.auth!.user.tenantId);
  if (!shift) {
    return res.status(404).json({ error: 'ShiftNotFound', message: 'Till shift not found.' });
  }

  const counted = Math.round(actualCashCountedMinor ?? shift.expectedCashMinor);
  const variance = counted - shift.expectedCashMinor;

  shift.status = 'Closed';
  shift.closedAt = new Date().toISOString();
  shift.actualCashCountedMinor = counted;
  shift.cashVarianceMinor = variance;
  shift.notes = notes || shift.notes;

  db.save();

  logAudit(
    req.auth!.user.tenantId,
    'TILL_SHIFT_CLOSED',
    'POSTillShift',
    shift.id,
    `Cashier ${shift.cashierName} closed till. Expected: ${shift.expectedCashMinor}, Counted: ${counted}, Variance: ${variance}`,
    req.ip || '127.0.0.1',
    variance === 0 ? 'Success' : 'Flagged',
    req.auth!.user.id,
    req.auth!.user.fullName
  );

  return res.json({
    message: 'Till shift closed successfully with Z-Report generated',
    shift,
    zReport: {
      sessionCode: shift.tillNumber,
      cashier: shift.cashierName,
      ordersCount: shift.ordersCount,
      openingFloatMinor: shift.openingFloatMinor,
      cashSalesMinor: shift.cashCollectedMinor,
      cardSalesMinor: shift.cardCollectedMinor,
      transferSalesMinor: shift.transferCollectedMinor,
      expectedCashMinor: shift.expectedCashMinor,
      actualCountedMinor: counted,
      varianceMinor: variance
    }
  });
});

// ============================================================================
// 6. AUTOMOTIVE & MECHANIC WORKSHOP WORKFLOW
// ============================================================================

// GET /api/automotive/jobs
apiRouter.get('/automotive/jobs', requireAuth, requirePermission('automotive', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const jobs = data.jobCards.filter(j => j.tenantId === req.auth!.user.tenantId);
  return res.json({ jobs });
});

// POST /api/automotive/intake (Vehicle intake & multi-point inspection)
apiRouter.post('/automotive/intake', requireAuth, requirePermission('automotive', 'create'), (req: Request, res: Response) => {
  const { vin, licensePlate, make, model, ownerName, ownerPhone, mileageKm, notes, inspectionChecklist } = req.body;
  const data = db.getData();

  let vehicle = data.vehicles.find(v => v.vin === vin || v.licensePlate === licensePlate);
  if (!vehicle) {
    vehicle = {
      id: `veh_${Date.now()}`,
      tenantId: req.auth!.user.tenantId,
      vin,
      licensePlate,
      make: make || 'Vehicle',
      model: model || 'Model',
      year: 2022,
      ownerName,
      ownerPhone,
      currentMileageKm: mileageKm || 50000
    };
    data.vehicles.push(vehicle);
  }

  const jobCard: AutomotiveJobCard = {
    id: `job_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    jobCardNumber: `JOB-2026-${String(data.jobCards.length + 301).padStart(4, '0')}`,
    vehicleId: vehicle.id,
    vehicleSummary: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
    customerName: ownerName,
    customerPhone: ownerPhone,
    serviceBayUnitId: 'unit_bay_01',
    intakeMileageKm: mileageKm || vehicle.currentMileageKm,
    intakeNotes: notes || 'Vehicle checked in for multi-point inspection',
    inspectionChecklist: inspectionChecklist || [
      { category: 'Brakes', finding: 'Passed', notes: 'Pads at 70%' },
      { category: 'EngineOil', finding: 'Caution', notes: 'Oil degradation; change recommended' },
      { category: 'Battery', finding: 'Passed', notes: '12.6V resting' }
    ],
    estimates: [],
    customerAuthorizedBy: '',
    partsIssued: [],
    partsReturned: [],
    laborHoursLogged: 0,
    qualityCheckPassed: false,
    status: 'Inspection',
    createdAt: new Date().toISOString()
  };

  data.jobCards.unshift(jobCard);
  db.save();

  return res.status(201).json({ message: 'Vehicle intake completed', jobCard });
});

// POST /api/automotive/jobs/:id/estimate (Prepare estimate & record customer authorization)
apiRouter.post('/automotive/jobs/:id/estimate', requireAuth, requirePermission('automotive', 'edit'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { estimates, customerConsentSignature } = req.body;
  const data = db.getData();

  const job = data.jobCards.find(j => j.id === id && j.tenantId === req.auth!.user.tenantId);
  if (!job) return res.status(404).json({ error: 'NotFound', message: 'Job card not found.' });

  job.estimates = estimates || [];
  if (customerConsentSignature) {
    job.customerAuthorizedBy = customerConsentSignature;
    job.customerConsentTimestamp = new Date().toISOString();
    job.status = 'Authorized';
  } else {
    job.status = 'EstimatePendingApproval';
  }

  db.save();
  return res.json({ message: 'Estimate updated', jobCard: job });
});

// POST /api/automotive/jobs/:id/parts-issue (Issue parts from inventory to job)
apiRouter.post('/automotive/jobs/:id/parts-issue', requireAuth, requirePermission('automotive', 'edit'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { partId, quantity } = req.body;
  const data = db.getData();

  const job = data.jobCards.find(j => j.id === id && j.tenantId === req.auth!.user.tenantId);
  if (!job) return res.status(404).json({ error: 'NotFound', message: 'Job not found.' });

  const product = data.retailProducts.find(p => p.id === partId && p.tenantId === req.auth!.user.tenantId);
  if (!product || product.totalStock < quantity) {
    return res.status(400).json({ error: 'OutOfStock', message: 'Part unavailable in stock.' });
  }

  product.totalStock -= quantity;
  job.partsIssued.push({
    partId: product.id,
    partName: product.name,
    quantity,
    issuedAt: new Date().toISOString()
  });

  job.status = 'InProgress';
  db.save();

  return res.json({ message: 'Parts issued to job', jobCard: job });
});

// POST /api/automotive/jobs/:id/complete (Quality check & invoice vehicle handover)
apiRouter.post('/automotive/jobs/:id/complete', requireAuth, requirePermission('automotive', 'edit'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { laborHours, qualityCheckPassed, qualityCheckNotes } = req.body;
  const data = db.getData();

  const job = data.jobCards.find(j => j.id === id && j.tenantId === req.auth!.user.tenantId);
  if (!job) return res.status(404).json({ error: 'NotFound', message: 'Job not found.' });

  job.laborHoursLogged = laborHours || 3.5;
  job.qualityCheckPassed = !!qualityCheckPassed;
  job.qualityCheckNotes = qualityCheckNotes || 'Multi-point road test completed successfully';
  job.status = 'ReadyForPickup';

  // Calculate invoice total
  const partsCost = job.partsIssued.reduce((sum, p) => sum + 3800000, 0); // sample parts
  const laborRevenue = Math.round(job.laborHoursLogged * 1500000); // 15,000 NGN/hr
  const totalBill = partsCost + laborRevenue;

  // Post to general ledger: Debit AR (1030), Credit Workshop Revenue (4020)
  postJournal({
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    date: new Date().toISOString().substring(0, 10),
    sourceModule: 'automotive',
    sourceReference: job.jobCardNumber,
    memo: `Automotive Repair Billing — ${job.vehicleSummary}`,
    lines: [
      { accountCode: '1030', debitMinorUnits: totalBill, creditMinorUnits: 0, memo: 'Debtor AR' },
      { accountCode: '4020', debitMinorUnits: 0, creditMinorUnits: totalBill, memo: 'Workshop Service Revenue' }
    ],
    createdByUserId: req.auth!.user.id
  });

  job.completedAt = new Date().toISOString();
  db.save();

  return res.json({ message: 'Repair job cleared for customer handover', jobCard: job });
});

// ============================================================================
// 7. AGRIBUSINESS WORKFLOW (No premature revenue recognition on harvest!)
// ============================================================================

// GET /api/agribusiness/plots
apiRouter.get('/agribusiness/plots', requireAuth, requirePermission('agribusiness', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const plots = data.farmPlots.filter(p => p.tenantId === req.auth!.user.tenantId);
  return res.json({ plots });
});

// POST /api/agribusiness/weighbridge (Weighbridge Intake: Gross, Tare, Net, Moisture %, Grading)
apiRouter.post('/agribusiness/weighbridge', requireAuth, requirePermission('agribusiness', 'create'), (req: Request, res: Response) => {
  const { sourceType, supplierOrFarmerName, cropType, grossWeightKg, tareWeightKg, moisturePercent, grade, pricePerKgMinor } = req.body;
  const data = db.getData();

  const gross = Math.round(grossWeightKg || 25000);
  const tare = Math.round(tareWeightKg || 9000);
  const net = Math.max(0, gross - tare);
  const price = Math.round(pricePerKgMinor || 45000); // 450 NGN/kg
  const totalPayable = Math.round((net * price) / 100);

  const lotNumber = `LOT-${Date.now().toString().slice(-6)}-${grade || 'GRA'}`;
  const ticket: WeighbridgeIntakeTicket = {
    id: `wb_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    ticketNumber: `WB-2026-${String(data.weighbridgeTickets.length + 501).padStart(4, '0')}`,
    sourceType: sourceType || 'FarmerAggregationSupplier',
    supplierOrFarmerName: supplierOrFarmerName || 'Alhaji Haruna Farms Cooperative',
    cropType: cropType || 'Commercial Yellow Maize',
    grossWeightKg: gross,
    tareWeightKg: tare,
    netWeightKg: net,
    moisturePercent: Number(moisturePercent || 12.4),
    grade: grade || 'GradeA',
    pricePerKgMinor: price,
    totalPayableMinor: totalPayable,
    destinationSiloLocationId: 'loc_kaduna_silo',
    assignedLotNumber: lotNumber,
    intakeTimestamp: new Date().toISOString()
  };

  data.weighbridgeTickets.unshift(ticket);

  // ACCOUNTING COMPLIANCE RULE:
  // Do NOT recognize sales revenue on harvest intake!
  // Instead: Debit Silo Inventory Asset (1060), Credit Accounts Payable (2010)
  postJournal({
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    date: new Date().toISOString().substring(0, 10),
    sourceModule: 'agribusiness',
    sourceReference: ticket.ticketNumber,
    memo: `Weighbridge Produce Intake at Silo — Lot ${lotNumber} (${net} kg)`,
    lines: [
      { accountCode: '1060', debitMinorUnits: totalPayable, creditMinorUnits: 0, memo: 'Silo Produce Stock Asset' },
      { accountCode: '2010', debitMinorUnits: 0, creditMinorUnits: totalPayable, memo: 'Farmer Settlement Payable' }
    ],
    createdByUserId: req.auth!.user.id
  });

  db.save();
  return res.status(201).json({ message: 'Weighbridge intake recorded to silo inventory', ticket });
});

// POST /api/agribusiness/processing (Processing batch: consumption, finished goods, yield, scrap)
apiRouter.post('/agribusiness/processing', requireAuth, requirePermission('agribusiness', 'create'), (req: Request, res: Response) => {
  const { productLine, sourceLotNumbers, consumedRawMaterialKg, finishedOutputKg, scrapOrLossKg } = req.body;
  const data = db.getData();

  const consumed = Math.round(consumedRawMaterialKg || 10000);
  const finished = Math.round(finishedOutputKg || 9400);
  const scrap = Math.max(0, consumed - finished);
  const outputLot = `OUT-FLOUR-${Date.now().toString().slice(-5)}`;

  const batch: AgribusinessProcessingBatch = {
    id: `batch_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    batchNumber: `PRC-2026-${Date.now().toString().slice(-4)}`,
    productLine: productLine || 'Wheat Milling & Flour Packaging',
    sourceLotNumbers: sourceLotNumbers || ['LOT-492810-GRA'],
    consumedRawMaterialKg: consumed,
    finishedOutputKg: finished,
    scrapOrLossKg: scrap,
    processingCostMinor: 45000000,
    outputLotNumber: outputLot,
    outputDestinationLocationId: 'loc_vi_wh',
    qualityReleaseApproved: true,
    batchDate: new Date().toISOString()
  };

  data.processingBatches.unshift(batch);
  db.save();

  return res.status(201).json({ message: 'Processing batch cleared to finished goods', batch });
});

// POST /api/agribusiness/sales (Sale of produce with traceable lot number!)
apiRouter.post('/agribusiness/sales', requireAuth, requirePermission('agribusiness', 'create'), (req: Request, res: Response) => {
  const { customerName, cropOrProduct, traceableLotNumber, quantitySoldKg, unitPriceMinor } = req.body;
  const data = db.getData();

  const qty = Math.round(quantitySoldKg || 5000);
  const unitPrice = Math.round(unitPriceMinor || 60000); // 600 NGN/kg
  const totalRev = Math.round((qty * unitPrice) / 100);

  const sale: AgribusinessProduceSale = {
    id: `sale_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    saleNumber: `AGR-SALE-${Date.now().toString().slice(-4)}`,
    customerName: customerName || 'Crown Flour Mills PLC',
    cropOrProduct: cropOrProduct || 'Premium Grain Output',
    traceableLotNumber: traceableLotNumber || 'LOT-492810-GRA',
    quantitySoldKg: qty,
    unitPriceMinor: unitPrice,
    totalRevenueMinor: totalRev,
    saleDate: new Date().toISOString(),
    deliveryStatus: 'Dispatched'
  };

  data.produceSales.unshift(sale);

  // HERE is where agricultural produce sales revenue is recognized!
  postJournal({
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    date: new Date().toISOString().substring(0, 10),
    sourceModule: 'agribusiness',
    sourceReference: sale.saleNumber,
    memo: `Agricultural Produce Dispatch — Lot ${traceableLotNumber}`,
    lines: [
      { accountCode: '1030', debitMinorUnits: totalRev, creditMinorUnits: 0, memo: 'Debtor Receivable' },
      { accountCode: '4030', debitMinorUnits: 0, creditMinorUnits: totalRev, memo: 'Agri Produce Sales Revenue' }
    ],
    createdByUserId: req.auth!.user.id
  });

  db.save();
  return res.status(201).json({ message: 'Produce sale invoiced with lot traceability', sale });
});

// ============================================================================
// 8. LOGISTICS & TRANSPORTATION (Freight Haulage vs Passenger Transport)
// ============================================================================

// GET /api/logistics/trips
apiRouter.get('/logistics/trips', requireAuth, requirePermission('logistics', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const trips = data.freightTrips.filter(t => t.tenantId === req.auth!.user.tenantId);
  return res.json({ freightTrips: trips });
});

// POST /api/logistics/freight/dispatch (Dispatch trip, fuel advance, manifest)
apiRouter.post('/logistics/freight/dispatch', requireAuth, requirePermission('logistics', 'create'), (req: Request, res: Response) => {
  const { vehicleId, driverUserId, originHub, destinationHub, cargoManifest, grossCargoWeightKg, agreedFreightRateMinor, fuelAdvanceMinor, consigneeName, deliveryAddress } = req.body;
  const data = db.getData();

  const vehicle = data.freightVehicles.find(v => v.id === vehicleId && v.tenantId === req.auth!.user.tenantId);
  const driver = data.users.find(u => u.id === driverUserId && u.tenantId === req.auth!.user.tenantId);

  const trip: FreightDispatchTrip = {
    id: `trip_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    tripNumber: `TRP-2026-${String(data.freightTrips.length + 401).padStart(4, '0')}`,
    vehicleId: vehicle ? vehicle.id : 'fveh_01',
    vehicleReg: vehicle ? vehicle.registrationNumber : 'LND-482-XA',
    driverUserId: driver ? driver.id : 'usr_ibrahim',
    driverName: driver ? driver.fullName : 'Mallam Ibrahim Garba',
    originHub: originHub || 'Lagos Central Depot',
    destinationHub: destinationHub || 'Abuja CBD Clearing Depot',
    cargoManifest: cargoManifest || '300 Bags Wheat Flour + 40 Crates Auto Parts',
    grossCargoWeightKg: Math.round(grossCargoWeightKg || 24000),
    agreedFreightRateMinor: Math.round(agreedFreightRateMinor || 380000000), // 3.8m NGN
    allocatedFuelAdvanceMinor: Math.round(fuelAdvanceMinor || 85000000), // 850k NGN
    actualTripExpensesMinor: 0,
    consigneeName: consigneeName || 'Abuja Regional Trading Co',
    deliveryAddress: deliveryAddress || 'Plot 104, Industrial Area, Abuja',
    departureTime: new Date().toISOString(),
    tripSettled: false,
    status: 'Dispatched'
  };

  data.freightTrips.unshift(trip);
  db.save();

  return res.status(201).json({ message: 'Freight trip dispatched', trip });
});

// POST /api/logistics/freight/:id/pod (Proof of Delivery signoff)
apiRouter.post('/logistics/freight/:id/pod', requireAuth, requirePermission('logistics', 'edit'), (req: Request, res: Response) => {
  const { id } = req.params;
  const { signedByName } = req.body;
  const data = db.getData();

  const trip = data.freightTrips.find(t => t.id === id && t.tenantId === req.auth!.user.tenantId);
  if (!trip) return res.status(404).json({ error: 'NotFound', message: 'Trip not found.' });

  trip.proofOfDeliverySignedBy = signedByName || 'Consignee Receiving Officer';
  trip.proofOfDeliveryTimestamp = new Date().toISOString();
  trip.deliveryTime = new Date().toISOString();
  trip.status = 'Delivered_PODSigned';

  // Recognize freight revenue upon delivery confirmation
  postJournal({
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    date: new Date().toISOString().substring(0, 10),
    sourceModule: 'logistics',
    sourceReference: trip.tripNumber,
    memo: `Freight Haulage Revenue — POD Signed: ${trip.tripNumber}`,
    lines: [
      { accountCode: '1030', debitMinorUnits: trip.agreedFreightRateMinor, creditMinorUnits: 0, memo: 'Freight Debtor' },
      { accountCode: '4040', debitMinorUnits: 0, creditMinorUnits: trip.agreedFreightRateMinor, memo: 'Freight Haulage Revenue' }
    ],
    createdByUserId: req.auth!.user.id
  });

  db.save();
  return res.json({ message: 'Proof of Delivery confirmed and freight invoiced', trip });
});

// ============================================================================
// 9. FUEL STATION WORKFLOW
// ============================================================================

// GET /api/fuel/tanks
apiRouter.get('/fuel/tanks', requireAuth, requirePermission('fuel', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const tanks = data.fuelTanks.filter(t => t.tenantId === req.auth!.user.tenantId);
  return res.json({ fuelTanks: tanks });
});

// POST /api/fuel/dips
apiRouter.post('/fuel/dips', requireAuth, requirePermission('fuel', 'edit'), (req: Request, res: Response) => {
  const { tankId, measuredLiters, waterDipCm } = req.body;
  const data = db.getData();

  const tank = data.fuelTanks.find(t => t.id === tankId && t.tenantId === req.auth!.user.tenantId);
  if (!tank) return res.status(404).json({ error: 'NotFound', message: 'Tank not found.' });

  tank.currentStockLiters = Math.round(measuredLiters);
  tank.waterDipCm = Number(waterDipCm || 0);
  tank.lastDipDate = new Date().toISOString();
  db.save();

  return res.json({ message: 'Tank calibration dip recorded', tank });
});

// POST /api/fuel/shifts (Pump shift: opening, closing meter, volume, cash vs POS reconciliation)
apiRouter.post('/fuel/shifts', requireAuth, requirePermission('fuel', 'create'), (req: Request, res: Response) => {
  const { pumpIsland, productType, openingMeter, closingMeter, unitPriceMinor, cashRemittedMinor, posCardRemittedMinor } = req.body;
  const data = db.getData();

  const openM = Number(openingMeter || 120000);
  const closeM = Number(closingMeter || 122500);
  const dispensed = Math.max(0, closeM - openM);
  const unitPrice = Math.round(unitPriceMinor || 75000); // 750 NGN/L
  const expectedTotal = Math.round((dispensed * unitPrice) / 100);

  const cash = Math.round(cashRemittedMinor || 0);
  const pos = Math.round(posCardRemittedMinor || 0);
  const variance = (cash + pos) - expectedTotal;

  const shift: FuelPumpShiftRecord = {
    id: `fpshift_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    pumpIsland: pumpIsland || 'Island 01 - Dual Nozzle',
    productType: productType || 'PMS_Petrol',
    attendantUserId: req.auth!.user.id,
    attendantName: req.auth!.user.fullName,
    shiftDate: new Date().toISOString().substring(0, 10),
    openingMeterLiters: openM,
    closingMeterLiters: closeM,
    volumeDispensedLiters: dispensed,
    unitPriceMinor: unitPrice,
    expectedSalesMinor: expectedTotal,
    cashRemittedMinor: cash,
    posCardRemittedMinor: pos,
    meterToCashVarianceMinor: variance,
    reconciliationStatus: variance === 0 ? 'Balanced' : 'ReviewedVariance'
  };

  data.fuelPumpShifts.unshift(shift);
  db.save();

  return res.status(201).json({ message: 'Pump shift sales reconciled', shift });
});

// ============================================================================
// 10. HR & STRICTLY SEGREGATED PAYROLL
// ============================================================================

// GET /api/hr/employees
apiRouter.get('/hr/employees', requireAuth, requirePermission('hr', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const employees = data.employees.filter(e => e.tenantId === req.auth!.user.tenantId);
  return res.json({ employees });
});

// GET /api/payroll/summary (Accessible to Accountant: ONLY aggregated journal numbers, NO individual wages!)
apiRouter.get('/payroll/summary', requireAuth, requirePermission('payroll', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const runs = data.payrollRuns.filter(r => r.tenantId === req.auth!.user.tenantId);

  // Return summarized representation without individual employee records
  const summaries = runs.map(r => ({
    payrollRunId: r.id,
    periodName: r.periodName,
    employeeCount: r.employeeCount,
    totalGrossMinor: r.totalGrossMinor,
    totalTaxPAYEMinor: r.totalTaxPAYEMinor,
    totalPensionMinor: r.totalPensionMinor,
    totalNetMinor: r.totalNetMinor,
    status: r.status,
    postedJournalId: r.postedJournalId
  }));

  return res.json({ summaries });
});

// GET /api/payroll/confidential (Restricted strictly to PayrollOfficer / OwnerDirector!)
apiRouter.get('/payroll/confidential', requireAuth, (req: Request, res: Response) => {
  const isPayrollAuthorized = req.auth!.roles.some(
    r => r.role === 'PayrollOfficer' || r.role === 'OwnerDirector'
  );

  if (!isPayrollAuthorized) {
    logAudit(
      req.auth!.user.tenantId,
      'PAYROLL_PRIVACY_BREACH_ATTEMPT',
      'ConfidentialCompensation',
      'all',
      `Unauthorized operator ${req.auth!.user.fullName} attempted to inspect confidential salaries`,
      req.ip || '127.0.0.1',
      'Denied',
      req.auth!.user.id,
      req.auth!.user.fullName
    );

    return res.status(403).json({
      error: 'PayrollPrivacyEnforced',
      message: 'Confidential Payroll Access Denied: Accountants and general staff are restricted from inspecting individual wages, bank details, and statutory employee deductions.'
    });
  }

  const data = db.getData();
  const comp = data.compensations.filter(c => c.tenantId === req.auth!.user.tenantId);
  return res.json({ compensations: comp });
});

// POST /api/payroll/run (Prepare payroll batch & post summarized journal to General Ledger)
apiRouter.post('/payroll/run', requireAuth, requirePermission('payroll', 'approve'), (req: Request, res: Response) => {
  const { periodName } = req.body;
  const data = db.getData();

  const comp = data.compensations.filter(c => c.tenantId === req.auth!.user.tenantId);
  if (comp.length === 0) {
    return res.status(400).json({ error: 'NoCompensationRecords', message: 'No active employee compensation profiles found.' });
  }

  const totalGross = comp.reduce((sum, c) => sum + c.baseSalaryMinor, 0);
  const totalTax = Math.round(totalGross * 0.15); // Average PAYE
  const totalPension = Math.round(totalGross * 0.08); // Pension
  const totalNet = totalGross - totalTax - totalPension;

  const batch: PayrollRunBatch = {
    id: `pr_${Date.now()}`,
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    periodName: periodName || 'October 2026',
    runDate: new Date().toISOString(),
    employeeCount: comp.length,
    totalGrossMinor: totalGross,
    totalTaxPAYEMinor: totalTax,
    totalPensionMinor: totalPension,
    totalNetMinor: totalNet,
    currency: 'NGN',
    status: 'PostedToLedger',
    approvedByUserId: req.auth!.user.id
  };

  // Post summarized journal entry (Accountant sees this summary, never individual wages!)
  const postRes = postJournal({
    tenantId: req.auth!.user.tenantId,
    legalEntityId: req.auth!.activeBranch.legalEntityId,
    branchId: req.auth!.activeBranch.id,
    date: new Date().toISOString().substring(0, 10),
    sourceModule: 'payroll',
    sourceReference: batch.id,
    memo: `Summarized Statutory Payroll Journal — ${batch.periodName} (${batch.employeeCount} Staff)`,
    lines: [
      { accountCode: '6010', debitMinorUnits: totalGross, creditMinorUnits: 0, memo: 'Staff Salaries Expense (Gross)' },
      { accountCode: '2030', debitMinorUnits: 0, creditMinorUnits: totalTax, memo: 'PAYE Tax Deduction Payable' },
      { accountCode: '2040', debitMinorUnits: 0, creditMinorUnits: totalPension, memo: 'Pension Contribution Payable' },
      { accountCode: '1020', debitMinorUnits: 0, creditMinorUnits: totalNet, memo: 'Net Salaries Bank Disbursement' }
    ],
    createdByUserId: req.auth!.user.id
  });

  if (postRes.success && postRes.journal) {
    batch.postedJournalId = postRes.journal.id;
  }

  data.payrollRuns.unshift(batch);
  db.save();

  return res.status(201).json({ message: 'Payroll executed and summarized journal posted', payrollRun: batch });
});

// ============================================================================
// 11. AUDIT TRAIL LOGS
// ============================================================================

// GET /api/audit/logs
apiRouter.get('/audit/logs', requireAuth, requirePermission('audit', 'view'), (req: Request, res: Response) => {
  const data = db.getData();
  const logs = data.auditRecords.filter(r => r.tenantId === req.auth!.user.tenantId);
  return res.json({ auditLogs: logs });
});
