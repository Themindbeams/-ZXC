import React from 'react';
import { useApp } from '../../context/AppContext';
import { INDUSTRY_TEMPLATES } from '../../data/templatesData';
import {
  Wrench,
  ShoppingBag,
  Scale,
  HeartPulse,
  Fuel,
  Truck,
  BookOpen,
  DollarSign,
  FileText,
  Package,
  Users,
  Briefcase,
  Sliders,
  Code2,
  ShieldCheck,
  Key,
  CreditCard,
  Wheat,
  Download,
  RotateCcw,
  Activity,
  Server,
  Wifi,
  Printer,
  Layers,
  Upload,
  MessageSquare,
  Video,
  Calendar,
  Megaphone,
  CheckCircle2,
  Sparkles,
  Lock,
  Compass,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenWizard: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenWizard
}) => {
  const {
    activeIndustryId,
    org,
    payoutRequests,
    repairOrders,
    posCart,
    products,
    staffCredentials,
    userSessions,
    activePOSSession,
    exportDatabaseJSON,
    resetToFactoryData,
    experienceArea,
    setExperienceArea,
    connectMeetings,
    connectAnnouncements,
    onboardingTasks,
    currentUser
  } = useApp();

  const currentTemplate = INDUSTRY_TEMPLATES[activeIndustryId] || INDUSTRY_TEMPLATES.automotive;

  // Pending dual approval count
  const pendingApprovals = payoutRequests.filter(p => p.status === 'Pending Dual Approval').length;
  // Low stock count
  const lowStockCount = products.filter(p => p.stockQuantity <= p.reorderLevel).length;
  // Active web/terminal sessions
  const activeSessionsCount = userSessions.filter(s => s.status === 'Active').length;
  // Unacknowledged policies count
  const unacknowledgedPoliciesCount = connectAnnouncements.filter(
    a => a.requiresAcknowledgment && !a.acknowledgments.some(ack => ack.userId === currentUser.id)
  ).length;
  // Incomplete onboarding steps count
  const pendingOnboardingCount = onboardingTasks.filter(t => !t.isCompleted).length;

  const getWorkspaceIcon = () => {
    switch (activeIndustryId) {
      case 'automotive': return <Wrench className="w-4 h-4" />;
      case 'retail': return <ShoppingBag className="w-4 h-4" />;
      case 'legal': return <Scale className="w-4 h-4" />;
      case 'healthcare': return <HeartPulse className="w-4 h-4" />;
      case 'energy': return <Fuel className="w-4 h-4" />;
      case 'logistics': return <Truck className="w-4 h-4" />;
      case 'agriculture': return <Wheat className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getWorkspaceTitle = () => {
    switch (activeIndustryId) {
      case 'automotive': return 'Workshop & Job Cards';
      case 'retail': return 'Retail POS Terminal';
      case 'legal': return 'Matters & Retainers';
      case 'agriculture': return 'Farm Plots & Silos';
      case 'logistics': return 'Fleet & Freight Trips';
      case 'energy': return 'Tanks & Pump Shifts';
      case 'healthcare': return 'Encounters & Clinic';
      case 'manufacturing': return 'Production & BOM';
      default: return `${currentTemplate.name} Ops`;
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* 1. Persistent Switch between WORK & CONNECT */}
      <div className="p-3 bg-slate-950/90 border-b border-slate-800">
        <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setExperienceArea('work');
              if (activeTab.startsWith('connect_')) setActiveTab('workspace');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              experienceArea === 'work'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Work</span>
          </button>

          <button
            onClick={() => {
              setExperienceArea('connect');
              if (!activeTab.startsWith('connect_') && activeTab !== 'channels' && activeTab !== 'direct' && activeTab !== 'meetings' && activeTab !== 'calendar' && activeTab !== 'announcements' && activeTab !== 'people' && activeTab !== 'activities' && activeTab !== 'onboarding' && activeTab !== 'knowledge') {
                setActiveTab('connect_home');
              }
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              experienceArea === 'connect'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Connect</span>
            {unacknowledgedPoliciesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Active Workspace Header Card */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="uppercase tracking-wider font-semibold text-[10px]">Active Business</span>
          <button
            onClick={onOpenWizard}
            className="text-indigo-400 hover:text-indigo-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Onboard New
          </button>
        </div>
        <div className="flex items-center gap-2.5 mt-1">
          <div className="w-7 h-7 rounded bg-slate-800 text-slate-200 flex items-center justify-center shrink-0">
            {getWorkspaceIcon()}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{currentTemplate.name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{org.name}</p>
          </div>
        </div>
      </div>

      {/* 3. Navigation Sections: Rendered depending on experienceArea */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {experienceArea === 'connect' ? (
          /* ================================================================ */
          /* CONNECT EXPERIENCE NAVIGATION                                    */
          /* ================================================================ */
          <div className="space-y-4">
            <div>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center justify-between">
                <span>Internal Collaboration</span>
                <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1 py-0.2 rounded font-mono">Connect</span>
              </div>

              <nav className="space-y-1">
                {/* 1. Connect Home */}
                <button
                  onClick={() => setActiveTab('connect_home')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'connect_home'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Home className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Connect Home</span>
                </button>

                {/* 2. Channels */}
                <button
                  onClick={() => setActiveTab('channels')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'channels'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Channels</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.2 rounded">
                    8
                  </span>
                </button>

                {/* 3. Direct Messages */}
                <button
                  onClick={() => setActiveTab('direct')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'direct'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct Messages</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </button>

                {/* 4. Meetings & Video Calls */}
                <button
                  onClick={() => setActiveTab('meetings')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'meetings'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Meetings & WebRTC</span>
                  </div>
                  {connectMeetings.some(m => m.status === 'Live') && (
                    <span className="text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded-full animate-pulse uppercase">
                      Live
                    </span>
                  )}
                </button>

                {/* 5. Calendar */}
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'calendar'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Calendars & RSVPs</span>
                </button>

                {/* 6. Announcements */}
                <button
                  onClick={() => setActiveTab('announcements')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'announcements'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Megaphone className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Announcements</span>
                  </div>
                  {unacknowledgedPoliciesCount > 0 && (
                    <span className="text-[10px] bg-amber-500 text-slate-900 font-bold px-1.5 py-0.2 rounded-full font-mono">
                      {unacknowledgedPoliciesCount}
                    </span>
                  )}
                </button>

                {/* 7. People Directory */}
                <button
                  onClick={() => setActiveTab('people')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'people'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>People Directory</span>
                </button>

                {/* 8. Knowledge & Notion SOPs */}
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'knowledge'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-indigo-300 shrink-0" />
                  <span>Knowledge & SOPs</span>
                </button>

                {/* 9. Company Activities */}
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'activities'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>Company Activities</span>
                </button>

                {/* 10. Staff Onboarding & Offboarding */}
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'onboarding'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Onboarding / Exit</span>
                  </div>
                  {pendingOnboardingCount > 0 && (
                    <span className="text-[10px] bg-emerald-600/80 text-white px-1.5 py-0.2 rounded font-mono">
                      {pendingOnboardingCount} left
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* WORK EXPERIENCE NAVIGATION (Company Operations)                  */
          /* ================================================================ */
          <div className="space-y-5">
            {/* Industry Operations */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center justify-between">
                <span>Industry Operations</span>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-mono">Work</span>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('workspace')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'workspace'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {getWorkspaceIcon()}
                  <span>{getWorkspaceTitle()}</span>
                </button>

                <button
                  onClick={() => setActiveTab('pos')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'pos'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>High-Speed Retail POS</span>
                  </div>
                  {posCart.length > 0 && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full font-mono">
                      {posCart.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('operational_flow')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'operational_flow'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Activity className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Process Flow Inspector</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'projects'
                      ? 'bg-slate-800 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Projects & Task Board</span>
                </button>
              </nav>
            </div>

            {/* Commerce & Supply Chain */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Commerce & Supply Chain
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'sales'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Sales & Customers</span>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'inventory'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 shrink-0" />
                    <span>Inventory & Warehouse</span>
                  </div>
                  {lowStockCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-800">
                      {lowStockCount} low
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Finance & Dual Approvals */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Finance & Treasury</span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-mono">SoD</span>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('accounting')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'accounting'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <DollarSign className="w-4 h-4 shrink-0" />
                  <span>General Ledger & COA</span>
                </button>

                <button
                  onClick={() => setActiveTab('treasury')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'treasury'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 shrink-0" />
                    <span>Treasury & Bank Feed</span>
                  </div>
                  {pendingApprovals > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      {pendingApprovals} dual
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* People & Payroll */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>People & Compensation</span>
                <span className="text-[9px] bg-purple-950 text-purple-300 px-1 py-0.2 rounded font-mono">Strict SoD</span>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('hr')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'hr'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>HR & Confidential Payroll</span>
                </button>
              </nav>
            </div>

            {/* Cloud Platform & Hardware Edge */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Managed Infrastructure
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('cloud_console')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'cloud_console'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Server className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>ZEEX Cloud Console</span>
                </button>

                <button
                  onClick={() => setActiveTab('service_status')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'service_status'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Customer Service Status</span>
                </button>

                <button
                  onClick={() => setActiveTab('offline')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'offline'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Wifi className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Offline Continuity</span>
                </button>

                <button
                  onClick={() => setActiveTab('peripherals')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'peripherals'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Printer className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Hardware Peripherals</span>
                </button>

                <button
                  onClick={() => setActiveTab('integrations')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'integrations'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>Integrations Store</span>
                </button>

                <button
                  onClick={() => setActiveTab('data_import')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'data_import'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Upload className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Data Import Wizard</span>
                </button>
              </nav>
            </div>

            {/* Governance & Security */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Governance & Security
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Key className="w-4 h-4 shrink-0" />
                    <span>Security & Staff Vault</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {activeSessionsCount} online
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('customization')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'customization'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Sliders className="w-4 h-4 shrink-0" />
                  <span>Customization Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'audit'
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Audit Trail Logs</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Footer Utility Actions: Backup JSON & Reset */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={exportDatabaseJSON}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors p-1 cursor-pointer"
          title="Export complete database backup as JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="text-[11px]">Export JSON</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('Reset all databases, journals, and workspaces to clean initial demo state?')) {
              resetToFactoryData();
            }
          }}
          className="flex items-center gap-1.5 hover:text-rose-300 transition-colors p-1 cursor-pointer"
          title="Reset database to factory starter data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px]">Reset Data</span>
        </button>
      </div>
    </aside>
  );
};
