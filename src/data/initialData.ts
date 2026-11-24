import {
  Organization,
  Branch,
  User,
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
  CustomFieldDefinition,
  CustomRecordDefinition,
  AutomationWorkflow,
  AuditLog,
  Vehicle,
  RepairOrder,
  POSTransaction,
  POSSession,
  LegalMatter,
  TimeEntry,
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
  AuthorizedWorkspace,
  ConnectMeeting,
  ConnectCalendarEvent,
  ConnectAnnouncement,
  ConnectActivity,
  OnboardingTask,
  OffboardingRecord,
  ConnectedNotification
} from '../types';

export const INITIAL_ORGANIZATION: Organization = {
  id: 'org_zeex_universal',
  name: 'Apex Horizon Enterprises',
  taxNumber: 'TIN-9840281-001',
  registrationNumber: 'RC-1849204',
  country: 'Nigeria',
  baseCurrency: 'USD',
  activeIndustryId: 'automotive',
  activatedModules: [
    'accounting',
    'treasury',
    'sales',
    'inventory',
    'procurement',
    'hr',
    'operations',
    'customization',
    'automation',
    'audit',
    'pos',
    'security'
  ]
};

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch_hq_lagos',
    name: 'Victoria Island HQ Hub',
    code: 'VI-01',
    city: 'Lagos',
    country: 'Nigeria',
    currency: 'USD',
    isHeadquarters: true,
    operatingTillsCount: 3,
    manager: 'Adekunle Babalola'
  },
  {
    id: 'branch_abuja',
    name: 'Central Business District Branch',
    code: 'ABJ-02',
    city: 'Abuja',
    country: 'Nigeria',
    currency: 'USD',
    isHeadquarters: false,
    operatingTillsCount: 2,
    manager: 'Hajia Amina Sanusi'
  },
  {
    id: 'branch_london',
    name: 'Canary Wharf Clearing Office',
    code: 'LON-03',
    city: 'London',
    country: 'United Kingdom',
    currency: 'GBP',
    isHeadquarters: false,
    operatingTillsCount: 1,
    manager: 'Elizabeth Vane'
  }
];

// Granular Users with strict Role Segregation
export const CURRENT_USER: User = {
  id: 'usr_sarah_chen',
  name: 'Sarah Chen, FCA',
  email: 's.chen@apexhorizon.com',
  role: 'Super Admin',
  department: 'Executive Governance & Group CFO',
  branchId: 'branch_hq_lagos',
  permissions: {
    canViewFinance: true,
    canEditFinance: true,
    canViewPayroll: true,
    canRunPayroll: true,
    canViewInventory: true,
    canAdjustStock: true,
    canAccessPOS: true,
    canCloseTillSession: true,
    canViewOperations: true,
    canApprovePayouts: true,
    canManageSecurity: true,
    canSwitchBranches: true
  }
};

export const INITIAL_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'usr_tariq_almansoor',
    name: 'Tariq Al-Mansoor',
    email: 't.mansoor@apexhorizon.com',
    role: 'Finance Director',
    department: 'Treasury & Controlling',
    branchId: 'branch_hq_lagos',
    permissions: {
      canViewFinance: true,
      canEditFinance: true,
      canViewPayroll: false, // STRICT SEGREGATION: Finance cannot see payroll compensation!
      canRunPayroll: false,
      canViewInventory: true,
      canAdjustStock: false,
      canAccessPOS: false,
      canCloseTillSession: false,
      canViewOperations: true,
      canApprovePayouts: true, // Checker role
      canManageSecurity: false,
      canSwitchBranches: true
    }
  },
  {
    id: 'usr_folake_adeleke',
    name: 'Barr. Folake Adeleke',
    email: 'f.adeleke@apexhorizon.com',
    role: 'Payroll Officer',
    department: 'People & Statutory Compensation',
    branchId: 'branch_hq_lagos',
    permissions: {
      canViewFinance: false, // Cannot alter General Ledger directly
      canEditFinance: false,
      canViewPayroll: true,  // Authorized for payroll & confidential wages
      canRunPayroll: true,
      canViewInventory: false,
      canAdjustStock: false,
      canAccessPOS: false,
      canCloseTillSession: false,
      canViewOperations: true,
      canApprovePayouts: false,
      canManageSecurity: false,
      canSwitchBranches: false
    }
  },
  {
    id: 'usr_chioma_okonkwo',
    name: 'Chioma Okonkwo',
    email: 'c.okonkwo@apexhorizon.com',
    role: 'Staff Cashier',
    department: 'Retail POS & Counter Operations',
    branchId: 'branch_hq_lagos',
    permissions: {
      canViewFinance: false,
      canEditFinance: false,
      canViewPayroll: false,
      canRunPayroll: false,
      canViewInventory: true,
      canAdjustStock: false,
      canAccessPOS: true,
      canCloseTillSession: true,
      canViewOperations: false,
      canApprovePayouts: false,
      canManageSecurity: false,
      canSwitchBranches: false
    }
  },
  {
    id: 'usr_ade_babalola',
    name: 'Adekunle Babalola',
    email: 'a.babalola@apexhorizon.com',
    role: 'Operations Manager',
    department: 'Engineering & Workshop Bays',
    branchId: 'branch_hq_lagos',
    permissions: {
      canViewFinance: false,
      canEditFinance: false,
      canViewPayroll: false,
      canRunPayroll: false,
      canViewInventory: true,
      canAdjustStock: true,
      canAccessPOS: false,
      canCloseTillSession: false,
      canViewOperations: true,
      canApprovePayouts: false, // Maker role (submits payouts for checker approval)
      canManageSecurity: false,
      canSwitchBranches: true
    }
  },
  {
    id: 'usr_haruna_bello',
    name: 'Dr. Haruna Bello',
    email: 'h.bello@apexhorizon.com',
    role: 'Chief Agronomist',
    department: 'Agricultural Operations & Silos',
    branchId: 'branch_hq_lagos',
    permissions: {
      canViewFinance: false,
      canEditFinance: false,
      canViewPayroll: false,
      canRunPayroll: false,
      canViewInventory: true,
      canAdjustStock: true,
      canAccessPOS: false,
      canCloseTillSession: false,
      canViewOperations: true,
      canApprovePayouts: false,
      canManageSecurity: false,
      canSwitchBranches: false
    }
  },
  {
    id: 'usr_musa_danladi',
    name: 'Capt. Musa Danladi',
    email: 'm.danladi@apexhorizon.com',
    role: 'Fleet Dispatcher',
    department: 'Logistics, Haulage & Dispatch',
    branchId: 'branch_hq_lagos',
    permissions: {
      canViewFinance: false,
      canEditFinance: false,
      canViewPayroll: false,
      canRunPayroll: false,
      canViewInventory: true,
      canAdjustStock: false,
      canAccessPOS: false,
      canCloseTillSession: false,
      canViewOperations: true,
      canApprovePayouts: false,
      canManageSecurity: false,
      canSwitchBranches: true
    }
  }
];

export const INITIAL_STAFF_CREDENTIALS: StaffSecurityCredential[] = [
  {
    id: 'sec_001',
    userId: 'usr_sarah_chen',
    userName: 'Sarah Chen, FCA',
    role: 'Super Admin',
    systemUsername: 'sarah.chen@apexhorizon.internal',
    posPinCode: '9001',
    passkeyHash: 'pk_ecdsa_p256_94f8b919a0824b2190184b',
    assignedBranch: 'Victoria Island HQ Hub',
    lastLoginTimestamp: '2026-10-15 08:14:22',
    lastLoginIp: '197.210.84.10',
    deviceFingerprint: 'MacBook Pro 16" (macOS 15.1 · Chrome 130)',
    mfaStatus: 'Hardware Passkey',
    status: 'Active'
  },
  {
    id: 'sec_002',
    userId: 'usr_tariq_almansoor',
    userName: 'Tariq Al-Mansoor',
    role: 'Finance Director',
    systemUsername: 'tariq.mansoor@apexhorizon.internal',
    posPinCode: '8821',
    passkeyHash: 'pk_ecdsa_p256_31a9801248102941b2',
    assignedBranch: 'Victoria Island HQ Hub',
    lastLoginTimestamp: '2026-10-15 07:45:00',
    lastLoginIp: '197.210.84.12',
    deviceFingerprint: 'ThinkPad X1 Carbon (Ubuntu 24.04 · Firefox 131)',
    mfaStatus: 'TOTP Authenticator',
    status: 'Active'
  },
  {
    id: 'sec_003',
    userId: 'usr_chioma_okonkwo',
    userName: 'Chioma Okonkwo',
    role: 'Staff Cashier',
    systemUsername: 'chioma.pos@apexhorizon.internal',
    posPinCode: '1042',
    passkeyHash: 'pk_pin_salted_09182419082',
    assignedBranch: 'Victoria Island HQ Hub',
    lastLoginTimestamp: '2026-10-15 08:00:15',
    lastLoginIp: '197.210.84.18',
    deviceFingerprint: 'ZEEX Smart POS Terminal VI-01 (Android 14)',
    mfaStatus: 'SMS OTP',
    status: 'Active'
  },
  {
    id: 'sec_004',
    userId: 'usr_folake_adeleke',
    userName: 'Barr. Folake Adeleke',
    role: 'Payroll Officer',
    systemUsername: 'folake.payroll@apexhorizon.internal',
    posPinCode: '4410',
    passkeyHash: 'pk_ecdsa_p256_88192041289410',
    assignedBranch: 'Victoria Island HQ Hub',
    lastLoginTimestamp: '2026-10-14 17:10:00',
    lastLoginIp: '197.210.84.15',
    deviceFingerprint: 'Dell Latitude 7440 (Windows 11 · Edge 129)',
    mfaStatus: 'TOTP Authenticator',
    status: 'Active'
  }
];

export const INITIAL_USER_SESSIONS: UserSession[] = [
  {
    id: 'sess_101',
    userId: 'usr_sarah_chen',
    userName: 'Sarah Chen, FCA',
    role: 'Super Admin',
    branchName: 'Victoria Island HQ Hub',
    ipAddress: '197.210.84.10',
    deviceType: 'MacBook Pro · Chrome 130',
    loginTime: '2026-10-15 08:14:22',
    lastActiveTime: 'Just now',
    status: 'Active'
  },
  {
    id: 'sess_102',
    userId: 'usr_chioma_okonkwo',
    userName: 'Chioma Okonkwo',
    role: 'Staff Cashier',
    branchName: 'Victoria Island HQ Hub',
    ipAddress: '197.210.84.18',
    deviceType: 'ZEEX POS Terminal VI-01',
    loginTime: '2026-10-15 08:00:15',
    lastActiveTime: '2 mins ago',
    status: 'Active'
  },
  {
    id: 'sess_103',
    userId: 'usr_tariq_almansoor',
    userName: 'Tariq Al-Mansoor',
    role: 'Finance Director',
    branchName: 'Victoria Island HQ Hub',
    ipAddress: '197.210.84.12',
    deviceType: 'ThinkPad X1 · Firefox 131',
    loginTime: '2026-10-15 07:45:00',
    lastActiveTime: '15 mins ago',
    status: 'Active'
  }
];

// POS Till Sessions & Cashier Shift Accountability
export const INITIAL_POS_SESSIONS: POSSession[] = [
  {
    id: 'pos_sess_041',
    sessionCode: 'SESS-2026-041',
    tillNumber: 'Till 01 (Storefront)',
    cashierId: 'usr_chioma_okonkwo',
    cashierName: 'Chioma Okonkwo',
    branchId: 'branch_hq_lagos',
    branchName: 'Victoria Island HQ Hub',
    startTime: '2026-10-15 08:00:00',
    openingFloat: 150.00,
    cashCollected: 486.65,
    cardCollected: 720.00,
    transferCollected: 280.25,
    totalSales: 1486.90,
    ordersCount: 8,
    expectedCashInDrawer: 636.65, // opening float + cash collected
    status: 'Active',
    notes: 'Morning shift till session opened with standard $150.00 cash float.'
  },
  {
    id: 'pos_sess_040',
    sessionCode: 'SESS-2026-040',
    tillNumber: 'Till 02 (Workshop Spares Desk)',
    cashierId: 'usr_ade_babalola',
    cashierName: 'Adekunle Babalola',
    branchId: 'branch_hq_lagos',
    branchName: 'Victoria Island HQ Hub',
    startTime: '2026-10-14 08:30:00',
    endTime: '2026-10-14 18:00:00',
    openingFloat: 100.00,
    cashCollected: 640.00,
    cardCollected: 1250.00,
    transferCollected: 850.00,
    totalSales: 2740.00,
    ordersCount: 14,
    expectedCashInDrawer: 740.00,
    actualCashCounted: 740.00,
    cashVariance: 0.00,
    status: 'Closed',
    notes: 'End of Day Z-Report verified. Cash drawer reconciled with zero variance.'
  }
];

export const INITIAL_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  // Assets
  { code: '1010', name: 'Cash on Hand / Till Cash Drawers', type: 'Asset', subCategory: 'Current Assets', balance: 4250.00, description: 'Petty cash and cash register drawer funds across branches', isSystem: true },
  { code: '1020', name: 'ZEEX Bank Operating Master Account', type: 'Asset', subCategory: 'Cash & Cash Equivalents', balance: 148500.00, description: 'Primary commercial clearing account via ZEEX Bank', isSystem: true },
  { code: '1025', name: 'ZEEX Bank Escrow & Trust Account', type: 'Asset', subCategory: 'Restricted Cash', balance: 52000.00, description: 'Client retainers and segregated escrow funds', isSystem: true },
  { code: '1030', name: 'Accounts Receivable (Trade Customers)', type: 'Asset', subCategory: 'Current Assets', balance: 34800.00, description: 'Amounts due from customers for invoiced services and goods', isSystem: true },
  { code: '1040', name: 'Merchandise & Parts Inventory', type: 'Asset', subCategory: 'Inventory', balance: 47600.00, description: 'Automotive spare parts, retail goods, and consumables', isSystem: true },
  { code: '1050', name: 'Agricultural Harvest & Silo Stock', type: 'Asset', subCategory: 'Inventory', balance: 38200.00, description: 'Grains, legumes, and graded farm produce in silos', isSystem: false },
  { code: '1510', name: 'Diagnostic Machinery & Fleet Trucks', type: 'Asset', subCategory: 'Fixed Assets', balance: 148000.00, description: 'Hydraulic lifts, diagnostic computers, and 30T haulage trucks', isSystem: false },
  
  // Liabilities
  { code: '2010', name: 'Accounts Payable (Trade Suppliers)', type: 'Liability', subCategory: 'Current Liabilities', balance: 19400.00, description: 'Outstanding supplier, fuel distributor and seed vendor invoices', isSystem: true },
  { code: '2020', name: 'VAT & Sales Tax Payable', type: 'Liability', subCategory: 'Current Liabilities', balance: 4850.00, description: 'Accrued value-added tax collected on sales', isSystem: true },
  { code: '2030', name: 'Payroll & Statutory Withholdings', type: 'Liability', subCategory: 'Current Liabilities', balance: 8200.00, description: 'PAYE income tax and pension payable to authorities', isSystem: true },
  { code: '2040', name: 'Client Trust Liability (Retainers)', type: 'Liability', subCategory: 'Current Liabilities', balance: 52000.00, description: 'Contra liability matching client trust retainers held', isSystem: true },

  // Equity
  { code: '3010', name: "Owner's Paid-in Capital", type: 'Equity', subCategory: 'Equity', balance: 180000.00, description: 'Initial seed equity capital from founding partners', isSystem: true },
  { code: '3020', name: 'Retained Earnings', type: 'Equity', subCategory: 'Equity', balance: 65900.00, description: 'Cumulative undistributed operating earnings', isSystem: true },

  // Revenue
  { code: '4010', name: 'Retail Merchandise & Parts Sales', type: 'Revenue', subCategory: 'Operating Revenue', balance: 54300.00, description: 'Direct revenue from store and spare parts sales', isSystem: true },
  { code: '4020', name: 'Mechanical & Diagnostic Labor Revenue', type: 'Revenue', subCategory: 'Operating Revenue', balance: 41200.00, description: 'Billed technician hours and diagnostic service fees', isSystem: true },
  { code: '4030', name: 'Agricultural Produce Revenue', type: 'Revenue', subCategory: 'Operating Revenue', balance: 39400.00, description: 'Commercial grain, soy, and bulk harvest sales', isSystem: false },
  { code: '4040', name: 'Freight & Logistics Haulage Fees', type: 'Revenue', subCategory: 'Operating Revenue', balance: 36800.00, description: 'Route freight rates and container dispatch fees', isSystem: false },

  // Expenses
  { code: '5010', name: 'Cost of Goods Sold (Parts, Produce & Stock)', type: 'Expense', subCategory: 'Direct Costs', balance: 26800.00, description: 'Wholesale acquisition cost of parts and retail items sold', isSystem: true },
  { code: '5020', name: 'Salaries, Wages & Benefits', type: 'Expense', subCategory: 'Operating Expenses', balance: 22400.00, description: 'Monthly payroll for engineers, technicians, and staff', isSystem: true },
  { code: '5030', name: 'Fleet Diesel & Generator Fuel', type: 'Expense', subCategory: 'Operating Expenses', balance: 12500.00, description: 'Bulk diesel purchases for trucks and facility power', isSystem: false },
  { code: '5040', name: 'Facility Rent & Utilities', type: 'Expense', subCategory: 'Operating Expenses', balance: 6500.00, description: 'Workshop floor lease, electricity, and water', isSystem: false }
];

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bank_zeex_primary',
    accountName: 'Apex Horizon Operating Master',
    bankName: 'ZEEX Bank International',
    accountNumber: '902-881-4901',
    glAccountCode: '1020',
    balance: 148500.00,
    currency: 'USD',
    isZeexBank: true,
    status: 'Connected',
    lastReconciledDate: '2026-10-14'
  },
  {
    id: 'bank_zeex_trust',
    accountName: 'Apex Retainer & Escrow Trust',
    bankName: 'ZEEX Bank International',
    accountNumber: '902-881-4999',
    glAccountCode: '1025',
    balance: 52000.00,
    currency: 'USD',
    isZeexBank: true,
    status: 'Connected',
    lastReconciledDate: '2026-10-12'
  },
  {
    id: 'bank_first_partner',
    accountName: 'Lagos Local Merchant Collection',
    bankName: 'First Partner Commercial Bank',
    accountNumber: '012-394-8210',
    glAccountCode: '1010',
    balance: 12400.00,
    currency: 'USD',
    isZeexBank: false,
    status: 'Connected',
    lastReconciledDate: '2026-10-10'
  }
];

export const INITIAL_BANK_STATEMENT_LINES: BankStatementLine[] = [
  { id: 'stmt_101', bankAccountId: 'bank_zeex_primary', date: '2026-10-14', description: 'DIRECT DEPOSIT: Metro Fleet Maintenance Inv #1042', amount: 3450.00, reference: 'TXN-948102', isReconciled: true, matchedJournalId: 'je_sales_1042' },
  { id: 'stmt_102', bankAccountId: 'bank_zeex_primary', date: '2026-10-13', description: 'OUTWARD WIRE: Bosch Auto Systems Spare Parts PO-881', amount: -6800.00, reference: 'TXN-948103', isReconciled: true, matchedJournalId: 'je_po_881' },
  { id: 'stmt_103', bankAccountId: 'bank_zeex_primary', date: '2026-10-15', description: 'ZEEX POS DAILY SETTLEMENT: Terminal VI-01 Session 040', amount: 2740.00, reference: 'TXN-948110', isReconciled: false },
  { id: 'stmt_104', bankAccountId: 'bank_zeex_primary', date: '2026-10-15', description: 'BULK HARVEST OFF-TAKE: Olam Agri Food Processing', amount: 18500.00, reference: 'AGRI-94821', isReconciled: false }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'je_sales_1042',
    entryNumber: 'JE-2026-0089',
    date: '2026-10-14',
    reference: 'INV-2026-1042',
    description: 'Fleet Service Invoice recognition for Metro Logistics',
    sourceModule: 'Sales',
    status: 'Posted',
    createdBy: 'Sarah Chen, FCA',
    totalAmount: 3450.00,
    lines: [
      { id: 'jl_1', accountCode: '1020', accountName: 'ZEEX Bank Operating Master Account', debit: 3450.00, credit: 0, memo: 'Wire receipt from customer' },
      { id: 'jl_2', accountCode: '4020', accountName: 'Mechanical & Diagnostic Labor Revenue', debit: 0, credit: 1950.00, memo: 'Engine overhaul labor' },
      { id: 'jl_3', accountCode: '4010', accountName: 'Retail Merchandise & Parts Sales', debit: 0, credit: 1500.00, memo: 'Brake pads & synthetic oil filters' }
    ]
  },
  {
    id: 'je_po_881',
    entryNumber: 'JE-2026-0088',
    date: '2026-10-13',
    reference: 'PO-2026-0881',
    description: 'Supplier bulk spare parts purchase - Bosch Systems',
    sourceModule: 'Purchases',
    status: 'Posted',
    createdBy: 'Tariq Al-Mansoor',
    totalAmount: 6800.00,
    lines: [
      { id: 'jl_4', accountCode: '1040', accountName: 'Merchandise & Parts Inventory', debit: 6800.00, credit: 0, memo: 'Brake rotors, calipers, sensors delivery' },
      { id: 'jl_5', accountCode: '1020', accountName: 'ZEEX Bank Operating Master Account', debit: 0, credit: 6800.00, memo: 'Electronic wire settlement' }
    ]
  }
];

export const INITIAL_PAYOUT_REQUESTS: PayoutRequest[] = [
  {
    id: 'payout_001',
    beneficiaryName: 'Bosch Automotive OEM Supply Ltd',
    beneficiaryAccount: '0482918402',
    bankName: 'Standard Chartered',
    amount: 8450.00,
    currency: 'USD',
    purpose: 'Bulk Ceramic Brake Pads & Electronic Sensors order',
    category: 'Supplier',
    status: 'Pending Dual Approval',
    makerUser: 'Adekunle Babalola',
    makerTimestamp: '2026-10-15 08:30:15',
    requiresDualApproval: true
  },
  {
    id: 'payout_002',
    beneficiaryName: 'Olam Agro Seeds & Fertilizer Aggregators',
    beneficiaryAccount: '9940182741',
    bankName: 'ZEEX Bank International',
    amount: 12400.00,
    currency: 'USD',
    purpose: '500 Bags NPK 15-15-15 + Certified Hybrid Maize Seed',
    category: 'Supplier',
    status: 'Approved',
    makerUser: 'Dr. Haruna Bello',
    makerTimestamp: '2026-10-14 14:10:00',
    checkerUser: 'Sarah Chen, FCA',
    checkerTimestamp: '2026-10-14 16:22:00',
    requiresDualApproval: true
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_101',
    name: 'Metro Logistics & Delivery Fleet',
    company: 'Metro Logistics Nigeria Ltd',
    email: 'fleet@metrologistics.ng',
    phone: '+234 802 334 1122',
    address: 'Plot 14, Commercial Avenue, Ikeja, Lagos',
    taxId: 'TIN-48201-99',
    totalSpent: 42800.00,
    outstandingBalance: 3450.00,
    currency: 'USD'
  },
  {
    id: 'cust_102',
    name: 'Dr. Chinedu Eze',
    company: 'Crown Specialist Dental',
    email: 'drezec@crowndental.com',
    phone: '+234 813 902 4433',
    address: '22 Admirality Way, Lekki Phase 1, Lagos',
    totalSpent: 12400.00,
    outstandingBalance: 0,
    currency: 'USD'
  },
  {
    id: 'cust_103',
    name: 'Olam International Agro Processing',
    company: 'Olam Agri Nigeria Ltd',
    email: 'procurement@olam-agri.ng',
    phone: '+234 1 270 9480',
    address: 'Km 38, Lagos-Ibadan Expressway, Ogun State',
    taxId: 'TIN-88910-44',
    totalSpent: 85000.00,
    outstandingBalance: 18500.00,
    currency: 'USD'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_1042',
    invoiceNumber: 'INV-2026-1042',
    customerId: 'cust_101',
    customerName: 'Metro Logistics & Delivery Fleet',
    issueDate: '2026-10-12',
    dueDate: '2026-10-26',
    currency: 'USD',
    status: 'Sent',
    paidAmount: 0,
    subtotal: 3209.30,
    taxTotal: 240.70,
    discountTotal: 0,
    total: 3450.00,
    branchId: 'branch_hq_lagos',
    notes: 'Payment term: 14 days net. Bank details: ZEEX Bank Account #902-881-4901.',
    items: [
      { id: 'item_1', description: 'Full Brake System Overhaul & Fluid Flush (4 Axles)', quantity: 1, unitPrice: 1950.00, taxRate: 7.5, total: 2096.25, glAccountCode: '4020' },
      { id: 'item_2', description: 'OEM Front Brake Caliper & Ceramic Pads Set', quantity: 2, unitPrice: 629.65, taxRate: 7.5, total: 1353.75, glAccountCode: '4010' }
    ]
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: 'wh_main', name: 'Victoria Island Central Distribution Depot', code: 'VI-HUB-01', location: 'Victoria Island, Lagos', branchId: 'branch_hq_lagos', manager: 'Adekunle Babalola' },
  { id: 'wh_abuja', name: 'Abuja CBD Regional Fulfillment Store', code: 'ABJ-STORE-02', location: 'Central Business District, Abuja', branchId: 'branch_abuja', manager: 'Hajia Amina Sanusi' },
  { id: 'wh_silo', name: 'Kaduna Commercial Grain Silo & Cold Depot', code: 'KAD-SILO-03', location: 'Zaria Road Agro Industrial Zone, Kaduna', branchId: 'branch_hq_lagos', manager: 'Dr. Haruna Bello' }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod_001', sku: 'BRK-CER-TYT', name: 'Bosch Ceramic Brake Pads (Hilux/Prado)', category: 'Spare Parts', unit: 'Set', costPrice: 65.00, sellingPrice: 120.00, stockQuantity: 42, reorderLevel: 15, warehouseId: 'wh_main', barcode: '789104829101', batchNumber: 'B-2026-09' },
  { id: 'prod_002', sku: 'OIL-SYN-5W30', name: 'Castrol Edge 5W-30 Fully Synthetic (5L)', category: 'Lubricants & Fluids', unit: 'Can', costPrice: 38.00, sellingPrice: 68.00, stockQuantity: 88, reorderLevel: 25, warehouseId: 'wh_main', barcode: '789104829102', batchNumber: 'B-2026-08' },
  { id: 'prod_003', sku: 'FLT-ENG-BOS', name: 'OEM Micro-Pore Oil Filter High Efficiency', category: 'Filters', unit: 'Piece', costPrice: 12.00, sellingPrice: 28.00, stockQuantity: 110, reorderLevel: 30, warehouseId: 'wh_main', barcode: '789104829103' },
  { id: 'prod_004', sku: 'AGRI-MZ-GRA', name: 'Grade-A Dried Hybrid Maize (50kg Bag)', category: 'Agro Produce', unit: 'Bag', costPrice: 28.00, sellingPrice: 42.00, stockQuantity: 340, reorderLevel: 50, warehouseId: 'wh_silo', barcode: '789104829107' },
  { id: 'prod_005', sku: 'AGRI-SOY-EX', name: 'Export Cleaned Soybeans (100kg Bag)', category: 'Agro Produce', unit: 'Bag', costPrice: 55.00, sellingPrice: 85.00, stockQuantity: 180, reorderLevel: 30, warehouseId: 'wh_silo', barcode: '789104829108' },
  { id: 'prod_006', sku: 'RET-ROLL-80M', name: 'Thermal Receipt Rolls 80mm x 80m (Box of 50)', category: 'Retail Consumables', unit: 'Box', costPrice: 22.00, sellingPrice: 45.00, stockQuantity: 4, reorderLevel: 10, warehouseId: 'wh_main', barcode: '789104829106' }
];

export const INITIAL_STOCK_TRANSFERS: StockTransfer[] = [
  {
    id: 'st_001',
    transferNumber: 'ST-2026-0041',
    sourceBranchId: 'branch_hq_lagos',
    sourceBranchName: 'Victoria Island HQ Hub',
    targetBranchId: 'branch_abuja',
    targetBranchName: 'Central Business District Branch',
    productId: 'prod_001',
    productName: 'Bosch Ceramic Brake Pads (Hilux/Prado)',
    quantity: 20,
    dispatchDate: '2026-10-14',
    status: 'In Transit',
    requestedBy: 'Hajia Amina Sanusi',
    approvedBy: 'Adekunle Babalola'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup_bosch', name: 'Bosch Automotive OEM Supply Ltd', contactPerson: 'Markus Vogel', email: 'orders@bosch-auto.com', phone: '+49 711 811 0', payableBalance: 12400.00, currency: 'USD', taxNumber: 'DE-811-094' },
  { id: 'sup_olam', name: 'Olam Agro Seeds & Inputs Ltd', contactPerson: 'Alhaji Kabir Bello', email: 'seeds@olam-inputs.ng', phone: '+234 803 992 1100', payableBalance: 12400.00, currency: 'USD', taxNumber: 'NG-48201-09' }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_0881',
    poNumber: 'PO-2026-0881',
    supplierId: 'sup_bosch',
    supplierName: 'Bosch Automotive OEM Supply Ltd',
    orderDate: '2026-10-08',
    expectedDate: '2026-10-20',
    totalAmount: 6800.00,
    currency: 'USD',
    status: 'Received',
    items: [
      { productId: 'prod_001', productName: 'Bosch Ceramic Brake Pads (Hilux/Prado)', quantity: 50, unitPrice: 65.00, total: 3250.00 }
    ]
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp_101', employeeCode: 'EMP-001', name: 'Adekunle Babalola', email: 'a.babalola@apexhorizon.com', phone: '+234 802 111 2233', role: 'Chief Master Technician', department: 'Service Engineering', branchId: 'branch_hq_lagos', hireDate: '2022-04-15', baseSalary: 3800.00, currency: 'USD', bankName: 'ZEEX Bank International', accountNumber: '902-111-0021', status: 'Active' },
  { id: 'emp_102', employeeCode: 'EMP-002', name: 'Rasheed Bakare', email: 'r.bakare@apexhorizon.com', phone: '+234 803 222 3344', role: 'Senior Auto Diagnostic Specialist', department: 'Service Engineering', branchId: 'branch_hq_lagos', hireDate: '2023-01-10', baseSalary: 2900.00, currency: 'USD', bankName: 'ZEEX Bank International', accountNumber: '902-111-0022', status: 'Active' },
  { id: 'emp_103', employeeCode: 'EMP-003', name: 'Chioma Okonkwo', email: 'c.okonkwo@apexhorizon.com', phone: '+234 805 333 4455', role: 'Inventory & POS Lead', department: 'Retail Operations', branchId: 'branch_hq_lagos', hireDate: '2023-08-01', baseSalary: 2100.00, currency: 'USD', bankName: 'First Partner Bank', accountNumber: '012-998-1100', status: 'Active' },
  { id: 'emp_104', employeeCode: 'EMP-004', name: 'Dr. Haruna Bello', email: 'h.bello@apexhorizon.com', phone: '+234 803 444 8899', role: 'Chief Agronomist & Farm Lead', department: 'Agricultural Operations', branchId: 'branch_hq_lagos', hireDate: '2023-03-01', baseSalary: 3400.00, currency: 'USD', bankName: 'ZEEX Bank International', accountNumber: '902-111-0026', status: 'Active' },
  { id: 'emp_105', employeeCode: 'EMP-005', name: 'Capt. Musa Danladi', email: 'm.danladi@apexhorizon.com', phone: '+234 809 333 7711', role: 'Logistics Fleet & Dispatch Director', department: 'Logistics & Haulage', branchId: 'branch_hq_lagos', hireDate: '2023-06-15', baseSalary: 3600.00, currency: 'USD', bankName: 'ZEEX Bank International', accountNumber: '902-111-0027', status: 'Active' }
];

export const INITIAL_PAYROLL_RUNS: PayrollRun[] = [
  {
    id: 'pr_2026_09',
    period: 'September 2026',
    runDate: '2026-09-28',
    totalGross: 15800.00,
    totalTaxPAYE: 2370.00,
    totalPension: 1264.00,
    totalNet: 12166.00,
    employeeCount: 5,
    status: 'Paid',
    journalEntryId: 'je_payroll_sep'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'proj_01', name: 'Fleet Electrification & Diagnostics Upgrade', clientName: 'Metro Logistics Nigeria Ltd', startDate: '2026-09-01', endDate: '2026-11-30', budget: 45000.00, actualCost: 28400.00, billedRevenue: 42000.00, profitability: 32.4, status: 'In Progress', manager: 'Adekunle Babalola', progressPercent: 68 },
  { id: 'proj_02', name: '500-Hectare Commercial Hybrid Maize Outgrower Cycle', clientName: 'Olam International Agro Processing', startDate: '2026-05-10', endDate: '2026-11-15', budget: 120000.00, actualCost: 78000.00, billedRevenue: 135000.00, profitability: 42.2, status: 'In Progress', manager: 'Dr. Haruna Bello', progressPercent: 75 }
];

// Automotive Vehicles
export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'veh_01', licensePlate: 'LAG-482-XA', vin: 'JTDKN3DU5E0198421', make: 'Toyota', model: 'Hilux 2.8 D-4D 4x4', year: 2022, ownerName: 'Metro Logistics & Delivery Fleet', ownerPhone: '+234 802 334 1122', mileage: 78420, engineCode: '1GD-FTV' },
  { id: 'veh_02', licensePlate: 'ABJ-910-CQ', vin: 'WBA5A7C57FD109822', make: 'BMW', model: 'X5 xDrive40i', year: 2023, ownerName: 'Dr. Chinedu Eze', ownerPhone: '+234 813 902 4433', mileage: 34100, engineCode: 'B58B30M1' }
];

export const INITIAL_REPAIR_ORDERS: RepairOrder[] = [
  {
    id: 'ro_101',
    orderNumber: 'RO-2026-0491',
    vehicleId: 'veh_01',
    vehicleSummary: '2022 Toyota Hilux (LAG-482-XA)',
    customerName: 'Metro Logistics & Delivery Fleet',
    technicianName: 'Adekunle Babalola',
    dateIn: '2026-10-12',
    estimatedCompletion: '2026-10-16',
    status: 'In Repair',
    issueDescription: 'Severe vibration under braking at highway speeds; squeal from front left axle; scheduled 80k inspection.',
    inspectionSummary: {
      brakes: 'Critical',
      engineOil: 'Good',
      suspension: 'Attention',
      battery: 'Good'
    },
    partsCost: 650.00,
    laborCost: 450.00,
    totalCost: 1100.00
  }
];

// Retail POS Transactions
export const INITIAL_POS_TRANSACTIONS: POSTransaction[] = [
  {
    id: 'pos_txn_001',
    receiptNumber: 'RCP-2026-9041',
    sessionId: 'pos_sess_041',
    tillNumber: 'Till 01',
    timestamp: '2026-10-15 08:35:10',
    cashierName: 'Chioma Okonkwo',
    branchName: 'Victoria Island HQ Hub',
    items: [
      { productId: 'prod_002', productName: 'Castrol Edge 5W-30 (5L)', quantity: 2, price: 68.00, total: 136.00 }
    ],
    subtotal: 136.00,
    tax: 10.20,
    discount: 0,
    total: 146.20,
    paymentMethod: 'Card'
  }
];

// Legal Practice
export const INITIAL_LEGAL_MATTERS: LegalMatter[] = [
  {
    id: 'mat_001',
    matterNumber: 'MAT-2026-018',
    title: 'Project Falcon: Acquisition of Zenith Energy Storage Ltd',
    clientName: 'Vanguard Capital Partners',
    leadAttorney: 'Barr. Folake Adeleke',
    practiceArea: 'Corporate & M&A',
    status: 'Active',
    trustRetainerBalance: 28500.00,
    billableRatePerHour: 350.00,
    hoursLogged: 42.5,
    unbilledAmount: 14875.00,
    nextHearingOrDeadline: '2026-10-22 (SEC Filing Deadline)'
  }
];

export const INITIAL_TIME_ENTRIES: TimeEntry[] = [
  {
    id: 'te_001',
    matterId: 'mat_001',
    matterTitle: 'Project Falcon: Acquisition of Zenith Energy',
    attorneyName: 'Barr. Folake Adeleke',
    date: '2026-10-14',
    hours: 3.5,
    hourlyRate: 350.00,
    description: 'Review of regulatory antitrust representations in share purchase deed.',
    isBilled: false
  }
];

// ---------------- Agribusiness & Farm Operations Initial Data ----------------
export const INITIAL_FARM_PLOTS: FarmPlot[] = [
  {
    id: 'plot_01',
    plotCode: 'PLT-KAD-A1',
    name: 'Sector 4 North Pioneer Alluvial Field',
    sizeHectares: 45.0,
    soilType: 'Loamy Alluvial',
    irrigationStatus: 'Drip Automated',
    currentCrop: 'Commercial Hybrid Maize SC653',
    location: 'Zaria Agro-Belt, Kaduna State',
    agronomistInCharge: 'Dr. Haruna Bello'
  },
  {
    id: 'plot_02',
    plotCode: 'PLT-KAD-B2',
    name: 'Sector 7 Export Grain & Legume Block',
    sizeHectares: 32.5,
    soilType: 'Sandy Loam',
    irrigationStatus: 'Center Pivot',
    currentCrop: 'Certified TGX Non-GMO Soybeans',
    location: 'Zaria Agro-Belt, Kaduna State',
    agronomistInCharge: 'Dr. Haruna Bello'
  },
  {
    id: 'plot_03',
    plotCode: 'PLT-OGUN-C1',
    name: 'Southern High-Moisture Cassava Plantation',
    sizeHectares: 60.0,
    soilType: 'Volcanic',
    irrigationStatus: 'Rainfed Seasonal',
    currentCrop: 'TME 419 High Starch Industrial Cassava',
    location: 'Ilaro Farm Settlement, Ogun State',
    agronomistInCharge: 'Bamidele Ojo'
  }
];

export const INITIAL_CROP_CYCLES: CropCycle[] = [
  {
    id: 'cycle_01',
    cycleCode: 'CYCLE-2026-MZ-01',
    plotId: 'plot_01',
    plotName: 'Sector 4 North Pioneer (45 Ha)',
    cropName: 'Hybrid White Maize',
    variety: 'SC653 High Yield Drought-Tolerant',
    plantingDate: '2026-06-15',
    expectedHarvestDate: '2026-10-25',
    status: 'Flowering & Fruiting',
    totalInputCost: 18400.00,
    estimatedYieldTons: 220.0
  },
  {
    id: 'cycle_02',
    cycleCode: 'CYCLE-2026-SB-02',
    plotId: 'plot_02',
    plotName: 'Sector 7 Export Block (32.5 Ha)',
    cropName: 'Non-GMO Soybeans',
    variety: 'TGX-1987 Favorable Protein Strain',
    plantingDate: '2026-07-01',
    expectedHarvestDate: '2026-10-30',
    status: 'Harvesting',
    totalInputCost: 14200.00,
    estimatedYieldTons: 95.0,
    actualHarvestTons: 92.5
  }
];

export const INITIAL_HARVEST_RECORDS: HarvestRecord[] = [
  {
    id: 'hvt_001',
    harvestNumber: 'WB-HVT-2026-0091',
    cropCycleId: 'cycle_02',
    plotName: 'Sector 7 Export Block',
    harvestDate: '2026-10-14',
    grossWeightKg: 28400,
    gradeA_Kg: 24100, // Export grade clean
    gradeB_Kg: 3800,  // Local processor
    gradeC_Kg: 500,   // Broken/Animal feed
    moistureContentPercent: 12.2, // Target <= 13% for grain preservation
    storageSilo: 'Silo 02 (Kaduna Grain Depot)',
    marketValuation: 24140.00
  }
];

export const INITIAL_AGRO_INPUTS: AgroInput[] = [
  { id: 'inp_01', name: 'YaraMila NPK 15-15-15 Granular Complex', category: 'Fertilizer', unit: '50kg Bag', stockQty: 240, unitCost: 45.00, targetCrop: 'Maize & Cereals' },
  { id: 'inp_02', name: 'SeedCo SC653 Certified Seed Pack', category: 'Certified Seed', unit: '25kg Bag', stockQty: 80, unitCost: 75.00, targetCrop: 'Maize' },
  { id: 'inp_03', name: 'Belt Expert Selective Crop Protection', category: 'Crop Protection', unit: '1L Bottle', stockQty: 55, unitCost: 32.00, targetCrop: 'Fall Armyworm Prevention' }
];

// ---------------- Logistics & Transportation Initial Data ----------------
export const INITIAL_FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'fleet_01',
    registrationNumber: 'KJA-910-XX',
    vehicleType: 'Heavy Duty 30T Hauler',
    tonnageCapacity: 30.0,
    odometerKm: 184200,
    fuelEfficiencyKmPerL: 2.8,
    roadworthinessExpiry: '2027-04-30',
    insuranceExpiry: '2027-03-15',
    status: 'In Transit',
    assignedDriver: 'Mallam Ibrahim Garba'
  },
  {
    id: 'fleet_02',
    registrationNumber: 'APP-402-LD',
    vehicleType: 'Refrigerated 10T Van',
    tonnageCapacity: 10.0,
    odometerKm: 92400,
    fuelEfficiencyKmPerL: 4.6,
    roadworthinessExpiry: '2027-06-10',
    insuranceExpiry: '2027-05-20',
    status: 'Available in Depot',
    assignedDriver: 'Sunday Eze'
  },
  {
    id: 'fleet_03',
    registrationNumber: 'EPE-812-ZZ',
    vehicleType: 'Flatbed Container Hauler',
    tonnageCapacity: 35.0,
    odometerKm: 210500,
    fuelEfficiencyKmPerL: 2.6,
    roadworthinessExpiry: '2026-12-15',
    insuranceExpiry: '2026-11-30',
    status: 'Available in Depot',
    assignedDriver: 'Kenneth Okon'
  }
];

export const INITIAL_DISPATCH_TRIPS: DispatchTrip[] = [
  {
    id: 'trip_101',
    tripNumber: 'TRIP-2026-0182',
    vehicleId: 'fleet_01',
    vehicleReg: 'KJA-910-XX (30T Hauler)',
    driverName: 'Mallam Ibrahim Garba',
    originHub: 'Lagos Victoria Island Central Hub',
    destinationHub: 'Abuja CBD Logistics Depot',
    departureTime: '2026-10-14 06:00:00',
    estimatedArrival: '2026-10-15 14:00:00',
    cargoManifest: '500 Bags Cleaned Soybeans + 20 Sets Bosch Calipers & Diagnostics',
    grossWeightTons: 28.5,
    freightCharge: 4800.00,
    fuelAdvanceAllocated: 1200.00,
    waybillNumber: 'WB-90184',
    status: 'On Route'
  }
];

export const INITIAL_WAYBILLS: Waybill[] = [
  {
    id: 'wb_01',
    waybillNumber: 'WB-90184',
    tripId: 'trip_101',
    shipperName: 'Apex Horizon Enterprises Central Hub',
    consigneeName: 'Olam International Agro Processing Abuja',
    deliveryAddress: 'Plot 48, Idu Industrial Area, Phase 1, Abuja',
    status: 'Pending Delivery'
  }
];

// ---------------- Energy & Fuel Station Initial Data ----------------
export const INITIAL_FUEL_TANKS: FuelTank[] = [
  {
    id: 'tank_01',
    tankCode: 'TK-01-PMS',
    fuelType: 'PMS Premium Motor Spirit (Petrol)',
    totalCapacityLiters: 45000,
    currentStockLiters: 31250,
    waterDipCm: 0.2, // normal water tolerance < 1.0cm
    ullageLiters: 13750,
    lastDipTimestamp: '2026-10-15 06:30:00'
  },
  {
    id: 'tank_02',
    tankCode: 'TK-02-AGO',
    fuelType: 'AGO Automotive Gas Oil (Diesel)',
    totalCapacityLiters: 33000,
    currentStockLiters: 19800,
    waterDipCm: 0.1,
    ullageLiters: 13200,
    lastDipTimestamp: '2026-10-15 06:30:00'
  },
  {
    id: 'tank_03',
    tankCode: 'TK-03-DPK',
    fuelType: 'DPK Dual Purpose Kerosene',
    totalCapacityLiters: 20000,
    currentStockLiters: 14500,
    waterDipCm: 0.0,
    ullageLiters: 5500,
    lastDipTimestamp: '2026-10-15 06:30:00'
  }
];

export const INITIAL_PUMP_READINGS: PumpShiftReading[] = [
  {
    id: 'pump_01',
    pumpIsland: 'Pump Island 01 - Dual Nozzle',
    fuelType: 'PMS Petrol',
    attendantName: 'Tunde Adeleke',
    shiftDate: '2026-10-14 (Afternoon Shift)',
    openingMeterLiters: 148920.0,
    closingMeterLiters: 151340.0,
    volumeDispensedLiters: 2420.0,
    unitPricePerLiter: 0.72,
    expectedRevenue: 1742.40,
    cashRemitted: 1200.00,
    posTerminalRemitted: 542.40,
    variance: 0.00 // Reconciled balanced
  },
  {
    id: 'pump_02',
    pumpIsland: 'Pump Island 02 - Heavy Diesel',
    fuelType: 'AGO Diesel',
    attendantName: 'Aliyu Mohammed',
    shiftDate: '2026-10-14 (Afternoon Shift)',
    openingMeterLiters: 89410.0,
    closingMeterLiters: 92830.0,
    volumeDispensedLiters: 3420.0,
    unitPricePerLiter: 0.85,
    expectedRevenue: 2907.00,
    cashRemitted: 1900.00,
    posTerminalRemitted: 1007.00,
    variance: 0.00
  }
];

export const INITIAL_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  { id: 'cf_veh_plate', targetEntity: 'vehicle', fieldKey: 'license_plate', label: 'License Plate No.', type: 'text', required: true, description: 'State motor vehicle registration plate' },
  { id: 'cf_veh_mileage', targetEntity: 'vehicle', fieldKey: 'odometer_km', label: 'Odometer (km)', type: 'number', required: true },
  { id: 'cf_farm_soil', targetEntity: 'farm_plot', fieldKey: 'soil_ph_level', label: 'Soil pH Measurement', type: 'number', required: false, defaultValue: 6.5 },
  { id: 'cf_trip_seal', targetEntity: 'dispatch_trip', fieldKey: 'container_tamper_seal', label: 'Container Security Seal #', type: 'text', required: true }
];

export const INITIAL_CUSTOM_RECORDS: CustomRecordDefinition[] = [
  {
    id: 'cr_equipment_inspection',
    name: 'Workshop Equipment Maintenance',
    singularName: 'Equipment Inspection',
    slug: 'equipment-inspection',
    icon: 'ShieldCheck',
    description: 'Log calibration and safety inspection for hydraulic lifts, wheel balancers and diagnostic scanners.',
    recordsCount: 14,
    fields: [
      { id: 'f1', targetEntity: 'custom_record', fieldKey: 'machine_serial', label: 'Machine Serial / Tag', type: 'text', required: true }
    ]
  }
];

export const INITIAL_AUTOMATIONS: AutomationWorkflow[] = [
  {
    id: 'auto_dual_approval_payout',
    name: 'Dual Authorization for Disbursements > $2,000',
    description: 'Enforce Maker-Checker principle: Any payment request exceeding $2,000 requires independent Checker counter-signature before execution.',
    triggerEvent: 'on_payment_exceeds_threshold',
    conditions: [
      { field: 'amount', operator: 'greater_than', value: 2000 }
    ],
    actions: [
      { type: 'require_dual_approval', targetRole: 'Finance Director', payload: 'Dual authorization token required from ZEEX Security HSM' },
      { type: 'send_notification', targetRole: 'Super Admin', payload: 'High-value treasury payout request pending clearance' }
    ],
    isActive: true,
    executionCount: 19,
    lastRun: '2026-10-15 08:30:15'
  },
  {
    id: 'auto_harvest_silo_sync',
    name: 'Auto-Post Grain Silo Valuation on Weighbridge Clearance',
    description: 'When grain weighbridge ticket is logged, post Grade A harvest to GL Asset Account 1050 (Agricultural Produce Inventory) and credit Farm Revenue.',
    triggerEvent: 'on_harvest_weighbridge_logged',
    conditions: [
      { field: 'moistureContentPercent', operator: 'less_than', value: 13.0 }
    ],
    actions: [
      { type: 'create_journal_entry', payload: 'Dr Silo Inventory 1050, Cr Farm Harvest Revenue 4030' },
      { type: 'send_notification', targetRole: 'Chief Agronomist', payload: 'Grain moisture passed quality test. Stored in Silo.' }
    ],
    isActive: true,
    executionCount: 28,
    lastRun: '2026-10-14 16:45:00'
  },
  {
    id: 'auto_till_variance_alert',
    name: 'Till Session Shortage Discrepancy Alert',
    description: 'If actual cash counted at till session close has variance < -$5.00, flag security audit event and notify Branch Manager.',
    triggerEvent: 'on_till_variance_detected',
    conditions: [
      { field: 'cashVariance', operator: 'less_than', value: -5 }
    ],
    actions: [
      { type: 'send_notification', targetRole: 'Branch Manager', payload: 'Cash drawer discrepancy detected on till close.' }
    ],
    isActive: true,
    executionCount: 3,
    lastRun: '2026-10-12 18:02:11'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_901',
    timestamp: '2026-10-15 08:35:10',
    userId: 'usr_chioma_okonkwo',
    userName: 'Chioma Okonkwo',
    action: 'POS_TILL_SALE_RECORDED',
    entityType: 'POSTransaction',
    entityId: 'RCP-2026-9041',
    details: 'Checkout completed on Till 01 for $146.20 via Card. Shift session: SESS-2026-041.',
    ipAddress: '197.210.84.18',
    status: 'Success'
  },
  {
    id: 'log_902',
    timestamp: '2026-10-15 08:30:15',
    userId: 'usr_ade_babalola',
    userName: 'Adekunle Babalola',
    action: 'TREASURY_PAYOUT_INITIATED',
    entityType: 'PayoutRequest',
    entityId: 'payout_001',
    details: 'Initiated supplier payout of $8,450.00 to Bosch Automotive OEM Supply Ltd. Triggered Maker-Checker dual authorization requirement.',
    ipAddress: '197.210.84.18',
    status: 'Success'
  },
  {
    id: 'log_903',
    timestamp: '2026-10-15 08:00:00',
    userId: 'usr_chioma_okonkwo',
    userName: 'Chioma Okonkwo',
    action: 'POS_TILL_SESSION_OPENED',
    entityType: 'POSSession',
    entityId: 'SESS-2026-041',
    details: 'Till 01 opened with $150.00 physical cash float verified at Victoria Island HQ.',
    ipAddress: '197.210.84.18',
    status: 'Success'
  },
  {
    id: 'log_904',
    timestamp: '2026-10-14 16:45:00',
    userId: 'usr_haruna_bello',
    userName: 'Dr. Haruna Bello',
    action: 'HARVEST_WEIGHBRIDGE_LOGGED',
    entityType: 'HarvestRecord',
    entityId: 'WB-HVT-2026-0091',
    details: 'Cleared 28.4 tons Soybeans harvest (Moisture: 12.2%). Transferred to Silo 02.',
    ipAddress: '197.210.84.22',
    status: 'Success'
  }
];

// ============================================================================
// Managed Workspace Architecture Initial Data
// ============================================================================

export const INITIAL_WORKSPACE_SPACES: WorkspaceSpace[] = [
  // 1. Company-wide Announcements & Operating Updates
  {
    id: 'space_general_ops',
    name: 'general-announcements',
    type: 'channel',
    channelType: 'company',
    isAnnouncementOnly: false,
    topic: 'Official company-wide announcements and shift broadcasts for all staff',
    description: 'Company-wide operating updates, shift handovers, and compliance notices.',
    unreadCount: 2,
    iconName: 'Megaphone',
    category: 'general',
    membersCount: 14
  },
  {
    id: 'space_policy_official',
    name: 'official-policies',
    type: 'channel',
    channelType: 'announcement',
    isAnnouncementOnly: true,
    topic: 'Statutory policies, governance bulletins & audit standards (read-only broadcasts)',
    description: 'Executive announcements, dual-control policy updates, and compliance requirements.',
    unreadCount: 1,
    iconName: 'ShieldCheck',
    category: 'general',
    membersCount: 14
  },

  // 2. Department Channels
  {
    id: 'space_workshop_floor',
    name: 'dept-workshop-service',
    type: 'channel',
    channelType: 'department',
    department: 'Automotive & Workshop',
    topic: 'Lead technicians, bay assignments, diagnostic trouble codes, and parts requisition',
    description: 'Live technician coordination, diagnostic scans, and bay scheduling.',
    unreadCount: 1,
    iconName: 'Wrench',
    category: 'operations',
    membersCount: 6
  },
  {
    id: 'space_pos_cashiers',
    name: 'dept-retail-tills',
    type: 'channel',
    channelType: 'department',
    department: 'Retail & POS Operations',
    topic: 'Till float balance checks, POS drawer opening, and offline register continuity',
    description: 'Cash float verifications, offline till continuity, and price overrides.',
    unreadCount: 0,
    iconName: 'CreditCard',
    category: 'operations',
    membersCount: 5
  },
  {
    id: 'space_finance_approvals',
    name: 'dept-finance-treasury',
    type: 'channel',
    channelType: 'department',
    department: 'Treasury & Controlling',
    topic: 'Statutory Maker-Checker discussions, disbursement queues, and bank reconciliation',
    description: 'Disbursement discussions, Maker-Checker reviews, and audit exceptions.',
    unreadCount: 3,
    iconName: 'Lock',
    category: 'finance',
    membersCount: 4
  },
  {
    id: 'space_logistics_dispatch',
    name: 'dept-fleet-logistics',
    type: 'channel',
    channelType: 'department',
    department: 'Freight & Fleet Logistics',
    topic: 'Trip dispatch manifests, driver road advances, and e-POD delivery verification',
    description: 'Trip manifest tracking, diesel advances, and e-POD signed confirmations.',
    unreadCount: 0,
    iconName: 'Truck',
    category: 'operations',
    membersCount: 7
  },

  // 3. Branch / Site Specific Channels
  {
    id: 'space_branch_lagos_hq',
    name: 'branch-victoria-island-hq',
    type: 'channel',
    channelType: 'branch',
    branchId: 'branch_hq_lagos',
    topic: 'Lagos Victoria Island HQ daily facilities, security gates, and local IT status',
    description: 'Lagos central operations and regional management alerts.',
    unreadCount: 0,
    iconName: 'Building2',
    category: 'operations',
    membersCount: 11
  },
  {
    id: 'space_branch_abuja',
    name: 'branch-abuja-cbd',
    type: 'channel',
    channelType: 'branch',
    branchId: 'branch_abuja',
    topic: 'Abuja Central Business District branch announcements & logistics reception',
    description: 'Abuja branch staff notices and register handover protocols.',
    unreadCount: 0,
    iconName: 'Building2',
    category: 'operations',
    membersCount: 4
  },

  // 4. Project & Cross-functional Channels
  {
    id: 'space_proj_cloud_migration',
    name: 'proj-offline-continuity-v2',
    type: 'channel',
    channelType: 'project',
    topic: 'Rollout of local edge cache, thermal ESC/POS network printing, and zero-drop sync',
    description: 'Technical cross-department initiative for edge resilience and hardware testing.',
    unreadCount: 0,
    iconName: 'Layers',
    category: 'operations',
    membersCount: 5
  },

  // 5. Private / Audited Restricted Channels (SoD Governance)
  {
    id: 'space_private_executive',
    name: 'private-executive-audit',
    type: 'channel',
    channelType: 'private',
    isPrivate: true,
    topic: 'Confidential board resolutions, group capital allocations, and audit committee reviews',
    description: 'Restricted channel with audited entry policies. Not all admins are auto-enrolled.',
    unreadCount: 0,
    iconName: 'Lock',
    category: 'finance',
    membersCount: 3
  },

  // 6. Social & Culture Channel
  {
    id: 'space_watercooler',
    name: 'social-watercooler',
    type: 'channel',
    channelType: 'social',
    topic: 'Casual conversations, weekend plans, book recommendations, and team shoutouts!',
    description: 'Non-work informal channel respecting staff preferences and zero work stress.',
    unreadCount: 1,
    iconName: 'Smile',
    category: 'general',
    membersCount: 14
  },

  // 7. Contextual Record Discussion Threads
  {
    id: 'space_record_ro8821',
    name: 'thread-ro-8821',
    type: 'record_thread',
    description: 'Discussion on Job Card RO-8821 (Toyota Land Cruiser Engine Overhaul).',
    unreadCount: 1,
    iconName: 'FileText',
    category: 'operations',
    linkedRecordType: 'repair_order',
    linkedRecordId: 'ro_001',
    membersCount: 3
  },
  {
    id: 'space_record_inv2026',
    name: 'thread-inv-2026-001',
    type: 'record_thread',
    description: 'Discussion on Invoice INV-2026-001 ($4,520.00 Lagos Marina Logistics).',
    unreadCount: 0,
    iconName: 'FileCheck',
    category: 'finance',
    linkedRecordType: 'invoice',
    linkedRecordId: 'inv_001',
    membersCount: 4
  },

  // 8. Direct Messages (Staff 1-on-1)
  {
    id: 'dm_tariq_mansoor',
    name: 'Tariq Mansoor',
    type: 'direct',
    directParticipantId: 'usr_tariq_almansoor',
    description: 'Direct 1-on-1 discussion with Tariq Mansoor (Finance Director & Controlling).',
    unreadCount: 1,
    iconName: 'User',
    category: 'general',
    membersCount: 2
  },
  {
    id: 'dm_folake_adeleke',
    name: 'Barr. Folake Adeleke',
    type: 'direct',
    directParticipantId: 'usr_folake_adeleke',
    description: 'Direct 1-on-1 discussion with Barr. Folake Adeleke (Payroll Officer & Legal).',
    unreadCount: 0,
    iconName: 'User',
    category: 'general',
    membersCount: 2
  },
  {
    id: 'dm_haruna_bello',
    name: 'Dr. Haruna Bello',
    type: 'direct',
    directParticipantId: 'usr_haruna_bello',
    description: 'Direct 1-on-1 discussion with Dr. Haruna Bello (Chief Agronomist & Silos).',
    unreadCount: 0,
    iconName: 'User',
    category: 'general',
    membersCount: 2
  }
];

export const INITIAL_WORKSPACE_MESSAGES: WorkspaceMessage[] = [
  {
    id: 'msg_001',
    spaceId: 'space_general_ops',
    authorId: 'usr_ade_babalola',
    authorName: 'Adekunle Babalola',
    authorRole: 'Super Admin',
    content: 'Welcome team to the ZEEX Managed Workspace. All branches (Victoria Island HQ, Abuja CBD, London Office) are synced. Please review the updated Till float SOP before opening your registers.',
    timestamp: '2026-10-15 07:30',
    mentions: ['@everyone'],
    reactions: [{ emoji: '👍', count: 4, users: ['usr_chioma_okonkwo', 'usr_elena_rostova', 'usr_tariq_mansoor'] }]
  },
  {
    id: 'msg_002',
    spaceId: 'space_workshop_floor',
    authorId: 'usr_tariq_mansoor',
    authorName: 'Tariq Mansoor',
    authorRole: 'Workshop Lead Technician',
    content: '@Elena Rostova we have completed the OBD-II engine scan on Job Card #RO-8821. Cylinder 3 misfire confirmed. Need authorization to draw OEM Ignition Coils ($480) from Central Spares.',
    timestamp: '2026-10-15 08:15',
    mentions: ['@Elena Rostova'],
    linkedRecord: {
      type: 'repair_order',
      id: 'ro_001',
      title: 'Job Card #RO-8821 (Toyota Land Cruiser)',
      amount: 480,
      status: 'In Progress'
    },
    attachments: [
      { name: 'Scan_Diagnostics_RO8821.pdf', size: '2.4 MB', type: 'application/pdf' }
    ]
  },
  {
    id: 'msg_003',
    spaceId: 'space_finance_approvals',
    authorId: 'usr_elena_rostova',
    authorName: 'Elena Rostova',
    authorRole: 'Finance Director',
    content: 'Reviewing payout request #PAY-2026-001 to Bosch Automotive OEM ($8,450.00). Invoice and 3-way matching with PO-2026-001 is clean. @Adekunle Babalola please provide secondary authorization in Treasury.',
    timestamp: '2026-10-15 08:35',
    mentions: ['@Adekunle Babalola'],
    linkedRecord: {
      type: 'payout',
      id: 'payout_001',
      title: 'Payout #PAY-2026-001 · Bosch OEM',
      amount: 8450,
      status: 'Pending Dual Approval'
    }
  },
  {
    id: 'msg_004',
    spaceId: 'space_record_ro8821',
    authorId: 'usr_ade_babalola',
    authorName: 'Adekunle Babalola',
    authorRole: 'Super Admin',
    content: 'Parts issue approved for Job Card #RO-8821. Inventory reserved in Warehouse 01 (Central Spares). Total estimated job cost updated to $1,850.00.',
    timestamp: '2026-10-15 08:42',
    mentions: ['@Tariq Mansoor']
  }
];

export const INITIAL_NOTION_PAGES: NotionPage[] = [
  {
    id: 'page_sop_pos',
    title: 'Cashier Till Opening & Float Reconciliation SOP',
    category: 'SOP',
    author: 'Elena Rostova (Finance Director)',
    updatedAt: '2026-10-14',
    icon: 'Calculator',
    badge: 'Mandatory Ops',
    summary: 'Standard statutory procedures for opening register cash drawers, verifying physical denominations, and handling offline till continuity.',
    contentBlocks: [
      {
        id: 'blk_1',
        type: 'callout',
        calloutType: 'info',
        content: 'Segregation Notice: Frontline cashiers may only open and count their designated till. Under no circumstance should supervisory passwords be shared.'
      },
      {
        id: 'blk_2',
        type: 'heading',
        content: '1. Morning Physical Till Opening Checklist'
      },
      {
        id: 'blk_3',
        type: 'checklist',
        content: 'Perform these verification steps before ringing the first transaction:',
        checklistItems: [
          { id: 'chk_1', label: 'Verify starting physical cash float ($150.00 or local currency equivalent)', checked: true, mandatory: true },
          { id: 'chk_2', label: 'Inspect thermal receipt roll (ensure minimum 20% remaining)', checked: true, mandatory: true },
          { id: 'chk_3', label: 'Confirm Bluetooth or USB Barcode Scanner responds to test SKU scan', checked: true, mandatory: true },
          { id: 'chk_4', label: 'Verify POS payment terminal connection or toggle Offline Continuity Mode', checked: false, mandatory: true }
        ]
      },
      {
        id: 'blk_4',
        type: 'heading',
        content: '2. Offline Continuity Policy'
      },
      {
        id: 'blk_5',
        type: 'paragraph',
        content: 'In the event of an ISP failure, the ZEEX retail register enters Offline Continuity Mode. Tills can process cash and authorized offline card transactions up to $2,500 total basket limit. Statutory e-invoicing and external bank transfers will queue and re-verify once the cloud connection restores.'
      }
    ]
  },
  {
    id: 'page_sop_workshop',
    title: 'Automotive 30-Point Vehicle Safety & Job Card SOP',
    category: 'SOP',
    author: 'Tariq Mansoor (Workshop Lead)',
    updatedAt: '2026-10-12',
    icon: 'Wrench',
    badge: 'Workshop Standard',
    summary: 'End-to-end procedure for customer intake, electronic multipoint inspection, technician labor logging, and parts requisition.',
    contentBlocks: [
      {
        id: 'blk_w1',
        type: 'callout',
        calloutType: 'warning',
        content: 'No vehicle may be released from bay without digital signature on the Proof of Road Test checklist.'
      },
      {
        id: 'blk_w2',
        type: 'checklist',
        content: 'Mandatory Pre-Service Protocol:',
        checklistItems: [
          { id: 'cw_1', label: 'Capture vehicle VIN, Odometer reading, and visual exterior damage photos', checked: true, mandatory: true },
          { id: 'cw_2', label: 'Execute full ECU diagnostic scan and attach PDF log to Job Card', checked: true, mandatory: true },
          { id: 'cw_3', label: 'Obtain customer estimate approval before reserving inventory parts', checked: true, mandatory: true },
          { id: 'cw_4', label: 'Record technician clock-in on Job Card labor ledger', checked: false, mandatory: true }
        ]
      }
    ]
  },
  {
    id: 'page_sop_agri',
    title: 'Agro Silo Grain Intake & Weighbridge Protocol',
    category: 'SOP',
    author: 'Dr. Haruna Bello (Chief Agronomist)',
    updatedAt: '2026-10-10',
    icon: 'Wheat',
    badge: 'Agribusiness',
    summary: 'Procedures for certified gross/tare weighbridge intake, digital moisture analysis, and automated silo bin allocation.',
    contentBlocks: [
      {
        id: 'blk_a1',
        type: 'callout',
        calloutType: 'danger',
        content: 'Moisture cutoff rule: Grains with moisture reading above 13.5% must route to Batch Dryer unit before storage to prevent aflatoxin contamination.'
      },
      {
        id: 'blk_a2',
        type: 'checklist',
        content: 'Weighbridge Intake Steps:',
        checklistItems: [
          { id: 'ca_1', label: 'Gross truck weight recording on calibrated weighbridge cell', checked: true, mandatory: true },
          { id: 'ca_2', label: 'Sample probe extraction from 5 distinct trailer zones', checked: true, mandatory: true },
          { id: 'ca_3', label: 'Calibrated moisture meter reading (recorded in Harvest Ledger)', checked: true, mandatory: true },
          { id: 'ca_4', label: 'Tare weight capture after silo dumping and automated Net Yield posting', checked: false, mandatory: true }
        ]
      }
    ]
  },
  {
    id: 'page_sop_treasury',
    title: 'Treasury Dual-Authorization & Anti-Fraud Policy',
    category: 'Policy',
    author: 'Adekunle Babalola & Elena Rostova',
    updatedAt: '2026-10-08',
    icon: 'ShieldCheck',
    badge: 'Governance',
    summary: 'Statutory segregation of duties: all disbursements exceeding $1,000 require independent Maker and Checker cryptographic sign-off.',
    contentBlocks: [
      {
        id: 'blk_t1',
        type: 'callout',
        calloutType: 'info',
        content: 'Maker-Checker Rule: The user who initiates a payout cannot approve or execute it. The system strictly blocks self-authorization.'
      },
      {
        id: 'blk_t2',
        type: 'checklist',
        content: 'Approval Verification Checklist:',
        checklistItems: [
          { id: 'ct_1', label: 'Verify vendor registered bank account matches historical Master Supplier record', checked: true, mandatory: true },
          { id: 'ct_2', label: 'Verify 3-way match: Purchase Order, Goods Receipt Note, and Supplier Invoice', checked: true, mandatory: true },
          { id: 'ct_3', label: 'Check cash flow forecast projection in Treasury before releasing batch', checked: true, mandatory: true }
        ]
      }
    ]
  }
];

export const INITIAL_PROJECT_TASKS: ProjectTask[] = [
  {
    id: 'task_001',
    title: 'Complete Month-End General Ledger Close (Q3)',
    description: 'Reconcile all bank feeds, depreciation schedules, and cross-branch inventory transfers.',
    assigneeId: 'usr_elena_rostova',
    assigneeName: 'Elena Rostova',
    assigneeRole: 'Finance Director',
    status: 'In Progress',
    priority: 'Urgent',
    dueDate: '2026-10-20',
    dependencies: [],
    branchId: 'branch_hq_lagos',
    moduleTag: 'Finance'
  },
  {
    id: 'task_002',
    title: 'Install Thermal Receipt Printer at Till 02',
    description: 'Configure ESC/POS direct IP driver (192.168.1.142) and test printed QR transaction codes.',
    assigneeId: 'usr_chioma_okonkwo',
    assigneeName: 'Chioma Okonkwo',
    assigneeRole: 'Staff Cashier',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2026-10-16',
    dependencies: [],
    branchId: 'branch_hq_lagos',
    moduleTag: 'Peripherals'
  },
  {
    id: 'task_003',
    title: 'Inspect 30-T Hauler Reg #KJA-904-XA Brakes',
    description: 'Pre-trip roadworthiness inspection and brake pad replacement before Lagos-Abuja haulage.',
    assigneeId: 'usr_tariq_mansoor',
    assigneeName: 'Tariq Mansoor',
    assigneeRole: 'Workshop Lead',
    status: 'Under Review',
    priority: 'High',
    dueDate: '2026-10-17',
    dependencies: [],
    branchId: 'branch_hq_lagos',
    moduleTag: 'Logistics',
    linkedRecordId: 'flt_001'
  },
  {
    id: 'task_004',
    title: 'Deploy FIRS E-Invoicing Real-Time Bridge',
    description: 'Validate cryptographic UBL-2.1 XML payload and sandbox signature verification.',
    assigneeId: 'usr_ade_babalola',
    assigneeName: 'Adekunle Babalola',
    assigneeRole: 'Super Admin',
    status: 'Backlog',
    priority: 'High',
    dueDate: '2026-10-25',
    dependencies: ['task_001'],
    branchId: 'branch_hq_lagos',
    moduleTag: 'Integrations'
  },
  {
    id: 'task_005',
    title: 'Quarterly Physical Stock Count in Warehouse 02',
    description: 'Execute cycle count on lubricants, OEM oil filters, and high-turnover fast consumables.',
    assigneeId: 'usr_chioma_okonkwo',
    assigneeName: 'Chioma Okonkwo',
    assigneeRole: 'Inventory Clerk',
    status: 'Completed',
    priority: 'Medium',
    dueDate: '2026-10-14',
    dependencies: [],
    branchId: 'branch_abuja',
    moduleTag: 'Inventory'
  }
];

export const INITIAL_CLOUD_INFRASTRUCTURE: CloudInfrastructureStatus = {
  hostingHealth: 'Operational',
  activeRegion: 'Europe-West (London Multi-AZ Cluster)',
  standbyRegion: 'US-East (Virginia Hot-Standby Replica)',
  p99LatencyMs: 18,
  activeConnections: 14,
  maxConnections: 100,
  uptime30Days: 99.98,
  currentVersion: 'v2026.10.4-LTS (Managed Enterprise)',
  lastSecurityPatch: '2026-10-14 (Zero-Day CVE mitigated · Kernel updated)',
  sslExpiry: '2027-10-14 (Strict TLS 1.3 · 4096-bit RSA)',
  activeVulnerabilities: 0,
  cpuUsagePercent: 24,
  memoryUsagePercent: 38,
  storageUsageGb: 14.2,
  maxStorageGb: 250
};

export const INITIAL_BACKUP_SNAPSHOTS: BackupSnapshot[] = [
  {
    id: 'snap_001',
    timestamp: '2026-10-15 08:00:00',
    type: 'Automated Hourly',
    sizeMb: 42.8,
    encryption: 'AES-256-GCM',
    status: 'Verified Healthy',
    checksumSha256: '9f83ab2049e88b...c38d92'
  },
  {
    id: 'snap_002',
    timestamp: '2026-10-15 00:00:00',
    type: 'Daily Snapshot',
    sizeMb: 42.1,
    encryption: 'AES-256-GCM',
    status: 'Verified Healthy',
    checksumSha256: 'a104c8f9410d02...71e40b'
  },
  {
    id: 'snap_003',
    timestamp: '2026-10-14 18:30:00',
    type: 'Manual Pre-Deployment',
    sizeMb: 41.6,
    encryption: 'AES-256-GCM',
    status: 'Verified Healthy',
    checksumSha256: '44de9910ab38cc...59b32a'
  }
];

export const INITIAL_DURABLE_JOBS: DurableQueueJob[] = [
  {
    id: 'job_881',
    jobName: 'GENERATE_E_INVOICE_XML_UBL21',
    queue: 'e_invoice_sync',
    status: 'Completed',
    attempts: 1,
    maxAttempts: 5,
    payloadSummary: 'Invoice INV-2026-001 ($4,520.00) signed and transmitted',
    createdAt: '2026-10-15 08:30',
    idempotencyKey: 'idemp_einv_inv_001'
  },
  {
    id: 'job_882',
    jobName: 'DISPATCH_WAYBILL_WEBHOOK',
    queue: 'webhook_dispatch',
    status: 'Completed',
    attempts: 1,
    maxAttempts: 5,
    payloadSummary: 'Trip TRIP-7701 e-POD status broadcast to consignee',
    createdAt: '2026-10-15 08:20',
    idempotencyKey: 'idemp_wh_trip_7701'
  },
  {
    id: 'job_883',
    jobName: 'SYNC_OFFLINE_SALES_QUEUE',
    queue: 'critical_transactions',
    status: 'Processing',
    attempts: 1,
    maxAttempts: 10,
    payloadSummary: 'Reconciliation of 3 queued offline cash till sales',
    createdAt: '2026-10-15 08:40',
    idempotencyKey: 'idemp_sync_till01_batch4'
  }
];

export const INITIAL_SERVICE_COMPONENTS: ServiceComponent[] = [
  {
    id: 'comp_1',
    name: 'ZEEX Core Ledger & High-Availability API',
    category: 'ZEEX Platform',
    status: 'Operational',
    latencyMs: 18,
    notes: '99.98% 30-day uptime. Active multi-AZ cluster.'
  },
  {
    id: 'comp_2',
    name: 'Real-time WebSocket & Collaboration Feed',
    category: 'ZEEX Platform',
    status: 'Operational',
    latencyMs: 12,
    notes: 'Sub-20ms message delivery across all active branch tabs.'
  },
  {
    id: 'comp_3',
    name: 'Automated Encrypted Backups & Disaster Recovery Engine',
    category: 'ZEEX Platform',
    status: 'Operational',
    latencyMs: 22,
    notes: 'RPO: < 5 min target. RTO: < 15 min restoration.'
  },
  {
    id: 'comp_4',
    name: 'External Card Payment Gateway (Stripe & Paystack)',
    category: 'External Payment Gateway',
    status: 'Operational',
    latencyMs: 140,
    notes: 'External provider operational. Direct webhook listener healthy.'
  },
  {
    id: 'comp_5',
    name: 'Local Branch ISP & Internet Gateway (Main Trunk)',
    category: 'Local Internet / Network',
    status: 'Operational',
    latencyMs: 8,
    notes: '100 Mbps fiber uplinks verified. Backup 4G LTE failover ready.'
  },
  {
    id: 'comp_6',
    name: 'Retail Hardware Peripherals (Printers & Scanners)',
    category: 'Local Peripherals',
    status: 'Operational',
    latencyMs: 4,
    notes: 'Till 01 printer online. Barcode scanner connected via USB-HID.'
  }
];

export const INITIAL_OFFLINE_CONFIG: OfflineConfig = {
  isSimulatedOffline: false,
  maxOfflineAmountLimit: 2500, // $2,500 max basket offline
  maxOfflineTransactionCount: 25,
  cachedPriceCatalogCount: 148,
  lastOnlineHeartbeat: '2026-10-15 08:45:00'
};

export const INITIAL_OFFLINE_QUEUE: OfflineQueueItem[] = [
  {
    id: 'off_001',
    type: 'POS_SALE',
    dataSummary: 'Sale: 2x Bosch Oil Filter + Castrol Edge 5W-40 (Cash: $148.00)',
    amount: 148.00,
    recordedAt: '2026-10-15 08:41:12',
    operatorName: 'Chioma Okonkwo',
    tillNumber: 'Till 01',
    status: 'Pending Sync'
  },
  {
    id: 'off_002',
    type: 'INVENTORY_RESERVATION',
    dataSummary: 'Reserved 4x Brake Rotor for Job Card #RO-8821',
    recordedAt: '2026-10-15 08:43:00',
    operatorName: 'Tariq Mansoor',
    tillNumber: 'Service Bay 02',
    status: 'Synced'
  }
];

export const INITIAL_PERIPHERAL_DEVICES: PeripheralDevice[] = [
  {
    id: 'dev_001',
    name: 'Honeywell Voyager 1400g Barcode Reader',
    type: 'Barcode Scanner',
    interfaceType: 'USB-HID',
    status: 'Connected',
    model: '1400g 2D Area-Imaging Scanner',
    connectionDetails: 'USB Port 3 / Keyboard Wedge (Emulated)',
    lastHeartbeat: '2026-10-15 08:44:10',
    diagnosticNotes: 'Scans EAN-13, UPC-A, and QR Code in < 50ms.'
  },
  {
    id: 'dev_002',
    name: 'Epson TM-T88VI Thermal Receipt Printer',
    type: 'Receipt Printer',
    interfaceType: 'Network IP',
    status: 'Connected',
    model: 'TM-T88VI High-Speed ESC/POS',
    connectionDetails: '192.168.1.140:9100 (Direct Socket)',
    lastHeartbeat: '2026-10-15 08:44:00',
    diagnosticNotes: 'Paper roll 85% full. Auto-cutter operational.'
  },
  {
    id: 'dev_003',
    name: 'Verifone P400 Smart POS Terminal',
    type: 'Payment Terminal',
    interfaceType: 'Cloud Agent',
    status: 'Connected',
    model: 'Verifone P400 / Cloud Pairing',
    connectionDetails: 'Terminal ID #TERM-9901 · SSL Encrypted',
    lastHeartbeat: '2026-10-15 08:43:55',
    diagnosticNotes: 'EMV Chip, Contactless NFC, and PIN pad verified.'
  },
  {
    id: 'dev_004',
    name: 'Avery Weigh-Tronix Industrial Axle Scale',
    type: 'Weighbridge',
    interfaceType: 'RS-232 Serial',
    status: 'Ready',
    model: 'BridgeMont BMS 60T Steel Deck',
    connectionDetails: 'COM3 (9600 Baud, 8-N-1) / Certified',
    lastHeartbeat: '2026-10-15 08:40:00',
    diagnosticNotes: 'Zero calibration valid. Certified tolerance +/- 0.05%.'
  },
  {
    id: 'dev_005',
    name: 'Zebra ZD421 Direct Thermal Label Printer',
    type: 'Label Printer',
    interfaceType: 'WebUSB',
    status: 'Ready',
    model: 'ZD421 203 DPI Barcode Label Printer',
    connectionDetails: 'WebUSB Direct Vendor ID: 0x0A5F',
    lastHeartbeat: '2026-10-15 08:35:00',
    diagnosticNotes: 'Loaded with 4"x6" Logistics Waybill Shipping labels.'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationApp[] = [
  {
    id: 'app_stripe',
    name: 'Stripe Global Payments',
    category: 'Payment',
    description: 'Accept credit cards, Apple Pay, and automated recurring billing across 135+ currencies.',
    provider: 'Stripe Inc.',
    status: 'Installed',
    sandboxMode: true,
    maskedApiKey: 'sk_test_••••••••••••••••9a21',
    scopes: ['charges:write', 'customers:read', 'refunds:write'],
    requestsThisMonth: 1420,
    monthlyQuota: 100000,
    lastSyncStatus: 'Healthy',
    lastSyncTimestamp: '2026-10-15 08:30:00'
  },
  {
    id: 'app_paystack',
    name: 'Paystack African Gateway',
    category: 'Payment',
    description: 'Accept local cards, direct bank accounts, USSD, and mobile money in NGN, GHS, KES, and ZAR.',
    provider: 'Paystack Payments Limited',
    status: 'Installed',
    sandboxMode: false,
    maskedApiKey: 'sk_live_••••••••••••••••41b8',
    scopes: ['transactions:read', 'transfers:write', 'charge:create'],
    requestsThisMonth: 3840,
    monthlyQuota: 500000,
    lastSyncStatus: 'Healthy',
    lastSyncTimestamp: '2026-10-15 08:42:00'
  },
  {
    id: 'app_firs_einv',
    name: 'FIRS Statutory E-Invoicing Bridge',
    category: 'E-Invoicing',
    description: 'Real-time cryptographic tax invoice reporting and QR verification compliant with regulatory tax standards.',
    provider: 'Federal Inland Revenue Service / TaxBridge',
    status: 'Installed',
    sandboxMode: true,
    maskedApiKey: 'tx_sec_••••••••••••••••83ff',
    scopes: ['einvoice:transmit', 'tax_qr:generate', 'audit_export:read'],
    requestsThisMonth: 412,
    monthlyQuota: 50000,
    lastSyncStatus: 'Healthy',
    lastSyncTimestamp: '2026-10-15 08:15:00'
  },
  {
    id: 'app_dhl',
    name: 'DHL Express Freight & Waybills',
    category: 'Logistics',
    description: 'Instant shipping label creation, international customs documentation, and automated e-POD track & trace.',
    provider: 'Deutsche Post DHL Group',
    status: 'Installed',
    sandboxMode: true,
    maskedApiKey: 'dhl_api_•••••••••••••••62aa',
    scopes: ['shipments:create', 'rates:read', 'tracking:read'],
    requestsThisMonth: 184,
    monthlyQuota: 20000,
    lastSyncStatus: 'Healthy',
    lastSyncTimestamp: '2026-10-15 07:50:00'
  },
  {
    id: 'app_whatsapp',
    name: 'WhatsApp Business Notifications',
    category: 'Messaging',
    description: 'Send automated invoice receipts, job card completion alerts, and waybill dispatch tracking links to customers.',
    provider: 'Meta Business API',
    status: 'Installed',
    sandboxMode: false,
    maskedApiKey: 'wa_token_••••••••••••••5190',
    scopes: ['messages:send', 'templates:read'],
    requestsThisMonth: 920,
    monthlyQuota: 50000,
    lastSyncStatus: 'Healthy',
    lastSyncTimestamp: '2026-10-15 08:44:00'
  },
  {
    id: 'app_quickbooks',
    name: 'QuickBooks Online Accounting Bridge',
    category: 'Accounting',
    description: 'Two-way synchronization of Chart of Accounts, supplier invoices, and reconciled bank feeds.',
    provider: 'Intuit Inc.',
    status: 'Available',
    sandboxMode: true,
    maskedApiKey: '',
    scopes: ['accounting:read_write'],
    requestsThisMonth: 0,
    monthlyQuota: 50000,
    lastSyncStatus: 'Healthy',
    lastSyncTimestamp: 'Never'
  }
];

export const INITIAL_READINESS_CHECKLIST: ReadinessChecklistItem[] = [
  {
    id: 'chk_bank',
    title: 'Configure Primary Operational Bank Account',
    description: 'At least one operating bank account is required for disbursements, customer receipts, and payroll posting.',
    module: 'Treasury & Ledger',
    isCompleted: true,
    priority: 'Critical',
    actionTab: 'treasury'
  },
  {
    id: 'chk_opening_stock',
    title: 'Import Opening Inventory & Set Reorder Levels',
    description: 'Upload product SKU catalog and verify current warehouse bin balances.',
    module: 'Inventory',
    isCompleted: true,
    priority: 'Critical',
    actionTab: 'inventory'
  },
  {
    id: 'chk_cashiers',
    title: 'Assign Cashiers to Retail Tills & Set Float Policy',
    description: 'Ensure staff cashiers have assigned till numbers and login credentials with POS isolation.',
    module: 'Retail & POS',
    isCompleted: true,
    priority: 'Critical',
    actionTab: 'security'
  },
  {
    id: 'chk_sod_rules',
    title: 'Verify Segregation of Duties & Maker-Checker Limits',
    description: 'Confirm that personnel approving payouts are distinct from the officers initiating wire requests.',
    module: 'Finance & Security',
    isCompleted: true,
    priority: 'Critical',
    actionTab: 'security'
  },
  {
    id: 'chk_peripherals',
    title: 'Test Barcode Scanner & Receipt Printer Connection',
    description: 'Run diagnostic test print and verify barcode scanner keyboard wedge input.',
    module: 'Peripherals',
    isCompleted: true,
    priority: 'Recommended',
    actionTab: 'peripherals'
  },
  {
    id: 'chk_offline_policy',
    title: 'Review Offline Till Sale Continuity Thresholds',
    description: 'Confirm max basket value ($2,500) and max offline transaction count (25) during connectivity drops.',
    module: 'Retail & POS',
    isCompleted: true,
    priority: 'Recommended',
    actionTab: 'offline'
  },
  {
    id: 'chk_tax_einvoice',
    title: 'Connect Regulatory E-Invoicing / Tax Bridge',
    description: 'Activate statutory sandbox credentials for real-time QR code generation on invoices.',
    module: 'Integrations',
    isCompleted: true,
    priority: 'Recommended',
    actionTab: 'integrations'
  }
];

// ============================================================================
// Connected Experience: Work & Connect Initial Datasets
// ============================================================================

export const INITIAL_AUTHORIZED_WORKSPACES: AuthorizedWorkspace[] = [
  {
    id: 'ws_apex_motors',
    name: 'Apex Motors & Engineering',
    code: 'APEX-AUTO',
    industry: 'Automotive & Workshop',
    industryId: 'automotive',
    city: 'Lagos',
    country: 'Nigeria',
    unreadCount: 3,
    avatarBg: 'bg-blue-600',
    isHeadquarters: true,
    currentRole: 'Super Admin'
  },
  {
    id: 'ws_apex_retail',
    name: 'Apex Superstores & POS',
    code: 'APEX-RETL',
    industry: 'Retail & Supermarket',
    industryId: 'retail',
    city: 'Abuja',
    country: 'Nigeria',
    unreadCount: 1,
    avatarBg: 'bg-emerald-600',
    isHeadquarters: false,
    currentRole: 'Branch Director'
  },
  {
    id: 'ws_north_freight',
    name: 'NorthLine Transit Logistics',
    code: 'NORTH-LOG',
    industry: 'Transport & Freight',
    industryId: 'logistics',
    city: 'Kano',
    country: 'Nigeria',
    unreadCount: 0,
    avatarBg: 'bg-amber-600',
    isHeadquarters: false,
    currentRole: 'Operations Controller'
  },
  {
    id: 'ws_greenvalley',
    name: 'GreenValley Agro Silos',
    code: 'GV-AGRO',
    industry: 'Agribusiness & Farm',
    industryId: 'agriculture',
    city: 'Kaduna',
    country: 'Nigeria',
    unreadCount: 0,
    avatarBg: 'bg-lime-600',
    isHeadquarters: false,
    currentRole: 'Chief Agronomist'
  },
  {
    id: 'ws_delta_energy',
    name: 'Delta Petroleum & Energy',
    code: 'DELTA-NRG',
    industry: 'Energy & Fuel Station',
    industryId: 'energy',
    city: 'Port Harcourt',
    country: 'Nigeria',
    unreadCount: 2,
    avatarBg: 'bg-purple-600',
    isHeadquarters: false,
    currentRole: 'Station Manager'
  },
  {
    id: 'ws_london_clearing',
    name: 'Apex Global Clearing UK',
    code: 'APEX-LON',
    industry: 'Legal & International Trade',
    industryId: 'legal',
    city: 'London',
    country: 'United Kingdom',
    unreadCount: 0,
    avatarBg: 'bg-slate-700',
    isHeadquarters: false,
    currentRole: 'Group Financial Auditor'
  }
];

export const INITIAL_CONNECT_MEETINGS: ConnectMeeting[] = [
  {
    id: 'meet_001',
    title: 'Daily Operations Sync & Shift Handover',
    description: 'Cross-branch review of workshop job cards, warehouse dispatch runs, and daily till balance verifications.',
    scheduledStartTime: '2026-10-18T09:00:00',
    durationMinutes: 30,
    hostId: 'usr_sarah_chen',
    hostName: 'Sarah Chen, FCA',
    hostRole: 'Group CFO / Super Admin',
    type: 'scheduled',
    status: 'Live',
    category: 'Internal Staff',
    meetingUrl: 'https://meet.zeex.cloud/apex/ops-daily-sync',
    waitingRoomEnabled: false,
    provider: 'ZEEX Cloud WebRTC',
    participants: [
      { userId: 'usr_sarah_chen', name: 'Sarah Chen, FCA', role: 'Super Admin', rsvp: 'Accepted', isHost: true, isMuted: false, hasVideo: true },
      { userId: 'usr_tariq_almansoor', name: 'Tariq Al-Mansoor', role: 'Finance Director', rsvp: 'Accepted', isMuted: true, hasVideo: true },
      { userId: 'usr_folake_adeleke', name: 'Barr. Folake Adeleke', role: 'Payroll Officer', rsvp: 'Accepted', isMuted: false, hasVideo: false },
      { userId: 'usr_haruna_bello', name: 'Dr. Haruna Bello', role: 'Chief Agronomist', rsvp: 'Accepted', isMuted: true, hasVideo: true }
    ],
    agendaItems: [
      { id: 'ag_1', title: 'Review Job Card RO-8821 engine parts reservation', completed: true, linkedTaskId: 'task_001' },
      { id: 'ag_2', title: 'Verify Till 02 thermal printer ESC/POS driver configuration', completed: false, linkedTaskId: 'task_002' },
      { id: 'ag_3', title: 'Disbursement dual-approval queue status in Treasury', completed: false }
    ],
    notes: 'Workshop bay 2 hydraulic pump calibration completed. Till 02 printer replacement active. Treasury dual authorization ready for review.',
    linkedRecord: {
      type: 'repair_order',
      id: 'ro_001',
      title: 'Job Card #RO-8821 (Toyota Land Cruiser)'
    },
    isRecording: false,
    recordingConsentAcknowledged: true
  },
  {
    id: 'meet_002',
    title: 'Q3 Financial Ledger Audit & Segregation Sign-Off',
    description: 'Statutory Maker-Checker balance sheet review with statutory external auditor.',
    scheduledStartTime: '2026-10-18T14:30:00',
    durationMinutes: 45,
    hostId: 'usr_tariq_almansoor',
    hostName: 'Tariq Al-Mansoor',
    hostRole: 'Finance Director',
    type: 'scheduled',
    status: 'Upcoming',
    category: 'Internal Staff',
    meetingUrl: 'https://meet.zeex.cloud/apex/finance-audit-q3',
    waitingRoomEnabled: true,
    provider: 'ZEEX Cloud WebRTC',
    participants: [
      { userId: 'usr_tariq_almansoor', name: 'Tariq Al-Mansoor', role: 'Finance Director', rsvp: 'Accepted', isHost: true },
      { userId: 'usr_sarah_chen', name: 'Sarah Chen, FCA', role: 'Super Admin', rsvp: 'Accepted' },
      { userId: 'usr_external_auditor', name: 'PwC Statutory Auditor', role: 'Auditor', rsvp: 'Tentative' }
    ],
    agendaItems: [
      { id: 'ag_f1', title: 'Reconciliation of $8,450 Bosch OEM Payout with bank feed', completed: false },
      { id: 'ag_f2', title: 'Segregation of duties log audit for payroll vs GL access', completed: false }
    ],
    notes: 'Ensure all Maker-Checker cryptographic signatures are exported.',
    linkedRecord: {
      type: 'payout',
      id: 'payout_001',
      title: 'Payout #PAY-2026-001 ($8,450.00)'
    },
    isRecording: false,
    recordingConsentAcknowledged: false
  },
  {
    id: 'meet_003',
    title: 'Instant Technician Bay Coordination',
    description: 'Ad-hoc video call for bay 03 transmission lift diagnostic review.',
    scheduledStartTime: '2026-10-18T11:15:00',
    durationMinutes: 20,
    hostId: 'usr_tariq_almansoor',
    hostName: 'Tariq Al-Mansoor',
    hostRole: 'Workshop Lead',
    type: 'instant',
    status: 'Upcoming',
    category: 'Operational Review',
    meetingUrl: 'https://meet.zeex.cloud/apex/bay-instant-3',
    waitingRoomEnabled: false,
    provider: 'ZEEX Cloud WebRTC',
    participants: [
      { userId: 'usr_tariq_almansoor', name: 'Tariq Al-Mansoor', role: 'Workshop Lead', rsvp: 'Accepted', isHost: true },
      { userId: 'usr_sarah_chen', name: 'Sarah Chen, FCA', role: 'Super Admin', rsvp: 'Pending' }
    ],
    agendaItems: [
      { id: 'ag_inst_1', title: 'Inspect transmission valve body fluid leak via camera', completed: false }
    ],
    notes: 'Camera feed inspection of hydraulic seal.',
    isRecording: false,
    recordingConsentAcknowledged: true
  }
];

export const INITIAL_CONNECT_CALENDAR_EVENTS: ConnectCalendarEvent[] = [
  {
    id: 'cal_001',
    title: 'Daily Operations Standup & Shift Handover',
    description: 'Mandatory sync for branch managers, workshop leads, and treasury.',
    startDate: '2026-10-18T09:00:00',
    endDate: '2026-10-18T09:30:00',
    category: 'internal_staff',
    scope: 'team',
    privacy: 'team_only',
    organizerId: 'usr_sarah_chen',
    organizerName: 'Sarah Chen, FCA',
    attendees: ['usr_sarah_chen', 'usr_tariq_almansoor', 'usr_folake_adeleke', 'usr_haruna_bello'],
    branchId: 'branch_hq_lagos',
    department: 'Operations',
    locationOrRoom: 'Conference Room Alpha / Virtual WebRTC',
    rsvpStatus: {
      usr_sarah_chen: 'Accepted',
      usr_tariq_almansoor: 'Accepted',
      usr_folake_adeleke: 'Accepted'
    },
    meetingId: 'meet_001'
  },
  {
    id: 'cal_002',
    title: 'VIP Fleet Service Intake - DHL Express Van #54',
    description: 'Scheduled preventive brake rotor replacement and multipoint scan.',
    startDate: '2026-10-18T10:30:00',
    endDate: '2026-10-18T12:00:00',
    category: 'customer_appointment',
    scope: 'branch',
    privacy: 'public',
    organizerId: 'usr_tariq_almansoor',
    organizerName: 'Tariq Al-Mansoor',
    attendees: ['usr_tariq_almansoor'],
    branchId: 'branch_hq_lagos',
    department: 'Workshop',
    locationOrRoom: 'Service Bay 02',
    rsvpStatus: {
      usr_tariq_almansoor: 'Accepted'
    },
    linkedRecord: {
      type: 'repair_order',
      id: 'ro_001',
      title: 'Job Card #RO-8821'
    }
  },
  {
    id: 'cal_003',
    title: 'Workshop Bay 01 Hydraulic Lift Calibration & Safety Test',
    description: 'Quarterly statutory certification of heavy vehicle hydraulic lifts.',
    startDate: '2026-10-18T13:00:00',
    endDate: '2026-10-18T14:15:00',
    category: 'operational_booking',
    scope: 'branch',
    privacy: 'public',
    organizerId: 'usr_tariq_almansoor',
    organizerName: 'Tariq Al-Mansoor',
    attendees: ['usr_tariq_almansoor', 'usr_sarah_chen'],
    branchId: 'branch_hq_lagos',
    locationOrRoom: 'Bay 01 Heavy Lift Facility',
    rsvpStatus: {
      usr_tariq_almansoor: 'Accepted',
      usr_sarah_chen: 'Accepted'
    }
  },
  {
    id: 'cal_004',
    title: 'Confidential Staff Performance Review (HR Strictly Segregated)',
    description: 'Confidential HR compensation review. Access isolated by strict RBAC.',
    startDate: '2026-10-18T15:00:00',
    endDate: '2026-10-18T15:45:00',
    category: 'internal_staff',
    scope: 'personal',
    privacy: 'confidential_restricted',
    organizerId: 'usr_folake_adeleke',
    organizerName: 'Barr. Folake Adeleke',
    attendees: ['usr_folake_adeleke', 'usr_sarah_chen'],
    department: 'People & Payroll',
    locationOrRoom: 'HR Private Room 3B',
    rsvpStatus: {
      usr_folake_adeleke: 'Accepted',
      usr_sarah_chen: 'Accepted'
    }
  },
  {
    id: 'cal_005',
    title: 'Team Achievement & Innovation Social Hour',
    description: 'Optional staff gathering celebrating successful rollout of ZEEX 2.0.',
    startDate: '2026-10-18T16:30:00',
    endDate: '2026-10-18T17:30:00',
    category: 'social_event',
    scope: 'personal',
    privacy: 'public',
    organizerId: 'usr_folake_adeleke',
    organizerName: 'Barr. Folake Adeleke',
    attendees: ['usr_sarah_chen', 'usr_tariq_almansoor', 'usr_folake_adeleke'],
    locationOrRoom: 'Lagos Rooftop Lounge & Virtual Link',
    rsvpStatus: {
      usr_sarah_chen: 'Accepted',
      usr_folake_adeleke: 'Accepted'
    }
  }
];

export const INITIAL_CONNECT_ANNOUNCEMENTS: ConnectAnnouncement[] = [
  {
    id: 'anc_001',
    title: 'Mandatory Policy: Segregation of Duties & Dual-Control Disbursement Sign-Off',
    content: 'Pursuant to group financial governance standards, all payments exceeding $1,000 must strictly adhere to the Maker-Checker protocol. Staff initiating bank transfers may not execute or authorize their own requests. Please read the full policy in the SOP library and acknowledge receipt below.',
    authorId: 'usr_sarah_chen',
    authorName: 'Sarah Chen, FCA',
    authorRole: 'Group CFO / Super Admin',
    publishDate: '2026-10-17',
    expiryDate: '2026-11-30',
    category: 'Policy Change',
    priority: 'Urgent',
    targetAudience: 'All Company',
    requiresAcknowledgment: true,
    acknowledgments: [
      { userId: 'usr_tariq_almansoor', userName: 'Tariq Al-Mansoor', userRole: 'Finance Director', timestamp: '2026-10-17 14:22:00' },
      { userId: 'usr_folake_adeleke', userName: 'Barr. Folake Adeleke', userRole: 'Payroll Officer', timestamp: '2026-10-17 16:05:00' }
    ],
    readCount: 14,
    allowComments: true,
    commentsCount: 3
  },
  {
    id: 'anc_002',
    title: 'Operational Rollout: Thermal ESC/POS Receipt Printers & Zero-Drop Offline Mode',
    content: 'We have updated all retail and workshop register stations with automatic offline fallback caching. During internet outages, cash and authorized offline card sales will be buffered locally in encrypted browser storage (IndexedDB) up to $2,500 and synced seamlessly once reconnecting.',
    authorId: 'usr_tariq_almansoor',
    authorName: 'Tariq Al-Mansoor',
    authorRole: 'Finance Director',
    publishDate: '2026-10-16',
    category: 'Branch Notice',
    priority: 'Standard',
    targetAudience: 'All Company',
    requiresAcknowledgment: false,
    acknowledgments: [],
    readCount: 19,
    allowComments: true,
    commentsCount: 5
  },
  {
    id: 'anc_003',
    title: 'Staff Introduction: Welcoming New Workshop Technicians to Victoria Island Hub',
    content: 'Please join us in welcoming Chinedu Eze and Amina Yusuf to the Automotive & Mechanical Engineering team! They bring over 8 years of European and Japanese diesel diagnostics expertise.',
    authorId: 'usr_folake_adeleke',
    authorName: 'Barr. Folake Adeleke',
    authorRole: 'People & Statutory Compensation Lead',
    publishDate: '2026-10-15',
    category: 'Staff Introduction',
    priority: 'Info',
    targetAudience: 'Branch',
    targetBranchId: 'branch_hq_lagos',
    requiresAcknowledgment: false,
    acknowledgments: [],
    readCount: 22,
    allowComments: true,
    commentsCount: 8
  }
];

export const INITIAL_CONNECT_ACTIVITIES: ConnectActivity[] = [
  {
    id: 'act_001',
    title: 'Q3 Group Achievement & Excellence Celebration',
    description: 'Celebrating 99.98% platform uptime, zero financial audit discrepancies, and record workshop customer satisfaction ratings.',
    date: '2026-10-24',
    time: '16:00 - 18:00',
    location: 'Victoria Island Terrace & Connected Remote Stream',
    type: 'Team Celebration',
    organizer: 'People & Culture Committee',
    attendeesCount: 18,
    isOptIn: true,
    respectfulPreferencesNotice: 'Attendance is completely voluntary. Dietary choices (Halal, Vegetarian, Vegan) and quiet space provided.',
    isAttending: true
  },
  {
    id: 'act_002',
    title: 'Interactive Peripheral Diagnostics & Safety Masterclass',
    description: 'Hands-on practical session covering thermal receipt printer maintenance, Bluetooth barcode scanner pairing, and weighbridge calibration.',
    date: '2026-10-21',
    time: '10:00 - 11:30',
    location: 'Tech Training Bay 2 / Hybrid',
    type: 'Training Session',
    organizer: 'Systems Engineering Team',
    attendeesCount: 12,
    isOptIn: true,
    respectfulPreferencesNotice: 'Recorded for asynchronous review by shift workers.',
    isAttending: true
  },
  {
    id: 'act_003',
    title: 'Friday Informal Coffee & Tech Innovation Talk',
    description: 'Casual open mic to share ideas on workflow automation, AI Studio integration, and workspace productivity hacks.',
    date: '2026-10-23',
    time: '15:30 - 16:30',
    location: 'Open Lounge Lagos & Connect Voice Room',
    type: 'Social Gathering',
    organizer: 'Cross-functional Staff Group',
    attendeesCount: 9,
    isOptIn: true,
    respectfulPreferencesNotice: 'No work agenda. Drop in and out whenever your schedule allows.',
    isAttending: false
  }
];

export const INITIAL_ONBOARDING_TASKS: OnboardingTask[] = [
  {
    id: 'onb_001',
    title: 'Welcome to ZEEX Commerce & Group Introduction',
    description: 'Read the executive welcome letter from CFO Sarah Chen and review the company directory.',
    category: 'Welcome',
    isCompleted: true,
    completedAt: '2026-10-15 08:00',
    mandatory: true,
    actionLabel: 'View Directory',
    actionTab: 'people'
  },
  {
    id: 'onb_002',
    title: 'Verify Hardware Passkey / WebAuthn MFA & PIN',
    description: 'Ensure your staff credentials have biometric FIDO2 passkey or hardware security key active for high-value actions.',
    category: 'Security & Policies',
    isCompleted: true,
    completedAt: '2026-10-15 08:30',
    mandatory: true,
    actionLabel: 'Security Settings',
    actionTab: 'security'
  },
  {
    id: 'onb_003',
    title: 'Acknowledge Segregation of Duties & Anti-Fraud Policy',
    description: 'Review statutory double-entry accounting controls and dual-control disbursement guidelines.',
    category: 'Security & Policies',
    isCompleted: false,
    mandatory: true,
    actionLabel: 'Read Announcement',
    actionTab: 'announcements'
  },
  {
    id: 'onb_004',
    title: 'Device & Peripheral Connectivity Test',
    description: 'Run diagnostic health check for your assigned receipt printer, barcode reader, and payment terminal.',
    category: 'Devices',
    isCompleted: true,
    completedAt: '2026-10-15 09:15',
    mandatory: false,
    actionLabel: 'Peripherals Hub',
    actionTab: 'peripherals'
  },
  {
    id: 'onb_005',
    title: 'Review Operating SOPs & Checklists in Notion Hub',
    description: 'Familiarize yourself with your department standard operating procedures (e.g. Till float reconciliation, Job Card SOP).',
    category: 'Training',
    isCompleted: false,
    mandatory: true,
    actionLabel: 'Open Knowledge Hub',
    actionTab: 'knowledge'
  },
  {
    id: 'onb_006',
    title: 'Introduce Yourself in #general-announcements',
    description: 'Post a quick hello to the team in the company-wide operating channel.',
    category: 'Team Introductions',
    isCompleted: true,
    completedAt: '2026-10-15 09:45',
    mandatory: false,
    actionLabel: 'Open Channels',
    actionTab: 'channels'
  }
];

export const INITIAL_OFFBOARDING_RECORDS: OffboardingRecord[] = [
  {
    id: 'offb_001',
    staffId: 'usr_former_tech',
    staffName: 'Kwame Mensah',
    staffRole: 'Junior Workshop Technician',
    department: 'Automotive & Workshop',
    departureDate: '2026-10-31',
    status: 'In Progress',
    accessRevoked: true,
    sessionsTerminated: true,
    peripheralsReleased: true,
    taskHandoffDesignee: 'Tariq Al-Mansoor',
    channelHandoffDesignee: 'Sarah Chen, FCA',
    handoverPackageExported: false,
    notes: 'Access keys terminated. Tool crib barcode scanner unlinked. 2 active job card tickets reassigned to Tariq.'
  }
];

export const INITIAL_CONNECTED_NOTIFICATIONS: ConnectedNotification[] = [
  {
    id: 'notif_001',
    title: 'Dual Approval Required: Payout #PAY-2026-001',
    description: 'Elena Rostova initiated wire payout of $8,450.00 to Bosch OEM. Secondary authorization needed.',
    timestamp: '10m ago',
    type: 'approval',
    area: 'work',
    isRead: false,
    targetTab: 'treasury',
    linkedRecord: {
      type: 'payout',
      id: 'payout_001',
      title: 'Payout #PAY-2026-001 ($8,450.00)'
    }
  },
  {
    id: 'notif_002',
    title: 'Mentioned by Tariq Mansoor in #dept-workshop-service',
    description: '@Sarah Chen we need authorization to issue OEM Ignition Coils for Job Card #RO-8821.',
    timestamp: '25m ago',
    type: 'mention',
    area: 'connect',
    isRead: false,
    targetTab: 'channels',
    linkedRecord: {
      type: 'repair_order',
      id: 'ro_001',
      title: 'Job Card #RO-8821'
    }
  },
  {
    id: 'notif_003',
    title: 'Meeting in 15 Minutes: Daily Operations Sync',
    description: 'Scheduled video sync starting at 09:00 AM on ZEEX Cloud WebRTC.',
    timestamp: '40m ago',
    type: 'meeting',
    area: 'connect',
    isRead: false,
    targetTab: 'meetings'
  },
  {
    id: 'notif_004',
    title: 'Policy Acknowledgment Required',
    description: 'Mandatory Policy: Segregation of Duties & Dual-Control Disbursement Sign-Off.',
    timestamp: '1h ago',
    type: 'announcement',
    area: 'connect',
    isRead: true,
    targetTab: 'announcements'
  },
  {
    id: 'notif_005',
    title: 'Low Stock Alert: Spark Plugs (Warehouse 01)',
    description: 'Stock quantity dropped below reorder threshold (12 units remaining).',
    timestamp: '2h ago',
    type: 'reminder',
    area: 'work',
    isRead: true,
    targetTab: 'inventory'
  }
];


