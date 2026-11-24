import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  ShieldCheck,
  Server,
  CreditCard,
  Wifi,
  Printer
} from 'lucide-react';

export const ServiceStatusPage: React.FC = () => {
  const { serviceComponents, refreshComponentHealth } = useApp();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ZEEX Platform':
        return <Server className="w-4 h-4 text-indigo-600" />;
      case 'External Payment Gateway':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'Local Internet / Network':
        return <Wifi className="w-4 h-4 text-sky-600" />;
      default:
        return <Printer className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Operational':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Operational</span>
          </span>
        );
      case 'Degraded':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Degraded</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Offline</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Overall Status Banner */}
      <div className="p-5 rounded-xl bg-emerald-500 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">All Core ZEEX Systems Operational</h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              30-Day Platform Availability: 99.98% · RPO Target: &lt; 5 min · RTO Target: &lt; 15 min
            </p>
          </div>
        </div>
        <div className="text-xs font-mono bg-emerald-600/60 px-3 py-1.5 rounded-lg border border-emerald-400/40">
          Last probe: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Critical SLA Targets & Boundaries Disclosure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
          <p className="font-bold text-slate-800 text-xs">Platform SLA Target</p>
          <p className="text-xl font-bold font-mono text-slate-900">99.95%</p>
          <p className="text-slate-500 text-[11px]">Contractual annual availability for cloud ledger and API services.</p>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
          <p className="font-bold text-slate-800 text-xs">Recovery Point Objective (RPO)</p>
          <p className="text-xl font-bold font-mono text-slate-900">&lt; 5 min</p>
          <p className="text-slate-500 text-[11px]">Maximum data lag between primary active AZ and hot replica domain.</p>
        </div>

        <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
          <p className="font-bold text-slate-800 text-xs">Recovery Time Objective (RTO)</p>
          <p className="text-xl font-bold font-mono text-slate-900">&lt; 15 min</p>
          <p className="text-slate-500 text-[11px]">Target window for complete cluster cutover during disaster drill.</p>
        </div>
      </div>

      {/* Clear Distinction Notice: Platform vs Local ISP vs External Providers */}
      <div className="p-4 rounded-lg border border-indigo-100 bg-indigo-50/50 text-xs text-indigo-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-indigo-950">Architectural Responsibility Boundary</p>
          <p className="text-indigo-900/90 leading-relaxed text-[11px]">
            ZEEX guarantees hosting, platform uptime, database maintenance, and encrypted disaster recovery.
            External payment gateways (e.g. Stripe, Paystack), customer local internet/ISP stability, and hardware peripherals (printers, scanners) are independently tracked below so outages are pinpointed accurately.
          </p>
        </div>
      </div>

      {/* Component Status Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Component Health Status</h3>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Component Name</th>
                <th className="px-3 py-3">Category Domain</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Round-Trip Latency</th>
                <th className="px-4 py-3">Operational Notes</th>
                <th className="px-3 py-3 text-right">Ping Probe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serviceComponents.map(comp => (
                <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                    {getCategoryIcon(comp.category)}
                    <span>{comp.name}</span>
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-600">{comp.category}</td>
                  <td className="px-3 py-3">{getStatusBadge(comp.status)}</td>
                  <td className="px-3 py-3 font-mono text-slate-700">{comp.latencyMs} ms</td>
                  <td className="px-4 py-3 text-slate-500 text-[11px]">{comp.notes}</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => refreshComponentHealth(comp.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded transition-colors cursor-pointer"
                      title="Run health probe"
                    >
                      <RefreshCw className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
