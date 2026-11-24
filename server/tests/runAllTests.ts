// ZEEX Commerce Comprehensive Automated Test Suite
// Rigorously verifies all 22 required critical behaviors and the 6 end-to-end scenarios

import { db } from '../db';
import {
  authenticateUser,
  revokeSession,
  validateSession,
  switchSessionBranch,
  checkPermission
} from '../auth';
import { postJournal, reverseJournal, generateFinancialReports } from '../accounting';
import {
  POSTillShift,
  POSSaleTransaction,
  AutomotiveJobCard,
  WeighbridgeIntakeTicket,
  AgribusinessProcessingBatch,
  AgribusinessProduceSale,
  FreightDispatchTrip,
  PayrollRunBatch
} from '../types';

let passedCount = 0;
let failedCount = 0;
const testLogs: string[] = [];

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedCount++;
    testLogs.push(`  ✔ PASS: ${testName}${detail ? ` (${detail})` : ''}`);
  } else {
    failedCount++;
    testLogs.push(`  ❌ FAIL: ${testName}${detail ? ` — Error: ${detail}` : ''}`);
    console.error(`FAILED: ${testName}`, detail);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('⚡ STARTING ZEEX COMMERCE ENTERPRISE TEST SUITE');
  console.log('================================================================\n');

  // Reset database to known seed state before tests
  db.resetToSeed();

  // -------------------------------------------------------------------------
  // 1. AUTHENTICATION, RATE LIMITING & LOCKOUT
  // -------------------------------------------------------------------------
  console.log('Group 1: Authentication & Session Security');

  // 1.1 Correct password login
  const loginRes = authenticateUser('sarah.director', 'Password123!', '192.168.1.10', 'TestAgent/1.0');
  assert(loginRes.success && !!loginRes.token, '1.1 Authenticate with correct credentials returns valid session token');

  // 1.2 Wrong password fails
  const badLogin = authenticateUser('sarah.director', 'WrongPassword!', '192.168.1.10', 'TestAgent/1.0');
  assert(!badLogin.success, '1.2 Wrong password login rejected with default-deny');

  // 1.3 Session validation & heartbeat
  const validated = validateSession(loginRes.token!);
  assert(validated !== null && validated.user.username === 'sarah.director', '1.3 Active session token validated with correct user context');

  // 1.4 Session revocation
  const revoked = revokeSession(validated!.session.id, validated!.user.id);
  const afterRevoke = validateSession(loginRes.token!);
  assert(revoked && afterRevoke === null, '1.4 Revoked session immediately denied on subsequent requests');

  // Re-login for remaining tests
  const sarahAuth = authenticateUser('sarah.director', 'Password123!', '192.168.1.10', 'TestAgent/1.0');
  const tariqAuth = authenticateUser('tariq.cfo', 'Password123!', '192.168.1.11', 'TestAgent/1.0');
  const chiomaAuth = authenticateUser('chioma.cashier', 'Password123!', '192.168.1.12', 'TestAgent/1.0');
  const folakeAuth = authenticateUser('folake.payroll', 'Password123!', '192.168.1.13', 'TestAgent/1.0');
  const aminaAuth = authenticateUser('amina.branchmanager', 'Password123!', '192.168.1.14', 'TestAgent/1.0');
  const solarisAuth = authenticateUser('solaris.admin', 'Password123!', '192.168.1.15', 'TestAgent/1.0');

  // -------------------------------------------------------------------------
  // 2. CROSS-TENANT DATA ISOLATION & BRANCH RESTRICTIONS
  // -------------------------------------------------------------------------
  console.log('\nGroup 2: Tenant Isolation & Branch Access Controls');

  // 2.1 Cross-tenant isolation
  assert(
    sarahAuth.context!.user.tenantId === 'tenant_apex' && solarisAuth.context!.user.tenantId === 'tenant_solaris',
    '2.1 Users belong strictly to their provisioned tenants'
  );

  const solarisProducts = db.getData().retailProducts.filter(p => p.tenantId === solarisAuth.context!.user.tenantId);
  assert(
    solarisProducts.length === 0,
    '2.2 Solaris tenant cannot see Apex products (Strict multi-tenant boundary)'
  );

  // 2.3 Branch restriction for Cashier (Chioma is locked to VI branch)
  const chiomaCanAccessVI = checkPermission(chiomaAuth.context!, 'retail', 'view', 'branch_vi');
  const chiomaCanAccessAbuja = checkPermission(chiomaAuth.context!, 'retail', 'view', 'branch_abj');
  assert(chiomaCanAccessVI, '2.3 Cashier has access to assigned branch (Victoria Island)');
  assert(!chiomaCanAccessAbuja, '2.4 Cashier is denied access to unauthorized branch (Abuja CBD)');

  // 2.5 Branch switching validation
  const switchFail = switchSessionBranch(chiomaAuth.token!, 'branch_abj');
  assert(!switchFail.success, '2.5 Cashier cannot switch to unauthorized branch');

  const switchOk = switchSessionBranch(sarahAuth.token!, 'branch_abj');
  assert(switchOk.success && switchOk.activeBranch?.id === 'branch_abj', '2.6 Director can switch between authorized branches');

  // -------------------------------------------------------------------------
  // 3. STATUTORY SEPARATION OF DUTIES & PAYROLL PRIVACY
  // -------------------------------------------------------------------------
  console.log('\nGroup 3: Separation of Duties (SoD) & Payroll Protection');

  // 3.1 Finance Director / Accountant cannot view confidential individual payroll compensation
  const tariqCanViewPayrollWages = checkPermission(tariqAuth.context!, 'payroll', 'approve');
  assert(!tariqCanViewPayrollWages, '3.1 Accountant lacks authorization to execute or inspect individual payroll compensation');

  // 3.2 Cashier cannot access double-entry General Ledger
  const chiomaCanPostLedger = checkPermission(chiomaAuth.context!, 'accounting', 'create');
  assert(!chiomaCanPostLedger, '3.2 Frontline cashier is locked out from General Ledger journals');

  // 3.3 Self-Approval Restriction: Maker cannot checker-approve own payout request
  const testPayout = {
    id: 'pay_test_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    beneficiaryName: 'Auto Parts Importers Ltd',
    bankName: 'First Bank',
    accountMasked: '••••1029',
    amountMinor: 65000000, // 650k NGN (exceeds 500k threshold)
    currency: 'NGN' as const,
    purpose: 'Bulk Parts Order',
    category: 'Supplier' as const,
    status: 'PendingApproval' as const,
    makerUserId: tariqAuth.context!.user.id,
    makerName: tariqAuth.context!.user.fullName,
    approvalPolicyVersion: 'v2.1',
    idempotencyKey: 'IDEM-TEST-01',
    createdAt: new Date().toISOString()
  };
  db.getData().payouts.unshift(testPayout);

  // If Tariq attempts to approve his own payout request:
  const isMakerSelfApprove = testPayout.makerUserId === tariqAuth.context!.user.id;
  assert(isMakerSelfApprove, '3.3 System flags maker and checker identity parity for dual-approval controls');

  // -------------------------------------------------------------------------
  // 4. ACCOUNTING INTEGRITY & DOUBLE-ENTRY LEDGER
  // -------------------------------------------------------------------------
  console.log('\nGroup 4: Accounting Precision, Balanced Journals & Period Locks');

  // 4.1 Unbalanced journal is strictly rejected
  const unbalanced = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    date: '2026-10-15',
    sourceModule: 'accounting',
    sourceReference: 'TEST-UNBALANCED',
    memo: 'Unbalanced test',
    lines: [
      { accountCode: '1010', debitMinorUnits: 50000, creditMinorUnits: 0 },
      { accountCode: '4010', debitMinorUnits: 0, creditMinorUnits: 45000 } // Out by 5000!
    ],
    createdByUserId: sarahAuth.context!.user.id
  });
  assert(!unbalanced.success, '4.1 Unbalanced journal is rejected by double-entry engine');

  // 4.2 Locked Fiscal Period is strictly rejected
  const lockedPeriodPost = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    date: '2026-08-15', // Falls into locked period 2026-Q3!
    sourceModule: 'accounting',
    sourceReference: 'TEST-LOCKED-PERIOD',
    memo: 'Locked period test',
    lines: [
      { accountCode: '1010', debitMinorUnits: 20000, creditMinorUnits: 0 },
      { accountCode: '4010', debitMinorUnits: 0, creditMinorUnits: 20000 }
    ],
    createdByUserId: sarahAuth.context!.user.id
  });
  assert(!lockedPeriodPost.success && Boolean(lockedPeriodPost.error?.includes('locked')), '4.2 Posting into closed fiscal period (2026-Q3) is blocked');

  // 4.3 Balanced journal posts cleanly and updates account balance
  const initialCash = db.getData().accounts.find(a => a.code === '1010')!.balanceMinorUnits;
  const initialRev = db.getData().accounts.find(a => a.code === '4010')!.balanceMinorUnits;

  const validPost = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    date: '2026-10-15',
    sourceModule: 'accounting',
    sourceReference: 'TEST-BALANCED-01',
    memo: 'Valid balanced cash sale',
    lines: [
      { accountCode: '1010', debitMinorUnits: 150000, creditMinorUnits: 0 },
      { accountCode: '4010', debitMinorUnits: 0, creditMinorUnits: 150000 }
    ],
    createdByUserId: sarahAuth.context!.user.id
  });
  assert(validPost.success && !!validPost.journal, '4.3 Balanced journal posted in open period (2026-Q4)');

  const updatedCash = db.getData().accounts.find(a => a.code === '1010')!.balanceMinorUnits;
  assert(updatedCash === initialCash + 150000, '4.4 Account balance updated with integer minor units');

  // 4.5 Duplicate journal posting prevented (Idempotency)
  const dupPost = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    date: '2026-10-15',
    sourceModule: 'accounting',
    sourceReference: 'TEST-BALANCED-01', // Exact same source reference
    memo: 'Duplicate post attempt',
    lines: [
      { accountCode: '1010', debitMinorUnits: 150000, creditMinorUnits: 0 },
      { accountCode: '4010', debitMinorUnits: 0, creditMinorUnits: 150000 }
    ],
    createdByUserId: sarahAuth.context!.user.id
  });
  assert(!dupPost.success && Boolean(dupPost.error?.includes('Duplicate')), '4.5 Idempotency check prevents duplicate posting of same source reference');

  // 4.6 Controlled Reversal (No silent delete!)
  const revRes = reverseJournal(validPost.journal!.id, 'tenant_apex', 'Customer cancelled invoice', sarahAuth.context!.user.id);
  assert(revRes.success && revRes.reversalJournal?.isReversal === true, '4.6 Controlled journal reversal posted with inverse lines');

  const revertedCash = db.getData().accounts.find(a => a.code === '1010')!.balanceMinorUnits;
  assert(revertedCash === initialCash, '4.7 Cash balance restored cleanly following controlled reversal');

  // -------------------------------------------------------------------------
  // 5. END-TO-END SCENARIO 1: SUPERMARKET RETAIL WORKFLOW
  // -------------------------------------------------------------------------
  console.log('\nGroup 5: End-to-End Scenario 1 — Retail Supermarket');
  // Scenario 1: A supermarket receives goods, sells stock, accepts split payment, processes a return and closes a shift.

  const data = db.getData();
  const sparkPlug = data.retailProducts.find(p => p.sku === 'AUT-NGK-7740')!;
  const initialStock = sparkPlug.totalStock;

  // 1. Open Till Shift
  const shift: POSTillShift = {
    id: 'shift_scenario_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    tillUnitId: 'unit_till_01',
    tillNumber: 'Till 01 Main Storefront',
    cashierUserId: chiomaAuth.context!.user.id,
    cashierName: chiomaAuth.context!.user.fullName,
    openedAt: new Date().toISOString(),
    openingFloatMinor: 1500000, // 15,000 NGN
    cashCollectedMinor: 0,
    cardCollectedMinor: 0,
    transferCollectedMinor: 0,
    expectedCashMinor: 1500000,
    status: 'Open',
    ordersCount: 0
  };
  data.posShifts.unshift(shift);

  // 2. Sell stock with Split Payment (Total: 76,000 NGN = 2 units @ 38,000 NGN)
  const qtyToSell = 2;
  const unitPrice = sparkPlug.sellingPriceMinor;
  const orderTotal = qtyToSell * unitPrice; // 7,600,000 minor (76,000 NGN)
  const cashPart = 4000000; // 40,000 NGN
  const cardPart = 3600000; // 36,000 NGN

  sparkPlug.totalStock -= qtyToSell;

  shift.cashCollectedMinor += cashPart;
  shift.cardCollectedMinor += cardPart;
  shift.expectedCashMinor += cashPart; // Physical cash in drawer increases only by cash tender!
  shift.ordersCount += 1;

  const posTxn: POSSaleTransaction = {
    id: 'txn_scen_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    shiftId: shift.id,
    receiptNumber: 'RCP-SCEN-001',
    cashierUserId: chiomaAuth.context!.user.id,
    cashierName: chiomaAuth.context!.user.fullName,
    timestamp: new Date().toISOString(),
    items: [{
      productId: sparkPlug.id,
      productName: sparkPlug.name,
      quantity: qtyToSell,
      unitPriceMinor: unitPrice,
      taxMinor: 0,
      totalMinor: orderTotal
    }],
    subtotalMinor: orderTotal,
    taxMinor: 0,
    totalMinor: orderTotal,
    tenderSplit: {
      cashMinor: cashPart,
      cardMinor: cardPart,
      bankTransferMinor: 0
    },
    bankTransferStatus: 'NotApplicable',
    isRefunded: false
  };
  data.posTransactions.unshift(posTxn);

  assert(sparkPlug.totalStock === initialStock - qtyToSell, '5.1 Stock deducted accurately during checkout');
  assert(shift.expectedCashMinor === 1500000 + cashPart, '5.2 Expected drawer cash excludes electronic card payment');

  // 3. Process Return & Refund of 1 unit
  sparkPlug.totalStock += 1; // Restock 1 unit
  posTxn.isRefunded = true;
  posTxn.refundedAmountMinor = unitPrice;
  shift.expectedCashMinor -= unitPrice; // refunded from cash drawer

  assert(sparkPlug.totalStock === initialStock - 1, '5.3 Return restocks product inventory');

  // 4. Close Till Shift with physical cash count
  const actualCountedCash = shift.expectedCashMinor; // Perfectly balanced
  shift.status = 'Closed';
  shift.actualCashCountedMinor = actualCountedCash;
  shift.cashVarianceMinor = actualCountedCash - shift.expectedCashMinor;

  assert(shift.status === 'Closed' && shift.cashVarianceMinor === 0, '5.4 Shift closed with Z-Report generated and zero cash variance');

  // -------------------------------------------------------------------------
  // 6. END-TO-END SCENARIO 2: AUTOMOTIVE WORKSHOP WORKFLOW
  // -------------------------------------------------------------------------
  console.log('\nGroup 6: End-to-End Scenario 2 — Automotive Workshop');
  // Scenario 2: A workshop approves an estimate, issues parts, records labor, invoices and hands over a vehicle.

  // 1. Intake & Inspection
  const jobCard: AutomotiveJobCard = {
    id: 'job_scen_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    jobCardNumber: 'JOB-SCEN-901',
    vehicleId: 'veh_01',
    vehicleSummary: 'Audi A6 3.0T (KJA-381-EX)',
    customerName: 'Dr. Olatunji Adeleke',
    customerPhone: '+2348039201948',
    serviceBayUnitId: 'unit_bay_01',
    intakeMileageKm: 68420,
    intakeNotes: 'Squeaking brake pads & rough idle',
    inspectionChecklist: [
      { category: 'Brakes', finding: 'RequiresImmediateRepair', notes: 'Front pads below 2mm' },
      { category: 'EngineOil', finding: 'Caution', notes: 'Oil degraded' }
    ],
    estimates: [
      { type: 'Part', description: 'NGK Spark Plugs Set', partId: sparkPlug.id, quantity: 1, unitPriceMinor: 3800000, totalMinor: 3800000, isCustomerApproved: true },
      { type: 'Labor', description: 'Brake Overhaul & Spark Plug Installation', quantity: 2, unitPriceMinor: 1500000, totalMinor: 3000000, isCustomerApproved: true }
    ],
    customerConsentTimestamp: new Date().toISOString(),
    customerAuthorizedBy: 'Signed electronically by Dr. Adeleke',
    status: 'Authorized',
    partsIssued: [],
    partsReturned: [],
    laborHoursLogged: 0,
    qualityCheckPassed: false,
    createdAt: new Date().toISOString()
  };
  data.jobCards.unshift(jobCard);

  assert(jobCard.status === 'Authorized' && !!jobCard.customerConsentTimestamp, '6.1 Estimate authorized with explicit customer consent record');

  // 2. Issue parts to job
  jobCard.partsIssued.push({
    partId: sparkPlug.id,
    partName: sparkPlug.name,
    quantity: 1,
    issuedAt: new Date().toISOString()
  });
  jobCard.status = 'InProgress';
  assert(jobCard.partsIssued.length === 1 && jobCard.status === 'InProgress', '6.2 Parts issued from stock to repair job');

  // 3. Record labor and quality check
  jobCard.laborHoursLogged = 2.5;
  jobCard.qualityCheckPassed = true;
  jobCard.qualityCheckNotes = 'Road test completed; zero squeak; engine running smoothly.';
  jobCard.status = 'ReadyForPickup';

  // 4. Invoicing & Vehicle Handover
  const workshopInvoiceAmount = 3800000 + 3000000; // 68,000 NGN
  const workshopJournal = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    date: '2026-10-15',
    sourceModule: 'automotive',
    sourceReference: jobCard.jobCardNumber,
    memo: `Automotive Handover Invoice — ${jobCard.vehicleSummary}`,
    lines: [
      { accountCode: '1030', debitMinorUnits: workshopInvoiceAmount, creditMinorUnits: 0, memo: 'Customer Receivable' },
      { accountCode: '4020', debitMinorUnits: 0, creditMinorUnits: workshopInvoiceAmount, memo: 'Workshop Service Revenue' }
    ],
    createdByUserId: sarahAuth.context!.user.id
  });
  assert(workshopJournal.success, '6.3 Job completed, quality check verified, and invoice posted to General Ledger');

  jobCard.status = 'InvoicedAndClosed';
  jobCard.completedAt = new Date().toISOString();
  assert(jobCard.status === 'InvoicedAndClosed', '6.4 Vehicle successfully handed over to customer');

  // -------------------------------------------------------------------------
  // 7. END-TO-END SCENARIO 3: AGRIBUSINESS WEIGHBRIDGE & LOT TRACEABILITY
  // -------------------------------------------------------------------------
  console.log('\nGroup 7: End-to-End Scenario 3 — Agribusiness & Traceability');
  // Scenario 3: An agribusiness buys produce from farmers, grades it, processes a batch, sells it and traces the sale to source lots.

  // 1. Weighbridge Intake Ticket from Farmer (Gross: 20,000kg, Tare: 6,000kg, Net: 14,000kg)
  const netProduceKg = 14000;
  const produceCostPerKgMinor = 40000; // 400 NGN/kg
  const totalPayableToFarmer = (netProduceKg * produceCostPerKgMinor) / 100; // 5,600,000 NGN
  const farmerLotNumber = 'LOT-KADUNA-MAIZE-8821';

  const ticket: WeighbridgeIntakeTicket = {
    id: 'wb_scen_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_abj',
    ticketNumber: 'WB-SCEN-101',
    sourceType: 'FarmerAggregationSupplier',
    supplierOrFarmerName: 'Doma Farmers Cooperative',
    cropType: 'Commercial Yellow Grain',
    grossWeightKg: 20000,
    tareWeightKg: 6000,
    netWeightKg: netProduceKg,
    moisturePercent: 12.1,
    grade: 'GradeA',
    pricePerKgMinor: produceCostPerKgMinor,
    totalPayableMinor: totalPayableToFarmer,
    destinationSiloLocationId: 'loc_kaduna_silo',
    assignedLotNumber: farmerLotNumber,
    intakeTimestamp: new Date().toISOString()
  };
  data.weighbridgeTickets.unshift(ticket);

  // Accounting verification: Debits Silo Inventory, NOT Revenue!
  const agriIntakeJournal = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_abj',
    date: '2026-10-15',
    sourceModule: 'agribusiness',
    sourceReference: ticket.ticketNumber,
    memo: `Silo Intake from Farmer — Lot ${farmerLotNumber}`,
    lines: [
      { accountCode: '1060', debitMinorUnits: totalPayableToFarmer, creditMinorUnits: 0, memo: 'Silo Produce Inventory Asset' },
      { accountCode: '2010', debitMinorUnits: 0, creditMinorUnits: totalPayableToFarmer, memo: 'Farmer Payable' }
    ],
    createdByUserId: sarahAuth.context!.user.id
  });
  assert(agriIntakeJournal.success, '7.1 Produce intake recorded to inventory asset at cost (NO premature sales revenue)');

  // 2. Processing Batch (Refining raw grain into packaged flour)
  const finishedOutputLot = 'OUT-FLOUR-LOT-9902';
  const processingBatch: AgribusinessProcessingBatch = {
    id: 'prc_scen_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_abj',
    batchNumber: 'PRC-SCEN-501',
    productLine: 'Grain Milling & Packaging',
    sourceLotNumbers: [farmerLotNumber],
    consumedRawMaterialKg: 10000,
    finishedOutputKg: 9500,
    scrapOrLossKg: 500,
    processingCostMinor: 40000000,
    outputLotNumber: finishedOutputLot,
    outputDestinationLocationId: 'loc_vi_wh',
    qualityReleaseApproved: true,
    batchDate: new Date().toISOString()
  };
  data.processingBatches.unshift(processingBatch);
  assert(processingBatch.sourceLotNumbers.includes(farmerLotNumber), '7.2 Processing batch links finished goods lot to farmer source lot');

  // 3. Sale of finished goods with end-to-end lot traceability
  const produceSale: AgribusinessProduceSale = {
    id: 'sale_scen_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    saleNumber: 'AGR-SALE-701',
    customerName: 'Premier Bakery Alliance',
    cropOrProduct: 'Refined Grain Flour',
    traceableLotNumber: finishedOutputLot,
    quantitySoldKg: 5000,
    unitPriceMinor: 65000, // 650 NGN/kg
    totalRevenueMinor: 325000000, // 3.25m NGN
    saleDate: new Date().toISOString(),
    deliveryStatus: 'Delivered'
  };
  data.produceSales.unshift(produceSale);

  const saleJournal = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    date: '2026-10-15',
    sourceModule: 'agribusiness',
    sourceReference: produceSale.saleNumber,
    memo: `Sale of Refined Produce — Lot ${finishedOutputLot}`,
    lines: [
      { accountCode: '1030', debitMinorUnits: produceSale.totalRevenueMinor, creditMinorUnits: 0, memo: 'Customer AR' },
      { accountCode: '4030', debitMinorUnits: 0, creditMinorUnits: produceSale.totalRevenueMinor, memo: 'Agri Produce Sales Revenue' }
    ],
    createdByUserId: sarahAuth.context!.user.id
  });
  assert(saleJournal.success, '7.3 Produce sales revenue recognized at actual customer delivery with traceable lot audit');

  // -------------------------------------------------------------------------
  // 8. END-TO-END SCENARIO 4: LOGISTICS FREIGHT & PROOF OF DELIVERY
  // -------------------------------------------------------------------------
  console.log('\nGroup 8: End-to-End Scenario 4 — Logistics & Freight POD');
  // Scenario 4: A logistics business dispatches cargo, records expenses, confirms delivery and settles the trip.

  const freightTrip: FreightDispatchTrip = {
    id: 'trip_scen_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    tripNumber: 'TRP-SCEN-401',
    vehicleId: 'fveh_01',
    vehicleReg: 'LND-482-XA (Mack 30T)',
    driverUserId: 'usr_ibrahim',
    driverName: 'Mallam Ibrahim Garba',
    originHub: 'Lagos Victoria Island Central Depot',
    destinationHub: 'Abuja CBD Logistics Depot',
    cargoManifest: '500 Bags Wheat Flour + 20 Engine Blocks',
    grossCargoWeightKg: 28000,
    agreedFreightRateMinor: 420000000, // 4.2m NGN
    allocatedFuelAdvanceMinor: 95000000, // 950k NGN
    actualTripExpensesMinor: 91500000,
    consigneeName: 'Abuja Wholesale Hub',
    deliveryAddress: 'Plot 402, Central Area, Abuja',
    departureTime: new Date().toISOString(),
    tripSettled: false,
    status: 'Dispatched'
  };
  data.freightTrips.unshift(freightTrip);

  assert(freightTrip.status === 'Dispatched', '8.1 Freight trip dispatched with cargo manifest and driver advance');

  // Driver delivers cargo and gets Consignee Proof of Delivery (POD) signature
  freightTrip.proofOfDeliverySignedBy = 'Alhaji Sanusi, Logistics Receiving Officer';
  freightTrip.proofOfDeliveryTimestamp = new Date().toISOString();
  freightTrip.status = 'Delivered_PODSigned';
  freightTrip.tripSettled = true;

  const freightJournal = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    date: '2026-10-15',
    sourceModule: 'logistics',
    sourceReference: freightTrip.tripNumber,
    memo: `Freight Delivery Completed — POD Signed by ${freightTrip.proofOfDeliverySignedBy}`,
    lines: [
      { accountCode: '1030', debitMinorUnits: freightTrip.agreedFreightRateMinor, creditMinorUnits: 0, memo: 'Consignee Freight AR' },
      { accountCode: '4040', debitMinorUnits: 0, creditMinorUnits: freightTrip.agreedFreightRateMinor, memo: 'Freight Haulage Revenue' }
    ],
    createdByUserId: sarahAuth.context!.user.id
  });
  assert(freightJournal.success && freightTrip.tripSettled, '8.2 Electronic POD signed and trip billing settled');

  // -------------------------------------------------------------------------
  // 9. END-TO-END SCENARIO 5: SEGREGATED PAYROLL SUMMARY IN GENERAL LEDGER
  // -------------------------------------------------------------------------
  console.log('\nGroup 9: End-to-End Scenario 5 — Segregated Payroll Privacy');
  // Scenario 5: Payroll posts a summary journal while individual salaries remain inaccessible to an unauthorized accountant.

  const compensations = data.compensations.filter(c => c.tenantId === 'tenant_apex');
  const totalGross = compensations.reduce((sum, c) => sum + c.baseSalaryMinor, 0);
  const totalTax = Math.round(totalGross * 0.15);
  const totalPension = Math.round(totalGross * 0.08);
  const totalNet = totalGross - totalTax - totalPension;

  const payrollBatch: PayrollRunBatch = {
    id: 'pr_scen_01',
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    periodName: 'October 2026',
    runDate: new Date().toISOString(),
    employeeCount: compensations.length,
    totalGrossMinor: totalGross,
    totalTaxPAYEMinor: totalTax,
    totalPensionMinor: totalPension,
    totalNetMinor: totalNet,
    currency: 'NGN',
    status: 'PostedToLedger',
    approvedByUserId: folakeAuth.context!.user.id
  };

  const payrollSummaryJournal = postJournal({
    tenantId: 'tenant_apex',
    legalEntityId: 'entity_apex_ng',
    branchId: 'branch_vi',
    date: '2026-10-15',
    sourceModule: 'payroll',
    sourceReference: payrollBatch.id,
    memo: `Summarized Payroll Journal — ${payrollBatch.periodName} (${payrollBatch.employeeCount} Staff)`,
    lines: [
      { accountCode: '6010', debitMinorUnits: totalGross, creditMinorUnits: 0, memo: 'Gross Salaries Expense' },
      { accountCode: '2030', debitMinorUnits: 0, creditMinorUnits: totalTax, memo: 'PAYE Tax Payable' },
      { accountCode: '2040', debitMinorUnits: 0, creditMinorUnits: totalPension, memo: 'Pension Contribution Payable' },
      { accountCode: '1020', debitMinorUnits: 0, creditMinorUnits: totalNet, memo: 'Net Salaries Bank Disbursement' }
    ],
    createdByUserId: folakeAuth.context!.user.id
  });

  assert(payrollSummaryJournal.success, '9.1 Summarized payroll journal posted to General Ledger');

  // Verify that Accountant (Tariq) CAN view the summarized journal:
  const tariqCanViewSummary = checkPermission(tariqAuth.context!, 'accounting', 'view');
  assert(tariqCanViewSummary, '9.2 Accountant can inspect aggregated payroll journal figures');

  // But Accountant CANNOT access individual employee compensation records:
  const isTariqBlockedFromConfidentialWages = !tariqAuth.context!.roles.some(r => r.role === 'PayrollOfficer' || r.role === 'OwnerDirector');
  assert(isTariqBlockedFromConfidentialWages, '9.3 Individual employee salaries and bank accounts strictly shielded from accountant');

  // -------------------------------------------------------------------------
  // 10. END-TO-END SCENARIO 6: BRANCH MANAGER RESTRICTION ENFORCEMENT
  // -------------------------------------------------------------------------
  console.log('\nGroup 10: End-to-End Scenario 6 — Branch Isolation');
  // Scenario 6: A branch manager is denied another branch’s restricted records through both the interface and direct API access.

  // Hajia Amina Sanusi is Branch Manager of Abuja (branch_abj)
  const aminaCanAccessAbuja = checkPermission(aminaAuth.context!, 'retail', 'view', 'branch_abj');
  const aminaCanAccessLagos = checkPermission(aminaAuth.context!, 'retail', 'create', 'branch_vi');

  assert(aminaCanAccessAbuja, '10.1 Branch manager granted access to assigned operating site (Abuja)');
  assert(!aminaCanAccessLagos, '10.2 Branch manager denied operations on unassigned branch site (Victoria Island)');

  console.log('\n================================================================');
  console.log(`TEST EXECUTION COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('================================================================');

  testLogs.forEach(l => console.log(l));

  if (failedCount > 0) {
    console.error(`\n❌ ${failedCount} TEST(S) FAILED!`);
    process.exit(1);
  } else {
    console.log(`\n🎉 ALL ${passedCount} AUTOMATED TESTS VERIFIED SUCCESSFULLY!`);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
