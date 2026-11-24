import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  MessageSquare,
  Bell,
  MoreHorizontal
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMore: () => void;
  onOpenNotifications: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenMore,
  onOpenNotifications,
  activeTab,
  setActiveTab
}) => {
  const {
    experienceArea,
    setExperienceArea,
    connectedNotifications
  } = useApp();

  const unreadNotifs = connectedNotifications.filter(n => !n.isRead).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-slate-400 z-40 select-none flex items-center justify-around py-2 px-1">
      {/* 1. Work */}
      <button
        onClick={() => {
          setExperienceArea('work');
          setActiveTab('workspace');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
          experienceArea === 'work' ? 'text-indigo-400 font-bold' : 'hover:text-white'
        }`}
      >
        <Briefcase className="w-5 h-5" />
        <span>Work</span>
      </button>

      {/* 2. Connect */}
      <button
        onClick={() => {
          setExperienceArea('connect');
          setActiveTab('connect_home');
        }}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
          experienceArea === 'connect' ? 'text-indigo-400 font-bold' : 'hover:text-white'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span>Connect</span>
      </button>

      {/* 3. Inbox */}
      <button
        onClick={onOpenNotifications}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold cursor-pointer hover:text-white relative"
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center font-mono">
              {unreadNotifs}
            </span>
          )}
        </div>
        <span>Inbox</span>
      </button>

      {/* 4. More */}
      <button
        onClick={onOpenMore}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold cursor-pointer hover:text-white"
      >
        <MoreHorizontal className="w-5 h-5" />
        <span>More</span>
      </button>
    </nav>
  );
};
