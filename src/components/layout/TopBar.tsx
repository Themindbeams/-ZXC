import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INDUSTRY_TEMPLATES } from '../../data/templatesData';
import { CurrencyCode, ConnectedNotification } from '../../types';
import {
  Briefcase,
  MessageSquare,
  Search,
  Plus,
  Bell,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Video,
  FileText,
  Megaphone,
  Layers,
  ChevronDown,
  X,
  ExternalLink,
  PanelRight,
  Wifi,
  Sparkles
} from 'lucide-react';

interface TopBarProps {
  onOpenWizard: () => void;
  onOpenChecklist?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateMeeting?: () => void;
  onOpenPublishNotice?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenWizard,
  onOpenChecklist,
  activeTab,
  setActiveTab,
  onOpenCreateMeeting,
  onOpenPublishNotice
}) => {
  const {
    activeBranch,
    branches,
    setActiveBranch,
    currency,
    setCurrency,
    currentUser,
    users,
    setCurrentUser,
    activeIndustryId,
    offlineConfig,
    offlineQueue,
    readinessChecklist,
    experienceArea,
    setExperienceArea,
    connectedNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    rightPanelMode,
    setRightPanelMode,
    invoices,
    repairOrders,
    products,
    workspaceSpaces
  } = useApp();

  const currentTemplate = INDUSTRY_TEMPLATES[activeIndustryId] || INDUSTRY_TEMPLATES.automotive;

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Quick Create dropdown state
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  // Notifications dropdown state
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'all' | 'work' | 'connect'>('all');

  const unreadCount = connectedNotifications.filter(n => !n.isRead).length;

  const filteredNotifs = connectedNotifications.filter(n => {
    if (notifTab === 'work') return n.area === 'work';
    if (notifTab === 'connect') return n.area === 'connect';
    return true;
  });

  // Scoped Search Results
  const searchResults = searchQuery.trim()
    ? experienceArea === 'work'
      ? [
          ...invoices
            .filter(i => i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) || i.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(i => ({ type: 'Invoice', label: `${i.invoiceNumber} · ${i.customerName}`, sub: `$${i.total}`, tab: 'sales' })),
          ...repairOrders
            .filter(r => r.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || r.vehicleSummary.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(r => ({ type: 'Job Card', label: `#${r.orderNumber} · ${r.vehicleSummary}`, sub: r.customerName, tab: 'workspace' })),
          ...products
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(p => ({ type: 'Product SKU', label: p.name, sub: `SKU: ${p.sku}`, tab: 'inventory' }))
        ].slice(0, 5)
      : [
          ...workspaceSpaces
            .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(s => ({ type: 'Channel', label: `#${s.name}`, sub: s.description, tab: 'channels' })),
          ...users
            .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(u => ({ type: 'Staff Member', label: u.name, sub: `${u.role} · ${u.department}`, tab: 'people' }))
        ].slice(0, 5)
    : [];

  const handleSelectSearchResult = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleNotificationClick = (notif: ConnectedNotification) => {
    markNotificationRead(notif.id);
    if (notif.area === 'work') {
      setExperienceArea('work');
    } else {
      setExperienceArea('connect');
    }
    setActiveTab(notif.targetTab);
    setIsNotifsOpen(false);
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'Super Admin':
        return { label: 'Single Operator / All Access', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'Finance Director':
        return { label: 'Ledger Lead · Payroll Segregated', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'Payroll Officer':
        return { label: 'Payroll Lead · Ledger Read-Only', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'Staff Cashier':
        return { label: 'Till Operator · Books Locked', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'Chief Agronomist':
        return { label: 'Farm Plots & Silos Lead', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'Fleet Dispatcher':
        return { label: 'Logistics Command Lead', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      default:
        return { label: `${currentUser.role}`, color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 select-none">
      {/* Primary Top Bar Row */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-2.5 max-w-[1720px] mx-auto">
        {/* Left: Brand + Experience Switcher Toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => {
              setExperienceArea('work');
              setActiveTab('workspace');
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-wider shadow-xs group-hover:bg-indigo-600 transition-colors">
              ZX
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-base font-bold tracking-tight text-slate-900 leading-none">
                ZEEX Commerce
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">Enterprise Workspace</span>
            </div>
          </button>

          {/* Persistent WORK / CONNECT Segmented Toggle Pill */}
          <div className="hidden md:flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => {
                setExperienceArea('work');
                if (activeTab.startsWith('connect_')) setActiveTab('workspace');
              }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                experienceArea === 'work'
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Work</span>
            </button>

            <button
              onClick={() => {
                setExperienceArea('connect');
                if (!activeTab.startsWith('connect_')) setActiveTab('connect_home');
              }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                experienceArea === 'connect'
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
          </div>
        </div>

        {/* Center: Scoped Search Input */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              placeholder={`Search ${experienceArea === 'work' ? 'work records, invoices & SKUs...' : 'channels, team members & notices...'}`}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-10 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 text-xs">
              <div className="p-2 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 flex items-center justify-between">
                <span>Matching {experienceArea === 'work' ? 'Work Records' : 'Connect Items'}</span>
                <span className="font-mono">{searchResults.length} results</span>
              </div>
              <div className="divide-y divide-slate-100">
                {searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    onMouseDown={() => handleSelectSearchResult(res.tab)}
                    className="w-full p-2.5 hover:bg-indigo-50/60 flex items-center justify-between text-left cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">{res.label}</span>
                      <span className="text-[11px] text-slate-500">{res.sub}</span>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {res.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Quick Create (+) · Notifications · Panel Toggle · Setup */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Create (+) Menu */}
          <div className="relative">
            <button
              onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
              title="Quick Create Action"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {isQuickCreateOpen && (
              <div
                onMouseLeave={() => setIsQuickCreateOpen(false)}
                className="absolute right-0 top-9 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-50 text-xs overflow-hidden py-1"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Actions
                </div>
                <button
                  onClick={() => {
                    setExperienceArea('work');
                    setActiveTab('sales');
                    setIsQuickCreateOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>New Invoice / Sale</span>
                </button>
                <button
                  onClick={() => {
                    setExperienceArea('connect');
                    setActiveTab('meetings');
                    setIsQuickCreateOpen(false);
                    if (onOpenCreateMeeting) onOpenCreateMeeting();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>Schedule Meeting</span>
                </button>
                <button
                  onClick={() => {
                    setExperienceArea('connect');
                    setActiveTab('channels');
                    setIsQuickCreateOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <span>Start Discussion</span>
                </button>
                <button
                  onClick={() => {
                    setExperienceArea('connect');
                    setActiveTab('announcements');
                    setIsQuickCreateOpen(false);
                    if (onOpenPublishNotice) onOpenPublishNotice();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <Megaphone className="w-4 h-4 text-amber-500" />
                  <span>Post Announcement</span>
                </button>
                <button
                  onClick={() => {
                    setExperienceArea('work');
                    setActiveTab('projects');
                    setIsQuickCreateOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>New Project Task</span>
                </button>
              </div>
            )}
          </div>

          {/* Unified Notifications Center Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifsOpen(!isNotifsOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer relative"
              title="Connected Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifsOpen && (
              <div className="absolute right-0 top-10 mt-1 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 text-xs overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                {/* Filter Tabs in Notifs */}
                <div className="flex border-b border-slate-100 text-[11px] font-semibold bg-slate-50/50">
                  <button
                    onClick={() => setNotifTab('all')}
                    className={`flex-1 py-1.5 text-center cursor-pointer ${
                      notifTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500'
                    }`}
                  >
                    All ({connectedNotifications.length})
                  </button>
                  <button
                    onClick={() => setNotifTab('work')}
                    className={`flex-1 py-1.5 text-center cursor-pointer ${
                      notifTab === 'work' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500'
                    }`}
                  >
                    Work & Approvals
                  </button>
                  <button
                    onClick={() => setNotifTab('connect')}
                    className={`flex-1 py-1.5 text-center cursor-pointer ${
                      notifTab === 'connect' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500'
                    }`}
                  >
                    Connect & Mentions
                  </button>
                </div>

                {/* Notification Items */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {filteredNotifs.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      No notifications in this view.
                    </div>
                  ) : (
                    filteredNotifs.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5 ${
                          !notif.isRead ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !notif.isRead ? 'bg-indigo-600' : 'bg-transparent'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 truncate">{notif.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{notif.description}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {notif.area}
                            </span>
                            {notif.linkedRecord && (
                              <span className="text-[10px] text-indigo-700 font-medium">
                                Record: {notif.linkedRecord.title}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel Toggle Button */}
          <button
            onClick={() => setRightPanelMode(rightPanelMode === 'closed' ? 'tasks' : 'closed')}
            className={`p-2 rounded-lg text-xs font-semibold hidden lg:flex items-center gap-1 transition-colors cursor-pointer ${
              rightPanelMode !== 'closed'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Toggle Right Context Panel (Thread/Record/Tasks)"
          >
            <PanelRight className="w-4 h-4" />
          </button>

          {/* Offline / Cloud Status Pill */}
          {offlineConfig.isSimulatedOffline ? (
            <button
              onClick={() => {
                setExperienceArea('work');
                setActiveTab('offline');
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-900 border border-amber-300 hidden sm:flex items-center gap-1.5 cursor-pointer animate-pulse"
              title="Click to manage offline continuity"
            >
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>Offline ({offlineQueue.filter(q => q.status === 'Pending Sync').length})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setExperienceArea('work');
                setActiveTab('service_status');
              }}
              className="px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hidden xl:flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Cloud 99.98%</span>
            </button>
          )}

          {/* Guided Checklist Modal button */}
          {onOpenChecklist && (
            <button
              onClick={onOpenChecklist}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer hidden md:flex items-center gap-1.5 border border-slate-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Readiness</span>
            </button>
          )}
        </div>
      </div>

      {/* Secondary Context & Utility Bar: Branch, Currency, Role Switcher */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 py-1.5 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Active Industry & Branch Context */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Industry:</span>
            <span className="font-semibold text-slate-800">{currentTemplate.name}</span>
          </div>

          <span className="text-slate-300" aria-hidden="true">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Branch:</span>
            <select
              value={activeBranch.id}
              onChange={(e) => {
                const found = branches.find(b => b.id === e.target.value);
                if (found) setActiveBranch(found);
              }}
              className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-300" aria-hidden="true">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="NGN">NGN (₦)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        {/* Right: Active Operator Identity & Role Switcher for Maker-Checker testing */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Operator Identity:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const u = users.find(x => x.id === e.target.value);
                if (u) setCurrentUser(u);
              }}
              className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-900 font-semibold focus:outline-hidden cursor-pointer"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.role}
                </option>
              ))}
            </select>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
            {badge.label}
          </span>
        </div>
      </div>
    </header>
  );
};
