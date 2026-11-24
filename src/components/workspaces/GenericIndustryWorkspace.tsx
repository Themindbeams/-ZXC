import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INDUSTRY_TEMPLATES } from '../../data/templatesData';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import {
  HeartPulse,
  Fuel,
  Truck,
  Factory,
  Wheat,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export const GenericIndustryWorkspace: React.FC = () => {
  const { activeIndustryId, formatCurrency } = useApp();
  const template = INDUSTRY_TEMPLATES[activeIndustryId] || INDUSTRY_TEMPLATES.healthcare;

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const getIndustryIcon = () => {
    switch (activeIndustryId) {
      case 'healthcare': return <HeartPulse className="w-5 h-5 text-slate-800" />;
      case 'energy': return <Fuel className="w-5 h-5 text-slate-800" />;
      case 'logistics': return <Truck className="w-5 h-5 text-slate-800" />;
      case 'manufacturing': return <Factory className="w-5 h-5 text-slate-800" />;
      case 'agriculture': return <Wheat className="w-5 h-5 text-slate-800" />;
      default: return <Layers className="w-5 h-5 text-slate-800" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Specialized Workspace</span>
            <span aria-hidden="true">·</span>
            <span>{template.name}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            {template.name} Command & Operations
          </h1>
        </div>

        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Log {template.customRecordTypes[0] || 'Encounter'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label={`${template.customRecordTypes[0] || 'Active Entries'}`}
          value="48 Active"
          secondary="Operational Stream Logged"
          icon={getIndustryIcon()}
        />
        <StatCard
          label="Sector Efficiency Index"
          value="98.4%"
          secondary="Compliance & Operational SLA"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Automated Ledger Sync"
          value="100% Cleared"
          secondary="Tied to Universal Double-Entry Engine"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Architecture Showcase Box */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-lg">
              {getIndustryIcon()}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{template.name} Configuration Profile</h3>
              <p className="text-xs text-slate-500">{template.tagline}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
            Template Active
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {template.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
            <h5 className="font-semibold text-slate-900">Custom Business Objects Activated:</h5>
            <ul className="space-y-1.5 text-slate-600">
              {template.customRecordTypes.map((rec, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
            <h5 className="font-semibold text-slate-900">Operational Safeguards & Rules:</h5>
            <ul className="space-y-1.5 text-slate-600">
              {template.sampleFeatures.map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title={`Record ${template.customRecordTypes[0] || 'Domain Event'}`}
        subtitle={`Captured according to ${template.name} data schema`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Record Title / Identifier</label>
            <input
              type="text"
              placeholder={`e.g. ${template.name} - Unit Log`}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Associated Financial Value ($)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Operational Narration</label>
            <textarea
              placeholder="Operational notes, technician observations, or batch tags..."
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 h-20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsRecordModalOpen(false)}
              className="px-5 py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800"
            >
              Save Record & Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
