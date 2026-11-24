// ZEEX Commerce Core Type Definitions — Multi-Tenant, Multi-Branch & Highly Tailored Enterprise ERP

export type CurrencyCode = 'USD' | 'NGN' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = rate
}

export type UserRole = 
  | 'Super Admin' 
  | 'Finance Director' 
  | 'Financial Controller'
  | 'Payroll Officer'
  | 'Operations Manager' 
  | 'Branch Manager'
  | 'Staff Cashier' 
  | 'Chief Agronomist'
  | 'Fleet Dispatcher'
  | 'Workshop Lead Technician'
  | 'Auditor';

export interface UserPermissions {
  canViewFinance: boolean;
  canEditFinance: boolean;
  canViewPayroll: boolean;       // Segregation: Finance cannot see payroll unless granted
  canRunPayroll: boolean;
  canViewInventory: boolean;
  canAdjustStock: boolean;
  canAccessPOS: boolean;
  canCloseTillSession: boolean;
  canViewOperations: boolean;
  canApprovePayouts: boolean;    // Dual authorization checker
  canManageSecurity: boolean;
  canSwitchBranches: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  branchId: string;
  permissions: UserPermissions;
}

export interface StaffSecurityCredential {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  systemUsername: string;
  posPinCode: string;
  passkeyHash: string;
  assignedBranch: string;
  lastLoginTimestamp: string;
  lastLoginIp: string;
  deviceFingerprint: string;
  mfaStatus: 'Hardware Passkey' | 'SMS OTP' | 'TOTP Authenticator';
  status: 'Active' | 'Locked' | 'Suspended';
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  branchName: string;
  ipAddress: string;
  deviceType: string;
  loginTime: string;
  lastActiveTime: string;
  status: 'Active' | 'Terminated';
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  currency: CurrencyCode;
  isHeadquarters: boolean;
  operatingTillsCount: number;
  manager: string;
}

export interface Organization {
  id: string;
  name: string;
  taxNumber: string;
  registrationNumber: string;
  country: string;
  baseCurrency: CurrencyCode;
  activeIndustryId: string;
  activatedModules: string[];
}

// ---------------- Accounting & Finance ----------------
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface ChartOfAccount {
  code: string;
  name: string;
  type: AccountType;
  subCategory: string;
  balance: number;
  description: string;
  isSystem: boolean;
}

export interface JournalLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  memo: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  reference: string;
  description: string;
  sourceModule: 'Manual' | 'Sales' | 'Purchases' | 'Payroll' | 'POS' | 'Workshop' | 'Bank' | 'Agri' | 'Fleet';
  lines: JournalLine[];
  status: 'Posted' | 'Draft';
  createdBy: string;
  totalAmount: number;
}

export interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  glAccountCode: string; // Linked COA
  balance: number;
  currency: CurrencyCode;
  isZeexBank: boolean;
  status: 'Connected' | 'Pending Verification';
  lastReconciledDate: string;
}

export interface BankStatementLine {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  amount: number; // positive = deposit, negative = withdrawal
  reference: string;
  isReconciled: boolean;
  matchedJournalId?: string;
}

export interface PayoutRequest {
  id: string;
  beneficiaryName: string;
  beneficiaryAccount: string;
  bankName: string;
  amount: number;
  currency: CurrencyCode;
  purpose: string;
  category: 'Supplier' | 'Payroll' | 'Tax' | 'Refund' | 'Operational' | 'AgroOutgrower' | 'DriverAdvance';
  status: 'Pending Dual Approval' | 'Approved' | 'Executed' | 'Rejected';
  makerUser: string;
  makerTimestamp: string;
  checkerUser?: string;
  checkerTimestamp?: string;
  requiresDualApproval: boolean;
}

// ---------------- Sales & Customers ----------------
export interface Customer {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  totalSpent: number;
  outstandingBalance: number;
  creditLimit?: number;
  currency: CurrencyCode;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 7.5% or 0
  total: number;
  glAccountCode?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  currency: CurrencyCode;
  status: 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';
  paidAmount: number;
  branchId: string;
  notes?: string;
}

// ---------------- Inventory, Multi-Warehouse & Branch Transfers ----------------
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  warehouseId: string;
  barcode?: string;
  batchNumber?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  branchId: string;
  manager: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  sourceBranchId: string;
  sourceBranchName: string;
  targetBranchId: string;
  targetBranchName: string;
  productId: string;
  productName: string;
  quantity: number;
  dispatchDate: string;
  status: 'Pending Dispatch' | 'In Transit' | 'Received & Reconciled';
  requestedBy: string;
  approvedBy?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  payableBalance: number;
  currency: CurrencyCode;
  taxNumber?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  currency: CurrencyCode;
  status: 'Draft' | 'Sent' | 'Received' | 'Invoiced' | 'Closed';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

// ---------------- HR & Segregated Payroll ----------------
export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  branchId: string;
  hireDate: string;
  baseSalary: number;
  currency: CurrencyCode;
  bankName: string;
  accountNumber: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export interface PayrollRun {
  id: string;
  period: string; // e.g. "October 2026"
  runDate: string;
  totalGross: number;
  totalTaxPAYE: number;
  totalPension: number;
  totalNet: number;
  employeeCount: number;
  status: 'Draft' | 'Approved' | 'Paid';
  journalEntryId?: string;
}

// ---------------- Projects & Operations ----------------
export interface Project {
  id: string;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  billedRevenue: number;
  profitability: number; // percentage
  status: 'Planning' | 'In Progress' | 'Under Review' | 'Completed';
  manager: string;
  progressPercent: number;
}

// ---------------- Customization Engine (Level 1, 2, 3) ----------------
export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'select' | 'boolean';

export interface CustomFieldDefinition {
  id: string;
  targetEntity: string;
  fieldKey: string;
  label: string;
  type: FieldType;
  options?: string[];
  required: boolean;
  defaultValue?: string | number | boolean;
  description?: string;
}

export interface CustomRecordDefinition {
  id: string;
  name: string;
  singularName: string;
  slug: string;
  icon: string;
  description: string;
  fields: CustomFieldDefinition[];
  recordsCount: number;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  triggerEvent: 
    | 'on_invoice_created' 
    | 'on_payment_exceeds_threshold' 
    | 'on_stock_below_reorder' 
    | 'on_repair_job_completed'
    | 'on_harvest_weighbridge_logged'
    | 'on_till_variance_detected'
    | 'on_fleet_trip_completed';
  conditions: {
    field: string;
    operator: 'greater_than' | 'equals' | 'contains' | 'less_than';
    value: string | number;
  }[];
  actions: {
    type: 'require_dual_approval' | 'send_notification' | 'create_journal_entry' | 'generate_payout_draft';
    targetRole?: UserRole;
    payload?: string;
  }[];
  isActive: boolean;
  executionCount: number;
  lastRun?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  status: 'Success' | 'Denied' | 'Flagged';
}

// ---------------- Industry Templates & Category Workspaces ----------------
export type IndustryCategory = 
  | 'automotive' 
  | 'retail' 
  | 'legal' 
  | 'healthcare' 
  | 'energy' 
  | 'logistics' 
  | 'manufacturing'
  | 'agriculture';

export interface IndustryTemplate {
  id: IndustryCategory;
  name: string;
  tagline: string;
  description: string;
  recommendedModules: string[];
  customRecordTypes: string[];
  sampleFeatures: string[];
  bannerHighlight: string;
  iconName: string;
}

// ---------------- Automotive Specific Data ----------------
export interface Vehicle {
  id: string;
  licensePlate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  ownerName: string;
  ownerPhone: string;
  mileage: number;
  engineCode?: string;
}

export interface RepairOrder {
  id: string;
  orderNumber: string;
  vehicleId: string;
  vehicleSummary: string;
  customerName: string;
  technicianName: string;
  dateIn: string;
  estimatedCompletion: string;
  status: 'Diagnosing' | 'Parts Ordered' | 'In Repair' | 'Quality Check' | 'Ready for Pickup' | 'Invoiced';
  issueDescription: string;
  inspectionSummary: {
    brakes: 'Good' | 'Attention' | 'Critical';
    engineOil: 'Good' | 'Attention' | 'Critical';
    suspension: 'Good' | 'Attention' | 'Critical';
    battery: 'Good' | 'Attention' | 'Critical';
  };
  partsCost: number;
  laborCost: number;
  totalCost: number;
  invoiceId?: string;
}

// ---------------- Retail & Supermarket POS Session & Terminal Accountability ----------------
export interface POSSession {
  id: string;
  sessionCode: string;
  tillNumber: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  branchName: string;
  startTime: string;
  endTime?: string;
  openingFloat: number;
  cashCollected: number;
  cardCollected: number;
  transferCollected: number;
  totalSales: number;
  ordersCount: number;
  expectedCashInDrawer: number;
  actualCashCounted?: number;
  cashVariance?: number; // negative = shortage, positive = overage
  status: 'Active' | 'Closed';
  notes?: string;
}

export interface POSCartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export interface POSTransaction {
  id: string;
  receiptNumber: string;
  sessionId: string;
  tillNumber: string;
  timestamp: string;
  cashierName: string;
  branchName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer' | 'Split';
  customerPhone?: string;
}

// ---------------- Legal Specific Data ----------------
export interface LegalMatter {
  id: string;
  matterNumber: string;
  title: string;
  clientName: string;
  leadAttorney: string;
  practiceArea: 'Corporate & M&A' | 'Litigation' | 'Real Estate' | 'Intellectual Property' | 'Tax Advisory';
  status: 'Intake' | 'Conflict Cleared' | 'Active' | 'Under Review' | 'Closed';
  trustRetainerBalance: number;
  billableRatePerHour: number;
  hoursLogged: number;
  unbilledAmount: number;
  nextHearingOrDeadline: string;
}

export interface TimeEntry {
  id: string;
  matterId: string;
  matterTitle: string;
  attorneyName: string;
  date: string;
  hours: number;
  hourlyRate: number;
  description: string;
  isBilled: boolean;
}

// ---------------- Agribusiness & Farm Operations Specific Data ----------------
export interface FarmPlot {
  id: string;
  plotCode: string;
  name: string;
  sizeHectares: number;
  soilType: 'Loamy Alluvial' | 'Sandy Loam' | 'Clayey Loam' | 'Volcanic';
  irrigationStatus: 'Drip Automated' | 'Center Pivot' | 'Rainfed Seasonal';
  currentCrop: string;
  location: string;
  agronomistInCharge: string;
}

export interface CropCycle {
  id: string;
  cycleCode: string;
  plotId: string;
  plotName: string;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  status: 'Land Preparation' | 'Vegetative Growth' | 'Flowering & Fruiting' | 'Harvesting' | 'Completed';
  totalInputCost: number;
  estimatedYieldTons: number;
  actualHarvestTons?: number;
}

export interface HarvestRecord {
  id: string;
  harvestNumber: string;
  cropCycleId: string;
  plotName: string;
  harvestDate: string;
  grossWeightKg: number;
  gradeA_Kg: number;
  gradeB_Kg: number;
  gradeC_Kg: number;
  moistureContentPercent: number;
  storageSilo: string;
  marketValuation: number;
}

export interface AgroInput {
  id: string;
  name: string;
  category: 'Fertilizer' | 'Certified Seed' | 'Crop Protection' | 'Organic Amendment';
  unit: string;
  stockQty: number;
  unitCost: number;
  targetCrop: string;
}

// ---------------- Logistics & Fleet Transportation Specific Data ----------------
export interface FleetVehicle {
  id: string;
  registrationNumber: string;
  vehicleType: 'Heavy Duty 30T Hauler' | 'Refrigerated 10T Van' | 'Flatbed Container Hauler' | 'Distribution Van';
  tonnageCapacity: number;
  odometerKm: number;
  fuelEfficiencyKmPerL: number;
  roadworthinessExpiry: string;
  insuranceExpiry: string;
  status: 'In Transit' | 'Available in Depot' | 'Under Inspection / Maintenance';
  assignedDriver: string;
}

export interface DispatchTrip {
  id: string;
  tripNumber: string;
  vehicleId: string;
  vehicleReg: string;
  driverName: string;
  originHub: string;
  destinationHub: string;
  departureTime: string;
  estimatedArrival: string;
  cargoManifest: string;
  grossWeightTons: number;
  freightCharge: number;
  fuelAdvanceAllocated: number;
  waybillNumber: string;
  status: 'Manifest Dispatched' | 'On Route' | 'Delivered' | 'Settled';
}

export interface Waybill {
  id: string;
  waybillNumber: string;
  tripId: string;
  shipperName: string;
  consigneeName: string;
  deliveryAddress: string;
  receivedBySignee?: string;
  podTimestamp?: string;
  status: 'Pending Delivery' | 'Proof of Delivery (POD) Signed';
}

// ---------------- Energy & Fuel Station Specific Data ----------------
export interface FuelTank {
  id: string;
  tankCode: string;
  fuelType: 'PMS Premium Motor Spirit (Petrol)' | 'AGO Automotive Gas Oil (Diesel)' | 'DPK Dual Purpose Kerosene';
  totalCapacityLiters: number;
  currentStockLiters: number;
  waterDipCm: number;
  ullageLiters: number;
  lastDipTimestamp: string;
}

export interface PumpShiftReading {
  id: string;
  pumpIsland: string;
  fuelType: string;
  attendantName: string;
  shiftDate: string;
  openingMeterLiters: number;
  closingMeterLiters: number;
  volumeDispensedLiters: number;
  unitPricePerLiter: number;
  expectedRevenue: number;
  cashRemitted: number;
  posTerminalRemitted: number;
  variance: number;
}

// ============================================================================
// Managed Workspace Architecture & Interaction Patterns
// ============================================================================

// 1. Workspace Spaces, Channels & Contextual Discussions (Discord/Slack Style)
export interface WorkspaceSpace {
  id: string;
  name: string;
  type: 'channel' | 'direct' | 'record_thread';
  description: string;
  unreadCount: number;
  iconName: string;
  category: 'general' | 'operations' | 'finance' | 'support' | 'peripherals';
  channelType?: 'company' | 'department' | 'branch' | 'project' | 'private' | 'announcement' | 'social';
  isPrivate?: boolean;
  isAnnouncementOnly?: boolean;
  topic?: string;
  pinnedMessageIds?: string[];
  notificationPref?: 'all' | 'mentions' | 'muted';
  department?: string;
  branchId?: string;
  directParticipantId?: string;
  linkedRecordType?: 'invoice' | 'repair_order' | 'purchase_order' | 'dispatch_trip' | 'payout' | 'harvest';
  linkedRecordId?: string;
  membersCount: number;
}

export interface WorkspaceAttachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface WorkspaceMessage {
  id: string;
  spaceId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  mentions: string[];
  attachments?: WorkspaceAttachment[];
  reactions?: { emoji: string; count: number; users: string[] }[];
  replyToId?: string;
  repliesCount?: number;
  isPinned?: boolean;
  isBookmarked?: boolean;
  editedAt?: string;
  linkedRecord?: {
    type: 'invoice' | 'repair_order' | 'purchase_order' | 'dispatch_trip' | 'payout' | 'harvest';
    id: string;
    title: string;
    amount?: number;
    status?: string;
  };
}

// 2. Notion-Style SOPs, Configurable Pages & Interactive Checklists
export interface NotionChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  mandatory?: boolean;
}

export interface NotionBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'callout' | 'checklist' | 'quote' | 'table';
  content: string;
  calloutType?: 'info' | 'warning' | 'tip' | 'danger';
  checklistItems?: NotionChecklistItem[];
  tableData?: { headers: string[]; rows: string[][] };
}

export interface NotionPage {
  id: string;
  title: string;
  category: 'SOP' | 'Policy' | 'Checklist' | 'Guide';
  author: string;
  updatedAt: string;
  icon: string;
  badge: string;
  summary: string;
  contentBlocks: NotionBlock[];
}

// 3. Project Management Boards, Tasks & Dependencies
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assigneeRole: string;
  status: 'Backlog' | 'In Progress' | 'Under Review' | 'Completed';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  dueDate: string;
  dependencies: string[]; // task IDs
  branchId: string;
  moduleTag: string;
  linkedRecordId?: string;
}

// 4. ZEEX Managed Infrastructure & Cloud Console (Centralized Technology)
export interface CloudInfrastructureStatus {
  hostingHealth: 'Operational' | 'Degraded' | 'Maintenance';
  activeRegion: string;
  standbyRegion: string;
  p99LatencyMs: number;
  activeConnections: number;
  maxConnections: number;
  uptime30Days: number;
  currentVersion: string;
  lastSecurityPatch: string;
  sslExpiry: string;
  activeVulnerabilities: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  storageUsageGb: number;
  maxStorageGb: number;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  type: 'Automated Hourly' | 'Manual Pre-Deployment' | 'Daily Snapshot';
  sizeMb: number;
  encryption: 'AES-256-GCM';
  status: 'Verified Healthy' | 'Creating' | 'Restored';
  checksumSha256: string;
}

export interface DurableQueueJob {
  id: string;
  jobName: string;
  queue: 'critical_transactions' | 'webhook_dispatch' | 'e_invoice_sync' | 'background_reports';
  status: 'Queued' | 'Processing' | 'Completed' | 'Retrying' | 'DeadLetter';
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  payloadSummary: string;
  createdAt: string;
  idempotencyKey: string;
}

// 5. Customer-Facing Service Status & Targets
export interface ServiceComponent {
  id: string;
  name: string;
  category: 'ZEEX Platform' | 'External Payment Gateway' | 'Local Internet / Network' | 'Local Peripherals';
  status: 'Operational' | 'Degraded' | 'Offline' | 'Monitoring';
  latencyMs: number;
  notes: string;
}

// 6. Limited Offline Continuity
export interface OfflineQueueItem {
  id: string;
  type: 'POS_SALE' | 'INVENTORY_RESERVATION' | 'WORK_ORDER_UPDATE';
  dataSummary: string;
  amount?: number;
  recordedAt: string;
  operatorName: string;
  tillNumber: string;
  status: 'Pending Sync' | 'Synced' | 'Conflict Review';
  conflictReason?: string;
}

export interface OfflineConfig {
  isSimulatedOffline: boolean;
  maxOfflineAmountLimit: number;
  maxOfflineTransactionCount: number;
  cachedPriceCatalogCount: number;
  lastOnlineHeartbeat: string;
}

// 7. Peripherals & Hardware Diagnostics
export interface PeripheralDevice {
  id: string;
  name: string;
  type: 'Barcode Scanner' | 'Receipt Printer' | 'Payment Terminal' | 'Weighbridge' | 'Label Printer';
  interfaceType: 'WebUSB' | 'USB-HID' | 'Bluetooth LE' | 'RS-232 Serial' | 'Network IP' | 'Cloud Agent';
  status: 'Connected' | 'Ready' | 'Disconnected' | 'Simulated';
  model: string;
  connectionDetails: string;
  lastHeartbeat: string;
  diagnosticNotes: string;
}

// 8. Integration App Discovery & Sandboxed Marketplace
export interface IntegrationApp {
  id: string;
  name: string;
  category: 'Payment' | 'E-Invoicing' | 'Logistics' | 'Messaging' | 'Accounting' | 'Hardware';
  description: string;
  provider: string;
  status: 'Installed' | 'Available';
  sandboxMode: boolean;
  maskedApiKey: string;
  scopes: string[];
  requestsThisMonth: number;
  monthlyQuota: number;
  lastSyncStatus: 'Healthy' | 'Warning' | 'Error';
  lastSyncTimestamp: string;
}

// 9. Data Imports with Validation & Diagnostics
export interface DataImportColumnMapping {
  csvHeader: string;
  targetField: string;
  sampleValue: string;
}

export interface DataImportRowError {
  row: number;
  column: string;
  issue: string;
}

// 10. Guided Readiness Checklist
export interface ReadinessChecklistItem {
  id: string;
  title: string;
  description: string;
  module: string;
  isCompleted: boolean;
  priority: 'Critical' | 'Recommended' | 'Optional';
  actionTab: string;
}

// ============================================================================
// ZEEX Connected Experience: Work & Connect Architecture
// ============================================================================

export type ExperienceArea = 'work' | 'connect';

export interface AuthorizedWorkspace {
  id: string;
  name: string;
  code: string;
  industry: string;
  industryId: string;
  city: string;
  country: string;
  unreadCount: number;
  avatarBg: string;
  isHeadquarters: boolean;
  currentRole: string;
}

export interface ConnectMeeting {
  id: string;
  title: string;
  description: string;
  scheduledStartTime: string;
  durationMinutes: number;
  hostId: string;
  hostName: string;
  hostRole: string;
  type: 'instant' | 'scheduled';
  status: 'Upcoming' | 'Live' | 'Ended';
  category: 'Internal Staff' | 'Customer Appointment' | 'Operational Review' | 'All-Hands';
  meetingUrl: string;
  waitingRoomEnabled: boolean;
  provider: 'ZEEX Cloud WebRTC' | 'Daily.co' | 'Jitsi Meet' | 'Twilio Video';
  participants: {
    userId: string;
    name: string;
    role: string;
    rsvp: 'Accepted' | 'Declined' | 'Tentative' | 'Pending';
    isHost?: boolean;
    isMuted?: boolean;
    hasVideo?: boolean;
    isScreenSharing?: boolean;
    joinedAt?: string;
  }[];
  agendaItems: {
    id: string;
    title: string;
    completed: boolean;
    linkedTaskId?: string;
  }[];
  notes: string;
  linkedRecord?: {
    type: string;
    id: string;
    title: string;
  };
  isRecording: boolean;
  recordingConsentAcknowledged: boolean;
  recordingExpiryDate?: string;
}

export interface ConnectCalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  category: 'internal_staff' | 'customer_appointment' | 'operational_booking' | 'social_event';
  scope: 'personal' | 'team' | 'branch';
  privacy: 'public' | 'team_only' | 'confidential_restricted';
  organizerId: string;
  organizerName: string;
  attendees: string[]; // user IDs
  branchId?: string;
  department?: string;
  locationOrRoom?: string;
  rsvpStatus: { [userId: string]: 'Accepted' | 'Declined' | 'Tentative' };
  linkedRecord?: {
    type: string;
    id: string;
    title: string;
  };
  meetingId?: string;
}

export interface ConnectAnnouncement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  publishDate: string;
  expiryDate?: string;
  category: 'Company Update' | 'Policy Change' | 'Branch Notice' | 'Staff Introduction' | 'Training' | 'Social';
  priority: 'Urgent' | 'Standard' | 'Info';
  targetAudience: 'All Company' | 'Branch' | 'Department';
  targetBranchId?: string;
  targetDepartment?: string;
  requiresAcknowledgment: boolean;
  acknowledgments: {
    userId: string;
    userName: string;
    userRole: string;
    timestamp: string;
  }[];
  readCount: number;
  allowComments: boolean;
  commentsCount: number;
}

export interface ConnectActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'Team Celebration' | 'Training Session' | 'Social Gathering' | 'Milestone Celebration';
  organizer: string;
  attendeesCount: number;
  isOptIn: boolean;
  respectfulPreferencesNotice: string;
  isAttending?: boolean;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'Welcome' | 'Devices' | 'Security & Policies' | 'Training' | 'Team Introductions';
  isCompleted: boolean;
  completedAt?: string;
  mandatory: boolean;
  actionLabel?: string;
  actionTab?: string;
}

export interface OffboardingRecord {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  department: string;
  departureDate: string;
  status: 'In Progress' | 'Completed';
  accessRevoked: boolean;
  sessionsTerminated: boolean;
  peripheralsReleased: boolean;
  taskHandoffDesignee: string;
  channelHandoffDesignee: string;
  handoverPackageExported: boolean;
  notes: string;
}

export interface ConnectedNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'mention' | 'approval' | 'reminder' | 'meeting' | 'announcement' | 'system';
  area: 'work' | 'connect';
  isRead: boolean;
  targetTab: string;
  linkedRecord?: {
    type: string;
    id: string;
    title: string;
  };
}

export type RightPanelMode = 'closed' | 'thread' | 'record' | 'participants' | 'tasks';


