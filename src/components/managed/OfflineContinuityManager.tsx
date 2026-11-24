import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

export const OfflineContinuityManager: React.FC = () => {
  const {
    offlineConfig,
    setOfflineMode,
    offlineQueue,
    recordOfflineTransaction,
    syncOfflineQueue,
    resolveOfflineConflict,
    formatCurrency,
    currentUser
  } = useApp();

  const [testSaleAmount, setTestSaleAmount] = useState('185.00');
  const [testSummary, setTestSummary] = useState('2x Synthetic Oil 5W-30 + Air Filter');
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);

  const pendingCount = offlineQueue.filter(q => q.status === 'Pending Sync').length;
  const conflictCount = offlineQueue.filter(q => q.status === 'Conflict Review').length;

  const handleSimulateOfflineSale = (e: React.FormEvent) => {
    e.preventDefault();
    recordOfflineTransaction({
      type: 'POS_SALE',
      dataSummary: testSummary,
      amount: parseFloat(testSaleAmount) || 50
    });
  };

  const handleRunSync = () => {
    setIsSimulatingSync(true);
    setTimeout(() => {
      syncOfflineQueue();
      setIsSimulatingSync(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header & Status Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Limited Offline Continuity Engine
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                offlineConfig.isSimulatedOffline
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {offlineConfig.isSimulatedOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                  <span>Offline Continuity Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cloud Connected (Live)</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Allow front-line sales and till operations to continue seamlessly during local ISP network cuts without risking data corruption.
          </p>
        </div>

        {/* Toggle Online / Offline Simulation */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setOfflineMode(!offlineConfig.isSimulatedOffline)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
              offlineConfig.isSimulatedOffline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {offlineConfig.isSimulatedOffline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>Reconnect to Cloud</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>Simulate ISP Network Loss</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Offline Guardrails & Operating Boundaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Allowed Offline Rules */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Permitted Offline Operations</span>
          </div>
          <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside">
            <li>Frontline retail sales using local cached price catalog ({offlineConfig.cachedPriceCatalogCount} items cached).</li>
            <li>Physical cash receipts and authorized card swipes up to configured limit ({formatCurrency(offlineConfig.maxOfflineAmountLimit)} max basket).</li>
            <li>Maximum offline limit: <strong>{offlineConfig.maxOfflineTransactionCount} transactions</strong> before manager override is required.</li>
            <li>Transactions encrypted locally in client storage until connection restoration.</li>
          </ul>
        </div>

        {/* Prohibited Offline Rules (Statutory & Risk Prevention) */}
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
          <div className="flex items-center gap-2 text-rose-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-700" />
            <span>Prohibited While Disconnected</span>
          </div>
          <ul className="space-y-1.5 text-slate-700 text-[11px] list-disc list-inside">
            <li><strong>No legal tax e-invoicing</strong>: Regulatory tax QR generation requires live authority endpoint.</li>
            <li><strong>No bank transfer verification</strong>: Bank statement polling is suspended until cloud sync.</li>
            <li><strong>No wire disbursements</strong>: Payout executions strictly blocked while offline.</li>
            <li>Single sales exceeding threshold require reconciliation review upon reconnect.</li>
          </ul>
        </div>
      </div>

      {/* Offline Simulation Playground */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Simulate Offline Till Checkout
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Operator: {currentUser.name} · Till: Till 01
          </span>
        </div>

        <form onSubmit={handleSimulateOfflineSale} className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Items summary (e.g. 2x Brake Fluid + Wiper Blades)"
              value={testSummary}
              onChange={e => setTestSummary(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
              required
            />
          </div>
          <div className="w-32">
            <input
              type="number"
              step="0.01"
              placeholder="Amount $"
              value={testSaleAmount}
              onChange={e => setTestSaleAmount(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-mono"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors shadow-xs cursor-pointer"
          >
            Record Offline Sale
          </button>
        </form>
      </div>

      {/* Offline Queue & Synchronization Drawer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Encrypted Local Offline Queue</h3>
            <p className="text-xs text-slate-500">
              Transactions stored securely and pending cloud synchronization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSync}
              disabled={isSimulatingSync || pendingCount === 0}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingSync ? 'animate-spin' : ''}`} />
              <span>Sync All Transactions ({pendingCount})</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Queue ID</th>
                <th className="px-3 py-3">Recorded At</th>
                <th className="px-3 py-3">Transaction Summary</th>
                <th className="px-3 py-3">Operator & Till</th>
                <th className="px-3 py-3 text-right">Amount</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right">Conflict Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offlineQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Offline queue is empty. No pending local transactions.
                  </td>
                </tr>
              ) : (
                offlineQueue.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">{item.id}</td>
                    <td className="px-3 py-3 text-slate-600">{item.recordedAt}</td>
                    <td className="px-3 py-3 text-slate-800 max-w-xs">{item.dataSummary}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {item.operatorName} ({item.tillNumber})
                    </td>
                    <td className="px-3 py-3 font-mono text-right font-semibold text-slate-900">
                      {item.amount !== undefined ? formatCurrency(item.amount) : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.status === 'Synced'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : item.status === 'Conflict Review'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.status === 'Conflict Review' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => resolveOfflineConflict(item.id, 'override')}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => resolveOfflineConflict(item.id, 'discard')}
                            className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-semibold hover:bg-rose-700 cursor-pointer"
                          >
                            Discard
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
