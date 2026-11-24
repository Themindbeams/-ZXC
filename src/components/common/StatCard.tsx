import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  secondary?: string;
  trend?: {
    positive: boolean;
    text: string;
  };
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  secondary,
  trend,
  icon
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-500 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </div>
        {(secondary || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            {trend && (
              <span className={`font-medium ${trend.positive ? 'text-emerald-700' : 'text-rose-600'}`}>
                {trend.text}
              </span>
            )}
            {trend && secondary && <span aria-hidden="true">·</span>}
            {secondary && <span>{secondary}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
