import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INDUSTRY_TEMPLATES } from '../../data/templatesData';
import { IndustryCategory } from '../../types';
import { Modal } from '../common/Modal';
import { Check, ArrowRight, Wrench, ShoppingBag, Scale, HeartPulse, Fuel, Truck, Factory, Wheat } from 'lucide-react';

interface BusinessSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessSetupWizard: React.FC<BusinessSetupWizardProps> = ({
  isOpen,
  onClose
}) => {
  const { activeIndustryId, switchIndustry, org, toggleModule } = useApp();
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryCategory>(activeIndustryId);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const template = INDUSTRY_TEMPLATES[selectedIndustry];

  const handleApply = () => {
    switchIndustry(selectedIndustry);
    onClose();
  };

  const getIndustryIcon = (id: IndustryCategory) => {
    switch (id) {
      case 'automotive': return <Wrench className="w-5 h-5 text-slate-800" />;
      case 'retail': return <ShoppingBag className="w-5 h-5 text-slate-800" />;
      case 'legal': return <Scale className="w-5 h-5 text-slate-800" />;
      case 'healthcare': return <HeartPulse className="w-5 h-5 text-slate-800" />;
      case 'energy': return <Fuel className="w-5 h-5 text-slate-800" />;
      case 'logistics': return <Truck className="w-5 h-5 text-slate-800" />;
      case 'manufacturing': return <Factory className="w-5 h-5 text-slate-800" />;
      case 'agriculture': return <Wheat className="w-5 h-5 text-slate-800" />;
      default: return null;
    }
  };

  const availableModulesList = [
    { key: 'accounting', label: 'Double-Entry Accounting & Ledger', desc: 'General ledger, balance sheet, P&L, chart of accounts' },
    { key: 'treasury', label: 'Treasury & Dual Authorization', desc: 'Maker-checker payout approvals, ZEEX Bank sync' },
    { key: 'sales', label: 'Sales & Customer Invoicing', desc: 'Quotations, accounts receivable, invoice payments' },
    { key: 'inventory', label: 'Inventory & Multi-Warehouse', desc: 'Stock quantities, reorder alerts, supplier purchase orders' },
    { key: 'hr', label: 'HR & Payroll Engine', desc: 'Employee registry, tax deductions, automated payroll batches' },
    { key: 'operations', label: 'Operations & Project Tracking', desc: 'Milestones, timesheets, job profitability calculations' },
    { key: 'pos', label: 'High-Speed Point of Sale (POS)', desc: 'Barcode scanning, cashier receipts, instant ledger sync' },
    { key: 'customization', label: 'No-Code Customization Studio', desc: 'Custom fields, custom records, automated workflows' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Universal Business Setup Wizard"
      subtitle="ZEEX Commerce adapts to how your business operates without rewriting core software."
      maxWidth="3xl"
    >
      {/* Step Indicator */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step === 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
          }`}>1</span>
          <span className={step === 1 ? 'font-semibold text-slate-900' : ''}>Select Industry</span>
        </div>
        <span className="text-slate-300">———</span>
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step === 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
          }`}>2</span>
          <span className={step === 2 ? 'font-semibold text-slate-900' : ''}>Activate Modules</span>
        </div>
        <span className="text-slate-300">———</span>
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
            step === 3 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
          }`}>3</span>
          <span className={step === 3 ? 'font-semibold text-slate-900' : ''}>Generated Workspace</span>
        </div>
      </div>

      {/* Step 1: Industry Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Select an industry template. Each template automatically configures custom business records, digital forms, and specialized reports on top of the shared financial ledger:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {(Object.keys(INDUSTRY_TEMPLATES) as IndustryCategory[]).map((key) => {
              const tmpl = INDUSTRY_TEMPLATES[key];
              const isSelected = selectedIndustry === key;

              return (
                <div
                  key={key}
                  onClick={() => setSelectedIndustry(key)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 hover:border-slate-400 bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-slate-100'}`}>
                        {getIndustryIcon(key)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{tmpl.name}</h4>
                        <span className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {tmpl.tagline}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                  </div>

                  <p className={`mt-3 text-xs line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                    {tmpl.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              Continue to Modules
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Modules Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Configure Modules for {template.name}</h4>
              <p className="text-xs text-slate-500">Enable or disable modules so your team only sees relevant tools.</p>
            </div>
            <button
              onClick={() => {
                // activate recommended
                template.recommendedModules.forEach(m => {
                  if (!org.activatedModules.includes(m)) toggleModule(m);
                });
              }}
              className="text-xs text-slate-700 font-semibold underline"
            >
              Select Recommended
            </button>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {availableModulesList.map((m) => {
              const isActive = org.activatedModules.includes(m.key) || template.recommendedModules.includes(m.key);
              return (
                <div
                  key={m.key}
                  onClick={() => toggleModule(m.key)}
                  className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors cursor-pointer ${
                    isActive
                      ? 'border-slate-800 bg-slate-50/90'
                      : 'border-slate-200 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div className="pr-4">
                    <h5 className="text-xs font-semibold text-slate-900">{m.label}</h5>
                    <p className="text-[11px] text-slate-500">{m.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                    isActive ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-950"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              Review Workspace Preview
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Workspace Preview & Launch */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="p-4 bg-slate-900 text-white rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Generated Business Architecture</span>
              <span className="text-xs text-emerald-400 font-medium">Ready to Deploy</span>
            </div>
            <h3 className="text-base font-bold">{template.name} Workspace</h3>
            <p className="text-xs text-slate-300 mt-1">{template.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
              <h5 className="font-semibold text-slate-900 mb-2">Specialized Custom Objects</h5>
              <ul className="space-y-1.5 text-slate-600">
                {template.customRecordTypes.map((rec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
              <h5 className="font-semibold text-slate-900 mb-2">Automated Workflows & Safeguards</h5>
              <ul className="space-y-1.5 text-slate-600">
                {template.sampleFeatures.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="line-clamp-1">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            <strong>Double-entry ledger intact:</strong> Switching industries will seamlessly adapt the forms, screens, and business objects while your universal chart of accounts, bank balances, and journal entries remain completely preserved and audit-compliant.
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-950"
            >
              Back
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              Activate & Launch Workspace
              <Check className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
