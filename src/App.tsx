import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { WorkspaceRail } from './components/layout/WorkspaceRail';
import { RightContextualPanel } from './components/layout/RightContextualPanel';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Toast } from './components/common/Toast';
import { BusinessSetupWizard } from './components/wizard/BusinessSetupWizard';
import { AccessRestrictedView } from './components/common/AccessRestrictedView';

// Universal Core Operational Modules (Work)
import { AccountingModule } from './components/modules/accounting/AccountingModule';
import { TreasuryModule } from './components/modules/treasury/TreasuryModule';
import { SalesModule } from './components/modules/sales/SalesModule';
import { InventoryModule } from './components/modules/inventory/InventoryModule';
import { HRModule } from './components/modules/hr/HRModule';
import { OperationsModule } from './components/modules/operations/OperationsModule';
import { CustomizationStudio } from './components/modules/customization/CustomizationStudio';
import { AuditModule } from './components/modules/audit/AuditModule';
import { SecurityAccessModule } from './components/modules/security/SecurityAccessModule';

// Tailored Industry Workspaces
import { AutomotiveWorkspace } from './components/workspaces/AutomotiveWorkspace';
import { RetailWorkspace } from './components/workspaces/RetailWorkspace';
import { LegalWorkspace } from './components/workspaces/LegalWorkspace';
import { AgribusinessWorkspace } from './components/workspaces/AgribusinessWorkspace';
import { LogisticsWorkspace } from './components/workspaces/LogisticsWorkspace';
import { EnergyFuelWorkspace } from './components/workspaces/EnergyFuelWorkspace';
import { GenericIndustryWorkspace } from './components/workspaces/GenericIndustryWorkspace';

// Managed Cloud Platform Tools
import { WorkspaceHub } from './components/managed/WorkspaceHub';
import { NotionKnowledgeHub } from './components/managed/NotionKnowledgeHub';
import { ProjectTaskManager } from './components/managed/ProjectTaskManager';
import { ZEEXCloudConsole } from './components/managed/ZEEXCloudConsole';
import { ServiceStatusPage } from './components/managed/ServiceStatusPage';
import { OfflineContinuityManager } from './components/managed/OfflineContinuityManager';
import { PeripheralDiagnosticsHub } from './components/managed/PeripheralDiagnosticsHub';
import { IntegrationsMarketplace } from './components/managed/IntegrationsMarketplace';
import { DataImportWizard } from './components/managed/DataImportWizard';
import { OperationalFlowInspector } from './components/managed/OperationalFlowInspector';
import { UniversalRecordModal } from './components/managed/UniversalRecordModal';
import { ReadinessChecklistModal } from './components/managed/ReadinessChecklistModal';

// Connect Collaboration Suite
import { ConnectHome } from './components/connect/ConnectHome';
import { ConnectChannels } from './components/connect/ConnectChannels';
import { ConnectDirectMessages } from './components/connect/ConnectDirectMessages';
import { ConnectMeetings } from './components/connect/ConnectMeetings';
import { ConnectCalendar } from './components/connect/ConnectCalendar';
import { ConnectAnnouncements } from './components/connect/ConnectAnnouncements';
import { ConnectPeople } from './components/connect/ConnectPeople';
import { ConnectActivities } from './components/connect/ConnectActivities';
import { ConnectOnboarding } from './components/connect/ConnectOnboarding';

const MainLayout: React.FC = () => {
  const {
    activeIndustryId,
    currentUser,
    notificationMessage,
    setNotificationMessage,
    experienceArea,
    setExperienceArea
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('workspace');
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);

  // Render Industry-Tailored Workspace
  const renderWorkspace = () => {
    switch (activeIndustryId) {
      case 'automotive':
        return <AutomotiveWorkspace />;
      case 'retail':
        return <RetailWorkspace />;
      case 'legal':
        return <LegalWorkspace />;
      case 'agriculture':
        return <AgribusinessWorkspace />;
      case 'logistics':
        return <LogisticsWorkspace />;
      case 'energy':
        return <EnergyFuelWorkspace />;
      default:
        return <GenericIndustryWorkspace />;
    }
  };

  // Render Active Navigation Module with Separation of Duties (SoD) Checks
  const renderActiveModule = () => {
    switch (activeTab) {
      // ====================================================================
      // CONNECT EXPERIENCE ROUTES
      // ====================================================================
      case 'connect_home':
        return (
          <ConnectHome
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenCreateMeeting={() => setActiveTab('meetings')}
            onOpenPublishNotice={() => setActiveTab('announcements')}
          />
        );

      case 'channels':
        return <ConnectChannels />;

      case 'direct':
        return <ConnectDirectMessages />;

      case 'meetings':
        return <ConnectMeetings />;

      case 'calendar':
        return <ConnectCalendar />;

      case 'announcements':
        return <ConnectAnnouncements />;

      case 'people':
        return <ConnectPeople onNavigateTab={tab => setActiveTab(tab)} />;

      case 'activities':
        return <ConnectActivities />;

      case 'onboarding':
        return <ConnectOnboarding onNavigateTab={tab => setActiveTab(tab)} />;

      // ====================================================================
      // WORK EXPERIENCE ROUTES
      // ====================================================================
      case 'workspace_hub':
        return <WorkspaceHub />;

      case 'knowledge':
        return <NotionKnowledgeHub />;

      case 'projects':
        return <ProjectTaskManager />;

      case 'operational_flow':
        return <OperationalFlowInspector />;

      case 'cloud_console':
        return <ZEEXCloudConsole />;

      case 'service_status':
        return <ServiceStatusPage />;

      case 'offline':
        return <OfflineContinuityManager />;

      case 'peripherals':
        return <PeripheralDiagnosticsHub />;

      case 'integrations':
        return <IntegrationsMarketplace />;

      case 'data_import':
        return <DataImportWizard />;

      case 'workspace':
        return renderWorkspace();

      case 'pos':
        return <RetailWorkspace />;

      case 'accounting':
        // Strict RBAC: Check if user has permission to view company financial ledger
        if (!currentUser.permissions.canViewFinance) {
          return (
            <AccessRestrictedView
              moduleName="Finance & General Ledger"
              requiredPermission="canViewFinance"
              rationale="Segregation of Duties Enforced: Frontline operators, cashiers, and shop technicians are isolated from double-entry accounting ledgers, journal entries, and balance sheets."
              onNavigateHome={() => setActiveTab('workspace')}
            />
          );
        }
        return <AccountingModule />;

      case 'treasury':
        if (!currentUser.permissions.canViewFinance) {
          return (
            <AccessRestrictedView
              moduleName="Treasury & Connected Accounts"
              requiredPermission="canViewFinance"
              rationale="Access to connected bank accounts and company disbursement queues requires Finance Officer or Executive authorization."
              onNavigateHome={() => setActiveTab('workspace')}
            />
          );
        }
        return <TreasuryModule />;

      case 'sales':
        return <SalesModule />;

      case 'inventory':
        if (!currentUser.permissions.canViewInventory) {
          return (
            <AccessRestrictedView
              moduleName="Inventory & Multi-Warehouse Management"
              requiredPermission="canViewInventory"
              rationale="Access to stock valuation and warehouse transfers requires inventory control authorization."
              onNavigateHome={() => setActiveTab('workspace')}
            />
          );
        }
        return <InventoryModule />;

      case 'hr':
        // Strict Separation of Duties: Finance & General staff CANNOT inspect Payroll unless authorized!
        if (!currentUser.permissions.canViewPayroll) {
          return (
            <AccessRestrictedView
              moduleName="HR & Confidential Payroll Register"
              requiredPermission="canViewPayroll"
              rationale="Strict Statutory Segregation: Personnel in charge of Finance, Ledger, or Operations cannot view confidential employee salary compensation, tax deductions, or bank accounts without explicit payroll authorization."
              onNavigateHome={() => setActiveTab('accounting')}
            />
          );
        }
        return <HRModule />;

      case 'operations':
        if (!currentUser.permissions.canViewOperations) {
          return (
            <AccessRestrictedView
              moduleName="Operations & Projects"
              requiredPermission="canViewOperations"
              rationale="Project profitability and operational milestones are restricted to project managers and directors."
              onNavigateHome={() => setActiveTab('workspace')}
            />
          );
        }
        return <OperationsModule />;

      case 'security':
        return <SecurityAccessModule />;

      case 'customization':
      case 'developer':
        return <CustomizationStudio />;

      case 'audit':
        return <AuditModule />;

      default:
        return experienceArea === 'connect' ? (
          <ConnectHome onNavigateTab={tab => setActiveTab(tab)} />
        ) : (
          renderWorkspace()
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-slate-900 selection:text-white pb-14 md:pb-0">
      {/* Top Bar Header with Scoped Search, Quick Create, Notifications & Operator Role Switcher */}
      <TopBar
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateMeeting={() => setActiveTab('meetings')}
        onOpenPublishNotice={() => setActiveTab('announcements')}
      />

      {/* Main Body Area: Far-Left Rail + Main Sidebar + Content + Optional Right Contextual Drawer */}
      <div className="flex-1 flex overflow-hidden w-full mx-auto">
        {/* Far-Left Rail: Authorized Business Workspaces (Discord Style) */}
        <div className="hidden lg:flex">
          <WorkspaceRail onOpenWizard={() => setIsWizardOpen(true)} />
        </div>

        {/* Main Sidebar: Work & Connect Navigation */}
        <div className="hidden md:flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenWizard={() => setIsWizardOpen(true)}
          />
        </div>

        {/* Primary Viewport Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50/70">
          <div className="max-w-6xl mx-auto">
            {renderActiveModule()}
          </div>
        </main>

        {/* Optional Right Panel: Thread / Record Details / Participants / Tasks */}
        <div className="hidden xl:flex">
          <RightContextualPanel />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Work, Connect, Inbox, More) */}
      <MobileBottomNav
        onOpenMore={() => setIsWizardOpen(true)}
        onOpenNotifications={() => {}}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Universal 360-Degree Record Drawer */}
      <UniversalRecordModal />

      {/* Guided Readiness Checklist Modal */}
      <ReadinessChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Business Setup Wizard Modal */}
      <BusinessSetupWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />

      {/* System Toast Notification */}
      <Toast
        message={notificationMessage}
        onClose={() => setNotificationMessage(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
