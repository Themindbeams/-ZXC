import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IntegrationApp } from '../../types';
import {
  CreditCard,
  FileCheck,
  Truck,
  MessageSquare,
  BookOpen,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Plus,
  ExternalLink,
  Layers,
  Key
} from 'lucide-react';

export const IntegrationsMarketplace: React.FC = () => {
  const {
    integrations,
    installIntegration,
    revokeIntegration,
    testSandboxIntegration
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedAppForInstall, setSelectedAppForInstall] = useState<IntegrationApp | null>(null);
  const [enteredApiKey, setEnteredApiKey] = useState('');
  const [testResult, setTestResult] = useState<{ id: string; latency: number } | null>(null);

  const categories = ['all', 'Payment', 'E-Invoicing', 'Logistics', 'Messaging', 'Accounting'];

  const filteredApps = activeCategory === 'all'
    ? integrations
    : integrations.filter(app => app.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Payment': return <CreditCard className="w-5 h-5 text-indigo-600" />;
      case 'E-Invoicing': return <FileCheck className="w-5 h-5 text-emerald-600" />;
      case 'Logistics': return <Truck className="w-5 h-5 text-purple-600" />;
      case 'Messaging': return <MessageSquare className="w-5 h-5 text-sky-600" />;
      case 'Accounting': return <BookOpen className="w-5 h-5 text-amber-600" />;
      default: return <Cpu className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleConfirmInstall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForInstall) return;
    installIntegration(selectedAppForInstall.id, enteredApiKey || 'sk_live_generated_key_8492');
    setSelectedAppForInstall(null);
    setEnteredApiKey('');
  };

  const handleTestSandbox = (appId: string) => {
    const res = testSandboxIntegration(appId);
    setTestResult({ id: appId, latency: res.latencyMs });
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              App Discovery & Verified Integrations Store
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              Sandboxed & Scoped
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Connect external payment gateways, regulatory tax e-invoicing bridges, and freight couriers with explicit business approval and masked secrets.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Plaintext Token Exposure</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer shrink-0 ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Integrations' : cat}
          </button>
        ))}
      </div>

      {/* App Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map(app => (
          <div
            key={app.id}
            className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  {getCategoryIcon(app.category)}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'Installed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">{app.name}</h4>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                {app.provider}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {app.description}
              </p>

              {/* Permission Scopes */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Requested Scopes
                </span>
                <div className="flex flex-wrap gap-1">
                  {app.scopes.map((scope, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-700"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quota & Credentials status if installed */}
              {app.status === 'Installed' && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>API Token:</span>
                    <span className="font-mono text-slate-900 font-semibold">{app.maskedApiKey}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span>Quota: {app.requestsThisMonth} / {app.monthlyQuota} calls</span>
                    <span className="text-emerald-600 font-semibold">{app.lastSyncStatus}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
              {app.status === 'Installed' ? (
                <>
                  <button
                    onClick={() => handleTestSandbox(app.id)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Play className="w-3 h-3 text-indigo-600" />
                    <span>
                      {testResult && testResult.id === app.id
                        ? `OK (${testResult.latency}ms)`
                        : 'Test Sandbox'}
                    </span>
                  </button>
                  <button
                    onClick={() => revokeIntegration(app.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                  >
                    Revoke Access
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedAppForInstall(app)}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Configure & Install</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Installation & Explicit Scope Approval Modal */}
      {selectedAppForInstall && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Approve & Install: {selectedAppForInstall.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Review requested access scopes. Secrets are encrypted at rest with AES-256-GCM.
            </p>

            <form onSubmit={handleConfirmInstall} className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1.5">
                <span className="font-bold text-indigo-950 block">Requested Permission Scopes</span>
                <ul className="space-y-1 text-[11px] text-indigo-900 list-disc list-inside">
                  {selectedAppForInstall.scopes.map((s, idx) => (
                    <li key={idx} className="font-mono">{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  API Key / Live Secret Token
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="sk_live_..."
                    value={enteredApiKey}
                    onChange={e => setEnteredApiKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Stored securely in customer vault. Never transmitted in plaintext logs.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppForInstall(null)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                >
                  Approve & Install
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
