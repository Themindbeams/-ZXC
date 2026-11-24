import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ReadinessChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ReadinessChecklistModal: React.FC<ReadinessChecklistModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { readinessChecklist, toggleReadinessItem } = useApp();

  if (!isOpen) return null;

  const completedCount = readinessChecklist.filter(item => item.isCompleted).length;
  const progressPercent = Math.round((completedCount / readinessChecklist.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-mono">
              Operational Readiness Checklist
            </span>
            <h3 className="text-base font-bold text-white">Go-Live Operating Verification</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              {completedCount} of {readinessChecklist.length} Milestones Verified
            </span>
            <span className="font-mono font-bold text-indigo-600">{progressPercent}% Ready</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500">
            Verifying these foundational setup tasks ensures financial books balance, cash float is protected, and operational audits pass.
          </p>
        </div>

        {/* Checklist Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 text-xs">
          {readinessChecklist.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                item.isCompleted
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleReadinessItem(item.id)}
                className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4
                    className={`font-bold text-xs ${
                      item.isCompleted ? 'text-slate-900' : 'text-slate-800'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {item.module}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.description}</p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onNavigateTab(item.actionTab);
                }}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Configure</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            {progressPercent === 100
              ? '✨ Workspace fully operational and audited.'
              : 'Complete critical items before commercial transactions.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
