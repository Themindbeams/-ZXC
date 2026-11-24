import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Lock, CheckCircle2, UserCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserPermissions } from '../../types';

interface AccessRestrictedViewProps {
  moduleName: string;
  requiredPermission: keyof UserPermissions;
  rationale?: string;
  onNavigateHome: () => void;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({
  moduleName,
  requiredPermission,
  rationale,
  onNavigateHome
}) => {
  const {
    currentUser,
    users,
    switchUserById,
    grantCurrentUserPermission,
    activeBranch
  } = useApp();

  const superAdminUser = users.find(u => u.role === 'Super Admin') || users[0];
  const authorizedUsers = users.filter(u => u.permissions[requiredPermission]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Top Warning Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="uppercase tracking-wider font-mono">Separation of Duties (SoD) Protocol</span>
          </div>
          <span className="text-[11px] font-mono text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
            Permission: {requiredPermission}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-800 mb-2">
              <Lock className="w-6 h-6 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
              Access Restricted: {moduleName}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {rationale || (
                `Your current profile lacks the requisite statutory privilege (${requiredPermission}) to view or alter records in ${moduleName}.`
              )}
            </p>
          </div>

          {/* Current Operator Context Box */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Active Operator Credentials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-slate-500 block">Operator Name</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Role</span>
                <span className="font-semibold text-slate-800">{currentUser.role}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Branch & Dept</span>
                <span className="text-slate-700">{activeBranch.city} · {currentUser.department}</span>
              </div>
            </div>
          </div>

          {/* Governance Notice */}
          <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Logical & Ethical Multi-User Isolation</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              In structured enterprises, individuals in charge of General Ledger accounting cannot inspect confidential payroll wages without explicit authorization. However, if your company is a lean business where a single person handles all roles, you can immediately switch to <strong>Super Admin Mode</strong> or grant a temporary statutory elevation below.
            </p>
          </div>

          {/* Remediation & Action Options */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-900 block">Resolution & Authorization Pathways:</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Switch to Super Admin */}
              <button
                onClick={() => switchUserById(superAdminUser.id)}
                className="p-4 rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white text-left space-y-1 transition-colors cursor-pointer shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">Switch to Super Admin</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-300">
                  Switch to {superAdminUser.name} (Single Operator / Group CFO mode with all privileges enabled).
                </p>
              </button>

              {/* Option 2: Temporary Elevation */}
              <button
                onClick={() => grantCurrentUserPermission(requiredPermission)}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-left space-y-1 transition-colors cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">Request Statutory Elevation</span>
                  <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Authorize {requiredPermission} for {currentUser.name.split(' ')[0]} and record audit clearance stamp.
                </p>
              </button>
            </div>

            {/* Option 3: Switch to an explicitly authorized staff member */}
            {authorizedUsers.length > 0 && (
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 text-xs text-slate-600">
                <span>Or switch to an authorized specialist:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {authorizedUsers.slice(0, 3).map(u => (
                    <button
                      key={u.id}
                      onClick={() => switchUserById(u.id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium transition-colors cursor-pointer"
                    >
                      {u.name} ({u.role.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Back Button */}
          <div className="flex justify-start pt-4 border-t border-slate-100">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Authorized Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
