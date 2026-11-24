import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import { RepairOrder, Vehicle } from '../../types';
import {
  Wrench,
  Car,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  Search
} from 'lucide-react';

export const AutomotiveWorkspace: React.FC = () => {
  const {
    vehicles,
    repairOrders,
    updateRepairOrderStatus,
    createRepairOrder,
    createInvoice,
    employees,
    formatCurrency,
    activeBranch
  } = useApp();

  const [activeTab, setActiveTab] = useState<'repair_orders' | 'vehicles'>('repair_orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<RepairOrder | null>(null);

  // New repair order form
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [technicianName, setTechnicianName] = useState('Adekunle Babalola');
  const [issueDescription, setIssueDescription] = useState('');
  const [partsCost, setPartsCost] = useState(350);
  const [laborCost, setLaborCost] = useState(250);

  const activeRepairsCount = repairOrders.filter(ro => ro.status !== 'Ready for Pickup' && ro.status !== 'Invoiced').length;
  const readyForPickupCount = repairOrders.filter(ro => ro.status === 'Ready for Pickup').length;
  const totalWipValuation = repairOrders.reduce((sum, ro) => sum + ro.totalCost, 0);

  const filteredOrders = repairOrders.filter(ro =>
    ro.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ro.vehicleSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ro.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === vehicleId);
    if (!veh) return;

    createRepairOrder({
      vehicleId: veh.id,
      vehicleSummary: `${veh.year} ${veh.make} ${veh.model} (${veh.licensePlate})`,
      customerName: veh.ownerName,
      technicianName,
      dateIn: new Date().toISOString().substring(0, 10),
      estimatedCompletion: '2026-10-18',
      status: 'Diagnosing',
      issueDescription: issueDescription || 'Standard multi-point inspection & diagnostic scan.',
      inspectionSummary: {
        brakes: 'Attention',
        engineOil: 'Good',
        suspension: 'Good',
        battery: 'Good'
      },
      partsCost: Number(partsCost),
      laborCost: Number(laborCost),
      totalCost: Number(partsCost) + Number(laborCost)
    });

    setIsNewOrderOpen(false);
    setIssueDescription('');
  };

  const handleGenerateInvoiceFromRO = (ro: RepairOrder) => {
    createInvoice({
      customerId: 'cust_101',
      customerName: ro.customerName,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: '2026-10-28',
      subtotal: ro.partsCost + ro.laborCost,
      taxTotal: Number(((ro.partsCost + ro.laborCost) * 0.075).toFixed(2)),
      discountTotal: 0,
      total: Number(((ro.partsCost + ro.laborCost) * 1.075).toFixed(2)),
      currency: 'USD',
      branchId: activeBranch.id,
      notes: `Generated from Workshop Repair Order ${ro.orderNumber} for ${ro.vehicleSummary}`,
      items: [
        {
          id: `item_labor_${Date.now()}`,
          description: `Mechanical & Diagnostic Labor: ${ro.issueDescription.slice(0, 50)}...`,
          quantity: 1,
          unitPrice: ro.laborCost,
          taxRate: 7.5,
          total: ro.laborCost * 1.075,
          glAccountCode: '4020'
        },
        {
          id: `item_parts_${Date.now()}`,
          description: `OEM Spare Parts and Consumables`,
          quantity: 1,
          unitPrice: ro.partsCost,
          taxRate: 7.5,
          total: ro.partsCost * 1.075,
          glAccountCode: '4010'
        }
      ]
    });

    updateRepairOrderStatus(ro.id, 'Invoiced');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Specialized Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Automotive & Mechanic Engineering</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Workshop Floor, Job Cards & Vehicle Profiles
          </h1>
        </div>

        <button
          onClick={() => setIsNewOrderOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Open New Repair Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Vehicles In Service"
          value={String(activeRepairsCount)}
          secondary="On Hydraulic Lifts & Diagnostic Bays"
          icon={<Wrench className="w-4 h-4 text-slate-700" />}
        />
        <StatCard
          label="Ready for Customer Handover"
          value={String(readyForPickupCount)}
          secondary="Quality Inspection Cleared"
          icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Active Workshop WIP Value"
          value={formatCurrency(totalWipValuation)}
          secondary="Billable Parts & Labor In Progress"
          icon={<Car className="w-4 h-4" />}
        />
      </div>

      {/* Segmented Controls & Search */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('repair_orders')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'repair_orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Repair Orders / Job Cards ({repairOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'vehicles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Registered Vehicles ({vehicles.length})
          </button>
        </div>

        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search RO #, plate, make, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Repair Orders View */}
      {activeTab === 'repair_orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map(ro => (
              <div
                key={ro.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 block">{ro.orderNumber}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{ro.vehicleSummary}</h4>
                    <span className="text-xs text-slate-500">{ro.customerName}</span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    ro.status === 'Ready for Pickup'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : ro.status === 'In Repair'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : ro.status === 'Invoiced'
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {ro.status}
                  </span>
                </div>

                {/* Issue Description */}
                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
                  {ro.issueDescription}
                </p>

                {/* Digital Inspection Indicators */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Diagnostic Inspection Points
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
                    <div className={`p-1 rounded ${
                      ro.inspectionSummary.brakes === 'Critical' ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Brakes: {ro.inspectionSummary.brakes}
                    </div>
                    <div className="p-1 rounded bg-slate-100 text-slate-700">
                      Oil: {ro.inspectionSummary.engineOil}
                    </div>
                    <div className="p-1 rounded bg-slate-100 text-slate-700">
                      Susp: {ro.inspectionSummary.suspension}
                    </div>
                    <div className="p-1 rounded bg-slate-100 text-slate-700">
                      Batt: {ro.inspectionSummary.battery}
                    </div>
                  </div>
                </div>

                {/* Technician & Costs */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tech: {ro.technicianName.split(' ')[0]}</span>
                  </div>
                  <div className="font-mono text-right">
                    <span className="text-[10px] text-slate-400 font-sans block">Parts + Labor</span>
                    <span className="font-bold text-slate-900">{formatCurrency(ro.totalCost)}</span>
                  </div>
                </div>

                {/* Status Switcher & Billing Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <select
                    value={ro.status}
                    onChange={(e) => updateRepairOrderStatus(ro.id, e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-medium"
                  >
                    <option value="Diagnosing">Diagnosing</option>
                    <option value="Parts Ordered">Parts Ordered</option>
                    <option value="In Repair">In Repair</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Invoiced">Invoiced</option>
                  </select>

                  {ro.status !== 'Invoiced' && (
                    <button
                      onClick={() => handleGenerateInvoiceFromRO(ro)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                      title="Generate customer commercial invoice and post to General Ledger"
                    >
                      <FileText className="w-3 h-3" />
                      Invoice & Post
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicles Database View */}
      {activeTab === 'vehicles' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">License Plate</th>
                <th className="py-3 px-4">Make & Model</th>
                <th className="py-3 px-4">VIN / Chassis #</th>
                <th className="py-3 px-4">Owner / Fleet</th>
                <th className="py-3 px-4 text-right">Mileage</th>
                <th className="py-3 px-4">Engine Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {vehicles.map(veh => (
                <tr key={veh.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">{veh.licensePlate}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">
                    {veh.year} {veh.make} {veh.model}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{veh.vin}</td>
                  <td className="py-3 px-4 font-sans text-slate-700">{veh.ownerName}</td>
                  <td className="py-3 px-4 text-right tabular-nums text-slate-900">
                    {veh.mileage.toLocaleString()} km
                  </td>
                  <td className="py-3 px-4 text-slate-500">{veh.engineCode || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Repair Order Modal */}
      <Modal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        title="Open Repair Order & Job Card"
        subtitle="Associates vehicle profile, symptom diagnostic, and assigns shop floor technician."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Vehicle</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.make} {v.model} — {v.licensePlate} ({v.ownerName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Assigned Lead Technician</label>
            <select
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
            >
              <option value="Adekunle Babalola">Adekunle Babalola (Chief Master Technician)</option>
              <option value="Rasheed Bakare">Rasheed Bakare (Senior Diagnostic Specialist)</option>
              <option value="Emeka Nwosu">Emeka Nwosu (Junior Auto Electrician)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Customer Reported Symptoms / Repair Scope</label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Grinding noise when braking; scheduled transmission fluid flush; check ABS sensor code"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Estimated Parts Cost ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={partsCost}
                onChange={(e) => setPartsCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Estimated Labor Cost ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={laborCost}
                onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewOrderOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Create Job Card
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
