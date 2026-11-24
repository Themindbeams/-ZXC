import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserX,
  FileCheck,
  Download,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Laptop,
  BookOpen,
  Key
} from 'lucide-react';

interface ConnectOnboardingProps {
  onNavigateTab: (tab: string) => void;
}

export const ConnectOnboarding: React.FC<ConnectOnboardingProps> = ({ onNavigateTab }) => {
  const {
    onboardingTasks,
    toggleOnboardingTask,
    offboardingRecords,
    executeOffboardingStep,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'onboarding' | 'offboarding'>('onboarding');

  const completedCount = onboardingTasks.filter(t => t.isCompleted).length;
  const progressPct = Math.round((completedCount / onboardingTasks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Staff Lifecycle: Onboarding & Offboarding</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured guided onboarding for new hires and secure, audited offboarding with access revocation and task handover.
          </p>
        </div>

        {/* Tab switch between Onboarding and Offboarding */}
        <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-semibold">
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              activeTab === 'onboarding'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Guided Onboarding ({progressPct}%)
          </button>
          <button
            onClick={() => setActiveTab('offboarding')}
            className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              activeTab === 'offboarding'
                ? 'bg-white text-rose-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Offboarding Control ({offboardingRecords.length})
          </button>
        </div>
      </div>

      {activeTab === 'onboarding' ? (
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-emerald-950 p-6 rounded-2xl text-white border border-emerald-900 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Readiness Progress · {currentUser.name}
                </span>
                <h3 className="text-xl font-bold mt-1">
                  {completedCount === onboardingTasks.length
                    ? '🎉 Onboarding Complete & Ready for Full Operations!'
                    : `${completedCount} of ${onboardingTasks.length} Steps Completed`}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Complete all mandatory verification steps to unlock unrestricted workflow actions.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-3xl font-extrabold text-emerald-400">{progressPct}%</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>

          {/* Onboarding Checklist Stream */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {onboardingTasks.map(task => (
              <div
                key={task.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleOnboardingTask(task.id)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {task.category}
                      </span>
                      {task.mandatory && (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <h4 className={`text-sm font-bold mt-1 ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">{task.description}</p>
                    {task.completedAt && (
                      <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                        Completed at: {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>

                {task.actionLabel && task.actionTab && (
                  <button
                    onClick={() => onNavigateTab(task.actionTab!)}
                    className="self-end sm:self-center px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                  >
                    <span>{task.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Offboarding Console */
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-950">Statutory Separation of Access Protocol</h4>
              <p className="text-rose-800 mt-0.5 leading-relaxed">
                Offboarding requires cryptographic revocation of FIDO2 passkeys, immediate termination of all active web/till sessions, peripheral detachment, and explicit handoff of active tasks and channels to a designated colleague.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {offboardingRecords.map(rec => (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{rec.staffName}</h3>
                      <span className="text-xs text-slate-500">({rec.staffRole})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Department: {rec.department} · Departure Date: {rec.departureDate}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Step 1: Revoke Credentials */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">1. Credentials Revocation</span>
                      {rec.accessRevoked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">Passkeys, login pins & OAuth tokens</p>
                    <button
                      disabled={rec.accessRevoked}
                      onClick={() => executeOffboardingStep(rec.id, 'revoke')}
                      className={`w-full py-1.5 rounded text-xs font-semibold ${
                        rec.accessRevoked
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                      }`}
                    >
                      {rec.accessRevoked ? 'Revoked' : 'Revoke Access'}
                    </button>
                  </div>

                  {/* Step 2: Terminate Sessions */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">2. Terminate Sessions</span>
                      {rec.sessionsTerminated && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">Force logout from browser & till</p>
                    <button
                      disabled={rec.sessionsTerminated}
                      onClick={() => executeOffboardingStep(rec.id, 'sessions')}
                      className={`w-full py-1.5 rounded text-xs font-semibold ${
                        rec.sessionsTerminated
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-900 text-white cursor-pointer'
                      }`}
                    >
                      {rec.sessionsTerminated ? 'Terminated' : 'Kill Sessions'}
                    </button>
                  </div>

                  {/* Step 3: Peripheral Release */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">3. Peripherals Release</span>
                      {rec.peripheralsReleased && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">Printers, barcode scanners, cash till</p>
                    <button
                      disabled={rec.peripheralsReleased}
                      onClick={() => executeOffboardingStep(rec.id, 'peripherals')}
                      className={`w-full py-1.5 rounded text-xs font-semibold ${
                        rec.peripheralsReleased
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-900 text-white cursor-pointer'
                      }`}
                    >
                      {rec.peripheralsReleased ? 'Released' : 'Release Hardware'}
                    </button>
                  </div>

                  {/* Step 4: Export Handover */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">4. Handover Export</span>
                      {rec.handoverPackageExported && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">Audit report & reassignments</p>
                    <button
                      onClick={() => executeOffboardingStep(rec.id, 'export')}
                      className="w-full py-1.5 rounded text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Archive</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-100">
                  <span>Handoff Designee: <strong className="text-slate-900">{rec.taskHandoffDesignee}</strong></span>
                  <span className="text-[11px] text-slate-400 italic">{rec.notes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
