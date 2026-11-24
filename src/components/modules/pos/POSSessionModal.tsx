import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Modal } from '../../common/Modal';
import { Clock, DollarSign, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

interface POSSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const POSSessionModal: React.FC<POSSessionModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    activePOSSession,
    openPOSSession,
    closePOSSession,
    formatCurrency,
    currentUser,
    activeBranch
  } = useApp();

  const [tillNumber, setTillNumber] = useState('Till 01 (Storefront)');
  const [openingFloat, setOpeningFloat] = useState<number>(150.0);
  const [actualCashCount, setActualCashCount] = useState<number>(activePOSSession?.expectedCashInDrawer || 0);
  const [closeNotes, setCloseNotes] = useState('');
  const [showZReport, setShowZReport] = useState(false);

  const handleOpen = (e: React.FormEvent) => {
    e.preventDefault();
    openPOSSession(tillNumber, Number(openingFloat));
    onClose();
  };

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePOSSession) return;
    closePOSSession(activePOSSession.id, Number(actualCashCount), closeNotes);
    setShowZReport(true);
  };

  const variance = activePOSSession ? Number((actualCashCount - activePOSSession.expectedCashInDrawer).toFixed(2)) : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activePOSSession ? `Till Session: ${activePOSSession.sessionCode}` : 'Open Cashier POS Till Session'}
      subtitle={`Cash register drawer shift accountability at ${activeBranch.name}`}
      maxWidth="md"
    >
      {!activePOSSession ? (
        // Open Till Form
        <form onSubmit={handleOpen} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Select Till Hardware Station</label>
            <select
              value={tillNumber}
              onChange={(e) => setTillNumber(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
            >
              <option value="Till 01 (Storefront Counter)">Till 01 (Storefront Counter)</option>
              <option value="Till 02 (Workshop Fast-Spares)">Till 02 (Workshop Fast-Spares)</option>
              <option value="Till 03 (Drive-Thru / Customer Service)">Till 03 (Drive-Thru / Customer Service)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Verified Opening Cash Float ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={openingFloat}
              onChange={(e) => setOpeningFloat(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold"
              required
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Physical currency count placed into drawer before first sale.</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs">
            Assigned Cashier: <strong>{currentUser.name} ({currentUser.role})</strong>. All orders processed in this session are cryptographically tagged to your operator identity.
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Open Till & Start Session
            </button>
          </div>
        </form>
      ) : showZReport ? (
        // Z-Report Summary
        <div className="space-y-4 text-xs font-mono">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
            <h4 className="font-bold text-sm tracking-tight text-slate-900 font-sans">END OF SHIFT Z-REPORT</h4>
            <p className="text-[10px] text-slate-500 font-sans">{activePOSSession.sessionCode} · {activeBranch.name}</p>

            <div className="border-t border-b border-dashed border-slate-300 py-2 text-left space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Cashier:</span>
                <strong className="text-slate-900">{activePOSSession.cashierName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Orders Checked Out:</span>
                <strong className="text-slate-900">{activePOSSession.ordersCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Opening Float:</span>
                <span>{formatCurrency(activePOSSession.openingFloat)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cash Sales:</span>
                <span>{formatCurrency(activePOSSession.cashCollected)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Card / POS Sales:</span>
                <span>{formatCurrency(activePOSSession.cardCollected)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bank Transfer Sales:</span>
                <span>{formatCurrency(activePOSSession.transferCollected)}</span>
              </div>
            </div>

            <div className="text-left space-y-1 text-xs pt-1">
              <div className="flex justify-between">
                <span>Expected Drawer Total:</span>
                <strong>{formatCurrency(activePOSSession.expectedCashInDrawer)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Actual Counted Cash:</span>
                <strong>{formatCurrency(actualCashCount)}</strong>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-200">
                <span>Cash Variance:</span>
                <span className={variance < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  {variance < 0 ? '-' : ''}{formatCurrency(Math.abs(variance))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-slate-200 rounded text-slate-700 hover:bg-slate-100 flex items-center gap-1 font-sans"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Z-Report
            </button>
            <button
              onClick={() => {
                setShowZReport(false);
                onClose();
              }}
              className="px-4 py-1.5 bg-slate-900 text-white rounded font-sans font-semibold hover:bg-slate-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        // Close Till Form
        <form onSubmit={handleClose} className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="font-sans text-slate-500">Till Station:</span>
              <strong className="text-slate-900">{activePOSSession.tillNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-slate-500">Opening Float:</span>
              <span>{formatCurrency(activePOSSession.openingFloat)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-slate-500">Shift Cash Collected:</span>
              <strong className="text-emerald-700">{formatCurrency(activePOSSession.cashCollected)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-slate-500">Card & Bank Transfers:</span>
              <span>{formatCurrency(activePOSSession.cardCollected + activePOSSession.transferCollected)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span className="font-sans">Expected Drawer Cash:</span>
              <span>{formatCurrency(activePOSSession.expectedCashInDrawer)}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Physical Cash Count in Till Drawer ($)</label>
            <input
              type="number"
              step="0.01"
              value={actualCashCount}
              onChange={(e) => setActualCashCount(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono font-bold text-sm"
              required
            />
          </div>

          <div className="flex justify-between items-center p-2.5 rounded bg-slate-100 font-mono">
            <span className="font-sans text-slate-600">Calculated Variance:</span>
            <span className={`font-bold ${variance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {variance === 0 ? '$0.00 (Balanced)' : `${variance < 0 ? '-' : '+'}${formatCurrency(Math.abs(variance))}`}
            </span>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Closing Notes / Shift Handover</label>
            <textarea
              value={closeNotes}
              onChange={(e) => setCloseNotes(e.target.value)}
              placeholder="e.g. End of day cash count completed. Safe drop envelope sealed."
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 h-16"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Close Till & Generate Z-Report
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
