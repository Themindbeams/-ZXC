import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import {
  Wheat,
  Scale,
  Warehouse,
  Sprout,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  Droplets,
  DollarSign
} from 'lucide-react';

export const AgribusinessWorkspace: React.FC = () => {
  const {
    farmPlots,
    cropCycles,
    harvestRecords,
    agroInputs,
    logHarvestRecord,
    formatCurrency,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'harvests' | 'plots' | 'cycles' | 'inputs'>('harvests');
  const [isNewHarvestOpen, setIsNewHarvestOpen] = useState(false);

  // New Harvest Form
  const [selectedCycleId, setSelectedCycleId] = useState(cropCycles[0]?.id || '');
  const [grossWeightKg, setGrossWeightKg] = useState<number>(25000);
  const [gradeAPercent, setGradeAPercent] = useState<number>(85);
  const [moisturePercent, setMoisturePercent] = useState<number>(12.4);
  const [storageSilo, setStorageSilo] = useState('Silo 02 (Kaduna Grain Depot)');
  const [marketRatePerKg, setMarketRatePerKg] = useState<number>(0.85);

  const totalHectares = farmPlots.reduce((sum, p) => sum + p.sizeHectares, 0);
  const totalHarvestTons = (harvestRecords.reduce((sum, h) => sum + h.grossWeightKg, 0) / 1000).toFixed(1);
  const totalSiloValuation = harvestRecords.reduce((sum, h) => sum + h.marketValuation, 0);

  const handleLogWeighbridge = (e: React.FormEvent) => {
    e.preventDefault();
    const cycle = cropCycles.find(c => c.id === selectedCycleId);
    if (!cycle || grossWeightKg <= 0) return;

    const gradeAKg = Number((grossWeightKg * (gradeAPercent / 100)).toFixed(0));
    const gradeBKg = Number((grossWeightKg * ((100 - gradeAPercent) * 0.8 / 100)).toFixed(0));
    const gradeCKg = grossWeightKg - gradeAKg - gradeBKg;
    const valuation = Number((grossWeightKg * marketRatePerKg).toFixed(2));

    logHarvestRecord({
      cropCycleId: cycle.id,
      plotName: cycle.plotName,
      harvestDate: new Date().toISOString().substring(0, 10),
      grossWeightKg: Number(grossWeightKg),
      gradeA_Kg: gradeAKg,
      gradeB_Kg: gradeBKg,
      gradeC_Kg: gradeCKg,
      moistureContentPercent: Number(moisturePercent),
      storageSilo,
      marketValuation: valuation
    });

    setIsNewHarvestOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Specialized Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Agribusiness, Commercial Farms & Grain Silos</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Farm Plots, Crop Cycles, Harvest Weighbridge & Silo Stock
          </h1>
        </div>

        <button
          onClick={() => setIsNewHarvestOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Scale className="w-3.5 h-3.5" />
          Log Weighbridge Harvest Intake
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Cultivated Farmland"
          value={`${totalHectares} Hectares`}
          secondary={`${farmPlots.length} Commercial Plot Blocks`}
          icon={<Wheat className="w-4 h-4 text-emerald-700" />}
        />
        <StatCard
          label="Cumulative Harvest Yield"
          value={`${totalHarvestTons} Tons`}
          secondary="Grain & Legumes Cleared at Weighbridge"
          icon={<Scale className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Silo Inventory Valuation"
          value={formatCurrency(totalSiloValuation)}
          secondary="Tied to GL Asset Account 1050"
          icon={<Warehouse className="w-4 h-4 text-amber-600" />}
        />
      </div>

      {/* Industry Operational Note */}
      <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 shrink-0">
            <Sprout className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-semibold text-slate-100">Agricultural Domain Engine Active:</span>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Weighbridge intake verifies moisture tolerance (&le; 13.0%) for commercial grain storage. Clean Grade A produce is immediately recognized on the general ledger and silo stock ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('harvests')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'harvests' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Weighbridge & Harvest Tickets ({harvestRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('plots')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'plots' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Farm Plots & Irrigation ({farmPlots.length})
        </button>
        <button
          onClick={() => setActiveTab('cycles')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'cycles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Crop Cycles ({cropCycles.length})
        </button>
        <button
          onClick={() => setActiveTab('inputs')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'inputs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Agro Inputs & Fertilizers ({agroInputs.length})
        </button>
      </div>

      {/* Tab 1: Harvest Records */}
      {activeTab === 'harvests' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Weighbridge Ticket</th>
                <th className="py-3 px-4">Plot & Harvest Date</th>
                <th className="py-3 px-4 text-right">Gross Weight</th>
                <th className="py-3 px-4 text-right">Produce Grading (A / B / C)</th>
                <th className="py-3 px-4 text-right">Moisture %</th>
                <th className="py-3 px-4">Destination Storage</th>
                <th className="py-3 px-4 text-right">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {harvestRecords.map(h => (
                <tr key={h.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">{h.harvestNumber}</td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-slate-900">{h.plotName}</div>
                    <span className="text-[11px] font-mono text-slate-400">{h.harvestDate}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {(h.grossWeightKg / 1000).toFixed(2)} Tons
                    <span className="block text-[10px] text-slate-400">{h.grossWeightKg.toLocaleString()} kg</span>
                  </td>
                  <td className="py-3 px-4 text-right text-xs font-sans">
                    <span className="text-emerald-700 font-semibold">Grade A: {(h.gradeA_Kg / 1000).toFixed(1)}T</span>
                    <span className="text-slate-500 block text-[11px]">Grade B: {(h.gradeB_Kg / 1000).toFixed(1)}T · C: {h.gradeC_Kg}kg</span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span className={`font-bold ${h.moistureContentPercent <= 13.0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {h.moistureContentPercent}%
                    </span>
                    <span className="block text-[10px] text-slate-400 font-sans">
                      {h.moistureContentPercent <= 13.0 ? 'Preserved' : 'Drying Req'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">{h.storageSilo}</td>
                  <td className="py-3 px-4 text-right font-bold tabular-nums text-slate-900">
                    {formatCurrency(h.marketValuation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Farm Plots */}
      {activeTab === 'plots' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {farmPlots.map(p => (
            <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{p.plotCode}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{p.name}</h4>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {p.sizeHectares} Ha
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Crop:</span>
                  <strong>{p.currentCrop}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Soil Type:</span>
                  <span>{p.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Irrigation:</span>
                  <span className="flex items-center gap-1 text-blue-700 font-medium">
                    <Droplets className="w-3 h-3" />
                    {p.irrigationStatus}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
                <span>{p.location}</span>
                <span>Lead: {p.agronomistInCharge}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Crop Cycles */}
      {activeTab === 'cycles' && (
        <div className="space-y-4">
          {cropCycles.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900">{c.cycleCode}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{c.cropName} — {c.variety}</h4>
                  <span className="text-xs text-slate-500">Plot: {c.plotName}</span>
                </div>
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                  {c.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Sowing Date</span>
                  <span className="text-slate-800">{c.plantingDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Expected Harvest</span>
                  <span className="text-slate-800">{c.expectedHarvestDate}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Input Cost Accrued</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(c.totalInputCost)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Estimated Yield</span>
                  <span className="text-emerald-700 font-bold">{c.estimatedYieldTons} Tons</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Agro Inputs */}
      {activeTab === 'inputs' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Agro Input Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target Crop</th>
                <th className="py-3 px-4 text-right">Available Stock</th>
                <th className="py-3 px-4 text-right">Unit Acquisition Cost</th>
                <th className="py-3 px-4 text-right">Total Inventory Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {agroInputs.map(inp => (
                <tr key={inp.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">{inp.name}</td>
                  <td className="py-3 px-4 font-sans text-slate-600">{inp.category}</td>
                  <td className="py-3 px-4 font-sans text-slate-500">{inp.targetCrop}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {inp.stockQty} {inp.unit}s
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-700">
                    {formatCurrency(inp.unitCost)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold tabular-nums text-slate-900">
                    {formatCurrency(inp.stockQty * inp.unitCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Harvest Weighbridge Modal */}
      <Modal
        isOpen={isNewHarvestOpen}
        onClose={() => setIsNewHarvestOpen(false)}
        title="Commercial Grain Weighbridge & Silo Clearance"
        subtitle="Automatic double-entry sync: Debits Silo Inventory (1050) and Credits Farm Harvest Revenue (4030)."
        maxWidth="lg"
      >
        <form onSubmit={handleLogWeighbridge} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Crop Cycle & Field Block</label>
            <select
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              {cropCycles.map(c => (
                <option key={c.id} value={c.id}>
                  {c.cycleCode} — {c.cropName} ({c.plotName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Gross Weighbridge Net (kg)</label>
              <input
                type="number"
                min="100"
                value={grossWeightKg}
                onChange={(e) => setGrossWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Moisture Content (%)</label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="30"
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Grade-A Export Proportion (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={gradeAPercent}
                onChange={(e) => setGradeAPercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Market Benchmark ($/kg)</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                value={marketRatePerKg}
                onChange={(e) => setMarketRatePerKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Storage Silo Destination</label>
            <input
              type="text"
              value={storageSilo}
              onChange={(e) => setStorageSilo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="font-sans text-slate-500">Total Produce Valuation:</span>
              <strong className="text-slate-900">${(grossWeightKg * marketRatePerKg).toFixed(2)}</strong>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span className="font-sans">Grade A Export Net:</span>
              <span>{((grossWeightKg * gradeAPercent) / 100).toFixed(0)} kg</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewHarvestOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Verify Weighbridge & Post to Silo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
