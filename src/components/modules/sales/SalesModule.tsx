import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Modal } from '../../common/Modal';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { Invoice } from '../../../types';
import {
  FileText,
  Plus,
  Search,
  Eye,
  CheckCircle,
  Users,
  DollarSign,
  Clock,
  Trash2
} from 'lucide-react';

export const SalesModule: React.FC = () => {
  const {
    invoices,
    customers,
    createInvoice,
    payInvoice,
    formatCurrency,
    activeBranch
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'customers'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  // New Invoice Form
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [dueDate, setDueDate] = useState('2026-10-31');
  const [notes, setNotes] = useState('Payment term: 14 days net.');
  const [items, setItems] = useState([
    { id: '1', description: 'Specialized Engineering Diagnostic & Overhaul', quantity: 1, unitPrice: 1200, taxRate: 7.5 }
  ]);

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalOutstanding = invoices
    .filter(i => i.status !== 'Paid')
    .reduce((sum, i) => sum + (i.total - i.paidAmount), 0);
  const totalCollected = invoices.reduce((sum, i) => sum + i.paidAmount, 0);

  const filteredInvoices = invoices.filter(i =>
    i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: String(Date.now()), description: '', quantity: 1, unitPrice: 150, taxRate: 7.5 }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, val: string | number) => {
    setItems(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

  const calculateTax = () =>
    items.reduce((sum, item) => sum + ((Number(item.quantity) * Number(item.unitPrice)) * (Number(item.taxRate) / 100)), 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const sub = calculateSubtotal();
    const tax = calculateTax();
    const grandTotal = sub + tax;

    createInvoice({
      customerId: cust.id,
      customerName: cust.name,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate,
      subtotal: sub,
      taxTotal: tax,
      discountTotal: 0,
      total: grandTotal,
      currency: 'USD',
      branchId: activeBranch.id,
      notes,
      items: items.map(item => ({
        id: item.id,
        description: item.description || 'Professional Services & Goods',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        taxRate: Number(item.taxRate),
        total: (Number(item.quantity) * Number(item.unitPrice)) * (1 + Number(item.taxRate) / 100)
      }))
    });

    setIsNewInvoiceOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Sales & Accounts Receivable</span>
            <span aria-hidden="true">·</span>
            <span>Commercial Invoicing</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Customer Invoicing & Revenue Contracts
          </h1>
        </div>

        <button
          onClick={() => setIsNewInvoiceOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Commercial Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Billed Invoices"
          value={formatCurrency(totalInvoiced)}
          secondary={`${invoices.length} Registered Invoices`}
          icon={<FileText className="w-4 h-4" />}
        />
        <StatCard
          label="Outstanding Receivables"
          value={formatCurrency(totalOutstanding)}
          secondary="Awaiting Customer Wire/Payment"
          icon={<Clock className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="Collected Revenue"
          value={formatCurrency(totalCollected)}
          secondary="Cleared in ZEEX Bank"
          icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'invoices' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invoices List ({invoices.length})
          </button>
          <button
            onClick={() => setActiveSubTab('customers')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'customers' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Accounts ({customers.length})
          </button>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search invoice #, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Invoices Table */}
      {activeSubTab === 'invoices' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{inv.customerName}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{inv.issueDate}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{inv.dueDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                    {formatCurrency(inv.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : inv.status === 'Partially Paid'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-700 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>View</span>
                      </button>

                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => payInvoice(inv.id, 'ZEEX Bank Wire')}
                          className="px-2.5 py-1 bg-emerald-700 text-white hover:bg-emerald-800 rounded font-medium cursor-pointer"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customers Table */}
      {activeSubTab === 'customers' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-3 px-4">Customer Name & Company</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Lifetime Billed</th>
                <th className="py-3 px-4 text-right">Outstanding Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map(cust => (
                <tr key={cust.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{cust.name}</div>
                    {cust.company && <div className="text-[11px] text-slate-500">{cust.company}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-700">{cust.email}</div>
                    <div className="text-[11px] font-mono text-slate-400">{cust.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{cust.address}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                    {formatCurrency(cust.totalSpent)}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-bold tabular-nums ${
                    cust.outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    {formatCurrency(cust.outstandingBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice View Modal */}
      <InvoicePreviewModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onPay={(id) => payInvoice(id, 'ZEEX Bank Wire')}
      />

      {/* Create New Invoice Modal */}
      <Modal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        title="Create Customer Commercial Invoice"
        subtitle="Automatic double-entry posting: Debits Accounts Receivable, Credits Sales Revenue and Output VAT."
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Select Customer</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
                required
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 w-20 text-right">Qty</th>
                  <th className="py-2 px-3 w-28 text-right">Unit Price</th>
                  <th className="py-2 px-3 w-20 text-right">VAT %</th>
                  <th className="py-2 px-3 w-28 text-right">Total</th>
                  <th className="py-2 px-2 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, idx) => {
                  const lineTotal = (Number(item.quantity) * Number(item.unitPrice)) * (1 + Number(item.taxRate) / 100);

                  return (
                    <tr key={item.id}>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(idx, 'description', e.target.value)}
                          placeholder="Item or service description"
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800"
                          required
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 1)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-right font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-right font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="0.1"
                          value={item.taxRate}
                          onChange={(e) => updateItem(idx, 'taxRate', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-right font-mono"
                        />
                      </td>
                      <td className="p-2 text-right font-mono font-bold tabular-nums text-slate-900">
                        ${lineTotal.toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          disabled={items.length <= 1}
                          className="text-slate-400 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-slate-700 font-semibold hover:text-slate-950 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </button>

            <div className="text-right space-y-0.5 font-mono text-xs">
              <div>Subtotal: <strong>${calculateSubtotal().toFixed(2)}</strong></div>
              <div>Output VAT: <strong>${calculateTax().toFixed(2)}</strong></div>
              <div className="text-sm font-bold text-slate-900">
                Grand Total: ${(calculateSubtotal() + calculateTax()).toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Invoice Notes & Wire Terms</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewInvoiceOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Issue Invoice & Post to GL
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
