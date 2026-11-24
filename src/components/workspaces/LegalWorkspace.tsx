import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import { LegalMatter } from '../../types';
import {
  Scale,
  Clock,
  Plus,
  ShieldCheck,
  Calendar,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const LegalWorkspace: React.FC = () => {
  const {
    legalMatters,
    timeEntries,
    addTimeEntry,
    createInvoice,
    formatCurrency,
    currentUser,
    activeBranch
  } = useApp();

  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedMatterId, setSelectedMatterId] = useState(legalMatters[0]?.id || '');
  const [hours, setHours] = useState(2.5);
  const [description, setDescription] = useState('');

  const totalTrustRetainers = legalMatters.reduce((sum, m) => sum + m.trustRetainerBalance, 0);
  const totalUnbilledWIP = legalMatters.reduce((sum, m) => sum + m.unbilledAmount, 0);
  const totalHoursLogged = legalMatters.reduce((sum, m) => sum + m.hoursLogged, 0);

  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    const matter = legalMatters.find(m => m.id === selectedMatterId);
    if (!matter || !hours || hours <= 0) return;

    addTimeEntry({
      matterId: matter.id,
      matterTitle: matter.title,
      attorneyName: currentUser.name,
      date: new Date().toISOString().substring(0, 10),
      hours: Number(hours),
      hourlyRate: matter.billableRatePerHour,
      description: description || 'Drafting legal counsel memoranda & transaction review.'
    });

    setIsTimeModalOpen(false);
    setDescription('');
  };

  const handleBillMatter = (matter: LegalMatter) => {
    if (matter.unbilledAmount <= 0) return;

    createInvoice({
      customerId: 'cust_103',
      customerName: matter.clientName,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: '2026-10-31',
      subtotal: matter.unbilledAmount,
      taxTotal: Number((matter.unbilledAmount * 0.075).toFixed(2)),
      discountTotal: 0,
      total: Number((matter.unbilledAmount * 1.075).toFixed(2)),
      currency: 'USD',
      branchId: activeBranch.id,
      notes: `Professional Counsel Retainer Bill: ${matter.title} (${matter.matterNumber})`,
      items: [
        {
          id: `matter_item_${Date.now()}`,
          description: `Counsel Legal Services: ${matter.title} (${matter.hoursLogged} hours accumulated)`,
          quantity: 1,
          unitPrice: matter.unbilledAmount,
          taxRate: 7.5,
          total: matter.unbilledAmount * 1.075,
          glAccountCode: '4030'
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Specialized Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Legal Practice & Professional Advisory</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Legal Matters, Retainer Trust Accounts & Billable Hours
          </h1>
        </div>

        <button
          onClick={() => setIsTimeModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Clock className="w-3.5 h-3.5" />
          Log Billable Hours
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Segregated Trust Retainer Balance"
          value={formatCurrency(totalTrustRetainers)}
          secondary="Strictly Isolated in ZEEX Escrow Trust Account"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Unbilled Work-in-Progress (WIP)"
          value={formatCurrency(totalUnbilledWIP)}
          secondary="Accrued Billable Counsel Hours"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="Total Counsel Hours Logged"
          value={`${totalHoursLogged.toFixed(1)} hrs`}
          secondary="Across Active Retainers & Litigation"
          icon={<Scale className="w-4 h-4" />}
        />
      </div>

      {/* Trust Compliance Notice */}
      <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-semibold text-slate-100">Bar Association Trust Accounting Safeguards Active:</span>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Client retainer funds are held in segregated GL Account 1025 / 2040 (ZEEX Escrow Trust) and cannot be commingled with operating cash until earned through milestone billing.
            </p>
          </div>
        </div>
      </div>

      {/* Legal Matters Master */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Active Client Matters & Deadlines ({legalMatters.length})
        </h3>

        <div className="space-y-4">
          {legalMatters.map(m => (
            <div key={m.id} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{m.matterNumber}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {m.practiceArea}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="text-xs text-slate-500 font-medium">Lead: {m.leadAttorney}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{m.title}</h4>
                  <p className="text-xs text-slate-500">Client: <strong>{m.clientName}</strong></p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded">
                    {m.status}
                  </span>
                  {m.unbilledAmount > 0 && (
                    <button
                      onClick={() => handleBillMatter(m)}
                      className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Generate Retainer Invoice
                    </button>
                  )}
                </div>
              </div>

              {/* Matter Financial & Deadline Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Trust Retainer Balance</span>
                  <span className="font-bold text-emerald-700">{formatCurrency(m.trustRetainerBalance)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Billable Rate</span>
                  <span className="text-slate-900 font-semibold">{formatCurrency(m.billableRatePerHour)} / hr</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Logged Hours</span>
                  <span className="text-slate-900 font-bold">{m.hoursLogged} hrs</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Unbilled WIP Total</span>
                  <span className="font-bold text-amber-700">{formatCurrency(m.unbilledAmount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Next Deadline / Court Hearing: <strong>{m.nextHearingOrDeadline}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Timesheet Entries */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Billable Timesheet Log
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Attorney</th>
                <th className="py-2.5 px-4">Matter</th>
                <th className="py-2.5 px-4">Activity Description</th>
                <th className="py-2.5 px-4 text-right">Hours</th>
                <th className="py-2.5 px-4 text-right">Billable Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeEntries.map(te => (
                <tr key={te.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono text-slate-500">{te.date}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">{te.attorneyName}</td>
                  <td className="py-2.5 px-4 text-slate-700 font-semibold truncate max-w-xs">{te.matterTitle}</td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-sm">{te.description}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                    {te.hours} hrs
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                    {formatCurrency(te.hours * te.hourlyRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Time Modal */}
      <Modal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        title="Log Billable Counsel Hours"
        subtitle="Accrues work-in-progress on matter retainer ledger."
        maxWidth="md"
      >
        <form onSubmit={handleLogTime} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Legal Matter</label>
            <select
              value={selectedMatterId}
              onChange={(e) => setSelectedMatterId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              {legalMatters.map(m => (
                <option key={m.id} value={m.id}>
                  {m.matterNumber} — {m.title} ({formatCurrency(m.billableRatePerHour)}/hr)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Hours Spent</label>
            <input
              type="number"
              step="0.25"
              min="0.25"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Work Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Legal research on competition law; drafting cross-examination interrogatories."
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 h-20"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTimeModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Record Timesheet Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
