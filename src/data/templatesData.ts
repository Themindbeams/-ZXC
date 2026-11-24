import { IndustryTemplate, IndustryCategory } from '../types';

export const INDUSTRY_TEMPLATES: Record<IndustryCategory, IndustryTemplate> = {
  automotive: {
    id: 'automotive',
    name: 'Automotive & Workshop',
    tagline: 'Vehicle repair orders, job cards, spare parts, and technician scheduling',
    description: 'Specialized for auto workshops, dealerships, and spare parts retail. Manages vehicle profiles by VIN/license plate, multi-point digital inspection cards, technician labor allocations, and automated invoicing.',
    recommendedModules: ['accounting', 'sales', 'inventory', 'operations', 'documents', 'custom_fields'],
    customRecordTypes: ['Vehicles', 'Repair Orders', 'Multi-point Inspections', 'Technician Job Cards'],
    sampleFeatures: [
      'Digital Inspection Checklists (Brakes, Engine, Suspension, Battery)',
      'Vehicle Service History Ledger by Plate & VIN',
      'Spare Parts Inventory linked to COGS & Work Orders',
      'Technician Labor Hours & Billable Rate Margin Tracking'
    ],
    bannerHighlight: 'Mechanic & Automotive Suite Active',
    iconName: 'Wrench'
  },
  retail: {
    id: 'retail',
    name: 'Retail & Supermarket',
    tagline: 'High-speed POS, barcode scanner, multi-warehouse stock, and supplier POs',
    description: 'Designed for supermarkets, consumer electronics stores, pharmacies, and wholesale distribution. Features live POS checkout with split payment methods, real-time stock deductions, batch numbers, and reorder triggers.',
    recommendedModules: ['accounting', 'pos', 'sales', 'inventory', 'procurement', 'reports'],
    customRecordTypes: ['POS Terminals', 'Stock Batches', 'Price Tiers', 'Promotions'],
    sampleFeatures: [
      'Fast Touch / Barcode Point of Sale with instant receipt printing',
      'Multi-warehouse Inventory with Low-stock Reorder alerts',
      'Instant General Ledger Journal posting on POS sale close',
      'Payment gateway reconciliation with ZEEX Bank and cards'
    ],
    bannerHighlight: 'Retail POS & Multi-Store Suite Active',
    iconName: 'ShoppingBag'
  },
  legal: {
    id: 'legal',
    name: 'Legal & Professional Services',
    tagline: 'Client intake, conflict check, case matters, retainer trust, and billable time',
    description: 'Tailored for law firms, management consultants, and accounting practices. Enforces strict trust accounting isolation, conflict-of-interest checks, court deadline trackers, hourly fee calculations, and retainer disbursements.',
    recommendedModules: ['accounting', 'sales', 'operations', 'hr', 'documents', 'custom_fields'],
    customRecordTypes: ['Legal Matters', 'Conflict Clearance Log', 'Trust Retainers', 'Court Deadlines'],
    sampleFeatures: [
      'Segregated Trust Retainer Account vs Operating Account',
      'Lead Attorney & Associate Billable Hours Time Ledger',
      'Mandatory Conflict Check prior to Matter Activation',
      'Automatic Retainer Invoicing and Work-in-Progress (WIP) reports'
    ],
    bannerHighlight: 'Legal & Professional Practice Suite Active',
    iconName: 'Scale'
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Clinic',
    tagline: 'Patient encounters, clinic billing, pharmacy dispensary, and doctor shifts',
    description: 'Optimized for private clinics, outpatient centers, and diagnostic labs. Manages patient billing codes, pharmacy inventory, doctor shift rosters, and equipment maintenance schedules.',
    recommendedModules: ['accounting', 'sales', 'inventory', 'hr', 'operations', 'documents'],
    customRecordTypes: ['Patient Encounters', 'Clinical Inventory', 'Doctor Shifts', 'Equipment Calibration'],
    sampleFeatures: [
      'Separate Safeguards for Clinical Records & Patient Billing',
      'Pharmacy Batch Expiry & Stock Threshold Alerts',
      'Consultation & Procedure Invoicing tied to General Ledger',
      'Medical Equipment Preventive Maintenance Log'
    ],
    bannerHighlight: 'Healthcare Operations Suite Active',
    iconName: 'HeartPulse'
  },
  energy: {
    id: 'energy',
    name: 'Energy & Fuel Station',
    tagline: 'Underground tank dip readings, pump reconciliation, and shift sales',
    description: 'Configured for petrol stations, LPG distributors, and bunkering depots. Features tank calibration dips, attendant cash handovers, fuel density adjustments, and bulk tanker delivery receipts.',
    recommendedModules: ['accounting', 'sales', 'inventory', 'treasury', 'reports', 'automation'],
    customRecordTypes: ['Tank Dip Logs', 'Pump Meter Readings', 'Attendant Shifts', 'Bulk Delivery Waybills'],
    sampleFeatures: [
      'End-of-shift Pump Meter vs Cash & POS Reconciliation',
      'Underground Tank Storage Level & Water Dip Tracking',
      'Direct Supplier Payout Dual Approval for Bulk Fuel Haulage',
      'Automated Profit Margin Calculations per Litre/Gallon'
    ],
    bannerHighlight: 'Energy & Fuel Management Suite Active',
    iconName: 'Fuel'
  },
  logistics: {
    id: 'logistics',
    name: 'Logistics & Fleet Operations',
    tagline: 'Vehicle dispatch, trip waybills, proof of delivery, and freight invoices',
    description: 'Built for transport operators, haulage providers, and dispatch fleets. Tracks vehicle maintenance, route fuel expenses, driver allowances, cargo manifests, and automated freight billing.',
    recommendedModules: ['accounting', 'operations', 'inventory', 'treasury', 'documents', 'reports'],
    customRecordTypes: ['Trip Waybills', 'Fleet Vehicles', 'Driver Fuel Logs', 'Proof of Delivery'],
    sampleFeatures: [
      'Trip-by-trip Route Cost & Freight Profitability Analysis',
      'Driver Advance & Expense Settlement Dual Authorization',
      'Fleet Maintenance & Tire Mileage Depreciation Log',
      'Customer Cargo Tracking & Instant Digital Waybill'
    ],
    bannerHighlight: 'Logistics & Fleet Command Suite Active',
    iconName: 'Truck'
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing & Assembly',
    tagline: 'Bill of Materials (BOM), production orders, raw materials, and batch traceability',
    description: 'For industrial processors, assembly plants, and consumer goods manufacturers. Coordinates raw material allocation, machine run times, scrap recording, and finished goods inventory valuation.',
    recommendedModules: ['accounting', 'inventory', 'procurement', 'operations', 'reports'],
    customRecordTypes: ['Bill of Materials', 'Production Orders', 'Quality Inspection', 'Work Centers'],
    sampleFeatures: [
      'Multi-level Bill of Materials with Automatic Raw Material Draw',
      'Production Costing (Direct Material + Direct Labor + Overhead)',
      'Batch-level Traceability & Quality Inspection Checkpoints',
      'Machine Preventative Maintenance Schedules'
    ],
    bannerHighlight: 'Manufacturing & Assembly Suite Active',
    iconName: 'Factory'
  },
  agriculture: {
    id: 'agriculture',
    name: 'Agriculture & Farm Ops',
    tagline: 'Plot management, crop cycles, harvest yields, and produce grading',
    description: 'Tailored for commercial farms, agro-processing cooperatives, and export aggregators. Tracks planting seasons, input applications (fertilizer/seed), harvest yields, and warehouse silo stock.',
    recommendedModules: ['accounting', 'inventory', 'operations', 'procurement', 'documents'],
    customRecordTypes: ['Farm Plots', 'Crop Production Cycles', 'Harvest Weighbridge Logs', 'Produce Grades'],
    sampleFeatures: [
      'Plot-level Input Costs & Yield Profitability per Hectare',
      'Produce Grading (Grade A/B/C) with Market Price Matrix',
      'Silo / Cold Storage Moisture & Batch Retention Logs',
      'Seasonal Labor Payroll & Cooperative Member Payouts'
    ],
    bannerHighlight: 'Agri-Business & Farm Suite Active',
    iconName: 'Wheat'
  }
};
