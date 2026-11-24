import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  ShoppingBag,
  Truck,
  Wheat,
  Fuel,
  Building,
  Plus,
  Briefcase
} from 'lucide-react';

interface WorkspaceRailProps {
  onOpenWizard: () => void;
}

export const WorkspaceRail: React.FC<WorkspaceRailProps> = ({ onOpenWizard }) => {
  const {
    authorizedWorkspaces,
    activeWorkspaceId,
    switchWorkspace
  } = useApp();

  const getWorkspaceIcon = (industryId: string) => {
    switch (industryId) {
      case 'automotive': return <Wrench className="w-5 h-5" />;
      case 'retail': return <ShoppingBag className="w-5 h-5" />;
      case 'logistics': return <Truck className="w-5 h-5" />;
      case 'agriculture': return <Wheat className="w-5 h-5" />;
      case 'energy': return <Fuel className="w-5 h-5" />;
      case 'legal': return <Building className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <aside className="w-18 bg-slate-950 text-slate-300 flex flex-col items-center py-3.5 border-r border-slate-900 select-none shrink-0 z-20">
      {/* Brand Icon at Top */}
      <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-indigo-600/30 mb-3 cursor-default">
        ZX
      </div>

      <div className="w-8 h-[1px] bg-slate-800 my-1"></div>

      {/* Authorized Workspaces List */}
      <div className="flex-1 w-full flex flex-col items-center gap-3 overflow-y-auto py-2 px-1">
        {authorizedWorkspaces.map(ws => {
          const isActive = ws.id === activeWorkspaceId;

          return (
            <div key={ws.id} className="relative group flex items-center justify-center">
              {/* Active Workspace Indicator Pill */}
              <div
                className={`absolute left-0 w-1 bg-white rounded-r transition-all duration-200 ${
                  isActive ? 'h-9' : 'h-0 group-hover:h-4'
                }`}
              ></div>

              <button
                onClick={() => switchWorkspace(ws.id)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer relative ${
                  isActive
                    ? `${ws.avatarBg} text-white shadow-lg rounded-xl ring-2 ring-indigo-400/40`
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white hover:rounded-xl'
                }`}
              >
                {getWorkspaceIcon(ws.industryId)}

                {/* Unread Badge */}
                {ws.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono ring-2 ring-slate-950">
                    {ws.unreadCount}
                  </span>
                )}
              </button>

              {/* Tooltip on hover */}
              <div className="absolute left-16 z-50 hidden group-hover:flex flex-col bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-700 pointer-events-none">
                <span className="font-bold">{ws.name}</span>
                <span className="text-[10px] text-slate-400">{ws.industry} · {ws.city}</span>
              </div>
            </div>
          );
        })}

        {/* Add / Setup New Workspace */}
        <div className="relative group flex items-center justify-center mt-1">
          <button
            onClick={onOpenWizard}
            className="w-11 h-11 rounded-2xl bg-slate-900 hover:bg-emerald-600 hover:rounded-xl text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs border border-dashed border-slate-800 hover:border-transparent"
            title="Add or Onboard Enterprise Business"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="absolute left-16 z-50 hidden group-hover:flex flex-col bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-700 pointer-events-none">
            <span className="font-bold">Add Business Workspace</span>
            <span className="text-[10px] text-slate-400">Launch Guided Onboarding Wizard</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
