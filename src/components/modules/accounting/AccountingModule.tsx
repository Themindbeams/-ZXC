import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { NewJournalModal } from './NewJournalModal';
import { BankReconciliationModal } from './BankReconciliationModal';
import {
  Plus,
  BookOpen,
  FileCheck,
  TrendingUp,
  Landmark,
  Scale,
  Printer,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

export const AccountingModule: React.FC = () => {
  const {
    chartOfAccounts,
    journalEntries,
    bankAccounts,
    formatCurrency,
    activeBranch
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'journals' | 'coa' | 'pnl' | 'balance_sheet' | 'trial_balance'>('journals');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('All');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isReconModalOpen, setIsReconModalOpen] = useState(false);

  // Financial Calculations
  const totalAssets = chartOfAccounts
    .filter(a => a.type === 'Asset')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = chartOfAccounts
    .filter(a => a.type === 'Liability')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalEquity = chartOfAccounts
    .filter(a => a.type === 'Equity')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalRevenue = chartOfAccounts
    .filter(a => a.type === 'Revenue')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalExpenses = chartOfAccounts
    .filter(a => a.type === 'Expense')
    .reduce((sum, a) => sum + a.balance, 0);

  const netIncome = totalRevenue - totalExpenses;
  const cashAndBankTotal = bankAccounts.reduce((sum, b) => sum + b.balance, 0);
  const accountsReceivable = chartOfAccounts.find(a => a.code === '1030')?.balance || 0;
  const accountsPayable = chartOfAccounts.find(a => a.code === '2010')?.balance || 0;

  // Filtered Journal Entries
  const filteredJournals = journalEntries.filter(j => {
    const matchesSearch =
      j.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModuleFilter === 'All' || j.sourceModule === selectedModuleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Finance & General Ledger</span>
            <span aria-hidden="true">·</span>
            <span>{activeBranch.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-700">Audit Grade · Double-Entry</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Double-Entry Accounting & Financial Engine
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReconModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Landmark className="w-3.5 h-3.5 text-slate-500" />
            Bank Reconciliation
          </button>
          <button
            onClick={() => setIsJournalModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            New Journal Entry
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Cash & Bank Accounts"
          value={formatCurrency(cashAndBankTotal)}
          secondary={`${bankAccounts.length} Connected Accounts`}
          icon={<Landmark className="w-4 h-4" />}
        />
        <StatCard
          label="Accounts Receivable (A/R)"
          value={formatCurrency(accountsReceivable)}
          secondary="Invoiced Trade Balances"
          icon={<ArrowUpRight className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Accounts Payable (A/P)"
          value={formatCurrency(accountsPayable)}
          secondary="Pending Supplier Obligations"
          icon={<ArrowDownLeft className="w-4 h-4 text-rose-500" />}
        />
        <StatCard
          label="Net Operating Income"
          value={formatCurrency(netIncome)}
          trend={{ positive: netIncome >= 0, text: `${((netIncome / (totalRevenue || 1)) * 100).toFixed(1)}% Operating Margin` }}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Segmented View Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveSubTab('journals')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'journals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            General Ledger Entries ({journalEntries.length})
          </button>
          <button
            onClick={() => setActiveSubTab('coa')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'coa' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chart of Accounts ({chartOfAccounts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('pnl')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'pnl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profit & Loss (P&L)
          </button>
          <button
            onClick={() => setActiveSubTab('balance_sheet')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'balance_sheet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => setActiveSubTab('trial_balance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'trial_balance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trial Balance
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 no-print"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Statement</span>
        </button>
      </div>

      {/* SubTab 1: General Ledger Journal Entries */}
      {activeSubTab === 'journals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search entries, reference, memo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 self-end">
              <span className="text-xs text-slate-500 font-medium">Filter Module:</span>
              <select
                value={selectedModuleFilter}
                onChange={(e) => setSelectedModuleFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="All">All Modules</option>
                <option value="Manual">Manual Adjustments</option>
                <option value="Sales">Sales & Invoicing</option>
                <option value="Purchases">Purchases & Supply</option>
                <option value="Payroll">Payroll</option>
                <option value="POS">Point of Sale</option>
                <option value="Bank">Treasury & Bank</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredJournals.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No journal entries matching filter criteria.
                </div>
              ) : (
                filteredJournals.map(je => (
                  <div key={je.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-slate-900">{je.entryNumber}</span>
                        <span className="text-slate-300" aria-hidden="true">·</span>
                        <span className="font-mono text-xs text-slate-500">{je.date}</span>
                        <span className="text-slate-300" aria-hidden="true">·</span>
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {je.sourceModule}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">·</span>
                        <span className="text-xs text-slate-500 font-mono">Ref: {je.reference}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold font-mono tabular-nums text-slate-900">
                          {formatCurrency(je.totalAmount)}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {je.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mb-3">{je.description}</p>

                    {/* Line Items Breakdown (Debits & Credits) */}
                    <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/60 font-mono text-[11px]">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-200 pb-1">
                            <th className="py-1">Account</th>
                            <th className="py-1">Line Narration</th>
                            <th className="py-1 text-right">Debit</th>
                            <th className="py-1 text-right">Credit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {je.lines.map(line => (
                            <tr key={line.id}>
                              <td className="py-1.5 text-slate-800 font-medium">
                                {line.accountCode} · {line.accountName}
                              </td>
                              <td className="py-1.5 text-slate-500 font-sans">{line.memo}</td>
                              <td className="py-1.5 text-right tabular-nums font-semibold text-slate-900">
                                {line.debit > 0 ? formatCurrency(line.debit) : '—'}
                              </td>
                              <td className="py-1.5 text-right tabular-nums font-semibold text-slate-900">
                                {line.credit > 0 ? formatCurrency(line.credit) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Chart of Accounts */}
      {activeSubTab === 'coa' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Chart of Accounts complies with double-entry classification (Assets, Liabilities, Equity, Revenue, Expenses).</span>
            <span className="font-mono">{chartOfAccounts.length} Active Ledger Accounts</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Name</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Sub-Category</th>
                  <th className="py-3 px-4 text-right">Current Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chartOfAccounts.map(acc => (
                  <tr key={acc.code} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{acc.code}</td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {acc.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{acc.description}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{acc.subCategory}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatCurrency(acc.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 3: Profit & Loss Statement */}
      {activeSubTab === 'pnl' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 font-display">Statement of Profit or Loss (Income Statement)</h2>
            <p className="text-xs text-slate-500 font-mono mt-1">Apex Horizon Enterprises · Year to Date (October 2026)</p>
          </div>

          {/* Revenue Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Operating Revenue</h3>
            <div className="space-y-1.5 text-xs">
              {chartOfAccounts.filter(a => a.type === 'Revenue').map(a => (
                <div key={a.code} className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-700">{a.name} ({a.code})</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold text-slate-900 border-t border-slate-300">
                <span>Total Revenue</span>
                <span className="font-mono tabular-nums">{formatCurrency(totalRevenue)}</span>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Operating & Direct Expenses</h3>
            <div className="space-y-1.5 text-xs">
              {chartOfAccounts.filter(a => a.type === 'Expense').map(a => (
                <div key={a.code} className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-700">{a.name} ({a.code})</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold text-slate-900 border-t border-slate-300">
                <span>Total Operating Expenses</span>
                <span className="font-mono tabular-nums">{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Net Profit Summary */}
          <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-slate-900">Net Operating Income (Profit)</span>
              <span className="block text-xs text-slate-500">Transferred to Retained Earnings</span>
            </div>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">
              {formatCurrency(netIncome)}
            </span>
          </div>
        </div>
      )}

      {/* SubTab 4: Balance Sheet */}
      {activeSubTab === 'balance_sheet' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 font-display">Consolidated Balance Sheet</h2>
            <p className="text-xs text-slate-500 font-mono mt-1">As of October 14, 2026 · Double-Entry Standard</p>
          </div>

          {/* Assets */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Assets</h3>
            <div className="space-y-1.5 text-xs">
              {chartOfAccounts.filter(a => a.type === 'Asset').map(a => (
                <div key={a.code} className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-700">{a.name} ({a.code})</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold text-slate-900 border-t-2 border-slate-900">
                <span>Total Assets</span>
                <span className="font-mono tabular-nums text-base">{formatCurrency(totalAssets)}</span>
              </div>
            </div>
          </div>

          {/* Liabilities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Liabilities</h3>
            <div className="space-y-1.5 text-xs">
              {chartOfAccounts.filter(a => a.type === 'Liability').map(a => (
                <div key={a.code} className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-700">{a.name} ({a.code})</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold text-slate-900 border-t border-slate-300">
                <span>Total Liabilities</span>
                <span className="font-mono tabular-nums">{formatCurrency(totalLiabilities)}</span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Shareholders' Equity</h3>
            <div className="space-y-1.5 text-xs">
              {chartOfAccounts.filter(a => a.type === 'Equity').map(a => (
                <div key={a.code} className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-700">{a.name} ({a.code})</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900">{formatCurrency(a.balance)}</span>
                </div>
              ))}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-700">Current Period Net Operating Income</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">{formatCurrency(netIncome)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-slate-900 border-t border-slate-300">
                <span>Total Equity</span>
                <span className="font-mono tabular-nums">{formatCurrency(totalEquity + netIncome)}</span>
              </div>
            </div>
          </div>

          {/* Accounting Equation Check: Assets = Liabilities + Equity */}
          <div className="pt-4 border-t-2 border-slate-900 bg-slate-50 p-4 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Total Liabilities & Equity</span>
              <span className="text-emerald-700 font-medium">Accounting Invariant: Assets == Liabilities + Equity</span>
            </div>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {formatCurrency(totalLiabilities + totalEquity + netIncome)}
            </span>
          </div>
        </div>
      )}

      {/* SubTab 5: Trial Balance */}
      {activeSubTab === 'trial_balance' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-3xl mx-auto space-y-4 text-xs">
          <div className="text-center pb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 font-display">Unadjusted Trial Balance</h2>
            <p className="text-slate-500 font-mono mt-0.5">Verification of Equal Debits and Credits across All Ledger Accounts</p>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Account Title</th>
                <th className="py-2.5 px-3 text-right">Debit Balance ($)</th>
                <th className="py-2.5 px-3 text-right">Credit Balance ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {chartOfAccounts.map(acc => {
                const isDebitNormal = acc.type === 'Asset' || acc.type === 'Expense';
                const debit = isDebitNormal ? acc.balance : 0;
                const credit = !isDebitNormal ? acc.balance : 0;

                return (
                  <tr key={acc.code} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-bold text-slate-900">{acc.code}</td>
                    <td className="py-2 px-3 font-sans text-slate-800">{acc.name}</td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {debit > 0 ? formatCurrency(debit) : '—'}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums">
                      {credit > 0 ? formatCurrency(credit) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-slate-900 bg-slate-50 font-bold font-mono">
              <tr>
                <td colSpan={2} className="py-2.5 px-3 text-right font-sans">Trial Balance Sums:</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-900">
                  {formatCurrency(totalAssets + totalExpenses)}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-900">
                  {formatCurrency(totalLiabilities + totalEquity + totalRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Modals */}
      <NewJournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
      />

      <BankReconciliationModal
        isOpen={isReconModalOpen}
        onClose={() => setIsReconModalOpen(false)}
      />
    </div>
  );
};
