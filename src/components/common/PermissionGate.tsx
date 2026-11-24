import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserPermissions } from '../../types';
import { ShieldAlert, Lock, UserCheck, ArrowRight } from 'lucide-react';

interface PermissionGateProps {
  requiredPermission: keyof UserPermissions;
  title: string;
  segregationReason: string;
  recommendedRole?: string;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  requiredPermission,
  title,
  segregationReason,
  recommendedRole = 'Super Admin',
  children
}) => {
  const { currentUser, hasPermission, users, setCurrentUser } = useApp();

  const isGranted = hasPermission(requiredPermission) || currentUser.role === 'Super Admin';

  if (isGranted) {
    return <>{children}</>;
  }

  // Find a user who has this permission for easy testing
  const authorizedUser = users.find(u => u.permissions[requiredPermission] || u.role === 'Super Admin');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs max-w-2xl mx-auto text-center space-y-6 my-10">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
        <Lock className="w-7 h-7 text-amber-400" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold block">
          Enterprise Role Segregation Policy Active
        </span>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-display">
          Authorization Restricted: {title}
        </h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          {segregationReason}
        </p>
      </div>

      {/* Current User Context Box */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-left max-w-md mx-auto space-y-2">
        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
          <span className="text-slate-500">Current Logged-in Staff:</span>
          <strong className="text-slate-900 font-semibold">{currentUser.name}</strong>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Assigned System Role:</span>
          <span className="font-mono text-slate-800 font-bold">{currentUser.role}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Department:</span>
          <span className="text-slate-700">{currentUser.department}</span>
        </div>
      </div>

      {/* Switch to authorized tester */}
      {authorizedUser && (
        <div className="pt-2">
          <button
            onClick={() => setCurrentUser(authorizedUser)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Switch to Authorized Staff ({authorizedUser.name} · {authorizedUser.role})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="block text-[11px] text-slate-400 mt-2">
            Audit logging: All permission checks and role transitions are strictly recorded.
          </span>
        </div>
      )}
    </div>
  );
};
