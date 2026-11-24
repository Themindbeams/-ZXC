import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingCart,
  CheckCircle,
  PackageCheck,
  Truck,
  FileText,
  DollarSign,
  BookOpen,
  PieChart,
  User,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const OperationalFlowInspector: React.FC = () => {
  const { invoices, journalEntries, setInspectedRecord } = useApp();

  const [activeStepId, setActiveStepId] = useState<number>(6); // Default: Step 6 (Invoice Issued)

  const steps = [
    {
      id: 1,
      title: 'Customer Order',
      actor: 'Adekunle Babalola (Super Admin)',
      timestamp: '2026-10-14 14:10',
      branch: 'Victoria Island HQ Hub',
      docRef: 'SO-2026-081',
      status: 'Completed',
      summary: 'Customer Lagos Island Fleet placed order for 2x Bosch Injector Sets & 4x Brake Discs ($4,520.00).',
      ledgerImpact: 'No direct balance sheet posting until contract fulfillment criteria met.',
      debit: '—',
      credit: '—'
    },
    {
      id: 2,
      title: 'Order Confirmed',
      actor: 'Adekunle Babalola',
      timestamp: '2026-10-14 14:22',
      branch: 'Victoria Island HQ Hub',
      docRef: 'CONF-8821',
      status: 'Completed',
      summary: 'Sales contract confirmed with credit limit verification ($15,000 ceiling checked).',
      ledgerImpact: 'Commercial commitment logged; credit exposure updated.',
      debit: '—',
      credit: '—'
    },
    {
      id: 3,
      title: 'Inventory Reserved',
      actor: 'Chioma Okonkwo (Inventory Lead)',
      timestamp: '2026-10-14 15:05',
      branch: 'Central Spares Warehouse',
      docRef: 'RES-0994',
      status: 'Completed',
      summary: 'Physical bin stock reserved in Warehouse 01 to prevent double-allocation.',
      ledgerImpact: 'Stock status moved from Available to Committed.',
      debit: '—',
      credit: '—'
    },
    {
      id: 4,
      title: 'Picked & Packed',
      actor: 'Tariq Mansoor (Technician)',
      timestamp: '2026-10-14 16:30',
      branch: 'Service Bay 02',
      docRef: 'PACK-412',
      status: 'Completed',
      summary: 'Parts inspected against manufacturer barcode and packed with tamper-evident seal.',
      ledgerImpact: 'Pre-dispatch inspection certificate attached to waybill.',
      debit: '—',
      credit: '—'
    },
    {
      id: 5,
      title: 'Delivery Dispatched',
      actor: 'Ibrahim Danladi (Driver)',
      timestamp: '2026-10-15 07:45',
      branch: 'Logistics Fleet Depot',
      docRef: 'TRIP-7701 (Waybill #WB-2026-091)',
      status: 'Completed',
      summary: 'Loaded onto 10-T Refrigerated Hauler reg #ABJ-882-XD with digital e-POD link.',
      ledgerImpact: 'Goods in transit liability transferred under FOB Destination terms.',
      debit: '—',
      credit: '—'
    },
    {
      id: 6,
      title: 'Invoice Issued',
      actor: 'Elena Rostova (Finance Director)',
      timestamp: '2026-10-15 08:30',
      branch: 'Victoria Island HQ Hub',
      docRef: 'INV-2026-001 ($4,520.00)',
      status: 'Completed',
      summary: 'Statutory commercial tax invoice generated with cryptographic QR verification.',
      ledgerImpact: 'Double-entry posting: Trade Accounts Receivable debited; Commercial Sales Revenue credited.',
      debit: '1100 Trade Receivables ($4,520.00)',
      credit: '4000 Commercial Sales Revenue ($4,520.00)'
    },
    {
      id: 7,
      title: 'Payment Collected',
      actor: 'Elena Rostova',
      timestamp: '2026-10-15 08:45',
      branch: 'Victoria Island HQ Hub',
      docRef: 'PAY-REC-001',
      status: 'Completed',
      summary: 'Direct bank transfer wire confirmed from Zenith Bank treasury feed.',
      ledgerImpact: 'Double-entry posting: Primary Bank Account debited; Trade Accounts Receivable credited.',
      debit: '1010 Operating Bank Account ($4,520.00)',
      credit: '1100 Trade Receivables ($4,520.00)'
    },
    {
      id: 8,
      title: 'General Ledger Posted',
      actor: 'ZEEX Automated Rule Engine',
      timestamp: '2026-10-15 08:45:01',
      branch: 'System Core',
      docRef: 'JE-2026-001',
      status: 'Completed',
      summary: 'Balanced double-entry journal immutable posting. Debits ($4,520.00) = Credits ($4,520.00).',
      ledgerImpact: 'General Ledger posted in real-time. Zero untracked inventory or unposted revenue.',
      debit: 'Debits Total: $4,520.00',
      credit: 'Credits Total: $4,520.00'
    },
    {
      id: 9,
      title: 'Financial Reports Reflect Changes',
      actor: 'Auditor & Executives',
      timestamp: 'Real-time',
      branch: 'Global Consolidated',
      docRef: 'Income Statement & Balance Sheet Q3',
      status: 'Active',
      summary: 'Balance Sheet, Profit & Loss, and Cash Flow statement automatically update with zero discrepancy.',
      ledgerImpact: 'Instant financial transparency with full drill-down audit trail.',
      debit: 'Net Working Capital: Updated',
      credit: 'Gross Margin: +38.4%'
    }
  ];

  const currentStep = steps.find(s => s.id === activeStepId) || steps[5];

  const getStepIcon = (id: number) => {
    switch (id) {
      case 1: return <ShoppingCart className="w-4 h-4" />;
      case 2: return <CheckCircle className="w-4 h-4" />;
      case 3: return <PackageCheck className="w-4 h-4" />;
      case 4: return <PackageCheck className="w-4 h-4" />;
      case 5: return <Truck className="w-4 h-4" />;
      case 6: return <FileText className="w-4 h-4" />;
      case 7: return <DollarSign className="w-4 h-4" />;
      case 8: return <BookOpen className="w-4 h-4" />;
      default: return <PieChart className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            End-to-End Operational & Financial Traceability
          </h2>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            Zero Orphan Records Guarantee
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Every commercial action links sequentially to operational logistics, verified staff identity, and double-entry general ledger postings.
        </p>
      </div>

      {/* Horizontal Interactive Step Pipeline */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-[900px]">
          {steps.map((step, idx) => {
            const isSelected = activeStepId === step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveStepId(step.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex-1 min-w-[120px] ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold font-mono ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                      0{step.id}
                    </span>
                    <span className={isSelected ? 'text-indigo-300' : 'text-slate-500'}>
                      {getStepIcon(step.id)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs truncate">{step.title}</h4>
                  <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {step.actor.split(' ')[0]}
                  </p>
                </button>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail Inspector */}
      <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-mono">
              Pipeline Stage {currentStep.id} of {steps.length}
            </span>
            <h3 className="text-base font-bold text-slate-900">{currentStep.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md">
              {currentStep.status}
            </span>
            <button
              onClick={() =>
                setInspectedRecord({
                  type: 'operational_flow',
                  id: currentStep.docRef,
                  title: `${currentStep.title} (${currentStep.docRef})`
                })
              }
              className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Inspect Record Drawer</span>
            </button>
          </div>
        </div>

        {/* Responsible Staff, Timestamp, Branch */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-2.5">
            <User className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Responsible Staff</p>
              <p className="font-semibold text-slate-900">{currentStep.actor}</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Timestamp Recorded</p>
              <p className="font-semibold text-slate-900 font-mono">{currentStep.timestamp}</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Operating Branch / Site</p>
              <p className="font-semibold text-slate-900">{currentStep.branch}</p>
            </div>
          </div>
        </div>

        {/* Narrative & Document Reference */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">Commercial & Operational Summary</span>
            <span className="font-mono text-indigo-700 font-semibold">{currentStep.docRef}</span>
          </div>
          <p className="text-slate-600 leading-relaxed">{currentStep.summary}</p>
        </div>

        {/* Automatic Double-Entry Ledger Impact */}
        <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-xs">Automatic Double-Entry Ledger Impact</h4>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Debits = Credits Verified
            </span>
          </div>

          <p className="text-xs text-slate-300">{currentStep.ledgerImpact}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 font-mono">
            <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
              <span className="text-emerald-400 font-bold block text-[10px] uppercase">Debit Account</span>
              <span className="text-slate-200">{currentStep.debit}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
              <span className="text-indigo-400 font-bold block text-[10px] uppercase">Credit Account</span>
              <span className="text-slate-200">{currentStep.credit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
