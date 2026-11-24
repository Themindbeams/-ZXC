import React from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Briefcase, CheckCircle2, TrendingUp, Calendar, User, Clock } from 'lucide-react';

export const OperationsModule: React.FC = () => {
  const { projects, formatCurrency } = useApp();

  const totalBilled = projects.reduce((sum, p) => sum + p.billedRevenue, 0);
  const totalCost = projects.reduce((sum, p) => sum + p.actualCost, 0);
  const averageProfitability = (projects.reduce((sum, p) => sum + p.profitability, 0) / (projects.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Operations & Project Delivery</span>
            <span aria-hidden="true">·</span>
            <span>Milestone Profitability</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Projects, Jobs & Profitability Engine
          </h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Active Projects & Contracts"
          value={String(projects.length)}
          secondary="In Flight Across Branches"
          icon={<Briefcase className="w-4 h-4" />}
        />
        <StatCard
          label="Cumulative Billed Revenue"
          value={formatCurrency(totalBilled)}
          secondary={`Cost of Execution: ${formatCurrency(totalCost)}`}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Average Project Margin"
          value={`${averageProfitability}%`}
          secondary="Gross Profitability Post-Direct Labor"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Project Milestones & Financial Realization
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Client: <strong>{p.clientName}</strong></p>
                </div>
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                  {p.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Milestone Completion</span>
                  <span className="font-mono font-bold text-slate-900">{p.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg text-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Budget</span>
                  <span className="font-bold text-slate-800">{formatCurrency(p.budget)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Actual Cost</span>
                  <span className="font-bold text-slate-800">{formatCurrency(p.actualCost)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Profit Margin</span>
                  <span className="font-bold text-emerald-700">{p.profitability}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Lead: {p.manager}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.startDate} → {p.endDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
