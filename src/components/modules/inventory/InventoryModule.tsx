import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Modal } from '../../common/Modal';
import {
  Package,
  Plus,
  AlertTriangle,
  Building,
  Search,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Warehouse as WarehouseIcon
} from 'lucide-react';

export const InventoryModule: React.FC = () => {
  const {
    products,
    warehouses,
    branches,
    activeBranch,
    stockTransfers,
    createStockTransfer,
    receiveStockTransfer,
    updateProductStock,
    createProduct,
    formatCurrency
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'transfers' | 'warehouses'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // New product state
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Spare Parts');
  const [unit, setUnit] = useState('Unit');
  const [costPrice, setCostPrice] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(90);
  const [stockQuantity, setStockQuantity] = useState(20);
  const [reorderLevel, setReorderLevel] = useState(10);
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || 'wh_main');
  const [batchNumber, setBatchNumber] = useState('B-2026-10');

  // Stock Transfer state
  const [transferTargetBranchId, setTransferTargetBranchId] = useState(branches[1]?.id || 'branch_abuja');
  const [transferProductId, setTransferProductId] = useState(products[0]?.id || '');
  const [transferQty, setTransferQty] = useState(10);

  const totalSKUs = products.length;
  const totalValuation = products.reduce((sum, p) => sum + (p.costPrice * p.stockQuantity), 0);
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.reorderLevel);

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = selectedWarehouse === 'All' || p.warehouseId === selectedWarehouse;
    return matchesSearch && matchesWarehouse;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name) return;

    createProduct({
      sku: sku.toUpperCase(),
      name,
      category,
      unit,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stockQuantity: Number(stockQuantity),
      reorderLevel: Number(reorderLevel),
      warehouseId,
      batchNumber
    });

    setIsNewProductOpen(false);
    setSku('');
    setName('');
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    createStockTransfer(transferTargetBranchId, transferProductId, Number(transferQty));
    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Inventory & Supply Chain</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Warehouse & Inter-Branch Transfers</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Stock Management, Batches & Cross-Branch Logistics
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
            Inter-Branch Stock Transfer
          </button>
          <button
            onClick={() => setIsNewProductOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Catalog Item / SKU
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Catalog SKUs"
          value={String(totalSKUs)}
          secondary={`${warehouses.length} Active Storage Locations`}
          icon={<Package className="w-4 h-4" />}
        />
        <StatCard
          label="Total Inventory Valuation"
          value={formatCurrency(totalValuation)}
          secondary="At Weighted Average Cost (FIFO/WAC)"
          icon={<Building className="w-4 h-4" />}
        />
        <StatCard
          label="Low Stock Alerts"
          value={String(lowStockProducts.length)}
          secondary="Items At or Below Safety Threshold"
          icon={<AlertTriangle className="w-4 h-4 text-rose-500" />}
        />
      </div>

      {/* Low Stock Alert Strip if any */}
      {lowStockProducts.length > 0 && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Reorder Trigger Activated:</strong> {lowStockProducts.map(p => p.name).join(', ')} require replenishment from approved suppliers.
            </span>
          </div>
          <span className="font-semibold text-rose-800 text-[11px] underline">
            Supplier PO Recommended
          </span>
        </div>
      )}

      {/* Segmented Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Catalog & Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveSubTab('transfers')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'transfers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inter-Branch Stock Transfers ({stockTransfers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('warehouses')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'warehouses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warehouses & Storage Hubs ({warehouses.length})
          </button>
        </div>

        {activeSubTab === 'catalog' && (
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search SKU, name, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium"
            >
              <option value="All">All Storage Locations</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Products Table */}
      {activeSubTab === 'catalog' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">SKU & Barcode</th>
                <th className="py-3 px-4">Product Name & Category</th>
                <th className="py-3 px-4">Warehouse Depot</th>
                <th className="py-3 px-4 text-right">Cost Price</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(prod => {
                const wh = warehouses.find(w => w.id === prod.warehouseId);
                const isLowStock = prod.stockQuantity <= prod.reorderLevel;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{prod.sku}</span>
                      {prod.batchNumber && (
                        <span className="text-[10px] text-slate-400 font-mono">Batch: {prod.batchNumber}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{prod.name}</div>
                      <span className="text-[11px] text-slate-500">{prod.category} · {prod.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {wh ? wh.name : 'Central Hub'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                      {formatCurrency(prod.costPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatCurrency(prod.sellingPrice)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-mono font-bold tabular-nums text-sm ${
                        isLowStock ? 'text-rose-600' : 'text-slate-900'
                      }`}>
                        {prod.stockQuantity}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Min: {prod.reorderLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => updateProductStock(prod.id, -1)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer text-xs"
                          title="Reduce stock by 1"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateProductStock(prod.id, 5)}
                          className="px-2 h-6 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center justify-center cursor-pointer text-[11px]"
                          title="Restock +5"
                        >
                          +5 Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Inter-Branch Stock Transfers */}
      {activeSubTab === 'transfers' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Secure cross-branch inventory transfers between Victoria Island HQ Hub, Abuja CBD Store, and regional distribution depots.
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-3 px-4">Transfer #</th>
                  <th className="py-3 px-4">Origin & Target Branch</th>
                  <th className="py-3 px-4">Product Transferred</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4">Dispatch Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockTransfers.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.transferNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{st.sourceBranchName} &rarr; {st.targetBranchName}</div>
                      <span className="text-[11px] text-slate-400">Initiated by: {st.requestedBy}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{st.productName}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {st.quantity} units
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{st.dispatchDate}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        st.status === 'Received & Reconciled'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {st.status === 'In Transit' && (
                        <button
                          onClick={() => receiveStockTransfer(st.id)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium text-xs cursor-pointer shadow-xs"
                        >
                          Confirm & Receive
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Warehouses */}
      {activeSubTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map(wh => {
            const whProds = products.filter(p => p.warehouseId === wh.id);
            const whValuation = whProds.reduce((sum, p) => sum + (p.costPrice * p.stockQuantity), 0);

            return (
              <div key={wh.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400">{wh.code}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{wh.name}</h4>
                  </div>
                  <WarehouseIcon className="w-5 h-5 text-slate-400" />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-sans text-slate-500">Stocked SKUs:</span>
                    <strong>{whProds.length} lines</strong>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="font-sans text-slate-500">Storage Valuation:</span>
                    <strong>{formatCurrency(whValuation)}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
                  <span>{wh.location}</span>
                  <span>Manager: {wh.manager}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Product Modal */}
      <Modal
        isOpen={isNewProductOpen}
        onClose={() => setIsNewProductOpen(false)}
        title="Add Inventory Item / Catalog SKU"
        subtitle="Registers product in valuation ledger and configures safety reorder threshold."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. BRK-PAD-09"
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Batch Number</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Denso Heavy Duty Alternator 130A"
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Unit of Measure</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Piece, Set, Box, Bag"
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Initial Stock</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Reorder Level</label>
              <input
                type="number"
                min="1"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(parseInt(e.target.value) || 1)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Warehouse</label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewProductOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Save Catalog SKU
            </button>
          </div>
        </form>
      </Modal>

      {/* Inter-Branch Transfer Modal */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Inter-Branch Inventory Transfer"
        subtitle={`Dispatch physical inventory from ${activeBranch.name} to another operating branch.`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Target Receiving Branch</label>
            <select
              value={transferTargetBranchId}
              onChange={(e) => setTransferTargetBranchId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              {branches.filter(b => b.id !== activeBranch.id).map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Product to Transfer</label>
            <select
              value={transferProductId}
              onChange={(e) => setTransferProductId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.sku} — {p.name} (Available: {p.stockQuantity} {p.unit}s)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Transfer Quantity</label>
            <input
              type="number"
              min="1"
              value={transferQty}
              onChange={(e) => setTransferQty(parseInt(e.target.value) || 1)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs leading-relaxed">
            Stock will be deducted from your current warehouse immediately and tracked "In Transit" until verified by the receiving branch manager.
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Dispatch Stock Transfer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
