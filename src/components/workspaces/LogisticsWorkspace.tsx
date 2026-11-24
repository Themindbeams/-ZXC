import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import { DispatchTrip } from '../../types';
import {
  Truck,
  FileText,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  User
} from 'lucide-react';

export const LogisticsWorkspace: React.FC = () => {
  const {
    fleetVehicles,
    dispatchTrips,
    waybills,
    dispatchNewTrip,
    signProofOfDelivery,
    formatCurrency
  } = useApp();

  const [activeTab, setActiveTab] = useState<'trips' | 'fleet' | 'waybills'>('trips');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedWaybillId, setSelectedWaybillId] = useState<string | null>(null);
  const [podSigneeName, setPodSigneeName] = useState('');

  // New Trip form state
  const [vehicleId, setVehicleId] = useState(fleetVehicles[0]?.id || '');
  const [originHub, setOriginHub] = useState('Lagos Victoria Island Central Hub');
  const [destinationHub, setDestinationHub] = useState('Abuja CBD Logistics Depot');
  const [driverName, setDriverName] = useState('Mallam Ibrahim Garba');
  const [cargoManifest, setCargoManifest] = useState('');
  const [grossWeightTons, setGrossWeightTons] = useState(24.5);
  const [freightCharge, setFreightCharge] = useState(4200);
  const [fuelAdvance, setFuelAdvance] = useState(1100);

  const activeTripsCount = dispatchTrips.filter(t => t.status === 'On Route').length;
  const totalFleetTonnage = fleetVehicles.reduce((sum, v) => sum + v.tonnageCapacity, 0);
  const totalFreightRevenue = dispatchTrips.reduce((sum, t) => sum + t.freightCharge, 0);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = fleetVehicles.find(v => v.id === vehicleId);
    if (!veh || !cargoManifest) return;

    dispatchNewTrip({
      vehicleId: veh.id,
      vehicleReg: `${veh.registrationNumber} (${veh.vehicleType})`,
      driverName,
      originHub,
      destinationHub,
      departureTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      estimatedArrival: '2026-10-16 18:00:00',
      cargoManifest,
      grossWeightTons: Number(grossWeightTons),
      freightCharge: Number(freightCharge),
      fuelAdvanceAllocated: Number(fuelAdvance)
    });

    setIsDispatchModalOpen(false);
    setCargoManifest('');
  };

  const handleSignPod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWaybillId || !podSigneeName) return;
    signProofOfDelivery(selectedWaybillId, podSigneeName);
    setSelectedWaybillId(null);
    setPodSigneeName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Specialized Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Freight Transport, Logistics & Dispatch</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Fleet Command, Waybills & Proof of Delivery (POD)
          </h1>
        </div>

        <button
          onClick={() => setIsDispatchModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Truck className="w-3.5 h-3.5" />
          Dispatch Freight Trip
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Active Haulage Trips"
          value={String(activeTripsCount)}
          secondary="In Transit on Interstate Corridors"
          icon={<Truck className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Total Fleet Capacity"
          value={`${totalFleetTonnage} Tons`}
          secondary={`${fleetVehicles.length} Registered Commercial Trucks`}
          icon={<ShieldCheck className="w-4 h-4 text-slate-800" />}
        />
        <StatCard
          label="Freight Revenue Billed"
          value={formatCurrency(totalFreightRevenue)}
          secondary="Tied to General Ledger Account 4040"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('trips')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'trips' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dispatch Trips & Routes ({dispatchTrips.length})
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'fleet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Fleet Vehicles & Roadworthiness ({fleetVehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('waybills')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'waybills' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Waybills & POD Clearance ({waybills.length})
        </button>
      </div>

      {/* Tab 1: Dispatch Trips */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          {dispatchTrips.map(trip => (
            <div key={trip.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{trip.tripNumber}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="font-mono text-xs text-slate-500">Waybill: {trip.waybillNumber}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{trip.originHub} &rarr; {trip.destinationHub}</h4>
                  <span className="text-xs text-slate-500">Vehicle: {trip.vehicleReg} · Driver: {trip.driverName}</span>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded self-start ${
                  trip.status === 'Delivered'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {trip.status}
                </span>
              </div>

              {/* Manifest Box */}
              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Cargo Manifest</span>
                <p className="text-slate-700 font-medium">{trip.cargoManifest}</p>
              </div>

              {/* Financial & Weight Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-50/50 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Gross Weight</span>
                  <span className="text-slate-900 font-bold">{trip.grossWeightTons} Tons</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Freight Rate</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(trip.freightCharge)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Fuel Advance</span>
                  <span className="text-slate-700">{formatCurrency(trip.fuelAdvanceAllocated)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-sans text-slate-400 font-bold block mb-0.5">Departure Time</span>
                  <span className="text-slate-600">{trip.departureTime.slice(0, 16)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Fleet Vehicles */}
      {activeTab === 'fleet' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Vehicle Specification</th>
                <th className="py-3 px-4">Assigned Driver</th>
                <th className="py-3 px-4 text-right">Capacity (Tons)</th>
                <th className="py-3 px-4 text-right">Odometer</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4 text-right">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {fleetVehicles.map(veh => (
                <tr key={veh.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">{veh.registrationNumber}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">{veh.vehicleType}</td>
                  <td className="py-3 px-4 font-sans text-slate-700">{veh.assignedDriver}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {veh.tonnageCapacity} Tons
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-700">
                    {veh.odometerKm.toLocaleString()} km
                  </td>
                  <td className="py-3 px-4 font-sans text-[11px] text-slate-600">
                    <div>Roadworthy: {veh.roadworthinessExpiry}</div>
                    <span className="text-slate-400">Insurance: {veh.insuranceExpiry}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      veh.status === 'Available in Depot'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {veh.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Waybills & POD */}
      {activeTab === 'waybills' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Waybill Number</th>
                <th className="py-3 px-4">Shipper & Consignee</th>
                <th className="py-3 px-4">Delivery Address</th>
                <th className="py-3 px-4">Proof of Delivery (POD) Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {waybills.map(wb => (
                <tr key={wb.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{wb.waybillNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{wb.consigneeName}</div>
                    <span className="text-[11px] text-slate-500">Shipper: {wb.shipperName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs">{wb.deliveryAddress}</td>
                  <td className="py-3 px-4">
                    {wb.receivedBySignee ? (
                      <div className="text-emerald-700 font-semibold text-xs">
                        Signed: {wb.receivedBySignee}
                        <span className="block text-[10px] font-mono text-slate-400">{wb.podTimestamp}</span>
                      </div>
                    ) : (
                      <span className="text-amber-700 text-xs font-medium">Pending Consignee Signature</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!wb.receivedBySignee && (
                      <button
                        onClick={() => setSelectedWaybillId(wb.id)}
                        className="px-3 py-1 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 cursor-pointer text-xs"
                      >
                        Sign POD
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dispatch Trip Modal */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        title="Dispatch Commercial Freight Trip"
        subtitle="Generates waybill manifest, assigns fleet vehicle and logs driver fuel allowance."
        maxWidth="lg"
      >
        <form onSubmit={handleDispatch} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Fleet Vehicle</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              {fleetVehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} — {v.vehicleType} ({v.tonnageCapacity} Tons capacity)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Origin Terminal Hub</label>
              <input
                type="text"
                value={originHub}
                onChange={(e) => setOriginHub(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Destination Hub</label>
              <input
                type="text"
                value={destinationHub}
                onChange={(e) => setDestinationHub(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Assigned Driver</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Gross Cargo Weight (Tons)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={grossWeightTons}
                onChange={(e) => setGrossWeightTons(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Cargo Manifest Description</label>
            <textarea
              value={cargoManifest}
              onChange={(e) => setCargoManifest(e.target.value)}
              placeholder="e.g. 500 Bags Soybeans in bags + 20 Sets Bosch OEM Calipers"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Freight Rate Billed ($)</label>
              <input
                type="number"
                step="1"
                min="100"
                value={freightCharge}
                onChange={(e) => setFreightCharge(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Driver Fuel Advance ($)</label>
              <input
                type="number"
                step="1"
                min="0"
                value={fuelAdvance}
                onChange={(e) => setFuelAdvance(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsDispatchModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Confirm Dispatch & Issue Waybill
            </button>
          </div>
        </form>
      </Modal>

      {/* Proof of Delivery Modal */}
      <Modal
        isOpen={!!selectedWaybillId}
        onClose={() => setSelectedWaybillId(null)}
        title="Electronic Proof of Delivery (POD)"
        subtitle="Confirm arrival, physical cargo inspection, and consignee signature."
        maxWidth="md"
      >
        <form onSubmit={handleSignPod} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Consignee Receiving Agent Name</label>
            <input
              type="text"
              value={podSigneeName}
              onChange={(e) => setPodSigneeName(e.target.value)}
              placeholder="e.g. Alhaji Babangida, Warehouse Manager"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs leading-relaxed">
            I certify that the goods listed on the electronic waybill manifest have been inspected, weighed and received in good condition with zero carton seal tampering.
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setSelectedWaybillId(null)}
              className="px-4 py-2 border border-slate-200 rounded text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 cursor-pointer"
            >
              Sign & Clear Waybill
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
