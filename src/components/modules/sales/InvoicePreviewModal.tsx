import React from 'react';
import { Invoice } from '../../../types';
import { Modal } from '../../common/Modal';
import { useApp } from '../../../context/AppContext';
import { Printer, Check, Download } from 'lucide-react';

interface InvoicePreviewModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onPay?: (invoiceId: string) => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onPay
}) => {
  const { org, formatCurrency } = useApp();

  if (!invoice) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Commercial Invoice — ${invoice.invoiceNumber}`}
      subtitle="Generated document linked to General Ledger A/R"
      maxWidth="3xl"
    >
      <div className="space-y-6 text-xs text-slate-800">
        {/* Printable Invoice Sheet */}
        <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-xs space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-xs">ZX</span>
                <span className="font-display font-bold text-base text-slate-900">{org.name}</span>
              </div>
              <p className="text-slate-500 font-mono text-[11px]">TIN: {org.taxNumber} · Reg: {org.registrationNumber}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Victoria Island Financial District, Lagos</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono tracking-widest uppercase text-slate-400 block">TAX INVOICE</span>
              <h2 className="text-lg font-bold font-mono text-slate-900">{invoice.invoiceNumber}</h2>
              <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                <div>Issue Date: <strong className="font-mono text-slate-800">{invoice.issueDate}</strong></div>
                <div>Due Date: <strong className="font-mono text-slate-800">{invoice.dueDate}</strong></div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Billed To</span>
              <h4 className="font-bold text-sm text-slate-900">{invoice.customerName}</h4>
              <p className="text-slate-500 mt-1">Authorized Customer Account</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Payment Status</span>
              <span className={`inline-block font-semibold px-2.5 py-1 rounded text-xs ${
                invoice.status === 'Paid'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {invoice.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">VAT</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{item.description}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{item.taxRate}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-right font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-sans text-slate-500">Subtotal:</span>
                <span className="tabular-nums font-semibold">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-sans text-slate-500">VAT (7.5%):</span>
                <span className="tabular-nums font-semibold">{formatCurrency(invoice.taxTotal)}</span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold text-slate-900 border-t-2 border-slate-900">
                <span className="font-sans">Invoice Total:</span>
                <span className="tabular-nums">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer & Bank Wire Instructions */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px] space-y-1">
            <strong className="text-slate-800 block">Settlement Instructions (ZEEX Direct Clearance):</strong>
            <p>ZEEX Bank International · Account Name: Apex Horizon Operating Master · Account: 902-881-4901</p>
            {invoice.notes && <p className="italic text-slate-500">{invoice.notes}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 no-print">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>

          <div className="flex items-center gap-2">
            {invoice.status !== 'Paid' && onPay && (
              <button
                onClick={() => {
                  onPay(invoice.id);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Record Payment Received
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
