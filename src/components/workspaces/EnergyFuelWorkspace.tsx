import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import { FuelTank, PumpShiftReading } from '../../types';
import {
  Fuel,
  Droplet,
  Layers,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const EnergyFuelWorkspace: React.FC = () => {
  const {
    fuelTanks,
    pumpReadings,
    recordPumpShift,
    updateTankDip,
    formatCurrency
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pumps' | 'tanks'>('pumps');
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isDipModalOpen, setIsDipModalOpen] = useState(false);
  const [selectedTankId, setSelectedTankId] = useState(fuelTanks[0]?.id || '');

  // Shift form
  const [pumpIsland, setPumpIsland] = useState('Pump Island 01 - Dual Nozzle');
  const [fuelType, setFuelType] = useState('PMS Petrol');
  const [attendantName, setAttendantName] = useState('Tunde Adeleke');
  const [openingMeter, setOpeningMeter] = useState<number>(151340.0);
  const [closingMeter, setClosingMeter] = useState<number>(153500.0);
  const [unitPrice, setUnitPrice] = useState<number>(0.72);
  const [cashRemitted, setCashRemitted] = useState<number>(1100.0);
  const [posRemitted, setPosRemitted] = useState<number>(455.20);

  // Dip form
  const [currentLiters, setCurrentLiters] = useState<number>(31000);
  const [waterDipCm, setWaterDipCm] = useState<number>(0.2);

  const totalFuelVolumeLiters = fuelTanks.reduce((sum, t) => sum + t.currentStockLiters, 0);
  const totalVolumeSold = pumpReadings.reduce((sum, r) => sum + r.volumeDispensedLiters, 0);
  const totalFuelRevenue = pumpReadings.reduce((sum, r) => sum + r.expectedRevenue, 0);

  const volumeDispensed = Math.max(0, closingMeter - openingMeter);
  const expectedTotal = Number((volumeDispensed * unitPrice).toFixed(2));
  const shiftVariance = Number(((cashRemitted + posRemitted) - expectedTotal).toFixed(2));

  const handleRecordShift = (e: React.FormEvent) => {
    e.preventDefault();
    recordPumpShift({
      pumpIsland,
      fuelType,
      attendantName,
      shiftDate: `${new Date().toISOString().substring(0, 10)} (Morning Shift)`,
      openingMeterLiters: Number(openingMeter),
      closingMeterLiters: Number(closingMeter),
      volumeDispensedLiters: volumeDispensed,
      unitPricePerLiter: Number(unitPrice),
      expectedRevenue: expectedTotal,
      cashRemitted: Number(cashRemitted),
      posTerminalRemitted: Number(posRemitted)
    });

    setIsShiftModalOpen(false);
  };

  const handleRecordDip = (e: React.FormEvent) => {
    e.preventDefault();
    updateTankDip(selectedTankId, Number(currentLiters), Number(waterDipCm));
    setIsDipModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Specialized Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Energy & Fuel Station Management</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Underground Tanks, Pump Meters & Shift Sales Reconciliation
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDipModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Droplet className="w-3.5 h-3.5 text-blue-600" />
            Record Tank Dip Reading
          </button>
          <button
            onClick={() => setIsShiftModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Reconcile Attendant Pump Shift
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Underground Tank Inventory"
          value={`${totalFuelVolumeLiters.toLocaleString()} Liters`}
          secondary={`${fuelTanks.length} Underground Storage Calibrated Tanks`}
          icon={<Fuel className="w-4 h-4 text-amber-600" />}
        />
        <StatCard
          label="Volume Dispensed Today"
          value={`${totalVolumeSold.toLocaleString()} Liters`}
          secondary="Across All Island Meter Nozzles"
          icon={<Droplet className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Pump Revenue Reconciled"
          value={formatCurrency(totalFuelRevenue)}
          secondary="Posted to General Ledger Revenue"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('pumps')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'pumps' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pump Shift Meter Readings ({pumpReadings.length})
        </button>
        <button
          onClick={() => setActiveTab('tanks')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'tanks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Underground Storage Tanks & Dips ({fuelTanks.length})
        </button>
      </div>

      {/* Tab 1: Pump Shift Readings */}
      {activeTab === 'pumps' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Pump Island & Fuel</th>
                <th className="py-3 px-4">Attendant & Shift</th>
                <th className="py-3 px-4 text-right">Opening Meter (L)</th>
                <th className="py-3 px-4 text-right">Closing Meter (L)</th>
                <th className="py-3 px-4 text-right">Dispensed</th>
                <th className="py-3 px-4 text-right">Remitted (Cash + POS)</th>
                <th className="py-3 px-4 text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {pumpReadings.map(pr => (
                <tr key={pr.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-slate-900">{pr.pumpIsland}</div>
                    <span className="text-[11px] text-slate-500">{pr.fuelType}</span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-medium text-slate-800">{pr.attendantName}</div>
                    <span className="text-[11px] text-slate-400">{pr.shiftDate}</span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                    {pr.openingMeterLiters.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                    {pr.closingMeterLiters.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {pr.volumeDispensedLiters.toLocaleString()} L
                  </td>
                  <td className="py-3 px-4 text-right font-sans text-xs">
                    <strong className="text-slate-900">{formatCurrency(pr.cashRemitted + pr.posTerminalRemitted)}</strong>
                    <span className="block text-[11px] text-slate-400">Cash: {formatCurrency(pr.cashRemitted)} · POS: {formatCurrency(pr.posTerminalRemitted)}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold tabular-nums">
                    <span className={pr.variance < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                      {pr.variance === 0 ? '$0.00 (Balanced)' : `${pr.variance < 0 ? '-' : '+'}${formatCurrency(Math.abs(pr.variance))}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Fuel Tanks & Dip Readings */}
      {activeTab === 'tanks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fuelTanks.map(tank => {
            const pct = Math.round((tank.currentStockLiters / tank.totalCapacityLiters) * 100);

            return (
              <div key={tank.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400">{tank.tankCode}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{tank.fuelType}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {pct}% Full
                  </span>
                </div>

                {/* Visual Level Indicator */}
                <div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        pct < 25 ? 'bg-rose-500' : pct < 50 ? 'bg-amber-500' : 'bg-slate-900'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                    <span>Stock: {tank.currentStockLiters.toLocaleString()} L</span>
                    <span>Capacity: {tank.totalCapacityLiters.toLocaleString()} L</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-sans text-slate-500">Remaining Tank Ullage:</span>
                    <strong>{tank.ullageLiters.toLocaleString()} L</strong>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="font-sans text-slate-500">Bottom Water Dip:</span>
                    <span className={tank.waterDipCm > 1.0 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                      {tank.waterDipCm} cm {tank.waterDipCm <= 1.0 ? '(Safe)' : '(Water Contamination)'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                  Last Dip Calibration: {tank.lastDipTimestamp}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Shift Modal */}
      <Modal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        title="Reconcile Pump Shift & Cash Remittance"
        subtitle="Automatic double-entry sync: Debits Cash/Till (1010), Debits Bank POS (1020), Credits Fuel Revenue (4010)."
        maxWidth="lg"
      >
        <form onSubmit={handleRecordShift} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Pump Island</label>
              <select
                value={pumpIsland}
                onChange={(e) => setPumpIsland(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
              >
                <option value="Pump Island 01 - Dual Nozzle">Pump Island 01 - Dual Nozzle</option>
                <option value="Pump Island 02 - Heavy Diesel">Pump Island 02 - Heavy Diesel</option>
                <option value="Pump Island 03 - High Speed PMS">Pump Island 03 - High Speed PMS</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              >
                <option value="PMS Petrol">PMS Premium Motor Spirit (Petrol)</option>
                <option value="AGO Diesel">AGO Automotive Gas Oil (Diesel)</option>
                <option value="DPK Kerosene">DPK Kerosene</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Attendant Name</label>
            <input
              type="text"
              value={attendantName}
              onChange={(e) => setAttendantName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Opening Meter (L)</label>
              <input
                type="number"
                step="0.1"
                value={openingMeter}
                onChange={(e) => setOpeningMeter(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Closing Meter (L)</label>
              <input
                type="number"
                step="0.1"
                value={closingMeter}
                onChange={(e) => setClosingMeter(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Pump Price ($/L)</label>
              <input
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Cash Remitted to Cashier ($)</label>
              <input
                type="number"
                step="0.01"
                value={cashRemitted}
                onChange={(e) => setCashRemitted(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">POS Card Settled ($)</label>
              <input
                type="number"
                step="0.01"
                value={posRemitted}
                onChange={(e) => setPosRemitted(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="font-sans text-slate-500">Volume Dispensed:</span>
              <strong>{volumeDispensed.toLocaleString()} Liters</strong>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-slate-500">Expected Sales Total:</span>
              <strong>${expectedTotal.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-bold">
              <span className="font-sans">Shift Variance:</span>
              <span className={shiftVariance < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                ${shiftVariance.toFixed(2)} {shiftVariance === 0 ? '(Balanced)' : ''}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsShiftModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Reconcile & Post to General Ledger
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Dip Modal */}
      <Modal
        isOpen={isDipModalOpen}
        onClose={() => setIsDipModalOpen(false)}
        title="Record Underground Tank Dip Measurement"
        subtitle="Log calibration dip tape reading and water presence in underground tank."
        maxWidth="md"
      >
        <form onSubmit={handleRecordDip} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Tank</label>
            <select
              value={selectedTankId}
              onChange={(e) => setSelectedTankId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              {fuelTanks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.tankCode} — {t.fuelType} (Capacity: {t.totalCapacityLiters.toLocaleString()}L)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Measured Stock (Liters)</label>
            <input
              type="number"
              value={currentLiters}
              onChange={(e) => setCurrentLiters(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Bottom Water Dip Paste Reading (cm)</label>
            <input
              type="number"
              step="0.05"
              min="0"
              value={waterDipCm}
              onChange={(e) => setWaterDipCm(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDipModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 cursor-pointer"
            >
              Save Tank Calibration Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
