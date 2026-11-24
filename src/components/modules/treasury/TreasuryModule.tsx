import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Modal } from '../../common/Modal';
import {
  DollarSign,
  ShieldCheck,
  Landmark,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Building,
  UserCheck
} from 'lucide-react';

export const TreasuryModule: React.FC = () => {
  const {
    bankAccounts,
    payoutRequests,
    createPayoutRequest,
    approvePayoutRequest,
    executePayout,
    currentUser,
    formatCurrency
  } = useApp();

  const [isNewPayoutModalOpen, setIsNewPayoutModalOpen] = useState(false);

  // New Payout Form State
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [bankName, setBankName] = useState('Standard Chartered');
  const [amount, setAmount] = useState<number>(2500);
  const [purpose, setPurpose] = useState('');
  const [category, setCategory] = useState<'Supplier' | 'Payroll' | 'Tax' | 'Refund' | 'Operational'>('Supplier');

  const totalBankBalance = bankAccounts.reduce((sum, b) => sum + b.balance, 0);
  const pendingApprovals = payoutRequests.filter(p => p.status === 'Pending Dual Approval');
  const approvedReadyToExecute = payoutRequests.filter(p => p.status === 'Approved');

  const handleCreatePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiaryName || !amount || amount <= 0) return;

    createPayoutRequest({
      beneficiaryName,
      beneficiaryAccount: beneficiaryAccount || '9018283921',
      bankName,
      amount: Number(amount),
      currency: 'USD',
      purpose: purpose || 'Operational settlement',
      category
    });

    setIsNewPayoutModalOpen(false);
    setBeneficiaryName('');
    setPurpose('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Treasury & Payment Security</span>
            <span aria-hidden="true">·</span>
            <span>ZEEX Bank Connected</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-700">Dual Authorization Enforced</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Payments, Treasury & Dual-Authorization Control
          </h1>
        </div>

        <button
          onClick={() => setIsNewPayoutModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Initiate Payout Request
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Liquid Treasury"
          value={formatCurrency(totalBankBalance)}
          secondary={`${bankAccounts.length} Commercial Accounts`}
          icon={<Landmark className="w-4 h-4" />}
        />
        <StatCard
          label="Pending Dual Approval"
          value={String(pendingApprovals.length)}
          secondary="Awaiting Checker Counter-Signature"
          icon={<ShieldCheck className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="Approved for Wire Dispatch"
          value={String(approvedReadyToExecute.length)}
          secondary="Dual Controls Cleared"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Maker-Checker Role Notice */}
      <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-semibold text-slate-100">Separation of Duties (Maker-Checker):</span>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Current active role: <strong>{currentUser.name} ({currentUser.role})</strong>. To approve a pending payout, switch to a different user in the top bar who did not initiate the payment.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Bank Accounts */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Connected Bank & Custody Accounts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankAccounts.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{b.accountName}</h4>
                  <span className="text-[11px] font-mono text-slate-500">{b.bankName}</span>
                </div>
                {b.isZeexBank ? (
                  <span className="text-[10px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded font-semibold">
                    ZEEX Core
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    Partner Bank
                  </span>
                )}
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Available Balance</span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">
                  {formatCurrency(b.balance, b.currency)}
                </span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">GL Code: {b.glAccountCode}</span>
                <span>Reconciled {b.lastReconciledDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout & Disbursement Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Treasury Payouts & Wire Queue ({payoutRequests.length})
          </h3>
          <span className="text-xs text-slate-500">Disbursements &gt; $2,000 mandate dual authorization</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Beneficiary & Bank</th>
                <th className="py-3 px-4">Purpose / Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Maker (Initiator)</th>
                <th className="py-3 px-4">Checker (Counter-Sign)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Dual Control Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payoutRequests.map(p => {
                const isMaker = p.makerUser === currentUser.name;
                const canApprove = p.status === 'Pending Dual Approval' && !isMaker;
                const canExecute = p.status === 'Approved';

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.beneficiaryName}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {p.bankName} · {p.beneficiaryAccount}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{p.purpose}</div>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatCurrency(p.amount, p.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{p.makerUser}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.makerTimestamp}</div>
                    </td>
                    <td className="py-3 px-4">
                      {p.checkerUser ? (
                        <>
                          <div className="text-emerald-700 font-medium">{p.checkerUser}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.checkerTimestamp}</div>
                        </>
                      ) : (
                        <span className="text-amber-700 text-[11px] font-medium">Pending Counter-Signature</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        p.status === 'Executed'
                          ? 'bg-slate-100 text-slate-800'
                          : p.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.status === 'Pending Dual Approval' && (
                        <div>
                          {canApprove ? (
                            <button
                              onClick={() => approvePayoutRequest(p.id)}
                              className="px-3 py-1 bg-emerald-700 text-white rounded font-medium hover:bg-emerald-800 transition-colors cursor-pointer text-xs"
                            >
                              Dual-Approve
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400" title="You are the Maker. Another user must approve.">
                              Awaiting Checker
                            </span>
                          )}
                        </div>
                      )}

                      {canExecute && (
                        <button
                          onClick={() => executePayout(p.id)}
                          className="px-3 py-1 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5 ml-auto"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Execute Wire
                        </button>
                      )}

                      {p.status === 'Executed' && (
                        <span className="text-slate-400 font-mono text-[11px]">Wire Transmitted</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Payout Modal */}
      <Modal
        isOpen={isNewPayoutModalOpen}
        onClose={() => setIsNewPayoutModalOpen(false)}
        title="Initiate Treasury Payout"
        subtitle="Disbursements exceeding $2,000 automatically trigger the Maker-Checker Dual Authorization policy."
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePayout} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Beneficiary Name</label>
            <input
              type="text"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="e.g. Bosch OEM Spare Parts Supply Ltd"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Beneficiary Account #</label>
              <input
                type="text"
                value={beneficiaryAccount}
                onChange={(e) => setBeneficiaryAccount(e.target.value)}
                placeholder="e.g. 0918291024"
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Beneficiary Bank</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Payment Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              >
                <option value="Supplier">Supplier Settlement</option>
                <option value="Operational">Operational Expense</option>
                <option value="Payroll">Payroll Payout</option>
                <option value="Tax">Statutory Tax Remittance</option>
                <option value="Refund">Customer Refund</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Purpose / Commercial Narration</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Payment for PO-2026-0881 shipment delivery"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
            />
          </div>

          {amount > 2000 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Amount exceeds $2,000 threshold. Will require independent dual authorization by a Checker role before wire transmission.
              </span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewPayoutModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Submit Payout Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
