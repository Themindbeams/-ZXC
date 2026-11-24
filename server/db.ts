import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  Tenant,
  LegalEntity,
  BranchSite,
  Department,
  WarehouseLocation,
  OperatingUnit,
  UserAccount,
  RoleAssignment,
  SessionToken,
  AuditRecord,
  FiscalPeriod,
  ChartOfAccount,
  JournalEntry,
  BankAccountRecord,
  PayoutAuthorizationRule,
  PayoutDisbursement,
  RetailProduct,
  PurchaseOrderRecord,
  GoodsReceiptRecord,
  POSTillShift,
  POSSaleTransaction,
  RetailReturnRecord,
  VehicleRecord,
  AutomotiveJobCard,
  FarmPlotRecord,
  CropSeasonCycle,
  WeighbridgeIntakeTicket,
  AgribusinessProcessingBatch,
  AgribusinessProduceSale,
  AquacultureTankRecord,
  FreightVehicleRecord,
  FreightDispatchTrip,
  PassengerRouteTrip,
  FuelStationTank,
  FuelPumpShiftRecord,
  EmployeeProfile,
  ConfidentialCompensation,
  PayrollRunBatch
} from './types';

// Persistent data structure
export interface DatabaseSchema {
  tenants: Tenant[];
  legalEntities: LegalEntity[];
  branches: BranchSite[];
  departments: Department[];
  warehouseLocations: WarehouseLocation[];
  operatingUnits: OperatingUnit[];
  users: UserAccount[];
  roleAssignments: RoleAssignment[];
  sessions: SessionToken[];
  auditRecords: AuditRecord[];
  fiscalPeriods: FiscalPeriod[];
  accounts: ChartOfAccount[];
  journalEntries: JournalEntry[];
  bankAccounts: BankAccountRecord[];
  payoutRules: PayoutAuthorizationRule[];
  payouts: PayoutDisbursement[];
  retailProducts: RetailProduct[];
  purchaseOrders: PurchaseOrderRecord[];
  goodsReceipts: GoodsReceiptRecord[];
  posShifts: POSTillShift[];
  posTransactions: POSSaleTransaction[];
  retailReturns: RetailReturnRecord[];
  vehicles: VehicleRecord[];
  jobCards: AutomotiveJobCard[];
  farmPlots: FarmPlotRecord[];
  cropCycles: CropSeasonCycle[];
  weighbridgeTickets: WeighbridgeIntakeTicket[];
  processingBatches: AgribusinessProcessingBatch[];
  produceSales: AgribusinessProduceSale[];
  aquacultureTanks: AquacultureTankRecord[];
  freightVehicles: FreightVehicleRecord[];
  freightTrips: FreightDispatchTrip[];
  passengerTrips: PassengerRouteTrip[];
  fuelTanks: FuelStationTank[];
  fuelPumpShifts: FuelPumpShiftRecord[];
  employees: EmployeeProfile[];
  compensations: ConfidentialCompensation[];
  payrollRuns: PayrollRunBatch[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'zeex_database.json');

// Scrypt password hashing
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const key = crypto.scryptSync(password, salt, 64);
    const hashBuffer = Buffer.from(hash, 'hex');
    return crypto.timingSafeEqual(key, hashBuffer);
  } catch {
    return false;
  }
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Failed reading existing database file, reseeding:', err);
      }
    }

    const seeded = this.generateSeedData();
    this.saveDirect(seeded);
    return seeded;
  }

  private saveDirect(dataToSave: DatabaseSchema) {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public save() {
    this.saveDirect(this.data);
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public resetToSeed(): DatabaseSchema {
    this.data = this.generateSeedData();
    this.save();
    return this.data;
  }

  private generateSeedData(): DatabaseSchema {
    const defaultPassword = 'Password123!';
    const { hash: pHash, salt: pSalt } = hashPassword(defaultPassword);

    // Primary Tenant
    const tenantApex: Tenant = {
      id: 'tenant_apex',
      name: 'Apex Horizon Enterprises Group',
      slug: 'apex-horizon',
      createdAt: '2026-01-10T00:00:00Z',
      status: 'Active',
      activeModules: [
        'organization',
        'accounting',
        'treasury',
        'payroll',
        'hr',
        'retail',
        'automotive',
        'agribusiness',
        'logistics',
        'fuel',
        'inventory',
        'procurement',
        'customization',
        'audit'
      ],
      demoMode: false // Real operational tenant
    };

    // Second Tenant for cross-tenant isolation verification!
    const tenantSolaris: Tenant = {
      id: 'tenant_solaris',
      name: 'Solaris Global Trading Ltd',
      slug: 'solaris-global',
      createdAt: '2026-02-01T00:00:00Z',
      status: 'Active',
      activeModules: ['organization', 'accounting', 'retail', 'inventory'],
      demoMode: true
    };

    // Legal Entities
    const entityApexNG: LegalEntity = {
      id: 'entity_apex_ng',
      tenantId: 'tenant_apex',
      legalName: 'Apex Commercial Services Nigeria Ltd',
      tradeName: 'Apex Commerce NG',
      registrationNumber: 'RC-1849204',
      taxIdentificationNumber: 'TIN-9840281-001',
      country: 'Nigeria',
      functionalCurrency: 'NGN',
      createdAt: '2026-01-10T00:00:00Z'
    };

    const entityApexUK: LegalEntity = {
      id: 'entity_apex_uk',
      tenantId: 'tenant_apex',
      legalName: 'Apex Trade International UK Ltd',
      tradeName: 'Apex International',
      registrationNumber: 'UK-12940291',
      taxIdentificationNumber: 'GB-99201928',
      country: 'United Kingdom',
      functionalCurrency: 'GBP',
      createdAt: '2026-01-15T00:00:00Z'
    };

    const entitySolarisNG: LegalEntity = {
      id: 'entity_solaris_ng',
      tenantId: 'tenant_solaris',
      legalName: 'Solaris West Africa Ltd',
      tradeName: 'Solaris West Africa',
      registrationNumber: 'RC-2938102',
      taxIdentificationNumber: 'TIN-7728192-002',
      country: 'Nigeria',
      functionalCurrency: 'NGN',
      createdAt: '2026-02-01T00:00:00Z'
    };

    // Branches
    const branchVI: BranchSite = {
      id: 'branch_vi',
      tenantId: 'tenant_apex',
      legalEntityId: 'entity_apex_ng',
      name: 'Victoria Island Central Hub',
      code: 'VI-01',
      city: 'Lagos',
      country: 'Nigeria',
      operatingCurrency: 'NGN',
      isHeadquarters: true,
      status: 'Active'
    };

    const branchABJ: BranchSite = {
      id: 'branch_abj',
      tenantId: 'tenant_apex',
      legalEntityId: 'entity_apex_ng',
      name: 'Central Business District Branch',
      code: 'ABJ-02',
      city: 'Abuja',
      country: 'Nigeria',
      operatingCurrency: 'NGN',
      isHeadquarters: false,
      status: 'Active'
    };

    const branchLON: BranchSite = {
      id: 'branch_lon',
      tenantId: 'tenant_apex',
      legalEntityId: 'entity_apex_uk',
      name: 'Canary Wharf Trade Office',
      code: 'LON-03',
      city: 'London',
      country: 'United Kingdom',
      operatingCurrency: 'GBP',
      isHeadquarters: false,
      status: 'Active'
    };

    const branchSolarisIkeja: BranchSite = {
      id: 'branch_solaris_ikeja',
      tenantId: 'tenant_solaris',
      legalEntityId: 'entity_solaris_ng',
      name: 'Ikeja Depot Branch',
      code: 'SOL-IKJ',
      city: 'Lagos',
      country: 'Nigeria',
      operatingCurrency: 'NGN',
      isHeadquarters: true,
      status: 'Active'
    };

    // Departments
    const departments: Department[] = [
      { id: 'dept_exec', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', name: 'Executive Leadership', code: 'EXEC' },
      { id: 'dept_fin', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', name: 'Finance & Accounts', code: 'FIN' },
      { id: 'dept_hr', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', name: 'People & Compensation', code: 'HR' },
      { id: 'dept_retail', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', name: 'Retail Storefront', code: 'RET' },
      { id: 'dept_workshop', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', name: 'Automotive Engineering', code: 'AUTO' },
      { id: 'dept_agri', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', name: 'Commercial Agriculture', code: 'AGRI' },
      { id: 'dept_logistics', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', name: 'Fleet Logistics', code: 'LOG' },
      { id: 'dept_fuel', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', name: 'Energy & Fuel Operations', code: 'FUEL' }
    ];

    // Warehouses & Stock Locations
    const warehouseLocations: WarehouseLocation[] = [
      { id: 'loc_vi_store', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', code: 'VI-STORE', name: 'VI Retail Front Counter', type: 'Storefront' },
      { id: 'loc_vi_wh', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', code: 'VI-MAIN-WH', name: 'VI Central Warehouse', type: 'Warehouse' },
      { id: 'loc_workshop_bay', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', code: 'AUTO-BAY-01', name: 'Workshop Fast Spares Bay', type: 'ServiceBay' },
      { id: 'loc_kaduna_silo', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_abj', code: 'SILO-02', name: 'Kaduna Grain Depot Silo 02', type: 'Silo' },
      { id: 'loc_abj_wh', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_abj', code: 'ABJ-WH-01', name: 'Abuja Regional Depot', type: 'Depot' },
      { id: 'loc_solaris_wh', tenantId: 'tenant_solaris', legalEntityId: 'entity_solaris_ng', branchId: 'branch_solaris_ikeja', code: 'SOL-WH-01', name: 'Solaris Ikeja Depot', type: 'Warehouse' }
    ];

    // Operating Units
    const operatingUnits: OperatingUnit[] = [
      { id: 'unit_till_01', tenantId: 'tenant_apex', branchId: 'branch_vi', type: 'Till', code: 'TILL-01', name: 'Storefront Main POS Register', status: 'Available' },
      { id: 'unit_till_02', tenantId: 'tenant_apex', branchId: 'branch_vi', type: 'Till', code: 'TILL-02', name: 'Customer Express Register', status: 'Available' },
      { id: 'unit_bay_01', tenantId: 'tenant_apex', branchId: 'branch_vi', type: 'ServiceBay', code: 'BAY-01', name: 'Hydraulic Lift Bay 01', status: 'Active' },
      { id: 'unit_bay_02', tenantId: 'tenant_apex', branchId: 'branch_vi', type: 'ServiceBay', code: 'BAY-02', name: 'Diagnostic & Electric Bay 02', status: 'Available' },
      { id: 'unit_plot_alpha', tenantId: 'tenant_apex', branchId: 'branch_abj', type: 'FarmPlot', code: 'PLOT-ALPHA', name: 'Commercial Plot Block Alpha (50 Ha)', status: 'Active' },
      { id: 'unit_plot_beta', tenantId: 'tenant_apex', branchId: 'branch_abj', type: 'FarmPlot', code: 'PLOT-BETA', name: 'Irrigated Soya Block Beta (75 Ha)', status: 'Active' },
      { id: 'unit_truck_01', tenantId: 'tenant_apex', branchId: 'branch_vi', type: 'FleetVehicle', code: 'TRK-30T-01', name: 'Mack 30T Heavy Hauler (LND-482-XA)', status: 'Active' },
      { id: 'unit_truck_02', tenantId: 'tenant_apex', branchId: 'branch_vi', type: 'FleetVehicle', code: 'TRK-10T-02', name: 'Mercedes 10T Refrigerated Van (ABC-912-LG)', status: 'Available' },
      { id: 'unit_pump_01', tenantId: 'tenant_apex', branchId: 'branch_abj', type: 'FuelPump', code: 'PUMP-ISLAND-01', name: 'Dual Nozzle Island 01 (PMS/AGO)', status: 'Active' }
    ];

    // Users with hashed passwords
    const users: UserAccount[] = [
      {
        id: 'usr_sarah',
        tenantId: 'tenant_apex',
        username: 'sarah.director',
        email: 'sarah.chen@apexhorizon.com',
        fullName: 'Sarah Chen, FCA',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'Executive Leadership',
        status: 'Active',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        createdAt: '2026-01-10T00:00:00Z'
      },
      {
        id: 'usr_tariq',
        tenantId: 'tenant_apex',
        username: 'tariq.cfo',
        email: 'tariq.mansoor@apexhorizon.com',
        fullName: 'Tariq Al-Mansoor',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'Finance & Accounts',
        status: 'Active',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        createdAt: '2026-01-10T00:00:00Z'
      },
      {
        id: 'usr_folake',
        tenantId: 'tenant_apex',
        username: 'folake.payroll',
        email: 'folake.adeleke@apexhorizon.com',
        fullName: 'Barr. Folake Adeleke',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'People & Compensation',
        status: 'Active',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        createdAt: '2026-01-12T00:00:00Z'
      },
      {
        id: 'usr_chioma',
        tenantId: 'tenant_apex',
        username: 'chioma.cashier',
        email: 'chioma.okonkwo@apexhorizon.com',
        fullName: 'Chioma Okonkwo',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'Retail Storefront',
        status: 'Active',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: '2026-01-15T00:00:00Z'
      },
      {
        id: 'usr_ade',
        tenantId: 'tenant_apex',
        username: 'ade.technician',
        email: 'ade.babalola@apexhorizon.com',
        fullName: 'Adekunle Babalola',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'Automotive Engineering',
        status: 'Active',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: '2026-01-15T00:00:00Z'
      },
      {
        id: 'usr_ibrahim',
        tenantId: 'tenant_apex',
        username: 'ibrahim.dispatcher',
        email: 'ibrahim.garba@apexhorizon.com',
        fullName: 'Mallam Ibrahim Garba',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'Fleet Logistics',
        status: 'Active',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: '2026-01-15T00:00:00Z'
      },
      {
        id: 'usr_haruna',
        tenantId: 'tenant_apex',
        username: 'haruna.agronomist',
        email: 'haruna.bello@apexhorizon.com',
        fullName: 'Dr. Haruna Bello',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'Commercial Agriculture',
        status: 'Active',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: '2026-01-15T00:00:00Z'
      },
      {
        id: 'usr_amina',
        tenantId: 'tenant_apex',
        username: 'amina.branchmanager',
        email: 'amina.sanusi@apexhorizon.com',
        fullName: 'Hajia Amina Sanusi',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'Management',
        status: 'Active',
        mfaEnabled: true,
        failedLoginAttempts: 0,
        createdAt: '2026-01-15T00:00:00Z'
      },
      // Solaris User for testing cross-tenant isolation
      {
        id: 'usr_solaris_admin',
        tenantId: 'tenant_solaris',
        username: 'solaris.admin',
        email: 'admin@solarisglobal.com',
        fullName: 'Marcus Vance',
        passwordHash: pHash,
        salt: pSalt,
        primaryDepartment: 'Executive',
        status: 'Active',
        mfaEnabled: false,
        failedLoginAttempts: 0,
        createdAt: '2026-02-01T00:00:00Z'
      }
    ];

    // Scoped Role Assignments
    const roleAssignments: RoleAssignment[] = [
      // Sarah has OwnerDirector across all branches
      { id: 'ra_sarah', userId: 'usr_sarah', tenantId: 'tenant_apex', role: 'OwnerDirector', grantedBy: 'SYSTEM', grantedAt: '2026-01-10T00:00:00Z' },
      // Tariq is Accountant (Finance Director) — note: NO payroll view right!
      { id: 'ra_tariq', userId: 'usr_tariq', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', role: 'Accountant', grantedBy: 'usr_sarah', grantedAt: '2026-01-10T00:00:00Z' },
      // Folake is Payroll Officer — can see payroll, but cannot modify General Ledger directly
      { id: 'ra_folake', userId: 'usr_folake', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', role: 'PayrollOfficer', grantedBy: 'usr_sarah', grantedAt: '2026-01-12T00:00:00Z' },
      // Chioma is Cashier restricted to Victoria Island Till
      { id: 'ra_chioma', userId: 'usr_chioma', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', role: 'Cashier', grantedBy: 'usr_sarah', grantedAt: '2026-01-15T00:00:00Z' },
      // Ade is Technician in VI Workshop Bay
      { id: 'ra_ade', userId: 'usr_ade', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', role: 'Technician', grantedBy: 'usr_sarah', grantedAt: '2026-01-15T00:00:00Z' },
      // Ibrahim is Dispatcher
      { id: 'ra_ibrahim', userId: 'usr_ibrahim', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', role: 'Dispatcher', grantedBy: 'usr_sarah', grantedAt: '2026-01-15T00:00:00Z' },
      // Haruna is Agronomist
      { id: 'ra_haruna', userId: 'usr_haruna', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_abj', role: 'BranchManager', grantedBy: 'usr_sarah', grantedAt: '2026-01-15T00:00:00Z' },
      // Amina is Branch Manager of Abuja
      { id: 'ra_amina', userId: 'usr_amina', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_abj', role: 'BranchManager', grantedBy: 'usr_sarah', grantedAt: '2026-01-15T00:00:00Z' },
      // Solaris Admin
      { id: 'ra_solaris', userId: 'usr_solaris_admin', tenantId: 'tenant_solaris', role: 'OrgAdmin', grantedBy: 'SYSTEM', grantedAt: '2026-02-01T00:00:00Z' }
    ];

    // Fiscal Periods (2026-Q3 Locked, 2026-Q4 Open)
    const fiscalPeriods: FiscalPeriod[] = [
      {
        id: 'fp_2026_q3',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        periodName: '2026-Q3 (Jul - Sep)',
        startDate: '2026-07-01',
        endDate: '2026-09-30',
        isLocked: true,
        lockedAt: '2026-10-01T00:00:00Z',
        lockedBy: 'usr_sarah'
      },
      {
        id: 'fp_2026_q4',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        periodName: '2026-Q4 (Oct - Dec)',
        startDate: '2026-10-01',
        endDate: '2026-12-31',
        isLocked: false
      }
    ];

    // Chart of Accounts (in minor units: e.g. 10,000,000 = $100,000.00)
    const accounts: ChartOfAccount[] = [
      { id: 'coa_1010', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '1010', name: 'Cash on Hand & Register Tills', type: 'Asset', subCategory: 'CashAndEquivalents', currency: 'NGN', balanceMinorUnits: 85000000, isControlAccount: true },
      { id: 'coa_1020', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '1020', name: 'Operating Bank Account (Commercial Checking)', type: 'Asset', subCategory: 'CashAndEquivalents', currency: 'NGN', balanceMinorUnits: 4200000000, isControlAccount: false },
      { id: 'coa_1030', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '1030', name: 'Accounts Receivable (Trade Debtors)', type: 'Asset', subCategory: 'Receivables', currency: 'NGN', balanceMinorUnits: 650000000, isControlAccount: true },
      { id: 'coa_1050', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '1050', name: 'Merchandise Inventory Asset', type: 'Asset', subCategory: 'Inventory', currency: 'NGN', balanceMinorUnits: 1450000000, isControlAccount: true },
      { id: 'coa_1060', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '1060', name: 'Silo Grain & Produce Stock Asset', type: 'Asset', subCategory: 'Inventory', currency: 'NGN', balanceMinorUnits: 980000000, isControlAccount: true },
      { id: 'coa_2010', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '2010', name: 'Accounts Payable (Trade Creditors)', type: 'Liability', subCategory: 'Payables', currency: 'NGN', balanceMinorUnits: -410000000, isControlAccount: true },
      { id: 'coa_2020', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '2020', name: 'Customer Retainers & Unearned Revenue', type: 'Liability', subCategory: 'Payables', currency: 'NGN', balanceMinorUnits: -180000000, isControlAccount: true },
      { id: 'coa_2030', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '2030', name: 'Statutory PAYE Tax Payable', type: 'Liability', subCategory: 'TaxesPayable', currency: 'NGN', balanceMinorUnits: -85000000, isControlAccount: true },
      { id: 'coa_2040', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '2040', name: 'Pension Fund Contribution Payable', type: 'Liability', subCategory: 'Payables', currency: 'NGN', balanceMinorUnits: -42000000, isControlAccount: true },
      { id: 'coa_3010', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '3010', name: 'Owner Capital & Retained Earnings', type: 'Equity', subCategory: 'Equity', currency: 'NGN', balanceMinorUnits: -6643000000, isControlAccount: false },
      { id: 'coa_4010', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '4010', name: 'Retail Storefront Sales Revenue', type: 'Revenue', subCategory: 'OperatingRevenue', currency: 'NGN', balanceMinorUnits: 0, isControlAccount: false },
      { id: 'coa_4020', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '4020', name: 'Automotive Workshop Service Revenue', type: 'Revenue', subCategory: 'OperatingRevenue', currency: 'NGN', balanceMinorUnits: 0, isControlAccount: false },
      { id: 'coa_4030', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '4030', name: 'Agricultural Produce Sales Revenue', type: 'Revenue', subCategory: 'OperatingRevenue', currency: 'NGN', balanceMinorUnits: 0, isControlAccount: false },
      { id: 'coa_4040', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '4040', name: 'Freight Logistics Haulage Revenue', type: 'Revenue', subCategory: 'OperatingRevenue', currency: 'NGN', balanceMinorUnits: 0, isControlAccount: false },
      { id: 'coa_5010', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '5010', name: 'Cost of Goods Sold (Retail COGS)', type: 'Expense', subCategory: 'CostOfSales', currency: 'NGN', balanceMinorUnits: 0, isControlAccount: false },
      { id: 'coa_5020', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '5020', name: 'Automotive Parts & Consumables Cost', type: 'Expense', subCategory: 'CostOfSales', currency: 'NGN', balanceMinorUnits: 0, isControlAccount: false },
      { id: 'coa_5040', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '5040', name: 'Freight Fuel & Route Running Cost', type: 'Expense', subCategory: 'DirectExpense', currency: 'NGN', balanceMinorUnits: 0, isControlAccount: false },
      { id: 'coa_6010', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', code: '6010', name: 'Staff Salaries & Compensation Expense', type: 'Expense', subCategory: 'OperatingExpense', currency: 'NGN', balanceMinorUnits: 0, isControlAccount: false }
    ];

    // Bank Accounts
    const bankAccounts: BankAccountRecord[] = [
      {
        id: 'bank_01',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_vi',
        accountName: 'Zenith Treasury Operational Account',
        bankName: 'Zenith Bank PLC',
        accountNumberMasked: '••••••••1048',
        glAccountId: 'coa_1020',
        currency: 'NGN',
        balanceMinorUnits: 4200000000,
        status: 'Connected_Sandbox', // Clearly labeled!
        lastReconciledDate: '2026-10-14'
      }
    ];

    // Payout Authorization Rules (Configurable per currency, removing hardcoded $2000 rule!)
    const payoutRules: PayoutAuthorizationRule[] = [
      {
        id: 'rule_apex_ngn',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        currency: 'NGN',
        dualApprovalThresholdMinor: 50000000, // 500,000 NGN
        allowSelfApproval: false, // Strict separation of duties
        maxSelfApprovalLimitMinor: 0
      },
      {
        id: 'rule_apex_usd',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        currency: 'USD',
        dualApprovalThresholdMinor: 100000, // 1,000 USD
        allowSelfApproval: false,
        maxSelfApprovalLimitMinor: 0
      }
    ];

    // Retail Products
    const retailProducts: RetailProduct[] = [
      {
        id: 'prod_spark_plug',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_vi',
        sku: 'AUT-NGK-7740',
        barcode: '087295177402',
        name: 'NGK Laser Iridium Spark Plug (Set of 4)',
        category: 'Fast Moving Spares',
        unitOfMeasure: 'box',
        costPriceMinor: 2400000, // 24,000 NGN
        sellingPriceMinor: 3800000, // 38,000 NGN
        stockByLocation: {
          loc_vi_store: 25,
          loc_vi_wh: 80,
          loc_workshop_bay: 15
        },
        totalStock: 120,
        reorderLevel: 30,
        taxRatePercent: 7.5,
        allowNegativeStock: false
      },
      {
        id: 'prod_engine_oil',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_vi',
        sku: 'OIL-MOB-5W30',
        barcode: '071924149723',
        name: 'Mobil 1 Full Synthetic 5W-30 (5L Jug)',
        category: 'Lubricants & Fluids',
        unitOfMeasure: 'pcs',
        costPriceMinor: 3200000, // 32,000 NGN
        sellingPriceMinor: 4850000, // 48,500 NGN
        stockByLocation: {
          loc_vi_store: 18,
          loc_vi_wh: 45,
          loc_workshop_bay: 12
        },
        totalStock: 75,
        reorderLevel: 20,
        taxRatePercent: 7.5,
        allowNegativeStock: false
      },
      {
        id: 'prod_grain_flour',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_vi',
        sku: 'AGR-FLR-25KG',
        barcode: '615284920194',
        name: 'Apex Golden Wheat Flour (25kg Bag)',
        category: 'Processed Foodstuff',
        unitOfMeasure: 'carton',
        costPriceMinor: 1850000,
        sellingPriceMinor: 2500000,
        stockByLocation: {
          loc_vi_store: 30,
          loc_vi_wh: 120
        },
        totalStock: 150,
        reorderLevel: 25,
        taxRatePercent: 0, // Exempt staple food
        allowNegativeStock: false
      }
    ];

    // Automotive Vehicles
    const vehicles: VehicleRecord[] = [
      {
        id: 'veh_01',
        tenantId: 'tenant_apex',
        vin: 'WAUZZZ4G1EN029481',
        licensePlate: 'KJA-381-EX',
        make: 'Audi',
        model: 'A6 3.0T Quattro',
        year: 2021,
        ownerName: 'Dr. Olatunji Adeleke',
        ownerPhone: '+2348039201948',
        ownerEmail: 'olatunji.adeleke@medclinic.ng',
        currentMileageKm: 68420
      },
      {
        id: 'veh_02',
        tenantId: 'tenant_apex',
        vin: 'JTEBU5JR8K5091823',
        licensePlate: 'RSH-904-AA',
        make: 'Toyota',
        model: 'Prado TX-L V6',
        year: 2023,
        ownerName: 'Alhaji Mansoor Bello',
        ownerPhone: '+2348021940291',
        currentMileageKm: 34100
      }
    ];

    // Farm Plots
    const farmPlots: FarmPlotRecord[] = [
      {
        id: 'plot_01',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_abj',
        code: 'KDN-PLT-01',
        name: 'Kaduna Commercial Maize Block Alpha',
        sizeHectares: 50,
        soilType: 'Loamy Alluvial',
        irrigationMethod: 'Center Pivot Automated',
        currentCropSeason: '2026 Wet Season Grain Cycle'
      },
      {
        id: 'plot_02',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_abj',
        code: 'KDN-PLT-02',
        name: 'Zaria Soya Outgrower Nucleus Block',
        sizeHectares: 75,
        soilType: 'Sandy Loam',
        irrigationMethod: 'Drip Feed & Rainfed',
        currentCropSeason: '2026 Wet Season Soya Cycle'
      }
    ];

    // Crop Cycles
    const cropCycles: CropSeasonCycle[] = [
      {
        id: 'cycle_01',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_abj',
        plotId: 'plot_01',
        cropName: 'Yellow Maize Grain',
        variety: 'SC 719 Hybrid',
        plantingDate: '2026-06-12',
        expectedHarvestDate: '2026-10-25',
        accumulatedInputCostsMinor: 1450000000,
        estimatedYieldKg: 280000,
        status: 'Growing'
      }
    ];

    // Freight Vehicles
    const freightVehicles: FreightVehicleRecord[] = [
      {
        id: 'fveh_01',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_vi',
        registrationNumber: 'LND-482-XA',
        vehicleType: 'HeavyHaulage30T',
        tonnageCapacity: 30,
        assignedDriverUserId: 'usr_ibrahim',
        assignedDriverName: 'Mallam Ibrahim Garba',
        odometerKm: 142800,
        status: 'Available'
      },
      {
        id: 'fveh_02',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_vi',
        registrationNumber: 'ABC-912-LG',
        vehicleType: 'RefrigeratedVan',
        tonnageCapacity: 10,
        odometerKm: 89400,
        status: 'Available'
      }
    ];

    // Fuel Tanks
    const fuelTanks: FuelStationTank[] = [
      {
        id: 'tank_pms_01',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_abj',
        tankCode: 'TNK-PMS-01',
        productType: 'PMS_Petrol',
        totalCapacityLiters: 45000,
        currentStockLiters: 32400,
        waterDipCm: 0.1, // Clean, zero water contamination
        lastDipDate: '2026-10-15'
      },
      {
        id: 'tank_ago_01',
        tenantId: 'tenant_apex',
        legalEntityId: 'entity_apex_ng',
        branchId: 'branch_abj',
        tankCode: 'TNK-AGO-01',
        productType: 'AGO_Diesel',
        totalCapacityLiters: 40000,
        currentStockLiters: 28900,
        waterDipCm: 0.0,
        lastDipDate: '2026-10-15'
      }
    ];

    // Employees (HR Profile)
    const employees: EmployeeProfile[] = [
      { id: 'emp_01', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', employeeCode: 'EMP-001', fullName: 'Sarah Chen', email: 'sarah.chen@apexhorizon.com', department: 'Executive', role: 'Group CFO', hireDate: '2024-03-01', status: 'Active' },
      { id: 'emp_02', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', employeeCode: 'EMP-002', fullName: 'Tariq Al-Mansoor', email: 'tariq.mansoor@apexhorizon.com', department: 'Finance', role: 'Finance Director', hireDate: '2024-06-15', status: 'Active' },
      { id: 'emp_03', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', employeeCode: 'EMP-003', fullName: 'Chioma Okonkwo', email: 'chioma.okonkwo@apexhorizon.com', department: 'Retail', role: 'Head Cashier', hireDate: '2025-01-10', status: 'Active' },
      { id: 'emp_04', tenantId: 'tenant_apex', legalEntityId: 'entity_apex_ng', branchId: 'branch_vi', employeeCode: 'EMP-004', fullName: 'Adekunle Babalola', email: 'ade.babalola@apexhorizon.com', department: 'Automotive', role: 'Master Workshop Technician', hireDate: '2024-08-01', status: 'Active' }
    ];

    // Confidential Compensations (Strictly isolated!)
    const compensations: ConfidentialCompensation[] = [
      { employeeId: 'emp_01', tenantId: 'tenant_apex', baseSalaryMinor: 350000000, currency: 'NGN', bankName: 'Standard Chartered', accountNumberMasked: '••••••••4920', taxJurisdictionRuleId: 'NG-LIRS-2026', payeTaxRatePercent: 19.5, pensionEmployeePercent: 8, pensionEmployerPercent: 10 },
      { employeeId: 'emp_02', tenantId: 'tenant_apex', baseSalaryMinor: 220000000, currency: 'NGN', bankName: 'Zenith Bank', accountNumberMasked: '••••••••1940', taxJurisdictionRuleId: 'NG-LIRS-2026', payeTaxRatePercent: 18.0, pensionEmployeePercent: 8, pensionEmployerPercent: 10 },
      { employeeId: 'emp_03', tenantId: 'tenant_apex', baseSalaryMinor: 35000000, currency: 'NGN', bankName: 'Access Bank', accountNumberMasked: '••••••••8192', taxJurisdictionRuleId: 'NG-LIRS-2026', payeTaxRatePercent: 7.0, pensionEmployeePercent: 8, pensionEmployerPercent: 10 },
      { employeeId: 'emp_04', tenantId: 'tenant_apex', baseSalaryMinor: 65000000, currency: 'NGN', bankName: 'GTBank', accountNumberMasked: '••••••••3018', taxJurisdictionRuleId: 'NG-LIRS-2026', payeTaxRatePercent: 11.0, pensionEmployeePercent: 8, pensionEmployerPercent: 10 }
    ];

    return {
      tenants: [tenantApex, tenantSolaris],
      legalEntities: [entityApexNG, entityApexUK, entitySolarisNG],
      branches: [branchVI, branchABJ, branchLON, branchSolarisIkeja],
      departments,
      warehouseLocations,
      operatingUnits,
      users,
      roleAssignments,
      sessions: [],
      auditRecords: [],
      fiscalPeriods,
      accounts,
      journalEntries: [],
      bankAccounts,
      payoutRules,
      payouts: [],
      retailProducts,
      purchaseOrders: [],
      goodsReceipts: [],
      posShifts: [],
      posTransactions: [],
      retailReturns: [],
      vehicles,
      jobCards: [],
      farmPlots,
      cropCycles,
      weighbridgeTickets: [],
      processingBatches: [],
      produceSales: [],
      aquacultureTanks: [],
      freightVehicles,
      freightTrips: [],
      passengerTrips: [],
      fuelTanks,
      fuelPumpShifts: [],
      employees,
      compensations,
      payrollRuns: []
    };
  }
}

export const db = new Database();
