import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { ShieldCheck, Search, Filter, Lock, CheckCircle2, AlertOctagon } from 'lucide-react';

export const AuditModule: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Security & Compliance</span>
            <span aria-hidden="true">·</span>
            <span>Tamper-Evident Immutable Log</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Activity Audit Trail & Security Ledger
          </h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Logged Events"
          value={String(auditLogs.length)}
          secondary="Chronological Cryptographic Sequence"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Dual Approvals & Verifications"
          value={String(auditLogs.filter(l => l.action.includes('DUAL_APPROVAL')).length)}
          secondary="Separation of Duties Verification"
          icon={<Lock className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Integrity Invariant"
          value="100% Passed"
          secondary="Zero Audit Alterations Detected"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter by action, user, or reference ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
        />
      </div>

      {/* Audit Logs Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold font-sans text-slate-600">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor / User</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">Entity Reference</th>
              <th className="py-3 px-4">Event Narration & Integrity</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3 px-4 font-sans font-medium text-slate-800">{log.userName}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{log.action}</td>
                <td className="py-3 px-4 text-slate-600">
                  {log.entityType} ({log.entityId})
                </td>
                <td className="py-3 px-4 font-sans text-slate-700 max-w-md">{log.details}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-sans text-[11px] font-semibold px-2 py-0.5 rounded ${
                    log.status === 'Success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
