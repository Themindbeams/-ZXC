import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Modal } from '../common/Modal';
import { Product, POSTransaction } from '../../types';
import {
  ShoppingBag,
  CreditCard,
  DollarSign,
  Barcode,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

import { POSSessionModal } from '../modules/pos/POSSessionModal';

export const RetailWorkspace: React.FC = () => {
  const {
    products,
    posCart,
    addToPOSCart,
    updatePOSCartQty,
    removeFromPOSCart,
    clearPOSCart,
    completePOSSale,
    posTransactions,
    activePOSSession,
    activeBranch,
    formatCurrency,
    currentUser,
    org
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [completedTxn, setCompletedTxn] = useState<POSTransaction | null>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  // Cart totals
  const subtotal = posCart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  const tax = Number((subtotal * 0.075).toFixed(2));
  const grandTotal = subtotal + tax;

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.barcode && p.barcode.includes(searchTerm));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCheckout = (method: 'Cash' | 'Card' | 'Bank Transfer') => {
    const res = completePOSSale(method);
    if (res.success && res.transaction) {
      setCompletedTxn(res.transaction);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Active Till Shift Accountability */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Specialized Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Retail & Supermarket Storefront</span>
            <span aria-hidden="true">·</span>
            <span>{activeBranch.name}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            High-Speed POS Register & Counter Checkout
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {activePOSSession ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <span className="font-semibold text-emerald-900">{activePOSSession.tillNumber}</span>
                <span className="text-[11px] text-emerald-700 block font-mono">
                  Cashier: {activePOSSession.cashierName.split(' ')[0]} · Float: {formatCurrency(activePOSSession.openingFloat)}
                </span>
              </div>
              <button
                onClick={() => setIsSessionModalOpen(true)}
                className="ml-2 px-2 py-1 bg-white border border-emerald-300 rounded font-semibold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
              >
                Close Till
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSessionModalOpen(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              Open Till Shift Session
            </button>
          )}
        </div>
      </div>

      {/* Main Split: Left Catalog / Right Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search catalog by name, SKU, or scan barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map(prod => {
              const inStock = prod.stockQuantity > 0;

              return (
                <button
                  key={prod.id}
                  onClick={() => inStock && addToPOSCart(prod)}
                  disabled={!inStock}
                  className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    inStock
                      ? 'bg-white border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer active:scale-98'
                      : 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>{prod.sku}</span>
                      <span className={prod.stockQuantity <= prod.reorderLevel ? 'text-rose-600 font-bold' : ''}>
                        {prod.stockQuantity} left
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">{prod.name}</h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono font-bold text-xs tabular-nums text-slate-900">
                      {formatCurrency(prod.sellingPrice)}
                    </span>
                    <span className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center text-xs font-bold transition-colors">
                      +
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active POS Cart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Current Sale Cart</h3>
            </div>
            {posCart.length > 0 && (
              <button
                onClick={clearPOSCart}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {posCart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Cart is empty. Tap items on the left or scan barcode to add to bill.
              </div>
            ) : (
              posCart.map(item => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-slate-900 truncate">{item.product.name}</h5>
                    <span className="text-[11px] font-mono text-slate-500">
                      {formatCurrency(item.product.sellingPrice)} each
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updatePOSCartQty(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="w-7 text-center font-mono font-bold text-slate-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updatePOSCartQty(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-20 text-right font-mono font-bold tabular-nums text-slate-900">
                    {formatCurrency(item.product.sellingPrice * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals Summary */}
          <div className="pt-3 border-t border-slate-200 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="font-sans">Subtotal:</span>
              <span className="tabular-nums font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-sans">VAT (7.5%):</span>
              <span className="tabular-nums font-semibold">{formatCurrency(tax)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
              <span className="font-sans">Amount Due:</span>
              <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Payment Method Action Buttons */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Complete Payment (Immediate Ledger Settlement)
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCheckout('Cash')}
                disabled={posCart.length === 0}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold rounded-lg text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <DollarSign className="w-4 h-4" />
                <span>Cash Till</span>
              </button>

              <button
                onClick={() => handleCheckout('Card')}
                disabled={posCart.length === 0}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold rounded-lg text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <CreditCard className="w-4 h-4" />
                <span>ZEEX Card</span>
              </button>

              <button
                onClick={() => handleCheckout('Bank Transfer')}
                disabled={posCart.length === 0}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold rounded-lg text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Barcode className="w-4 h-4" />
                <span>Transfer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent POS Transactions */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Terminal Register Settled Receipts ({posTransactions.length})
        </h3>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
              <tr>
                <th className="py-2.5 px-4">Receipt #</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Cashier</th>
                <th className="py-2.5 px-4">Payment Tender</th>
                <th className="py-2.5 px-4 text-right">Items</th>
                <th className="py-2.5 px-4 text-right">Total Settled</th>
                <th className="py-2.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {posTransactions.map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{txn.receiptNumber}</td>
                  <td className="py-2.5 px-4 text-slate-500">{txn.timestamp}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-700">{txn.cashierName}</td>
                  <td className="py-2.5 px-4 font-sans">
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {txn.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-sans text-slate-600">
                    {txn.items.reduce((s, i) => s + i.quantity, 0)} items
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold tabular-nums text-slate-900">
                    {formatCurrency(txn.total)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-sans">
                    <button
                      onClick={() => setCompletedTxn(txn)}
                      className="text-xs text-slate-700 font-semibold underline hover:text-slate-950 cursor-pointer"
                    >
                      Print Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Thermal Receipt Modal */}
      <Modal
        isOpen={!!completedTxn}
        onClose={() => setCompletedTxn(null)}
        title="Transaction Slip"
        subtitle="Point of sale customer copy linked to GL cash register"
        maxWidth="sm"
      >
        {completedTxn && (
          <div className="space-y-4 text-xs font-mono">
            {/* Paper Slip Layout */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
              <div>
                <h4 className="font-bold text-sm tracking-tight text-slate-900 font-sans">{org.name}</h4>
                <p className="text-[10px] text-slate-500 font-sans">VI Superstore & Parts Depot</p>
                <p className="text-[10px] text-slate-500">TIN: {org.taxNumber}</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 text-[11px] text-left space-y-1">
                <div className="flex justify-between">
                  <span>Receipt:</span>
                  <strong className="text-slate-900">{completedTxn.receiptNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{completedTxn.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{completedTxn.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tender:</span>
                  <span className="font-bold">{completedTxn.paymentMethod}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1.5 text-left text-[11px]">
                {completedTxn.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div className="font-sans truncate max-w-[170px]">
                      {i.quantity}x {i.productName}
                    </div>
                    <span className="tabular-nums font-bold">${i.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1 text-right">
                <div className="flex justify-between text-slate-600">
                  <span className="font-sans">Subtotal:</span>
                  <span className="tabular-nums">${completedTxn.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-sans">VAT 7.5%:</span>
                  <span className="tabular-nums">${completedTxn.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span className="font-sans">TOTAL:</span>
                  <span className="tabular-nums">${completedTxn.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-sans">
                Powered by ZEEX Commerce · Instant GL Posting
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-700 hover:bg-slate-100 flex items-center gap-1 font-sans"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Slip
              </button>
              <button
                onClick={() => setCompletedTxn(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded font-sans font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* POS Till Session Modal */}
      <POSSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
      />
    </div>
  );
};
