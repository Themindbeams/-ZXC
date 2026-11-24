// ZEEX Commerce Core Type Definitions — Enterprise Modular Business OS
// Enforces Organization, Legal Entities, Multi-Branch Sites, Operating Units, and Decimal/Minor-Unit Accounting Precision

export type CurrencyCode = 'USD' | 'NGN' | 'EUR' | 'GBP';

export type RoleName =
  | 'OwnerDirector'
  | 'OrgAdmin'
  | 'BranchManager'
  | 'Accountant'
  | 'AccountsPayableOfficer'
  | 'AccountsReceivableOfficer'
  | 'PayrollOfficer'
  | 'HROfficer'
  | 'Cashier'
  | 'InventoryOfficer'
  | 'ProcurementOfficer'
  | 'Technician'
  | 'Dispatcher'
  | 'Driver'
  | 'Auditor';

export type ActionType =
  | 'view'
  | 'create'
  | 'edit'
  | 'submit'
  | 'approve'
  | 'post'
  | 'reverse'
  | 'refund'
  | 'export'
  | 'manage';

export type ModuleName =
  | 'organization'
  | 'accounting'
  | 'treasury'
  | 'payroll'
  | 'hr'
  | 'retail'
  | 'automotive'
  | 'agribusiness'
  | 'logistics'
  | 'fuel'
  | 'inventory'
  | 'procurement'
  | 'customization'
  | 'audit';

// ---------------- 1. Organizational Hierarchy ----------------
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  status: 'Active' | 'Suspended';
  activeModules: ModuleName[];
  demoMode: boolean; // Explicit indicator: whether tenant is sandbox/demo or operational
}

export interface LegalEntity {
  id: string;
  tenantId: string;
  legalName: string;
  tradeName: string;
  registrationNumber: string;
  taxIdentificationNumber: string;
  country: string;
  functionalCurrency: CurrencyCode;
  createdAt: string;
}

export interface BranchSite {
  id: string;
  tenantId: string;
  legalEntityId: string;
  name: string;
  code: string;
  city: string;
  country: string;
  operatingCurrency: CurrencyCode;
  isHeadquarters: boolean;
  managerUserId?: string;
  status: 'Active' | 'Inactive';
}

export interface Department {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId?: string;
  name: string;
  code: string;
}

export interface WarehouseLocation {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  code: string;
  name: string;
  type: 'Warehouse' | 'Storefront' | 'ServiceBay' | 'Silo' | 'Depot' | 'ColdStorage';
  managerUserId?: string;
}

export interface OperatingUnit {
  id: string;
  tenantId: string;
  branchId: string;
  type: 'Till' | 'ServiceBay' | 'FarmPlot' | 'AquaculturePond' | 'FleetVehicle' | 'FuelPump' | 'ProductionLine';
  code: string;
  name: string;
  status: 'Available' | 'Active' | 'Maintenance' | 'Decommissioned';
}

// ---------------- 2. Identity, Auth & Personal Workspaces ----------------
export interface UserAccount {
  id: string;
  tenantId: string;
  username: string;
  email: string;
  fullName: string;
  passwordHash: string; // scrypt hashed, never plaintext!
  salt: string;
  primaryDepartment?: string;
  status: 'Active' | 'Suspended' | 'Offboarded';
  mfaEnabled: boolean;
  failedLoginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
}

export interface RoleAssignment {
  id: string;
  userId: string;
  tenantId: string;
  legalEntityId?: string;
  branchId?: string; // If undefined, applies to all authorized branches of entity
  role: RoleName;
  grantedBy: string;
  grantedAt: string;
  notes?: string;
}

export interface SessionToken {
  id: string;
  token: string;
  userId: string;
  tenantId: string;
  legalEntityId: string;
  activeBranchId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  status: 'Active' | 'Revoked' | 'Expired';
}

export interface AuditRecord {
  id: string;
  tenantId: string;
  legalEntityId?: string;
  branchId?: string;
  actorUserId: string;
  actorName: string;
  action: string;
  targetEntity: string;
  targetId: string;
  changesSummary: string;
  approvalContext?: string;
  ipAddress: string;
  status: 'Success' | 'Denied' | 'Flagged';
  timestamp: string;
}

// ---------------- 3. Accounting & Double-Entry Ledger ----------------
// All monetary values in minor units (e.g. 100 USD = 10000 cents) to eliminate floating-point rounding defects
export interface FiscalPeriod {
  id: string;
  tenantId: string;
  legalEntityId: string;
  periodName: string; // e.g. "2026-Q4" or "2026-10"
  startDate: string;
  endDate: string;
  isLocked: boolean;
  lockedAt?: string;
  lockedBy?: string;
}

export interface ChartOfAccount {
  id: string;
  tenantId: string;
  legalEntityId: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subCategory: string;
  currency: CurrencyCode;
  balanceMinorUnits: number; // Signed minor units
  isControlAccount: boolean;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  debitMinorUnits: number;
  creditMinorUnits: number;
  memo: string;
}

export interface JournalEntry {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  entryNumber: string;
  date: string;
  fiscalPeriodId: string;
  sourceModule: ModuleName;
  sourceReference: string;
  lines: JournalLine[];
  memo: string;
  status: 'Draft' | 'Approved' | 'Posted' | 'Reversed';
  isReversal: boolean;
  reversedJournalId?: string; // If this journal reverses a previous one
  createdBy: string;
  approvedBy?: string;
  postedAt?: string;
  totalDebitMinor: number;
  totalCreditMinor: number;
}

export interface BankAccountRecord {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  accountName: string;
  bankName: string;
  accountNumberMasked: string; // Masked for privacy
  glAccountId: string;
  currency: CurrencyCode;
  balanceMinorUnits: number;
  status: 'Connected_Sandbox' | 'Connected_Live' | 'Manual_Reconcile';
  lastReconciledDate: string;
}

export interface PayoutAuthorizationRule {
  id: string;
  tenantId: string;
  legalEntityId: string;
  currency: CurrencyCode;
  dualApprovalThresholdMinor: number; // Configurable per currency & scope!
  allowSelfApproval: boolean; // Explicit policy, never silently bypassed!
  maxSelfApprovalLimitMinor: number;
}

export interface PayoutDisbursement {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  beneficiaryName: string;
  bankName: string;
  accountMasked: string;
  amountMinor: number;
  currency: CurrencyCode;
  purpose: string;
  category: 'Supplier' | 'PayrollSummary' | 'Tax' | 'Refund' | 'Operational' | 'DriverAdvance';
  status:
    | 'Requested'
    | 'PendingApproval'
    | 'Approved'
    | 'ProviderSubmitted'
    | 'Settled'
    | 'Failed'
    | 'Rejected';
  makerUserId: string;
  makerName: string;
  checkerUserId?: string;
  checkerName?: string;
  approvalPolicyVersion: string;
  idempotencyKey: string;
  createdAt: string;
  settledAt?: string;
}

// ---------------- 4. Retail Supermarket Workflow ----------------
export interface RetailProduct {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  unitOfMeasure: 'pcs' | 'kg' | 'liter' | 'box' | 'carton';
  costPriceMinor: number;
  sellingPriceMinor: number;
  stockByLocation: Record<string, number>; // locationId -> qty
  totalStock: number;
  reorderLevel: number;
  taxRatePercent: number; // e.g. 7.5
  allowNegativeStock: boolean; // Configurable business rule
}

export interface PurchaseOrderRecord {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  poNumber: string;
  supplierName: string;
  orderDate: string;
  items: {
    productId: string;
    productName: string;
    orderedQty: number;
    receivedQty: number;
    unitCostMinor: number;
  }[];
  totalAmountMinor: number;
  status: 'Draft' | 'Sent' | 'PartiallyReceived' | 'Received' | 'Invoiced' | 'Closed';
}

export interface GoodsReceiptRecord {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  warehouseLocationId: string;
  grnNumber: string;
  poId: string;
  receivedDate: string;
  receiverUserId: string;
  items: {
    productId: string;
    productName: string;
    quantityReceived: number;
    unitCostMinor: number;
    batchNumber?: string;
    expiryDate?: string;
  }[];
  notes?: string;
}

export interface POSTillShift {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  tillUnitId: string;
  tillNumber: string;
  cashierUserId: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingFloatMinor: number;
  cashCollectedMinor: number;
  cardCollectedMinor: number;
  transferCollectedMinor: number;
  expectedCashMinor: number;
  actualCashCountedMinor?: number;
  cashVarianceMinor?: number;
  status: 'Open' | 'Closed';
  ordersCount: number;
  notes?: string;
  supervisorSignoffUserId?: string;
}

export interface POSSaleTransaction {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  shiftId: string;
  receiptNumber: string;
  cashierUserId: string;
  cashierName: string;
  timestamp: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPriceMinor: number;
    taxMinor: number;
    totalMinor: number;
  }[];
  subtotalMinor: number;
  taxMinor: number;
  totalMinor: number;
  tenderSplit: {
    cashMinor: number;
    cardMinor: number;
    bankTransferMinor: number;
  };
  bankTransferStatus: 'NotApplicable' | 'PendingVerification' | 'VerifiedSettled';
  bankTransferReference?: string;
  isRefunded: boolean;
  refundedAmountMinor?: number;
}

export interface RetailReturnRecord {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  returnNumber: string;
  originalReceiptNumber: string;
  items: {
    productId: string;
    productName: string;
    returnedQty: number;
    refundAmountMinor: number;
    restockLocationId: string;
  }[];
  totalRefundMinor: number;
  refundMethod: 'Cash' | 'StoreCredit' | 'OriginalCard';
  reason: string;
  authorizedByUserId: string;
  processedAt: string;
}

// ---------------- 5. Automotive & Mechanic Workshop Workflow ----------------
export interface VehicleRecord {
  id: string;
  tenantId: string;
  vin: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  currentMileageKm: number;
}

export interface InspectionCheckItem {
  category: 'Brakes' | 'Tires' | 'EngineOil' | 'Suspension' | 'Battery' | 'Exhaust' | 'Lights';
  finding: 'Passed' | 'Caution' | 'RequiresImmediateRepair';
  notes: string;
}

export interface RepairEstimateItem {
  type: 'Part' | 'Labor' | 'Outsourced';
  description: string;
  partId?: string;
  quantity: number;
  unitPriceMinor: number;
  totalMinor: number;
  isCustomerApproved: boolean;
}

export interface AutomotiveJobCard {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  jobCardNumber: string;
  vehicleId: string;
  vehicleSummary: string;
  customerName: string;
  customerPhone: string;
  serviceBayUnitId: string;
  intakeMileageKm: number;
  intakeNotes: string;
  inspectionChecklist: InspectionCheckItem[];
  estimates: RepairEstimateItem[];
  customerConsentTimestamp?: string;
  customerAuthorizedBy: string; // e.g. "Signed by John Doe in workshop"
  assignedTechnicianUserId?: string;
  assignedTechnicianName?: string;
  partsIssued: {
    partId: string;
    partName: string;
    quantity: number;
    issuedAt: string;
  }[];
  partsReturned: {
    partId: string;
    partName: string;
    quantity: number;
    returnedAt: string;
  }[];
  laborHoursLogged: number;
  qualityCheckPassed: boolean;
  qualityCheckNotes?: string;
  status:
    | 'Intake'
    | 'Inspection'
    | 'EstimatePendingApproval'
    | 'Authorized'
    | 'InProgress'
    | 'QualityInspection'
    | 'ReadyForPickup'
    | 'InvoicedAndClosed';
  invoiceId?: string;
  createdAt: string;
  completedAt?: string;
}

// ---------------- 6. Agribusiness Workflow ----------------
export interface FarmPlotRecord {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  code: string;
  name: string;
  sizeHectares: number;
  soilType: string;
  irrigationMethod: string;
  currentCropSeason?: string;
}

export interface CropSeasonCycle {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  plotId: string;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  accumulatedInputCostsMinor: number;
  estimatedYieldKg: number;
  actualHarvestKg?: number;
  status: 'Planted' | 'Growing' | 'Harvesting' | 'Completed';
}

export interface WeighbridgeIntakeTicket {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  ticketNumber: string;
  sourceType: 'OwnFarmHarvest' | 'FarmerAggregationSupplier';
  supplierOrFarmerName: string;
  cropType: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  moisturePercent: number;
  grade: 'GradeA' | 'GradeB' | 'GradeC' | 'Rejected';
  rejectionReason?: string;
  pricePerKgMinor: number;
  totalPayableMinor: number;
  destinationSiloLocationId: string;
  assignedLotNumber: string;
  intakeTimestamp: string;
  // NOTE: Accounting policy strictly separates harvest intake (inventory asset at cost) from sales revenue!
}

export interface AgribusinessProcessingBatch {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  batchNumber: string;
  productLine: string; // e.g. "Soybean Oil & Meal Refining"
  sourceLotNumbers: string[];
  consumedRawMaterialKg: number;
  finishedOutputKg: number;
  scrapOrLossKg: number;
  processingCostMinor: number;
  outputLotNumber: string;
  outputDestinationLocationId: string;
  qualityReleaseApproved: boolean;
  batchDate: string;
}

export interface AgribusinessProduceSale {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  saleNumber: string;
  customerName: string;
  cropOrProduct: string;
  traceableLotNumber: string; // Strict end-to-end traceability to farmer/field lot
  quantitySoldKg: number;
  unitPriceMinor: number;
  totalRevenueMinor: number;
  saleDate: string;
  deliveryStatus: 'Prepared' | 'Dispatched' | 'Delivered';
}

export interface AquacultureTankRecord {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  tankCode: string;
  species: string; // e.g. "African Catfish (Clarias gariepinus)"
  fingerlingsStockedCount: number;
  stockingDate: string;
  feedConsumedKg: number;
  currentAverageWeightGrams: number;
  mortalityCount: number;
  waterQualityPH: number;
  dissolvedOxygenMgL: number;
  status: 'ActiveStock' | 'Harvested';
}

// ---------------- 7. Logistics & Transportation ----------------
export interface FreightVehicleRecord {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  registrationNumber: string;
  vehicleType: 'HeavyHaulage30T' | 'FlatbedContainer' | 'RefrigeratedVan' | 'DistributionVan';
  tonnageCapacity: number;
  assignedDriverUserId?: string;
  assignedDriverName?: string;
  odometerKm: number;
  status: 'Available' | 'OnRoute' | 'Maintenance';
}

export interface FreightDispatchTrip {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  tripNumber: string;
  vehicleId: string;
  vehicleReg: string;
  driverUserId: string;
  driverName: string;
  originHub: string;
  destinationHub: string;
  cargoManifest: string;
  grossCargoWeightKg: number;
  agreedFreightRateMinor: number;
  allocatedFuelAdvanceMinor: number;
  actualTripExpensesMinor: number;
  consigneeName: string;
  deliveryAddress: string;
  departureTime: string;
  deliveryTime?: string;
  proofOfDeliverySignedBy?: string;
  proofOfDeliveryTimestamp?: string;
  tripSettled: boolean;
  status: 'ManifestCreated' | 'Dispatched' | 'Delivered_PODSigned' | 'Settled';
}

export interface PassengerRouteTrip {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  routeCode: string;
  originCity: string;
  destinationCity: string;
  scheduledDeparture: string;
  vehicleId: string;
  vehicleRegistration: string;
  driverName: string;
  seatCapacity: number;
  bookedSeatsCount: number;
  farePerSeatMinor: number;
  totalCollectedMinor: number;
  passengerManifest: {
    ticketNumber: string;
    seatNumber: number;
    passengerName: string;
    passengerPhone: string;
    isBoarded: boolean;
    farePaidMinor: number;
  }[];
  tripStatus: 'Boarding' | 'EnRoute' | 'Arrived' | 'Reconciled';
}

// ---------------- 8. Fuel Station Workflow ----------------
export interface FuelStationTank {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  tankCode: string;
  productType: 'PMS_Petrol' | 'AGO_Diesel' | 'DPK_Kerosene';
  totalCapacityLiters: number;
  currentStockLiters: number;
  waterDipCm: number;
  lastDipDate: string;
}

export interface FuelPumpShiftRecord {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  pumpIsland: string;
  productType: 'PMS_Petrol' | 'AGO_Diesel' | 'DPK_Kerosene';
  attendantUserId: string;
  attendantName: string;
  shiftDate: string;
  openingMeterLiters: number;
  closingMeterLiters: number;
  volumeDispensedLiters: number;
  unitPriceMinor: number;
  expectedSalesMinor: number;
  cashRemittedMinor: number;
  posCardRemittedMinor: number;
  meterToCashVarianceMinor: number;
  reconciliationStatus: 'Balanced' | 'ReviewedVariance' | 'Investigating';
}

// ---------------- 9. HR & Segregated Payroll ----------------
export interface EmployeeProfile {
  id: string;
  tenantId: string;
  legalEntityId: string;
  branchId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  hireDate: string;
  status: 'Active' | 'OnLeave' | 'Terminated';
}

// Confidential compensation records stored separately with strict role checks!
export interface ConfidentialCompensation {
  employeeId: string;
  tenantId: string;
  baseSalaryMinor: number;
  currency: CurrencyCode;
  bankName: string;
  accountNumberMasked: string;
  taxJurisdictionRuleId: string;
  payeTaxRatePercent: number;
  pensionEmployeePercent: number;
  pensionEmployerPercent: number;
}

export interface PayrollRunBatch {
  id: string;
  tenantId: string;
  legalEntityId: string;
  periodName: string; // e.g. "October 2026"
  runDate: string;
  employeeCount: number;
  totalGrossMinor: number;
  totalTaxPAYEMinor: number;
  totalPensionMinor: number;
  totalNetMinor: number;
  currency: CurrencyCode;
  status: 'Draft' | 'Approved' | 'PostedToLedger';
  postedJournalId?: string;
  approvedByUserId?: string;
}

// Summarized view for General Ledger accountant: does NOT expose individual wages!
export interface PayrollJournalSummary {
  payrollRunId: string;
  periodName: string;
  employeeCount: number;
  totalGrossMinor: number;
  totalTaxPAYEMinor: number;
  totalPensionMinor: number;
  totalNetMinor: number;
  currency: CurrencyCode;
}
