import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organization,
  Branch,
  User,
  CurrencyCode,
  ChartOfAccount,
  JournalEntry,
  BankAccount,
  BankStatementLine,
  PayoutRequest,
  Customer,
  Invoice,
  Product,
  Warehouse,
  Supplier,
  PurchaseOrder,
  Employee,
  PayrollRun,
  Project,
  Vehicle,
  RepairOrder,
  POSTransaction,
  POSSession,
  LegalMatter,
  TimeEntry,
  CustomFieldDefinition,
  CustomRecordDefinition,
  AutomationWorkflow,
  AuditLog,
  IndustryCategory,
  POSCartItem,
  UserPermissions,
  StaffSecurityCredential,
  UserSession,
  StockTransfer,
  FarmPlot,
  CropCycle,
  HarvestRecord,
  AgroInput,
  FleetVehicle,
  DispatchTrip,
  Waybill,
  FuelTank,
  PumpShiftReading,
  WorkspaceSpace,
  WorkspaceMessage,
  WorkspaceAttachment,
  NotionPage,
  ProjectTask,
  CloudInfrastructureStatus,
  BackupSnapshot,
  DurableQueueJob,
  ServiceComponent,
  OfflineConfig,
  OfflineQueueItem,
  PeripheralDevice,
  IntegrationApp,
  ReadinessChecklistItem,
  ExperienceArea,
  AuthorizedWorkspace,
  ConnectMeeting,
  ConnectCalendarEvent,
  ConnectAnnouncement,
  ConnectActivity,
  OnboardingTask,
  OffboardingRecord,
  ConnectedNotification,
  RightPanelMode
} from '../types';
import {
  INITIAL_ORGANIZATION,
  INITIAL_BRANCHES,
  CURRENT_USER,
  INITIAL_USERS,
  INITIAL_STAFF_CREDENTIALS,
  INITIAL_USER_SESSIONS,
  INITIAL_POS_SESSIONS,
  INITIAL_CHART_OF_ACCOUNTS,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_BANK_STATEMENT_LINES,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_PAYOUT_REQUESTS,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INITIAL_WAREHOUSES,
  INITIAL_PRODUCTS,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_PAYROLL_RUNS,
  INITIAL_PROJECTS,
  INITIAL_VEHICLES,
  INITIAL_REPAIR_ORDERS,
  INITIAL_POS_TRANSACTIONS,
  INITIAL_LEGAL_MATTERS,
  INITIAL_TIME_ENTRIES,
  INITIAL_FARM_PLOTS,
  INITIAL_CROP_CYCLES,
  INITIAL_HARVEST_RECORDS,
  INITIAL_AGRO_INPUTS,
  INITIAL_FLEET_VEHICLES,
  INITIAL_DISPATCH_TRIPS,
  INITIAL_WAYBILLS,
  INITIAL_FUEL_TANKS,
  INITIAL_PUMP_READINGS,
  INITIAL_CUSTOM_FIELDS,
  INITIAL_CUSTOM_RECORDS,
  INITIAL_AUTOMATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_WORKSPACE_SPACES,
  INITIAL_WORKSPACE_MESSAGES,
  INITIAL_NOTION_PAGES,
  INITIAL_PROJECT_TASKS,
  INITIAL_CLOUD_INFRASTRUCTURE,
  INITIAL_BACKUP_SNAPSHOTS,
  INITIAL_DURABLE_JOBS,
  INITIAL_SERVICE_COMPONENTS,
  INITIAL_OFFLINE_CONFIG,
  INITIAL_OFFLINE_QUEUE,
  INITIAL_PERIPHERAL_DEVICES,
  INITIAL_INTEGRATIONS,
  INITIAL_READINESS_CHECKLIST,
  INITIAL_AUTHORIZED_WORKSPACES,
  INITIAL_CONNECT_MEETINGS,
  INITIAL_CONNECT_CALENDAR_EVENTS,
  INITIAL_CONNECT_ANNOUNCEMENTS,
  INITIAL_CONNECT_ACTIVITIES,
  INITIAL_ONBOARDING_TASKS,
  INITIAL_OFFBOARDING_RECORDS,
  INITIAL_CONNECTED_NOTIFICATIONS
} from '../data/initialData';
import { INDUSTRY_TEMPLATES } from '../data/templatesData';

interface AppContextType {
  // Core & Org
  org: Organization;
  branches: Branch[];
  activeBranch: Branch;
  setActiveBranch: (branch: Branch) => void;
  currentUser: User;
  users: User[];
  roles: { role: string; branchId?: string }[];
  setCurrentUser: (user: User) => void;
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatCurrency: (amount: number, overrideCurrency?: CurrencyCode) => string;
  hasPermission: (permKey: keyof UserPermissions) => boolean;
  grantCurrentUserPermission: (permKey: keyof UserPermissions) => void;
  switchUserById: (userId: string) => void;

  // Active Industry Workspace
  activeIndustryId: IndustryCategory;
  switchIndustry: (industry: IndustryCategory) => void;
  toggleModule: (moduleKey: string) => void;

  // Staff Security & Login Sessions
  staffCredentials: StaffSecurityCredential[];
  userSessions: UserSession[];
  terminateSession: (sessionId: string) => void;
  lockUserAccount: (credentialId: string) => void;

  // Multi-Till POS Sessions & Accountability
  posSessions: POSSession[];
  activePOSSession: POSSession | undefined;
  openPOSSession: (tillNumber: string, openingFloat: number) => { success: boolean; session?: POSSession };
  closePOSSession: (sessionId: string, actualCashCounted: number, notes?: string) => void;

  // Accounting & Finance
  chartOfAccounts: ChartOfAccount[];
  journalEntries: JournalEntry[];
  bankAccounts: BankAccount[];
  bankStatementLines: BankStatementLine[];
  postJournalEntry: (entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'status' | 'totalAmount'> & { totalAmount?: number }) => { success: boolean; error?: string };
  reconcileStatementLine: (statementId: string, matchedJournalId?: string) => void;
  
  // Treasury & Dual Authorization
  payoutRequests: PayoutRequest[];
  createPayoutRequest: (data: Omit<PayoutRequest, 'id' | 'status' | 'makerUser' | 'makerTimestamp' | 'requiresDualApproval'>) => void;
  approvePayoutRequest: (payoutId: string) => void;
  executePayout: (payoutId: string) => void;

  // Sales & Invoicing
  customers: Customer[];
  invoices: Invoice[];
  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'paidAmount'>) => void;
  payInvoice: (invoiceId: string, paymentMethod: string) => void;

  // Inventory, Warehouses & Cross-Branch Transfers
  products: Product[];
  warehouses: Warehouse[];
  stockTransfers: StockTransfer[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  updateProductStock: (productId: string, quantityDelta: number) => void;
  createProduct: (product: Omit<Product, 'id'>) => void;
  createStockTransfer: (targetBranchId: string, productId: string, quantity: number) => void;
  receiveStockTransfer: (transferId: string) => void;

  // HR & Segregated Payroll
  employees: Employee[];
  payrollRuns: PayrollRun[];
  executePayrollRun: (period: string) => void;

  // Operations
  projects: Project[];

  // Automotive Industry
  vehicles: Vehicle[];
  repairOrders: RepairOrder[];
  updateRepairOrderStatus: (orderId: string, newStatus: RepairOrder['status']) => void;
  createRepairOrder: (order: Omit<RepairOrder, 'id' | 'orderNumber'>) => void;

  // Retail & Point of Sale
  posTransactions: POSTransaction[];
  posCart: POSCartItem[];
  addToPOSCart: (product: Product) => void;
  updatePOSCartQty: (productId: string, qty: number) => void;
  removeFromPOSCart: (productId: string) => void;
  clearPOSCart: () => void;
  completePOSSale: (paymentMethod: 'Cash' | 'Card' | 'Bank Transfer') => { success: boolean; transaction?: POSTransaction; error?: string };

  // Legal Practice
  legalMatters: LegalMatter[];
  timeEntries: TimeEntry[];
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'isBilled'>) => void;

  // Agribusiness & Farm Operations
  farmPlots: FarmPlot[];
  cropCycles: CropCycle[];
  harvestRecords: HarvestRecord[];
  agroInputs: AgroInput[];
  logHarvestRecord: (data: Omit<HarvestRecord, 'id' | 'harvestNumber'>) => void;

  // Logistics & Fleet Transportation
  fleetVehicles: FleetVehicle[];
  dispatchTrips: DispatchTrip[];
  waybills: Waybill[];
  dispatchNewTrip: (trip: Omit<DispatchTrip, 'id' | 'tripNumber' | 'waybillNumber' | 'status'>) => void;
  signProofOfDelivery: (waybillId: string, signee: string) => void;

  // Energy & Fuel Station
  fuelTanks: FuelTank[];
  pumpReadings: PumpShiftReading[];
  recordPumpShift: (data: Omit<PumpShiftReading, 'id' | 'variance'>) => void;
  updateTankDip: (tankId: string, currentLiters: number, waterDipCm: number) => void;

  // Customization Engine (Level 2 & 3)
  customFields: CustomFieldDefinition[];
  customRecords: CustomRecordDefinition[];
  automationWorkflows: AutomationWorkflow[];
  auditLogs: AuditLog[];
  addCustomField: (field: Omit<CustomFieldDefinition, 'id'>) => void;
  addCustomRecord: (record: Omit<CustomRecordDefinition, 'id' | 'recordsCount'>) => void;
  toggleWorkflow: (workflowId: string) => void;
  testRunWorkflow: (workflowId: string) => void;

  // Managed Workspace Architecture & Interaction Patterns
  // 1. Workspace Spaces & Record Discussions (Discord/Slack style)
  workspaceSpaces: WorkspaceSpace[];
  activeSpaceId: string;
  setActiveSpaceId: (spaceId: string) => void;
  workspaceMessages: WorkspaceMessage[];
  sendWorkspaceMessage: (spaceId: string, content: string, linkedRecord?: WorkspaceMessage['linkedRecord'], attachments?: WorkspaceAttachment[]) => void;
  addMessageReaction: (messageId: string, emoji: string) => void;

  // 2. Notion-Style SOPs, Pages & Checklists
  notionPages: NotionPage[];
  activeNotionPageId: string;
  setActiveNotionPageId: (pageId: string) => void;
  toggleChecklistItem: (pageId: string, blockId: string, itemId: string) => void;
  createNotionPage: (page: Omit<NotionPage, 'id' | 'updatedAt'>) => void;

  // 3. Project Management Tasks & Dependencies
  projectTasks: ProjectTask[];
  updateTaskStatus: (taskId: string, newStatus: ProjectTask['status']) => void;
  createProjectTask: (task: Omit<ProjectTask, 'id'>) => void;

  // 4. ZEEX Managed Infrastructure & Cloud Console
  cloudInfrastructure: CloudInfrastructureStatus;
  backupSnapshots: BackupSnapshot[];
  durableJobs: DurableQueueJob[];
  triggerBackupNow: () => void;
  testBackupRestoration: (snapshotId: string) => void;
  retryDurableJob: (jobId: string) => void;

  // 5. Customer-Facing Service Status
  serviceComponents: ServiceComponent[];
  refreshComponentHealth: (componentId: string) => void;

  // 6. Limited Offline Continuity
  offlineConfig: OfflineConfig;
  setOfflineMode: (isOffline: boolean) => void;
  offlineQueue: OfflineQueueItem[];
  recordOfflineTransaction: (item: Omit<OfflineQueueItem, 'id' | 'recordedAt' | 'operatorName' | 'tillNumber' | 'status'>) => void;
  syncOfflineQueue: () => { syncedCount: number; conflictCount: number };
  resolveOfflineConflict: (queueItemId: string, resolution: 'override' | 'discard') => void;

  // 7. Peripherals & Diagnostics Hub
  peripherals: PeripheralDevice[];
  testPeripheral: (deviceId: string) => { success: boolean; message: string };
  togglePeripheralConnection: (deviceId: string) => void;

  // 8. Integrations Marketplace & Sandboxing
  integrations: IntegrationApp[];
  installIntegration: (integrationId: string, apiKey: string) => void;
  revokeIntegration: (integrationId: string) => void;
  testSandboxIntegration: (integrationId: string) => { success: boolean; latencyMs: number };

  // 9. Data Imports & Guided Readiness
  readinessChecklist: ReadinessChecklistItem[];
  toggleReadinessItem: (itemId: string) => void;
  importDataset: (entityType: 'Products' | 'Customers' | 'ChartOfAccounts' | 'Suppliers', items: any[]) => { importedCount: number; errorCount: number };

  // 10. Universal Record Inspector (360 Degree View)
  inspectedRecord: { type: string; id: string; title: string; data?: any } | null;
  setInspectedRecord: (record: { type: string; id: string; title: string; data?: any } | null) => void;

  // 11. ZEEX Connected Experience: Work & Connect Architecture
  experienceArea: ExperienceArea;
  setExperienceArea: (area: ExperienceArea) => void;
  authorizedWorkspaces: AuthorizedWorkspace[];
  activeWorkspaceId: string;
  switchWorkspace: (workspaceId: string) => void;
  connectMeetings: ConnectMeeting[];
  connectCalendarEvents: ConnectCalendarEvent[];
  connectAnnouncements: ConnectAnnouncement[];
  connectActivities: ConnectActivity[];
  onboardingTasks: OnboardingTask[];
  offboardingRecords: OffboardingRecord[];
  connectedNotifications: ConnectedNotification[];
  rightPanelMode: RightPanelMode;
  setRightPanelMode: (mode: RightPanelMode) => void;
  activeThreadMessageId: string | null;
  setActiveThreadMessageId: (msgId: string | null) => void;

  // Connect & Unified Actions
  acknowledgeAnnouncement: (announcementId: string) => void;
  toggleOnboardingTask: (taskId: string) => void;
  toggleActivityAttendance: (activityId: string) => void;
  rsvpCalendarEvent: (eventId: string, status: 'Accepted' | 'Declined' | 'Tentative') => void;
  createConnectMeeting: (meeting: Omit<ConnectMeeting, 'id' | 'meetingUrl'>) => void;
  updateMeetingStatus: (meetingId: string, status: ConnectMeeting['status']) => void;
  toggleMeetingRecording: (meetingId: string) => void;
  publishAnnouncement: (announcement: Omit<ConnectAnnouncement, 'id' | 'publishDate' | 'acknowledgments' | 'readCount' | 'commentsCount'>) => void;
  addCalendarEvent: (event: Omit<ConnectCalendarEvent, 'id' | 'rsvpStatus'>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  executeOffboardingStep: (recordId: string, step: 'revoke' | 'sessions' | 'peripherals' | 'export') => void;
  openRecordContextualThread: (recordType: string, recordId: string, recordTitle: string) => void;
  openRecordInInspector: (recordType: string, recordId: string, recordTitle: string) => void;
  convertDiscussionToTask: (message: WorkspaceMessage) => void;

  // System Utility
  resetToFactoryData: () => void;
  exportDatabaseJSON: () => void;
  notificationMessage: string | null;
  setNotificationMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'zeex_commerce_db_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core State
  const [org, setOrg] = useState<Organization>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_org`);
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZATION;
  });

  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [activeBranch, setActiveBranch] = useState<Branch>(INITIAL_BRANCHES[0]);
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [roles, setRoles] = useState<{ role: string; branchId?: string }[]>([{ role: CURRENT_USER.role }]);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  useEffect(() => {
    setRoles([{ role: currentUser.role }]);
  }, [currentUser]);

  // Staff Security & Sessions
  const [staffCredentials, setStaffCredentials] = useState<StaffSecurityCredential[]>(INITIAL_STAFF_CREDENTIALS);
  const [userSessions, setUserSessions] = useState<UserSession[]>(INITIAL_USER_SESSIONS);

  // POS Sessions
  const [posSessions, setPosSessions] = useState<POSSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pos_sessions`);
    return saved ? JSON.parse(saved) : INITIAL_POS_SESSIONS;
  });

  // Accounting State
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_coa`);
    return saved ? JSON.parse(saved) : INITIAL_CHART_OF_ACCOUNTS;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_journals`);
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_banks`);
    return saved ? JSON.parse(saved) : INITIAL_BANK_ACCOUNTS;
  });

  const [bankStatementLines, setBankStatementLines] = useState<BankStatementLine[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bank_stmts`);
    return saved ? JSON.parse(saved) : INITIAL_BANK_STATEMENT_LINES;
  });

  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payouts`);
    return saved ? JSON.parse(saved) : INITIAL_PAYOUT_REQUESTS;
  });

  // Sales State
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  // Inventory & Transfers
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [warehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>(INITIAL_STOCK_TRANSFERS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);

  // HR & Payroll
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(INITIAL_PAYROLL_RUNS);

  // Operations
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);

  // Automotive
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [repairOrders, setRepairOrders] = useState<RepairOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_repair_orders`);
    return saved ? JSON.parse(saved) : INITIAL_REPAIR_ORDERS;
  });

  // Retail & POS
  const [posTransactions, setPosTransactions] = useState<POSTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pos_txns`);
    return saved ? JSON.parse(saved) : INITIAL_POS_TRANSACTIONS;
  });
  const [posCart, setPosCart] = useState<POSCartItem[]>([]);

  // Legal
  const [legalMatters, setLegalMatters] = useState<LegalMatter[]>(INITIAL_LEGAL_MATTERS);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(INITIAL_TIME_ENTRIES);

  // Agribusiness
  const [farmPlots, setFarmPlots] = useState<FarmPlot[]>(INITIAL_FARM_PLOTS);
  const [cropCycles, setCropCycles] = useState<CropCycle[]>(INITIAL_CROP_CYCLES);
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>(INITIAL_HARVEST_RECORDS);
  const [agroInputs, setAgroInputs] = useState<AgroInput[]>(INITIAL_AGRO_INPUTS);

  // Logistics
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>(INITIAL_FLEET_VEHICLES);
  const [dispatchTrips, setDispatchTrips] = useState<DispatchTrip[]>(INITIAL_DISPATCH_TRIPS);
  const [waybills, setWaybills] = useState<Waybill[]>(INITIAL_WAYBILLS);

  // Energy & Fuel
  const [fuelTanks, setFuelTanks] = useState<FuelTank[]>(INITIAL_FUEL_TANKS);
  const [pumpReadings, setPumpReadings] = useState<PumpShiftReading[]>(INITIAL_PUMP_READINGS);

  // Customization
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(INITIAL_CUSTOM_FIELDS);
  const [customRecords, setCustomRecords] = useState<CustomRecordDefinition[]>(INITIAL_CUSTOM_RECORDS);
  const [automationWorkflows, setAutomationWorkflows] = useState<AutomationWorkflow[]>(INITIAL_AUTOMATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Managed Workspace Architecture States
  const [workspaceSpaces, setWorkspaceSpaces] = useState<WorkspaceSpace[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_spaces`);
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACE_SPACES;
  });
  const [activeSpaceId, setActiveSpaceId] = useState<string>(INITIAL_WORKSPACE_SPACES[0].id);
  const [workspaceMessages, setWorkspaceMessages] = useState<WorkspaceMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : INITIAL_WORKSPACE_MESSAGES;
  });

  const [notionPages, setNotionPages] = useState<NotionPage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notion_pages`);
    return saved ? JSON.parse(saved) : INITIAL_NOTION_PAGES;
  });
  const [activeNotionPageId, setActiveNotionPageId] = useState<string>(INITIAL_NOTION_PAGES[0].id);

  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_TASKS;
  });

  const [cloudInfrastructure, setCloudInfrastructure] = useState<CloudInfrastructureStatus>(INITIAL_CLOUD_INFRASTRUCTURE);
  const [backupSnapshots, setBackupSnapshots] = useState<BackupSnapshot[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_backups`);
    return saved ? JSON.parse(saved) : INITIAL_BACKUP_SNAPSHOTS;
  });
  const [durableJobs, setDurableJobs] = useState<DurableQueueJob[]>(INITIAL_DURABLE_JOBS);

  const [serviceComponents, setServiceComponents] = useState<ServiceComponent[]>(INITIAL_SERVICE_COMPONENTS);

  const [offlineConfig, setOfflineConfig] = useState<OfflineConfig>(INITIAL_OFFLINE_CONFIG);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_offline_queue`);
    return saved ? JSON.parse(saved) : INITIAL_OFFLINE_QUEUE;
  });

  const [peripherals, setPeripherals] = useState<PeripheralDevice[]>(INITIAL_PERIPHERAL_DEVICES);
  const [integrations, setIntegrations] = useState<IntegrationApp[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_integrations`);
    return saved ? JSON.parse(saved) : INITIAL_INTEGRATIONS;
  });
  const [readinessChecklist, setReadinessChecklist] = useState<ReadinessChecklistItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_readiness`);
    return saved ? JSON.parse(saved) : INITIAL_READINESS_CHECKLIST;
  });

  const [inspectedRecord, setInspectedRecord] = useState<{ type: string; id: string; title: string; data?: any } | null>(null);

  // Experience Areas (Work & Connect)
  const [experienceArea, setExperienceArea] = useState<ExperienceArea>('work');
  const [authorizedWorkspaces, setAuthorizedWorkspaces] = useState<AuthorizedWorkspace[]>(INITIAL_AUTHORIZED_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(INITIAL_AUTHORIZED_WORKSPACES[0].id);

  const [connectMeetings, setConnectMeetings] = useState<ConnectMeeting[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_meetings`);
    return saved ? JSON.parse(saved) : INITIAL_CONNECT_MEETINGS;
  });

  const [connectCalendarEvents, setConnectCalendarEvents] = useState<ConnectCalendarEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_CONNECT_CALENDAR_EVENTS;
  });

  const [connectAnnouncements, setConnectAnnouncements] = useState<ConnectAnnouncement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_CONNECT_ANNOUNCEMENTS;
  });

  const [connectActivities, setConnectActivities] = useState<ConnectActivity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
    return saved ? JSON.parse(saved) : INITIAL_CONNECT_ACTIVITIES;
  });

  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_onboarding`);
    return saved ? JSON.parse(saved) : INITIAL_ONBOARDING_TASKS;
  });

  const [offboardingRecords, setOffboardingRecords] = useState<OffboardingRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_offboarding`);
    return saved ? JSON.parse(saved) : INITIAL_OFFBOARDING_RECORDS;
  });

  const [connectedNotifications, setConnectedNotifications] = useState<ConnectedNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_CONNECTED_NOTIFICATIONS;
  });

  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('closed');
  const [activeThreadMessageId, setActiveThreadMessageId] = useState<string | null>(null);

  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => setNotificationMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [notificationMessage]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_org`, JSON.stringify(org));
      localStorage.setItem(`${STORAGE_KEY}_coa`, JSON.stringify(chartOfAccounts));
      localStorage.setItem(`${STORAGE_KEY}_journals`, JSON.stringify(journalEntries));
      localStorage.setItem(`${STORAGE_KEY}_pos_sessions`, JSON.stringify(posSessions));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_KEY}_repair_orders`, JSON.stringify(repairOrders));
      localStorage.setItem(`${STORAGE_KEY}_pos_txns`, JSON.stringify(posTransactions));
      localStorage.setItem(`${STORAGE_KEY}_spaces`, JSON.stringify(workspaceSpaces));
      localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(workspaceMessages));
      localStorage.setItem(`${STORAGE_KEY}_notion_pages`, JSON.stringify(notionPages));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(projectTasks));
      localStorage.setItem(`${STORAGE_KEY}_backups`, JSON.stringify(backupSnapshots));
      localStorage.setItem(`${STORAGE_KEY}_offline_queue`, JSON.stringify(offlineQueue));
      localStorage.setItem(`${STORAGE_KEY}_integrations`, JSON.stringify(integrations));
      localStorage.setItem(`${STORAGE_KEY}_readiness`, JSON.stringify(readinessChecklist));
      localStorage.setItem(`${STORAGE_KEY}_meetings`, JSON.stringify(connectMeetings));
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(connectCalendarEvents));
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(connectAnnouncements));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(connectActivities));
      localStorage.setItem(`${STORAGE_KEY}_onboarding`, JSON.stringify(onboardingTasks));
      localStorage.setItem(`${STORAGE_KEY}_offboarding`, JSON.stringify(offboardingRecords));
      localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(connectedNotifications));
    } catch {
      // storage error ignored
    }
  }, [
    org, chartOfAccounts, journalEntries, posSessions, invoices, products, repairOrders, posTransactions,
    workspaceSpaces, workspaceMessages, notionPages, projectTasks, backupSnapshots, offlineQueue, integrations, readinessChecklist,
    connectMeetings, connectCalendarEvents, connectAnnouncements, connectActivities, onboardingTasks, offboardingRecords, connectedNotifications
  ]);

  // Granular Permission Check
  const hasPermission = (permKey: keyof UserPermissions): boolean => {
    return currentUser.permissions[permKey] === true;
  };

  // Currency Formatter
  const formatCurrency = (amount: number, overrideCurrency?: CurrencyCode): string => {
    const targetCurr = overrideCurrency || currency;
    let symbol = '$';
    let rate = 1;

    if (targetCurr === 'NGN') {
      symbol = '₦';
      rate = 1450;
    } else if (targetCurr === 'EUR') {
      symbol = '€';
      rate = 0.92;
    } else if (targetCurr === 'GBP') {
      symbol = '£';
      rate = 0.77;
    }

    const converted = amount * rate;
    return `${symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const addAuditLog = (action: string, entityType: string, entityId: string, details: string, status: 'Success' | 'Denied' | 'Flagged' = 'Success') => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '197.210.84.10',
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const grantCurrentUserPermission = (permKey: keyof UserPermissions) => {
    setCurrentUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permKey]: true
      }
    }));
    addAuditLog(
      'PRIVILEGE_ELEVATION',
      'UserPermission',
      currentUser.id,
      `Privilege "${permKey}" temporarily granted to operator ${currentUser.name} under SoD governance`,
      'Success'
    );
    setNotificationMessage(`Privilege "${permKey}" authorized for ${currentUser.name}`);
  };

  const switchUserById = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      addAuditLog(
        'USER_SESSION_SWITCH',
        'User',
        target.id,
        `Active session switched to ${target.name} (${target.role})`,
        'Success'
      );
      setNotificationMessage(`Switched active operator to ${target.name} (${target.role})`);
    }
  };

  // Active POS Session for current user/branch
  const activePOSSession = posSessions.find(
    s => s.status === 'Active' && s.branchId === activeBranch.id
  );

  const openPOSSession = (tillNumber: string, openingFloat: number) => {
    if (!hasPermission('canAccessPOS')) {
      addAuditLog('POS_ACCESS_DENIED', 'POSSession', tillNumber, 'Unauthorized user attempted to open till session', 'Denied');
      setNotificationMessage('Access Denied: Your assigned role lacks POS register authorization.');
      return { success: false };
    }

    const nextCode = `SESS-2026-${String(posSessions.length + 42).padStart(3, '0')}`;
    const newSession: POSSession = {
      id: `sess_${Date.now()}`,
      sessionCode: nextCode,
      tillNumber,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      branchId: activeBranch.id,
      branchName: activeBranch.name,
      startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      openingFloat,
      cashCollected: 0,
      cardCollected: 0,
      transferCollected: 0,
      totalSales: 0,
      ordersCount: 0,
      expectedCashInDrawer: openingFloat,
      status: 'Active',
      notes: `Till opened with physical opening float of $${openingFloat.toFixed(2)}.`
    };

    setPosSessions(prev => [newSession, ...prev]);
    addAuditLog('POS_TILL_SESSION_OPENED', 'POSSession', nextCode, `Opened ${tillNumber} at ${activeBranch.name} with $${openingFloat.toFixed(2)} float.`);
    setNotificationMessage(`Till Session ${nextCode} opened for ${tillNumber}. Ready for checkout.`);
    return { success: true, session: newSession };
  };

  const closePOSSession = (sessionId: string, actualCashCounted: number, notes?: string) => {
    const sess = posSessions.find(s => s.id === sessionId);
    if (!sess) return;

    const variance = Number((actualCashCounted - sess.expectedCashInDrawer).toFixed(2));

    setPosSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? {
              ...s,
              endTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
              actualCashCounted,
              cashVariance: variance,
              status: 'Closed',
              notes: notes || `End of shift till close. Counted $${actualCashCounted.toFixed(2)} (Variance: $${variance.toFixed(2)}).`
            }
          : s
      )
    );

    if (Math.abs(variance) > 5) {
      addAuditLog('TILL_VARIANCE_FLAGGED', 'POSSession', sess.sessionCode, `Cash drawer discrepancy detected: $${variance.toFixed(2)} variance.`, 'Flagged');
      setNotificationMessage(`Warning: Cash drawer variance of $${variance.toFixed(2)} detected on till close. Flagged in security audit.`);
    } else {
      addAuditLog('POS_TILL_SESSION_CLOSED', 'POSSession', sess.sessionCode, `Till closed balanced with Z-Report summary.`);
      setNotificationMessage(`Till Session ${sess.sessionCode} closed. Z-Report generated.`);
    }
  };

  // Staff Security Operations
  const terminateSession = (sessionId: string) => {
    setUserSessions(prev => prev.filter(s => s.id !== sessionId));
    addAuditLog('SESSION_TERMINATED', 'UserSession', sessionId, 'Session forcibly revoked by security admin.');
    setNotificationMessage('Active staff session revoked.');
  };

  const lockUserAccount = (credentialId: string) => {
    setStaffCredentials(prev =>
      prev.map(c => (c.id === credentialId ? { ...c, status: c.status === 'Locked' ? 'Active' : 'Locked' } : c))
    );
    addAuditLog('USER_LOCK_TOGGLED', 'StaffSecurityCredential', credentialId, 'Staff account access lock modified.');
    setNotificationMessage('Staff login credential state updated.');
  };

  // Cross-Branch Stock Transfer
  const createStockTransfer = (targetBranchId: string, productId: string, quantity: number) => {
    const prod = products.find(p => p.id === productId);
    const targetBranch = branches.find(b => b.id === targetBranchId);
    if (!prod || !targetBranch || quantity <= 0) return;

    if (prod.stockQuantity < quantity) {
      setNotificationMessage(`Insufficient stock at ${activeBranch.name}. Available: ${prod.stockQuantity}.`);
      return;
    }

    // Deduct stock from source warehouse
    updateProductStock(productId, -quantity);

    const newTransfer: StockTransfer = {
      id: `st_${Date.now()}`,
      transferNumber: `ST-2026-${String(stockTransfers.length + 42).padStart(4, '0')}`,
      sourceBranchId: activeBranch.id,
      sourceBranchName: activeBranch.name,
      targetBranchId: targetBranch.id,
      targetBranchName: targetBranch.name,
      productId: prod.id,
      productName: prod.name,
      quantity,
      dispatchDate: new Date().toISOString().substring(0, 10),
      status: 'In Transit',
      requestedBy: currentUser.name
    };

    setStockTransfers(prev => [newTransfer, ...prev]);
    addAuditLog('STOCK_TRANSFER_DISPATCHED', 'StockTransfer', newTransfer.transferNumber, `Dispatched ${quantity}x ${prod.name} from ${activeBranch.name} to ${targetBranch.name}`);
    setNotificationMessage(`Stock Transfer ${newTransfer.transferNumber} dispatched to ${targetBranch.name}.`);
  };

  const receiveStockTransfer = (transferId: string) => {
    const transfer = stockTransfers.find(t => t.id === transferId);
    if (!transfer) return;

    // Add stock to target warehouse
    updateProductStock(transfer.productId, transfer.quantity);

    setStockTransfers(prev =>
      prev.map(t => (t.id === transferId ? { ...t, status: 'Received & Reconciled' } : t))
    );

    addAuditLog('STOCK_TRANSFER_RECEIVED', 'StockTransfer', transfer.transferNumber, `Received and verified ${transfer.quantity}x ${transfer.productName} at ${transfer.targetBranchName}`);
    setNotificationMessage(`Transfer ${transfer.transferNumber} received and added to inventory.`);
  };

  // Switch Industry Workspace (Level 1)
  const switchIndustry = (newIndustryId: IndustryCategory) => {
    const template = INDUSTRY_TEMPLATES[newIndustryId];
    if (!template) return;

    setOrg(prev => ({
      ...prev,
      activeIndustryId: newIndustryId,
      activatedModules: Array.from(new Set([...prev.activatedModules, ...template.recommendedModules]))
    }));

    addAuditLog('WORKSPACE_SWITCHED', 'Organization', org.id, `Workspace adapted to ${template.name} industry template.`);
    setNotificationMessage(`Switched active workspace to ${template.name}.`);
  };

  const toggleModule = (moduleKey: string) => {
    setOrg(prev => {
      const exists = prev.activatedModules.includes(moduleKey);
      const updated = exists
        ? prev.activatedModules.filter(m => m !== moduleKey)
        : [...prev.activatedModules, moduleKey];
      return { ...prev, activatedModules: updated };
    });
  };

  // Double-Entry Journal Posting (Guaranteed Debits == Credits)
  const postJournalEntry = (entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'status' | 'totalAmount'> & { totalAmount?: number }) => {
    if (!hasPermission('canEditFinance') && currentUser.role !== 'Super Admin') {
      addAuditLog('FINANCE_ACCESS_DENIED', 'JournalEntry', entry.reference, 'Unauthorized journal posting attempt', 'Denied');
      return { success: false, error: 'Authorization Denied: Your assigned role lacks General Ledger posting clearance.' };
    }

    const totalDebit = entry.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = entry.lines.reduce((sum, l) => sum + (l.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return {
        success: false,
        error: `Double-entry imbalance: Total Debits ($${totalDebit.toFixed(2)}) must equal Total Credits ($${totalCredit.toFixed(2)}).`
      };
    }

    const nextNumber = `JE-2026-${String(journalEntries.length + 90).padStart(4, '0')}`;
    const newEntry: JournalEntry = {
      ...entry,
      id: `je_${Date.now()}`,
      entryNumber: nextNumber,
      status: 'Posted',
      totalAmount: totalDebit
    };

    setJournalEntries(prev => [newEntry, ...prev]);

    // Update account balances in Chart of Accounts
    setChartOfAccounts(prev => {
      return prev.map(account => {
        const line = entry.lines.find(l => l.accountCode === account.code);
        if (!line) return account;

        let delta = 0;
        if (account.type === 'Asset' || account.type === 'Expense') {
          delta = (line.debit || 0) - (line.credit || 0);
        } else {
          delta = (line.credit || 0) - (line.debit || 0);
        }

        return { ...account, balance: account.balance + delta };
      });
    });

    addAuditLog('JOURNAL_ENTRY_POSTED', 'JournalEntry', nextNumber, `Posted double-entry ledger transaction for $${totalDebit.toFixed(2)} (${entry.description})`);
    return { success: true };
  };

  const reconcileStatementLine = (statementId: string, matchedJournalId?: string) => {
    setBankStatementLines(prev =>
      prev.map(line =>
        line.id === statementId
          ? { ...line, isReconciled: true, matchedJournalId: matchedJournalId || line.matchedJournalId || 'je_sales_1042' }
          : line
      )
    );
    addAuditLog('BANK_RECONCILED', 'BankStatementLine', statementId, 'Bank line cleared against General Ledger.');
    setNotificationMessage('Bank statement transaction successfully reconciled.');
  };

  // Treasury Payouts with Maker-Checker Dual Authorization
  const createPayoutRequest = (data: Omit<PayoutRequest, 'id' | 'status' | 'makerUser' | 'makerTimestamp' | 'requiresDualApproval'>) => {
    const isAboveThreshold = data.amount > 2000;
    const newPayout: PayoutRequest = {
      ...data,
      id: `payout_${Date.now()}`,
      status: isAboveThreshold ? 'Pending Dual Approval' : 'Approved',
      makerUser: currentUser.name,
      makerTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      requiresDualApproval: isAboveThreshold
    };

    setPayoutRequests(prev => [newPayout, ...prev]);
    addAuditLog('TREASURY_PAYOUT_INITIATED', 'PayoutRequest', newPayout.id, `Payout of $${data.amount.toFixed(2)} created. Dual approval required: ${isAboveThreshold}`);

    if (isAboveThreshold) {
      setNotificationMessage(`Payout of $${data.amount.toFixed(2)} created. Requires counter-signature from Checker.`);
    } else {
      setNotificationMessage(`Payout of $${data.amount.toFixed(2)} approved.`);
    }
  };

  const approvePayoutRequest = (payoutId: string) => {
    if (!hasPermission('canApprovePayouts')) {
      addAuditLog('DUAL_APPROVAL_DENIED', 'PayoutRequest', payoutId, 'User lacks checker approval permissions.', 'Denied');
      setNotificationMessage('Authorization Denied: Your role is not authorized as a financial Checker.');
      return;
    }

    const payout = payoutRequests.find(p => p.id === payoutId);
    if (!payout) return;

    if (payout.makerUser === currentUser.name) {
      setNotificationMessage('Separation of Duties Violation: Maker cannot be Checker on the same transaction.');
      addAuditLog('DUAL_APPROVAL_REJECTED', 'PayoutRequest', payoutId, 'User attempted self-approval as maker & checker.', 'Denied');
      return;
    }

    setPayoutRequests(prev =>
      prev.map(p =>
        p.id === payoutId
          ? {
              ...p,
              status: 'Approved',
              checkerUser: currentUser.name,
              checkerTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : p
      )
    );

    addAuditLog('DUAL_APPROVAL_GRANTED', 'PayoutRequest', payoutId, `Dual authorization counter-signature verified by ${currentUser.name}.`);
    setNotificationMessage(`Dual approval confirmed by ${currentUser.name}.`);
  };

  const executePayout = (payoutId: string) => {
    const payout = payoutRequests.find(p => p.id === payoutId);
    if (!payout) return;

    postJournalEntry({
      date: new Date().toISOString().substring(0, 10),
      reference: `PAYOUT-${payout.id.slice(-6)}`,
      description: `Disbursement to ${payout.beneficiaryName} - ${payout.purpose}`,
      sourceModule: 'Bank',
      createdBy: currentUser.name,
      lines: [
        { id: `pl_1_${Date.now()}`, accountCode: '2010', accountName: 'Accounts Payable (Trade Suppliers)', debit: payout.amount, credit: 0, memo: `Settlement to ${payout.beneficiaryName}` },
        { id: `pl_2_${Date.now()}`, accountCode: '1020', accountName: 'ZEEX Bank Operating Master Account', debit: 0, credit: payout.amount, memo: `Outward wire via ZEEX Bank` }
      ]
    });

    setPayoutRequests(prev =>
      prev.map(p => (p.id === payoutId ? { ...p, status: 'Executed' } : p))
    );

    setBankAccounts(prev =>
      prev.map(b => (b.id === 'bank_zeex_primary' ? { ...b, balance: b.balance - payout.amount } : b))
    );

    addAuditLog('PAYMENT_EXECUTED', 'PayoutRequest', payoutId, `Wire transfer of $${payout.amount.toFixed(2)} transmitted via ZEEX Bank.`);
    setNotificationMessage(`Payment of $${payout.amount.toFixed(2)} transmitted.`);
  };

  // Invoicing & Sales
  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'paidAmount'>) => {
    const invoiceNum = `INV-2026-${String(invoices.length + 1043).padStart(4, '0')}`;
    const newInvoice: Invoice = {
      ...data,
      id: `inv_${Date.now()}`,
      invoiceNumber: invoiceNum,
      status: 'Sent',
      paidAmount: 0
    };

    setInvoices(prev => [newInvoice, ...prev]);

    setCustomers(prev =>
      prev.map(c => (c.id === data.customerId ? { ...c, outstandingBalance: c.outstandingBalance + data.total, totalSpent: c.totalSpent + data.total } : c))
    );

    postJournalEntry({
      date: data.issueDate,
      reference: invoiceNum,
      description: `Sales Invoice recognition for ${data.customerName}`,
      sourceModule: 'Sales',
      createdBy: currentUser.name,
      lines: [
        { id: `il_ar_${Date.now()}`, accountCode: '1030', accountName: 'Accounts Receivable (Trade Customers)', debit: data.total, credit: 0, memo: `Invoice ${invoiceNum}` },
        { id: `il_rev_${Date.now()}`, accountCode: '4010', accountName: 'Retail Merchandise & Parts Sales', debit: 0, credit: data.subtotal, memo: `Sales revenue` },
        { id: `il_tax_${Date.now()}`, accountCode: '2020', accountName: 'VAT & Sales Tax Payable', debit: 0, credit: data.taxTotal, memo: `Output VAT` }
      ]
    });

    setNotificationMessage(`Invoice ${invoiceNum} generated.`);
  };

  const payInvoice = (invoiceId: string, paymentMethod: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    setInvoices(prev =>
      prev.map(i => (i.id === invoiceId ? { ...i, status: 'Paid', paidAmount: i.total } : i))
    );

    setCustomers(prev =>
      prev.map(c => (c.id === inv.customerId ? { ...c, outstandingBalance: Math.max(0, c.outstandingBalance - inv.total) } : c))
    );

    postJournalEntry({
      date: new Date().toISOString().substring(0, 10),
      reference: `RCP-${inv.invoiceNumber}`,
      description: `Receipt of payment for ${inv.invoiceNumber} via ${paymentMethod}`,
      sourceModule: 'Sales',
      createdBy: currentUser.name,
      lines: [
        { id: `rcp_dr_${Date.now()}`, accountCode: '1020', accountName: 'ZEEX Bank Operating Master Account', debit: inv.total, credit: 0, memo: `Collections received` },
        { id: `rcp_cr_${Date.now()}`, accountCode: '1030', accountName: 'Accounts Receivable (Trade Customers)', debit: 0, credit: inv.total, memo: `A/R settlement` }
      ]
    });

    setBankAccounts(prev =>
      prev.map(b => (b.id === 'bank_zeex_primary' ? { ...b, balance: b.balance + inv.total } : b))
    );

    setNotificationMessage(`Invoice ${inv.invoiceNumber} marked Paid ($${inv.total.toFixed(2)} received).`);
  };

  // Inventory Management
  const updateProductStock = (productId: string, delta: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const newQty = Math.max(0, p.stockQuantity + delta);
        if (newQty <= p.reorderLevel) {
          setNotificationMessage(`Low Stock Alert: ${p.name} has fallen to ${newQty} ${p.unit}.`);
        }
        return { ...p, stockQuantity: newQty };
      })
    );
  };

  const createProduct = (product: Omit<Product, 'id'>) => {
    const newProd: Product = { ...product, id: `prod_${Date.now()}` };
    setProducts(prev => [newProd, ...prev]);
    addAuditLog('PRODUCT_CREATED', 'Product', newProd.sku, `Created SKU ${newProd.sku}: ${newProd.name}`);
    setNotificationMessage(`Product ${newProd.name} added to catalog.`);
  };

  // HR & Segregated Payroll Execution
  const executePayrollRun = (period: string) => {
    if (!hasPermission('canRunPayroll') && currentUser.role !== 'Super Admin') {
      addAuditLog('PAYROLL_ACCESS_DENIED', 'PayrollRun', period, 'Unauthorized user attempted to execute payroll', 'Denied');
      setNotificationMessage('Authorization Denied: Your assigned role lacks confidential Payroll clearance.');
      return;
    }

    const grossTotal = employees.reduce((acc, e) => acc + e.baseSalary, 0);
    const taxPAYE = Number((grossTotal * 0.15).toFixed(2));
    const pension = Number((grossTotal * 0.08).toFixed(2));
    const netTotal = grossTotal - taxPAYE - pension;

    const runId = `pr_${Date.now()}`;
    const newRun: PayrollRun = {
      id: runId,
      period,
      runDate: new Date().toISOString().substring(0, 10),
      totalGross: grossTotal,
      totalTaxPAYE: taxPAYE,
      totalPension: pension,
      totalNet: netTotal,
      employeeCount: employees.length,
      status: 'Approved'
    };

    setPayrollRuns(prev => [newRun, ...prev]);

    createPayoutRequest({
      beneficiaryName: `ZEEX Automated Payroll Clearing - ${period}`,
      beneficiaryAccount: '902-881-PAYROLL',
      bankName: 'ZEEX Bank International',
      amount: netTotal,
      currency: 'USD',
      purpose: `Net salary disbursements for ${employees.length} employees (${period})`,
      category: 'Payroll'
    });

    postJournalEntry({
      date: new Date().toISOString().substring(0, 10),
      reference: `PAYROLL-${period.toUpperCase().replace(' ', '-')}`,
      description: `Payroll accrual for ${period} (${employees.length} staff)`,
      sourceModule: 'Payroll',
      createdBy: currentUser.name,
      lines: [
        { id: `prl_1_${Date.now()}`, accountCode: '5020', accountName: 'Salaries, Wages & Benefits', debit: grossTotal, credit: 0, memo: 'Gross payroll expense' },
        { id: `prl_2_${Date.now()}`, accountCode: '2030', accountName: 'Payroll & Statutory Withholdings', debit: 0, credit: (taxPAYE + pension), memo: 'Tax and pension withholdings' },
        { id: `prl_3_${Date.now()}`, accountCode: '2010', accountName: 'Accounts Payable (Trade Suppliers)', debit: 0, credit: netTotal, memo: 'Net salary payable to staff' }
      ]
    });

    setNotificationMessage(`Payroll for ${period} generated ($${netTotal.toFixed(2)} net).`);
  };

  // Automotive Repair Orders
  const updateRepairOrderStatus = (orderId: string, newStatus: RepairOrder['status']) => {
    setRepairOrders(prev =>
      prev.map(ro => (ro.id === orderId ? { ...ro, status: newStatus } : ro))
    );
    addAuditLog('REPAIR_ORDER_STATUS', 'RepairOrder', orderId, `Repair status changed to: ${newStatus}`);
    setNotificationMessage(`Repair Order status updated to "${newStatus}".`);
  };

  const createRepairOrder = (order: Omit<RepairOrder, 'id' | 'orderNumber'>) => {
    const orderNum = `RO-2026-${String(repairOrders.length + 494).padStart(4, '0')}`;
    const newRO: RepairOrder = { ...order, id: `ro_${Date.now()}`, orderNumber: orderNum };
    setRepairOrders(prev => [newRO, ...prev]);
    addAuditLog('REPAIR_ORDER_CREATED', 'RepairOrder', orderNum, `Opened repair order for: ${newRO.vehicleSummary}`);
    setNotificationMessage(`Repair Order ${orderNum} opened.`);
  };

  // Retail POS Operations & Till Session Integration
  const addToPOSCart = (product: Product) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updatePOSCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromPOSCart(productId);
      return;
    }
    setPosCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromPOSCart = (productId: string) => {
    setPosCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearPOSCart = () => {
    setPosCart([]);
  };

  const completePOSSale = (paymentMethod: 'Cash' | 'Card' | 'Bank Transfer') => {
    if (!hasPermission('canAccessPOS')) {
      return { success: false, error: 'Unauthorized: You do not have cashier register permissions.' };
    }

    if (posCart.length === 0) return { success: false, error: 'Cart is empty.' };

    const activeSess = activePOSSession;
    const subtotal = posCart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
    const tax = Number((subtotal * 0.075).toFixed(2));
    const total = subtotal + tax;

    const receiptNum = `RCP-2026-${String(posTransactions.length + 9043).padStart(4, '0')}`;
    const transaction: POSTransaction = {
      id: `pos_txn_${Date.now()}`,
      receiptNumber: receiptNum,
      sessionId: activeSess?.id || 'open_till',
      tillNumber: activeSess?.tillNumber || 'Till 01',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      cashierName: currentUser.name,
      branchName: activeBranch.name,
      items: posCart.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        price: i.product.sellingPrice,
        total: i.product.sellingPrice * i.quantity
      })),
      subtotal,
      tax,
      discount: 0,
      total,
      paymentMethod
    };

    setPosTransactions(prev => [transaction, ...prev]);

    // Update active session running totals
    if (activeSess) {
      setPosSessions(prev =>
        prev.map(s => {
          if (s.id !== activeSess.id) return s;
          const cashInc = paymentMethod === 'Cash' ? total : 0;
          const cardInc = paymentMethod === 'Card' ? total : 0;
          const xferInc = paymentMethod === 'Bank Transfer' ? total : 0;

          return {
            ...s,
            cashCollected: s.cashCollected + cashInc,
            cardCollected: s.cardCollected + cardInc,
            transferCollected: s.transferCollected + xferInc,
            totalSales: s.totalSales + total,
            ordersCount: s.ordersCount + 1,
            expectedCashInDrawer: s.expectedCashInDrawer + cashInc
          };
        })
      );
    }

    // Deduct stock from inventory
    posCart.forEach(item => {
      updateProductStock(item.product.id, -item.quantity);
    });

    setPosCart([]);

    // Post double entry journal: Dr Cash/Bank, Cr Revenue, Cr Tax
    const cashAccountCode = paymentMethod === 'Cash' ? '1010' : '1020';
    const cashAccountName = paymentMethod === 'Cash' ? 'Cash on Hand / Till Cash Drawers' : 'ZEEX Bank Operating Master Account';

    postJournalEntry({
      date: new Date().toISOString().substring(0, 10),
      reference: receiptNum,
      description: `POS Counter Sale ${receiptNum} (${paymentMethod}) - ${activeBranch.name}`,
      sourceModule: 'POS',
      createdBy: currentUser.name,
      lines: [
        { id: `pos_dr_${Date.now()}`, accountCode: cashAccountCode, accountName: cashAccountName, debit: total, credit: 0, memo: `POS receipt ${paymentMethod}` },
        { id: `pos_cr_rev_${Date.now()}`, accountCode: '4010', accountName: 'Retail Merchandise & Parts Sales', debit: 0, credit: subtotal, memo: `POS merchandise revenue` },
        { id: `pos_cr_tax_${Date.now()}`, accountCode: '2020', accountName: 'VAT & Sales Tax Payable', debit: 0, credit: tax, memo: `Output VAT` }
      ]
    });

    addAuditLog('POS_TILL_SALE_RECORDED', 'POSTransaction', receiptNum, `POS sale $${total.toFixed(2)} completed via ${paymentMethod} by ${currentUser.name} at ${activeBranch.name}`);
    setNotificationMessage(`Sale ${receiptNum} completed ($${total.toFixed(2)}).`);
    return { success: true, transaction };
  };

  // Legal Practice
  const addTimeEntry = (entry: Omit<TimeEntry, 'id' | 'isBilled'>) => {
    const newEntry: TimeEntry = { ...entry, id: `te_${Date.now()}`, isBilled: false };
    setTimeEntries(prev => [newEntry, ...prev]);

    setLegalMatters(prev =>
      prev.map(m =>
        m.id === entry.matterId
          ? {
              ...m,
              hoursLogged: m.hoursLogged + entry.hours,
              unbilledAmount: m.unbilledAmount + (entry.hours * entry.hourlyRate)
            }
          : m
      )
    );

    addAuditLog('TIME_ENTRY_LOGGED', 'TimeEntry', newEntry.id, `Logged ${entry.hours} hrs for matter ${entry.matterTitle}`);
    setNotificationMessage(`Logged ${entry.hours} billable hours.`);
  };

  // Agribusiness & Farm Operations
  const logHarvestRecord = (data: Omit<HarvestRecord, 'id' | 'harvestNumber'>) => {
    const harvestNum = `WB-HVT-2026-${String(harvestRecords.length + 92).padStart(4, '0')}`;
    const newHarvest: HarvestRecord = {
      ...data,
      id: `hvt_${Date.now()}`,
      harvestNumber: harvestNum
    };

    setHarvestRecords(prev => [newHarvest, ...prev]);

    // Post to General Ledger: Dr Agricultural Harvest Stock (1050), Cr Produce Revenue (4030)
    postJournalEntry({
      date: data.harvestDate,
      reference: harvestNum,
      description: `Weighbridge clearance for ${data.plotName} - ${(data.grossWeightKg / 1000).toFixed(1)} tons`,
      sourceModule: 'Agri',
      createdBy: currentUser.name,
      lines: [
        { id: `agri_dr_${Date.now()}`, accountCode: '1050', accountName: 'Agricultural Harvest & Silo Stock', debit: data.marketValuation, credit: 0, memo: `Grain silo intake Grade A: ${data.gradeA_Kg}kg` },
        { id: `agri_cr_${Date.now()}`, accountCode: '4030', accountName: 'Agricultural Produce Revenue', debit: 0, credit: data.marketValuation, memo: `Farm harvest recognition` }
      ]
    });

    addAuditLog('HARVEST_WEIGHBRIDGE_LOGGED', 'HarvestRecord', harvestNum, `Weighbridge logged ${(data.grossWeightKg / 1000).toFixed(1)} tons from ${data.plotName}. Moisture: ${data.moistureContentPercent}%.`);
    setNotificationMessage(`Weighbridge Ticket ${harvestNum} verified and posted to Silo Inventory.`);
  };

  // Logistics & Fleet Transport
  const dispatchNewTrip = (trip: Omit<DispatchTrip, 'id' | 'tripNumber' | 'waybillNumber' | 'status'>) => {
    const tripNum = `TRIP-2026-${String(dispatchTrips.length + 183).padStart(4, '0')}`;
    const wbNum = `WB-${String(waybills.length + 90185)}`;

    const newTrip: DispatchTrip = {
      ...trip,
      id: `trip_${Date.now()}`,
      tripNumber: tripNum,
      waybillNumber: wbNum,
      status: 'On Route'
    };

    const newWb: Waybill = {
      id: `wb_${Date.now()}`,
      waybillNumber: wbNum,
      tripId: newTrip.id,
      shipperName: trip.originHub,
      consigneeName: trip.destinationHub,
      deliveryAddress: `Hub Logistics Depot, ${trip.destinationHub}`,
      status: 'Pending Delivery'
    };

    setDispatchTrips(prev => [newTrip, ...prev]);
    setWaybills(prev => [newWb, ...prev]);

    // Mark vehicle in transit
    setFleetVehicles(prev =>
      prev.map(v => (v.id === trip.vehicleId ? { ...v, status: 'In Transit' } : v))
    );

    addAuditLog('FLEET_TRIP_DISPATCHED', 'DispatchTrip', tripNum, `Dispatched ${newTrip.vehicleReg} on route ${trip.originHub} → ${trip.destinationHub}.`);
    setNotificationMessage(`Trip ${tripNum} dispatched with Waybill ${wbNum}.`);
  };

  const signProofOfDelivery = (waybillId: string, signee: string) => {
    const wb = waybills.find(w => w.id === waybillId);
    if (!wb) return;

    setWaybills(prev =>
      prev.map(w =>
        w.id === waybillId
          ? {
              ...w,
              receivedBySignee: signee,
              podTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              status: 'Proof of Delivery (POD) Signed'
            }
          : w
      )
    );

    // Update matching trip status
    setDispatchTrips(prev =>
      prev.map(t => (t.id === wb.tripId ? { ...t, status: 'Delivered' } : t))
    );

    addAuditLog('PROOF_OF_DELIVERY_SIGNED', 'Waybill', wb.waybillNumber, `POD confirmed and electronically signed by ${signee}. Cargo cleared.`);
    setNotificationMessage(`Waybill ${wb.waybillNumber} delivered. Proof of delivery archived.`);
  };

  // Energy & Fuel Station
  const recordPumpShift = (data: Omit<PumpShiftReading, 'id' | 'variance'>) => {
    const varAmount = Number(((data.cashRemitted + data.posTerminalRemitted) - data.expectedRevenue).toFixed(2));
    const newReading: PumpShiftReading = {
      ...data,
      id: `pump_${Date.now()}`,
      variance: varAmount
    };

    setPumpReadings(prev => [newReading, ...prev]);

    // Post to General Ledger
    postJournalEntry({
      date: new Date().toISOString().substring(0, 10),
      reference: `PUMP-${data.pumpIsland.slice(0, 7)}`,
      description: `Fuel shift reconciliation for ${data.pumpIsland} (${data.attendantName})`,
      sourceModule: 'Manual',
      createdBy: currentUser.name,
      lines: [
        { id: `f_dr_cash_${Date.now()}`, accountCode: '1010', accountName: 'Cash on Hand / Till Cash Drawers', debit: data.cashRemitted, credit: 0, memo: 'Attendant cash remittance' },
        { id: `f_dr_pos_${Date.now()}`, accountCode: '1020', accountName: 'ZEEX Bank Operating Master Account', debit: data.posTerminalRemitted, credit: 0, memo: 'Pump POS terminal settlement' },
        { id: `f_cr_rev_${Date.now()}`, accountCode: '4010', accountName: 'Retail Merchandise & Parts Sales', debit: 0, credit: data.expectedRevenue, memo: 'Bulk fuel dispensed revenue' }
      ]
    });

    addAuditLog('PUMP_SHIFT_RECONCILED', 'PumpShiftReading', newReading.id, `Shift reconciled for ${data.pumpIsland}. Volume: ${data.volumeDispensedLiters}L. Variance: $${varAmount.toFixed(2)}.`);
    setNotificationMessage(`Pump shift logged for ${data.pumpIsland}.`);
  };

  const updateTankDip = (tankId: string, currentLiters: number, waterDipCm: number) => {
    setFuelTanks(prev =>
      prev.map(t => {
        if (t.id !== tankId) return t;
        const newUllage = Math.max(0, t.totalCapacityLiters - currentLiters);
        return {
          ...t,
          currentStockLiters: currentLiters,
          waterDipCm,
          ullageLiters: newUllage,
          lastDipTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      })
    );
    addAuditLog('TANK_DIP_RECORDED', 'FuelTank', tankId, `Dip recorded: ${currentLiters}L remaining. Water level: ${waterDipCm}cm.`);
    setNotificationMessage('Underground tank calibration dip recorded.');
  };

  // Customization Engine
  const addCustomField = (field: Omit<CustomFieldDefinition, 'id'>) => {
    const newField: CustomFieldDefinition = { ...field, id: `cf_${Date.now()}` };
    setCustomFields(prev => [...prev, newField]);
    addAuditLog('CUSTOM_FIELD_ADDED', 'CustomField', newField.fieldKey, `Added custom field ${newField.label} on ${newField.targetEntity}`);
    setNotificationMessage(`Custom field "${newField.label}" added.`);
  };

  const addCustomRecord = (record: Omit<CustomRecordDefinition, 'id' | 'recordsCount'>) => {
    const newRec: CustomRecordDefinition = { ...record, id: `cr_${Date.now()}`, recordsCount: 0 };
    setCustomRecords(prev => [...prev, newRec]);
    addAuditLog('CUSTOM_RECORD_CREATED', 'CustomRecord', newRec.slug, `Defined custom entity: ${newRec.name}`);
    setNotificationMessage(`Custom entity "${newRec.name}" registered.`);
  };

  const toggleWorkflow = (workflowId: string) => {
    setAutomationWorkflows(prev =>
      prev.map(w => (w.id === workflowId ? { ...w, isActive: !w.isActive } : w))
    );
  };

  const testRunWorkflow = (workflowId: string) => {
    const wf = automationWorkflows.find(w => w.id === workflowId);
    if (!wf) return;

    setAutomationWorkflows(prev =>
      prev.map(w =>
        w.id === workflowId
          ? { ...w, executionCount: w.executionCount + 1, lastRun: new Date().toISOString().replace('T', ' ').substring(0, 19) }
          : w
      )
    );

    addAuditLog('WORKFLOW_TRIGGERED', 'AutomationWorkflow', wf.id, `Rule "${wf.name}" executed successfully.`);
    setNotificationMessage(`Workflow "${wf.name}" simulated.`);
  };

  // ============================================================================
  // Managed Workspace Architecture Handlers
  // ============================================================================

  // 1. Workspace Spaces & Messages (Discord/Slack style)
  const sendWorkspaceMessage = (
    spaceId: string,
    content: string,
    linkedRecord?: WorkspaceMessage['linkedRecord'],
    attachments?: WorkspaceAttachment[]
  ) => {
    // Detect @mentions in text
    const mentionMatches = content.match(/@([a-zA-Z0-9_\s]+?)(?=\s|$|[.,!?])/g) || [];
    const mentions = mentionMatches.map(m => m.trim());

    const newMessage: WorkspaceMessage = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      spaceId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      mentions,
      linkedRecord,
      attachments
    };

    setWorkspaceMessages(prev => [...prev, newMessage]);

    // If attached to a record and no dedicated space exists yet, create record thread
    if (linkedRecord) {
      setWorkspaceSpaces(prev => {
        const threadId = `space_record_${linkedRecord.type}_${linkedRecord.id}`;
        if (!prev.some(s => s.id === threadId)) {
          const newThreadSpace: WorkspaceSpace = {
            id: threadId,
            name: `thread-${linkedRecord.type}-${linkedRecord.id}`,
            type: 'record_thread',
            description: `Discussion on ${linkedRecord.title}`,
            unreadCount: 0,
            iconName: 'FileText',
            category: 'operations',
            linkedRecordType: linkedRecord.type,
            linkedRecordId: linkedRecord.id,
            membersCount: 2
          };
          return [...prev, newThreadSpace];
        }
        return prev;
      });
    }

    addAuditLog(
      'WORKSPACE_MESSAGE_SENT',
      'WorkspaceMessage',
      spaceId,
      `Message posted by ${currentUser.name} in space "${spaceId}" with ${mentions.length} mentions.`,
      'Success'
    );
  };

  const addMessageReaction = (messageId: string, emoji: string) => {
    setWorkspaceMessages(prev =>
      prev.map(msg => {
        if (msg.id !== messageId) return msg;
        const reactions = msg.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        if (existing) {
          if (existing.users.includes(currentUser.id)) {
            // Remove user reaction
            const newUsers = existing.users.filter(u => u !== currentUser.id);
            if (newUsers.length === 0) {
              return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) };
            }
            return {
              ...msg,
              reactions: reactions.map(r => r.emoji === emoji ? { ...r, count: newUsers.length, users: newUsers } : r)
            };
          } else {
            // Add user reaction
            return {
              ...msg,
              reactions: reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, users: [...r.users, currentUser.id] } : r)
            };
          }
        } else {
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1, users: [currentUser.id] }]
          };
        }
      })
    );
  };

  // 2. Notion-Style SOPs & Checklists
  const toggleChecklistItem = (pageId: string, blockId: string, itemId: string) => {
    setNotionPages(prev =>
      prev.map(page => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          contentBlocks: page.contentBlocks.map(block => {
            if (block.id !== blockId || !block.checklistItems) return block;
            return {
              ...block,
              checklistItems: block.checklistItems.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              )
            };
          })
        };
      })
    );
  };

  const createNotionPage = (pageData: Omit<NotionPage, 'id' | 'updatedAt'>) => {
    const newPage: NotionPage = {
      ...pageData,
      id: `page_${Date.now()}`,
      updatedAt: new Date().toISOString().substring(0, 10)
    };
    setNotionPages(prev => [newPage, ...prev]);
    addAuditLog('NOTION_PAGE_CREATED', 'NotionPage', newPage.id, `Created knowledge base doc "${newPage.title}"`, 'Success');
    setNotificationMessage(`Document "${newPage.title}" published to Knowledge Base.`);
  };

  // 3. Project Management Tasks & Dependencies
  const updateTaskStatus = (taskId: string, newStatus: ProjectTask['status']) => {
    setProjectTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
    addAuditLog('TASK_STATUS_UPDATED', 'ProjectTask', taskId, `Task ${taskId} moved to status ${newStatus}`);
    setNotificationMessage(`Task status updated to ${newStatus}`);
  };

  const createProjectTask = (taskData: Omit<ProjectTask, 'id'>) => {
    const newTask: ProjectTask = {
      ...taskData,
      id: `task_${Date.now()}`
    };
    setProjectTasks(prev => [newTask, ...prev]);
    addAuditLog('PROJECT_TASK_CREATED', 'ProjectTask', newTask.id, `Assigned task "${newTask.title}" to ${newTask.assigneeName}`);
    setNotificationMessage(`Task "${newTask.title}" created.`);
  };

  // 4. ZEEX Managed Infrastructure & Cloud Console
  const triggerBackupNow = () => {
    const newSnapshot: BackupSnapshot = {
      id: `snap_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'Manual Pre-Deployment',
      sizeMb: 43.4,
      encryption: 'AES-256-GCM',
      status: 'Verified Healthy',
      checksumSha256: `${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}...sha256`
    };
    setBackupSnapshots(prev => [newSnapshot, ...prev]);
    addAuditLog('CLOUD_BACKUP_EXECUTED', 'BackupSnapshot', newSnapshot.id, 'AES-256-GCM encrypted snapshot generated and verified.', 'Success');
    setNotificationMessage(`Encrypted snapshot ${newSnapshot.id} created and verified.`);
  };

  const testBackupRestoration = (snapshotId: string) => {
    setNotificationMessage(`Disaster Recovery Drill: Snapshot ${snapshotId} checksum passed. Hot-standby replica verified.`);
    addAuditLog('DISASTER_RECOVERY_TEST', 'BackupSnapshot', snapshotId, 'Restoration drill completed in 1.2s. RTO/RPO SLA verified.', 'Success');
  };

  const retryDurableJob = (jobId: string) => {
    setDurableJobs(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, status: 'Completed', attempts: job.attempts + 1 } : job
      )
    );
    setNotificationMessage(`Job ${jobId} re-executed with idempotency protection.`);
  };

  // 5. Customer-Facing Service Status
  const refreshComponentHealth = (componentId: string) => {
    setServiceComponents(prev =>
      prev.map(c =>
        c.id === componentId
          ? { ...c, status: 'Operational', latencyMs: Math.floor(Math.random() * 15) + 10 }
          : c
      )
    );
    setNotificationMessage(`Component ${componentId} health check OK.`);
  };

  // 6. Limited Offline Continuity
  const setOfflineMode = (isOffline: boolean) => {
    setOfflineConfig(prev => ({
      ...prev,
      isSimulatedOffline: isOffline,
      lastOnlineHeartbeat: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }));

    if (isOffline) {
      setNotificationMessage('Offline Continuity Activated: Local till sales permitted up to $2,500 limit. External e-invoicing queued.');
      addAuditLog('OFFLINE_MODE_ENTERED', 'OfflineEngine', 'till_local', 'Network connection severed. Local cache active.', 'Flagged');
    } else {
      setNotificationMessage('Cloud Connection Restored. Synchronizing offline queue...');
      syncOfflineQueue();
    }
  };

  const recordOfflineTransaction = (
    itemData: Omit<OfflineQueueItem, 'id' | 'recordedAt' | 'operatorName' | 'tillNumber' | 'status'>
  ) => {
    const newItem: OfflineQueueItem = {
      ...itemData,
      id: `off_${Date.now()}`,
      recordedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operatorName: currentUser.name,
      tillNumber: 'Till 01',
      status: 'Pending Sync'
    };
    setOfflineQueue(prev => [newItem, ...prev]);
    setNotificationMessage(`Transaction saved locally in encrypted offline queue (${newItem.id}).`);
  };

  const syncOfflineQueue = () => {
    let synced = 0;
    let conflict = 0;

    setOfflineQueue(prev =>
      prev.map(item => {
        if (item.status === 'Pending Sync') {
          // If transaction amount > $1,000 simulate review requirement, else auto-sync
          if (item.amount && item.amount > 2000) {
            conflict++;
            return {
              ...item,
              status: 'Conflict Review',
              conflictReason: 'Sale exceeded offline single-ticket threshold. Manager approval required.'
            };
          }
          synced++;
          return { ...item, status: 'Synced' };
        }
        return item;
      })
    );

    addAuditLog('OFFLINE_QUEUE_SYNCED', 'OfflineQueue', 'batch_sync', `Reconciled ${synced} transactions from local queue.`, 'Success');
    setNotificationMessage(`Sync Complete: ${synced} offline transactions posted to cloud ledger.`);
    return { syncedCount: synced, conflictCount: conflict };
  };

  const resolveOfflineConflict = (queueItemId: string, resolution: 'override' | 'discard') => {
    setOfflineQueue(prev =>
      prev.map(item => {
        if (item.id !== queueItemId) return item;
        return {
          ...item,
          status: resolution === 'override' ? 'Synced' : 'Synced',
          conflictReason: resolution === 'override' ? 'Manager override approved.' : 'Discarded by supervisor.'
        };
      })
    );
    setNotificationMessage(`Conflict for ${queueItemId} resolved (${resolution}).`);
  };

  // 7. Peripherals & Hardware Diagnostics Hub
  const testPeripheral = (deviceId: string) => {
    const dev = peripherals.find(p => p.id === deviceId);
    if (!dev) return { success: false, message: 'Device not found.' };

    if (dev.type === 'Receipt Printer') {
      return { success: true, message: `Direct ESC/POS test slip printed at ${dev.connectionDetails}. Auto-cutter OK.` };
    } else if (dev.type === 'Barcode Scanner') {
      return { success: true, message: `Scanner loopback OK: Scanned test SKU "7350021-9921" in 34ms.` };
    } else if (dev.type === 'Payment Terminal') {
      return { success: true, message: `EMV test authorization passed with Terminal Cloud Agent.` };
    } else if (dev.type === 'Weighbridge') {
      return { success: true, message: `RS-232 COM3 stream verified: Zero Calibration 0.00 kg +/- 0.02%.` };
    }
    return { success: true, message: `Device diagnostic self-test passed cleanly.` };
  };

  const togglePeripheralConnection = (deviceId: string) => {
    setPeripherals(prev =>
      prev.map(p => {
        if (p.id !== deviceId) return p;
        const newStatus = p.status === 'Connected' ? 'Disconnected' : 'Connected';
        return { ...p, status: newStatus };
      })
    );
  };

  // 8. Integrations Marketplace & Sandboxing
  const installIntegration = (integrationId: string, apiKey: string) => {
    const masked = apiKey ? `${apiKey.substring(0, 7)}••••••••${apiKey.slice(-4)}` : 'sk_live_••••••••39a1';
    setIntegrations(prev =>
      prev.map(app =>
        app.id === integrationId
          ? {
              ...app,
              status: 'Installed',
              maskedApiKey: masked,
              lastSyncStatus: 'Healthy',
              lastSyncTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : app
      )
    );
    addAuditLog('INTEGRATION_INSTALLED', 'IntegrationApp', integrationId, `Approved and installed ${integrationId} with sandboxed scopes.`, 'Success');
    setNotificationMessage(`Integration ${integrationId} activated with encrypted credentials.`);
  };

  const revokeIntegration = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(app =>
        app.id === integrationId
          ? { ...app, status: 'Available', maskedApiKey: '', lastSyncStatus: 'Healthy' }
          : app
      )
    );
    addAuditLog('INTEGRATION_REVOKED', 'IntegrationApp', integrationId, `Revoked API credentials for ${integrationId}.`, 'Flagged');
    setNotificationMessage(`Integration ${integrationId} revoked. Access tokens invalidated immediately.`);
  };

  const testSandboxIntegration = (integrationId: string) => {
    const latency = Math.floor(Math.random() * 80) + 40;
    setNotificationMessage(`Sandbox test successful: Provider API responded in ${latency}ms (HTTP 200 OK).`);
    return { success: true, latencyMs: latency };
  };

  // 9. Data Imports & Guided Readiness
  const toggleReadinessItem = (itemId: string) => {
    setReadinessChecklist(prev =>
      prev.map(item => (item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const importDataset = (
    entityType: 'Products' | 'Customers' | 'ChartOfAccounts' | 'Suppliers',
    items: any[]
  ) => {
    let imported = 0;
    let errors = 0;

    if (entityType === 'Products') {
      const validProducts: Product[] = [];
      items.forEach((item, idx) => {
        if (item.name && item.sku && Number(item.sellingPrice) >= 0) {
          validProducts.push({
            id: `prod_imp_${Date.now()}_${idx}`,
            name: item.name,
            sku: item.sku,
            category: item.category || 'General',
            unit: item.unit || item.unitOfMeasure || 'Unit',
            stockQuantity: Number(item.stockQuantity) || 0,
            reorderLevel: Number(item.reorderLevel) || 10,
            costPrice: Number(item.costPrice) || 0,
            sellingPrice: Number(item.sellingPrice) || 0,
            warehouseId: 'wh_main_abuja'
          });
          imported++;
        } else {
          errors++;
        }
      });
      setProducts(prev => [...validProducts, ...prev]);
    } else if (entityType === 'Customers') {
      const validCustomers: Customer[] = [];
      items.forEach((item, idx) => {
        if (item.name) {
          validCustomers.push({
            id: `cust_imp_${Date.now()}_${idx}`,
            name: item.name,
            email: item.email || '',
            phone: item.phone || '',
            address: item.address || '',
            creditLimit: Number(item.creditLimit) || 5000,
            outstandingBalance: 0,
            totalSpent: 0,
            taxId: item.taxId || '',
            currency: currency
          });
          imported++;
        } else {
          errors++;
        }
      });
      setCustomers(prev => [...validCustomers, ...prev]);
    }

    addAuditLog('DATA_IMPORT_BATCH', 'DataImportEngine', entityType, `Imported ${imported} records (${errors} invalid skipped).`, 'Success');
    setNotificationMessage(`Data Import: Successfully imported ${imported} ${entityType} records.`);
    return { importedCount: imported, errorCount: errors };
  };

  const resetToFactoryData = () => {
    localStorage.clear();
    setOrg(INITIAL_ORGANIZATION);
    setChartOfAccounts(INITIAL_CHART_OF_ACCOUNTS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
    setBankStatementLines(INITIAL_BANK_STATEMENT_LINES);
    setPayoutRequests(INITIAL_PAYOUT_REQUESTS);
    setCustomers(INITIAL_CUSTOMERS);
    setInvoices(INITIAL_INVOICES);
    setProducts(INITIAL_PRODUCTS);
    setStockTransfers(INITIAL_STOCK_TRANSFERS);
    setRepairOrders(INITIAL_REPAIR_ORDERS);
    setPosSessions(INITIAL_POS_SESSIONS);
    setPosTransactions(INITIAL_POS_TRANSACTIONS);
    setLegalMatters(INITIAL_LEGAL_MATTERS);
    setTimeEntries(INITIAL_TIME_ENTRIES);
    setFarmPlots(INITIAL_FARM_PLOTS);
    setCropCycles(INITIAL_CROP_CYCLES);
    setHarvestRecords(INITIAL_HARVEST_RECORDS);
    setAgroInputs(INITIAL_AGRO_INPUTS);
    setFleetVehicles(INITIAL_FLEET_VEHICLES);
    setDispatchTrips(INITIAL_DISPATCH_TRIPS);
    setWaybills(INITIAL_WAYBILLS);
    setFuelTanks(INITIAL_FUEL_TANKS);
    setPumpReadings(INITIAL_PUMP_READINGS);
    setCustomFields(INITIAL_CUSTOM_FIELDS);
    setCustomRecords(INITIAL_CUSTOM_RECORDS);
    setAutomationWorkflows(INITIAL_AUTOMATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setStaffCredentials(INITIAL_STAFF_CREDENTIALS);
    setUserSessions(INITIAL_USER_SESSIONS);
    setNotificationMessage('Database reset to clean factory state.');
  };

  const exportDatabaseJSON = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      organization: org,
      activeBranch,
      chartOfAccounts,
      journalEntries,
      bankAccounts,
      payoutRequests,
      invoices,
      products,
      stockTransfers,
      repairOrders,
      posSessions,
      posTransactions,
      legalMatters,
      farmPlots,
      cropCycles,
      harvestRecords,
      fleetVehicles,
      dispatchTrips,
      waybills,
      fuelTanks,
      pumpReadings,
      staffCredentials,
      userSessions,
      automationWorkflows,
      auditLogs
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zeex_commerce_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotificationMessage('Complete database backup exported as JSON.');
  };

  // ============================================================================
  // Connected Experience: Work & Connect Actions
  // ============================================================================

  const switchWorkspace = (workspaceId: string) => {
    const ws = authorizedWorkspaces.find(w => w.id === workspaceId);
    if (!ws) return;
    setActiveWorkspaceId(workspaceId);
    switchIndustry(ws.industryId as IndustryCategory);
    setNotificationMessage(`Switched active enterprise workspace to ${ws.name} (${ws.city})`);
    addAuditLog('SWITCH_WORKSPACE', 'AuthorizedWorkspace', workspaceId, `Switched workspace to ${ws.name} (${ws.code})`);
  };

  const acknowledgeAnnouncement = (announcementId: string) => {
    setConnectAnnouncements(prev => prev.map(a => {
      if (a.id === announcementId) {
        const alreadyAck = a.acknowledgments.some(ack => ack.userId === currentUser.id);
        if (alreadyAck) return a;
        const newAck = {
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        addAuditLog('ACKNOWLEDGE_POLICY', 'ConnectAnnouncement', announcementId, `Policy acknowledged by ${currentUser.name}`);
        return {
          ...a,
          acknowledgments: [...a.acknowledgments, newAck]
        };
      }
      return a;
    }));
    setNotificationMessage('Statutory policy acknowledged and cryptographically recorded in audit register.');
  };

  const toggleOnboardingTask = (taskId: string) => {
    setOnboardingTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newCompleted = !t.isCompleted;
        return {
          ...t,
          isCompleted: newCompleted,
          completedAt: newCompleted ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined
        };
      }
      return t;
    }));
  };

  const toggleActivityAttendance = (activityId: string) => {
    setConnectActivities(prev => prev.map(act => {
      if (act.id === activityId) {
        const nextAttending = !act.isAttending;
        return {
          ...act,
          isAttending: nextAttending,
          attendeesCount: nextAttending ? act.attendeesCount + 1 : Math.max(0, act.attendeesCount - 1)
        };
      }
      return act;
    }));
  };

  const rsvpCalendarEvent = (eventId: string, status: 'Accepted' | 'Declined' | 'Tentative') => {
    setConnectCalendarEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          rsvpStatus: {
            ...ev.rsvpStatus,
            [currentUser.id]: status
          }
        };
      }
      return ev;
    }));
    setNotificationMessage(`RSVP updated to ${status}`);
  };

  const createConnectMeeting = (meetingData: Omit<ConnectMeeting, 'id' | 'meetingUrl'>) => {
    const id = `meet_${Date.now()}`;
    const slug = meetingData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24);
    const newMeeting: ConnectMeeting = {
      ...meetingData,
      id,
      meetingUrl: `https://meet.zeex.cloud/apex/${slug}`
    };
    setConnectMeetings(prev => [newMeeting, ...prev]);

    // Add corresponding calendar event
    const newCalEvent: ConnectCalendarEvent = {
      id: `cal_meet_${id}`,
      title: newMeeting.title,
      description: newMeeting.description,
      startDate: newMeeting.scheduledStartTime,
      endDate: new Date(new Date(newMeeting.scheduledStartTime).getTime() + newMeeting.durationMinutes * 60000).toISOString().slice(0, 19),
      category: 'internal_staff',
      scope: 'team',
      privacy: 'team_only',
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      attendees: newMeeting.participants.map(p => p.userId),
      rsvpStatus: { [currentUser.id]: 'Accepted' },
      meetingId: id,
      linkedRecord: newMeeting.linkedRecord
    };
    setConnectCalendarEvents(prev => [newCalEvent, ...prev]);

    // Send notification
    const newNotif: ConnectedNotification = {
      id: `notif_${Date.now()}`,
      title: `New Meeting: ${newMeeting.title}`,
      description: `Scheduled by ${currentUser.name} (${newMeeting.durationMinutes} min)`,
      timestamp: 'Just now',
      type: 'meeting',
      area: 'connect',
      isRead: false,
      targetTab: 'meetings'
    };
    setConnectedNotifications(prev => [newNotif, ...prev]);
    setNotificationMessage(`Meeting "${newMeeting.title}" created with WebRTC room.`);
  };

  const updateMeetingStatus = (meetingId: string, status: ConnectMeeting['status']) => {
    setConnectMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, status } : m));
    setNotificationMessage(`Meeting status updated to ${status}`);
  };

  const toggleMeetingRecording = (meetingId: string) => {
    setConnectMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        const nextRecording = !m.isRecording;
        if (nextRecording) {
          addAuditLog('MEETING_RECORDING_STARTED', 'ConnectMeeting', meetingId, `Recording initiated by ${currentUser.name} with participant notice`);
        }
        return {
          ...m,
          isRecording: nextRecording,
          recordingConsentAcknowledged: true,
          recordingExpiryDate: nextRecording ? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] : undefined
        };
      }
      return m;
    }));
  };

  const publishAnnouncement = (ann: Omit<ConnectAnnouncement, 'id' | 'publishDate' | 'acknowledgments' | 'readCount' | 'commentsCount'>) => {
    const id = `anc_${Date.now()}`;
    const newAnn: ConnectAnnouncement = {
      ...ann,
      id,
      publishDate: new Date().toISOString().split('T')[0],
      acknowledgments: [],
      readCount: 1,
      commentsCount: 0
    };
    setConnectAnnouncements(prev => [newAnn, ...prev]);
    const notif: ConnectedNotification = {
      id: `notif_${Date.now()}`,
      title: `Announcement: ${newAnn.title}`,
      description: `Published by ${currentUser.name} (${newAnn.category})`,
      timestamp: 'Just now',
      type: 'announcement',
      area: 'connect',
      isRead: false,
      targetTab: 'announcements'
    };
    setConnectedNotifications(prev => [notif, ...prev]);
    setNotificationMessage('Announcement published to authorized company members.');
  };

  const addCalendarEvent = (eventData: Omit<ConnectCalendarEvent, 'id' | 'rsvpStatus'>) => {
    const id = `cal_${Date.now()}`;
    const newEvent: ConnectCalendarEvent = {
      ...eventData,
      id,
      rsvpStatus: { [currentUser.id]: 'Accepted' }
    };
    setConnectCalendarEvents(prev => [...prev, newEvent]);
    setNotificationMessage(`Calendar appointment "${newEvent.title}" scheduled.`);
  };

  const markNotificationRead = (notifId: string) => {
    setConnectedNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setConnectedNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setNotificationMessage('All notifications marked as read.');
  };

  const executeOffboardingStep = (recordId: string, step: 'revoke' | 'sessions' | 'peripherals' | 'export') => {
    setOffboardingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        if (step === 'revoke') {
          addAuditLog('STAFF_OFFBOARDING_REVOKE', 'OffboardingRecord', recordId, `Credentials revoked for ${r.staffName}`);
          return { ...r, accessRevoked: true };
        }
        if (step === 'sessions') {
          addAuditLog('STAFF_OFFBOARDING_SESSIONS', 'OffboardingRecord', recordId, `Active sessions terminated for ${r.staffName}`);
          return { ...r, sessionsTerminated: true };
        }
        if (step === 'peripherals') {
          addAuditLog('STAFF_OFFBOARDING_PERIPHERALS', 'OffboardingRecord', recordId, `Peripherals released for ${r.staffName}`);
          return { ...r, peripheralsReleased: true };
        }
        if (step === 'export') {
          addAuditLog('STAFF_OFFBOARDING_EXPORT', 'OffboardingRecord', recordId, `Handover package exported for ${r.staffName}`);
          return { ...r, handoverPackageExported: true, status: 'Completed' as const };
        }
      }
      return r;
    }));
    setNotificationMessage(`Offboarding action executed: ${step}`);
  };

  const openRecordContextualThread = (recordType: string, recordId: string, recordTitle: string) => {
    let space = workspaceSpaces.find(s => s.linkedRecordId === recordId);
    if (!space) {
      space = {
        id: `space_rec_${recordId}_${Date.now()}`,
        name: `thread-${recordType.slice(0, 3)}-${recordId}`,
        type: 'record_thread',
        description: `Operational discussion thread for ${recordTitle}`,
        unreadCount: 0,
        iconName: 'FileText',
        category: 'operations',
        linkedRecordType: recordType as any,
        linkedRecordId: recordId,
        membersCount: 4
      };
      setWorkspaceSpaces(prev => [...prev, space!]);
    }
    setActiveSpaceId(space.id);
    setExperienceArea('connect');
    setRightPanelMode('thread');
    setNotificationMessage(`Opened discussion thread for ${recordTitle}`);
  };

  const openRecordInInspector = (recordType: string, recordId: string, recordTitle: string) => {
    setInspectedRecord({ type: recordType, id: recordId, title: recordTitle });
    setRightPanelMode('record');
  };

  const convertDiscussionToTask = (message: WorkspaceMessage) => {
    const newTask: ProjectTask = {
      id: `task_${Date.now()}`,
      title: `Action: ${message.content.slice(0, 45)}...`,
      description: `Originating from Connect discussion by ${message.authorName}: "${message.content}"`,
      assigneeId: currentUser.id,
      assigneeName: currentUser.name,
      assigneeRole: currentUser.role,
      status: 'Backlog',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      dependencies: [],
      branchId: activeBranch.id,
      moduleTag: 'Operations',
      linkedRecordId: message.linkedRecord?.id
    };
    createProjectTask(newTask);
    setNotificationMessage(`Created task from discussion: "${newTask.title}"`);
  };

  return (
    <AppContext.Provider
      value={{
        org,
        branches,
        activeBranch,
        setActiveBranch,
        currentUser,
        users,
        roles,
        setCurrentUser,
        currency,
        setCurrency,
        formatCurrency,
        hasPermission,
        grantCurrentUserPermission,
        switchUserById,
        activeIndustryId: org.activeIndustryId as IndustryCategory,
        switchIndustry,
        toggleModule,
        staffCredentials,
        userSessions,
        terminateSession,
        lockUserAccount,
        posSessions,
        activePOSSession,
        openPOSSession,
        closePOSSession,
        chartOfAccounts,
        journalEntries,
        bankAccounts,
        bankStatementLines,
        postJournalEntry,
        reconcileStatementLine,
        payoutRequests,
        createPayoutRequest,
        approvePayoutRequest,
        executePayout,
        customers,
        invoices,
        createInvoice,
        payInvoice,
        products,
        warehouses,
        stockTransfers,
        suppliers,
        purchaseOrders,
        updateProductStock,
        createProduct,
        createStockTransfer,
        receiveStockTransfer,
        employees,
        payrollRuns,
        executePayrollRun,
        projects,
        vehicles,
        repairOrders,
        updateRepairOrderStatus,
        createRepairOrder,
        posTransactions,
        posCart,
        addToPOSCart,
        updatePOSCartQty,
        removeFromPOSCart,
        clearPOSCart,
        completePOSSale,
        legalMatters,
        timeEntries,
        addTimeEntry,
        farmPlots,
        cropCycles,
        harvestRecords,
        agroInputs,
        logHarvestRecord,
        fleetVehicles,
        dispatchTrips,
        waybills,
        dispatchNewTrip,
        signProofOfDelivery,
        fuelTanks,
        pumpReadings,
        recordPumpShift,
        updateTankDip,
        customFields,
        customRecords,
        automationWorkflows,
        auditLogs,
        addCustomField,
        addCustomRecord,
        toggleWorkflow,
        testRunWorkflow,
        resetToFactoryData,
        exportDatabaseJSON,
        notificationMessage,
        setNotificationMessage,

        // Managed Workspace Architecture
        workspaceSpaces,
        activeSpaceId,
        setActiveSpaceId,
        workspaceMessages,
        sendWorkspaceMessage,
        addMessageReaction,

        notionPages,
        activeNotionPageId,
        setActiveNotionPageId,
        toggleChecklistItem,
        createNotionPage,

        projectTasks,
        updateTaskStatus,
        createProjectTask,

        cloudInfrastructure,
        backupSnapshots,
        durableJobs,
        triggerBackupNow,
        testBackupRestoration,
        retryDurableJob,

        serviceComponents,
        refreshComponentHealth,

        offlineConfig,
        setOfflineMode,
        offlineQueue,
        recordOfflineTransaction,
        syncOfflineQueue,
        resolveOfflineConflict,

        peripherals,
        testPeripheral,
        togglePeripheralConnection,

        integrations,
        installIntegration,
        revokeIntegration,
        testSandboxIntegration,

        readinessChecklist,
        toggleReadinessItem,
        importDataset,

        inspectedRecord,
        setInspectedRecord,

        // Work & Connect Connected Experience
        experienceArea,
        setExperienceArea,
        authorizedWorkspaces,
        activeWorkspaceId,
        switchWorkspace,
        connectMeetings,
        connectCalendarEvents,
        connectAnnouncements,
        connectActivities,
        onboardingTasks,
        offboardingRecords,
        connectedNotifications,
        rightPanelMode,
        setRightPanelMode,
        activeThreadMessageId,
        setActiveThreadMessageId,

        acknowledgeAnnouncement,
        toggleOnboardingTask,
        toggleActivityAttendance,
        rsvpCalendarEvent,
        createConnectMeeting,
        updateMeetingStatus,
        toggleMeetingRecording,
        publishAnnouncement,
        addCalendarEvent,
        markNotificationRead,
        markAllNotificationsRead,
        executeOffboardingStep,
        openRecordContextualThread,
        openRecordInInspector,
        convertDiscussionToTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
