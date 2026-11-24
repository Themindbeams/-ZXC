import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Modal } from '../../common/Modal';
import { CustomFieldDefinition, FieldType } from '../../../types';
import {
  Sliders,
  Play,
  Plus,
  Zap,
  Code2,
  FileCode,
  Shield,
  Check,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Database,
  Webhook
} from 'lucide-react';

export const CustomizationStudio: React.FC = () => {
  const {
    customFields,
    customRecords,
    automationWorkflows,
    addCustomField,
    addCustomRecord,
    toggleWorkflow,
    testRunWorkflow,
    org
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'workflows' | 'fields' | 'objects' | 'api'>('workflows');
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isApiSecretRevealed, setIsApiSecretRevealed] = useState(false);
  const [simulatedWebhookResponse, setSimulatedWebhookResponse] = useState<string | null>(null);

  // New Custom Field State
  const [targetEntity, setTargetEntity] = useState('repair_job');
  const [fieldKey, setFieldKey] = useState('');
  const [label, setLabel] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [required, setRequired] = useState(false);

  // New Custom Record State
  const [recordName, setRecordName] = useState('');
  const [singularName, setSingularName] = useState('');
  const [recordDescription, setRecordDescription] = useState('');

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldKey || !label) return;

    addCustomField({
      targetEntity,
      fieldKey: fieldKey.toLowerCase().replace(/\s+/g, '_'),
      label,
      type: fieldType,
      required
    });

    setIsFieldModalOpen(false);
    setFieldKey('');
    setLabel('');
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordName || !singularName) return;

    addCustomRecord({
      name: recordName,
      singularName,
      slug: recordName.toLowerCase().replace(/\s+/g, '-'),
      icon: 'Database',
      description: recordDescription,
      fields: []
    });

    setIsRecordModalOpen(false);
    setRecordName('');
    setSingularName('');
    setRecordDescription('');
  };

  const handleTestWebhook = () => {
    setSimulatedWebhookResponse('Sending signed HMAC payload to endpoint...');
    setTimeout(() => {
      setSimulatedWebhookResponse(JSON.stringify({
        status: 200,
        event: 'zeex.payment.executed',
        timestamp: new Date().toISOString(),
        payload: {
          payout_id: 'payout_001',
          amount: 8450.00,
          currency: 'USD',
          bank: 'Standard Chartered',
          dual_signature_verified: true
        },
        signature_sha256: 'hmac_sha256_94f8b919a0824b2190184b...'
      }, null, 2));
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Platform Customization Engine</span>
            <span aria-hidden="true">·</span>
            <span>Level 2 No-Code & Level 3 APIs</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            The Customization Studio (One Platform. Every Business.)
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFieldModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Field
          </button>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Define Business Object
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Active Automated Workflows"
          value={String(automationWorkflows.filter(w => w.isActive).length)}
          secondary={`${automationWorkflows.reduce((sum, w) => sum + w.executionCount, 0)} Total Triggers Fired`}
          icon={<Zap className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="Dynamic Custom Fields"
          value={String(customFields.length)}
          secondary="Injected into Core Database Schemas"
          icon={<Sliders className="w-4 h-4" />}
        />
        <StatCard
          label="Custom Business Objects"
          value={String(customRecords.length)}
          secondary="User-Defined Domain Entities"
          icon={<Database className="w-4 h-4" />}
        />
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveSubTab('workflows')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'workflows' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Visual Workflow Automations ({automationWorkflows.length})
        </button>
        <button
          onClick={() => setActiveSubTab('fields')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'fields' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Custom Fields Builder ({customFields.length})
        </button>
        <button
          onClick={() => setActiveSubTab('objects')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'objects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Custom Business Objects ({customRecords.length})
        </button>
        <button
          onClick={() => setActiveSubTab('api')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'api' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Developer API & Webhooks
        </button>
      </div>

      {/* SubTab 1: Workflows */}
      {activeSubTab === 'workflows' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Automated event-driven business rules. Trigger actions, dual-authorization limits, or auto-post balanced accounting entries.
          </div>

          <div className="space-y-3">
            {automationWorkflows.map(wf => (
              <div
                key={wf.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-800">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{wf.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{wf.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleWorkflow(wf.id)}
                      className="text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      {wf.isActive ? (
                        <>
                          <ToggleRight className="w-6 h-6 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                          <span className="text-slate-400">Disabled</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => testRunWorkflow(wf.id)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Simulate rule condition and test live execution"
                    >
                      <Play className="w-3 h-3" />
                      Test Run
                    </button>
                  </div>
                </div>

                {/* Trigger & Conditions visual chain */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-xs font-mono">
                  <div>
                    <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Event Trigger</span>
                    <span className="font-semibold text-slate-800">{wf.triggerEvent}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Condition</span>
                    <span className="text-slate-800">
                      {wf.conditions.map(c => `${c.field} ${c.operator} ${c.value}`).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Action Output</span>
                    <span className="text-slate-800">
                      {wf.actions.map(a => a.type.replace(/_/g, ' ')).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>Execution count: {wf.executionCount} runs</span>
                  <span>Last run: {wf.lastRun || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: Custom Fields */}
      {activeSubTab === 'fields' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Extend core business records with typed database fields without running SQL migrations.</span>
            <span className="font-mono">{customFields.length} Registered Fields</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-3 px-4">Field Label</th>
                  <th className="py-3 px-4">Field Key (JSONB)</th>
                  <th className="py-3 px-4">Attached Entity</th>
                  <th className="py-3 px-4">Data Type</th>
                  <th className="py-3 px-4">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {customFields.map(cf => (
                  <tr key={cf.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">{cf.label}</td>
                    <td className="py-3 px-4 text-slate-600">{cf.fieldKey}</td>
                    <td className="py-3 px-4">
                      <span className="font-sans text-[11px] font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {cf.targetEntity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-semibold uppercase text-[11px]">{cf.type}</td>
                    <td className="py-3 px-4 font-sans">
                      {cf.required ? (
                        <span className="text-emerald-700 font-medium">Yes</span>
                      ) : (
                        <span className="text-slate-400">Optional</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 3: Custom Business Objects */}
      {activeSubTab === 'objects' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Define first-class business entities (e.g. Equipment Inspections, Fuel Tank Dips, Plot Harvests) that adapt the platform to any sector.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customRecords.map(cr => (
              <div key={cr.id} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{cr.name}</h4>
                    <span className="text-xs text-slate-500 font-mono">Slug: {cr.slug}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">{cr.description}</p>

                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Defined Entity Attributes ({cr.fields.length})
                  </span>
                  {cr.fields.map((f, i) => (
                    <div key={i} className="flex justify-between text-slate-700 font-mono text-[11px]">
                      <span>{f.label}</span>
                      <span className="text-slate-400 uppercase">{f.type}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span>{cr.recordsCount} Active Records</span>
                  <span className="text-emerald-700 font-medium">Schema Synchronized</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: Developer APIs & Webhooks */}
      {activeSubTab === 'api' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                API Authentication & REST Gateway
              </span>
              <span className="text-xs font-mono text-emerald-400">Environment: Live Sandboxed</span>
            </div>
            <div className="flex items-center gap-3">
              <code className="p-2 bg-slate-950 rounded text-emerald-400 font-mono text-xs flex-1">
                {isApiSecretRevealed ? 'zx_live_sec_9948018247018bba4820194827018247' : 'zx_live_sec_••••••••••••••••••••••••••••••••'}
              </code>
              <button
                onClick={() => setIsApiSecretRevealed(!isApiSecretRevealed)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium"
              >
                {isApiSecretRevealed ? 'Hide' : 'Reveal Secret'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Platform REST Endpoints</h4>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                  <span className="text-emerald-700 font-bold">GET</span>
                  <span className="text-slate-800">/api/v1/ledger/chart-of-accounts</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                  <span className="text-blue-700 font-bold">POST</span>
                  <span className="text-slate-800">/api/v1/treasury/payout-requests</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                  <span className="text-blue-700 font-bold">POST</span>
                  <span className="text-slate-800">/api/v1/sales/invoices</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100 flex items-center justify-between">
                  <span className="text-emerald-700 font-bold">GET</span>
                  <span className="text-slate-800">/api/v1/inventory/stock-levels</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">Outbound Webhook Tester</h4>
                <button
                  onClick={handleTestWebhook}
                  className="px-3 py-1 bg-slate-900 text-white rounded font-medium text-xs hover:bg-slate-800"
                >
                  Simulate Payload
                </button>
              </div>

              <div className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] min-h-[140px] overflow-x-auto">
                {simulatedWebhookResponse ? (
                  <pre>{simulatedWebhookResponse}</pre>
                ) : (
                  <span className="text-slate-500">Click "Simulate Payload" to test signed HMAC webhook dispatch.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Field Modal */}
      <Modal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        title="Add Dynamic Custom Field"
        subtitle="Injected into database documents and automatically rendered in forms."
        maxWidth="md"
      >
        <form onSubmit={handleAddField} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Target Business Entity</label>
            <select
              value={targetEntity}
              onChange={(e) => setTargetEntity(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              <option value="repair_job">Repair Order / Job Card</option>
              <option value="vehicle">Vehicle Record</option>
              <option value="invoice">Sales Invoice</option>
              <option value="customer">Customer Profile</option>
              <option value="product">Inventory Product SKU</option>
              <option value="matter">Legal Matter</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Display Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Engine Serial Number"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Database Field Key</label>
            <input
              type="text"
              value={fieldKey}
              onChange={(e) => setFieldKey(e.target.value)}
              placeholder="e.g. engine_serial_no"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Data Type</label>
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value as FieldType)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              >
                <option value="text">Text String</option>
                <option value="number">Numeric</option>
                <option value="currency">Currency ($)</option>
                <option value="date">Date</option>
                <option value="boolean">Boolean (Yes/No)</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  className="rounded text-slate-900 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Mandatory Field</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFieldModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Save Custom Field
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Custom Record Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Register Custom Business Object"
        subtitle="Creates a new domain entity in your organization workspace."
        maxWidth="md"
      >
        <form onSubmit={handleAddRecord} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Entity Plural Name</label>
            <input
              type="text"
              value={recordName}
              onChange={(e) => setRecordName(e.target.value)}
              placeholder="e.g. Tank Dip Readings"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Singular Name</label>
            <input
              type="text"
              value={singularName}
              onChange={(e) => setSingularName(e.target.value)}
              placeholder="e.g. Tank Dip Reading"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Description</label>
            <textarea
              value={recordDescription}
              onChange={(e) => setRecordDescription(e.target.value)}
              placeholder="e.g. Daily manual gauge measurements of underground fuel storage"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 h-20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Create Business Entity
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
