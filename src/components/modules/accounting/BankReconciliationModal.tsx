import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Modal } from '../../common/Modal';
import { Check, Link, ExternalLink } from 'lucide-react';

interface BankReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankReconciliationModal: React.FC<BankReconciliationModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    bankAccounts,
    bankStatementLines,
    reconcileStatementLine,
    journalEntries,
    formatCurrency
  } = useApp();

  const primaryBank = bankAccounts[0]; // ZEEX Bank Primary

  const unreconciledCount = bankStatementLines.filter(l => !l.isReconciled).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bank Statement Reconciliation"
      subtitle={`Match imported statements against General Ledger GL-1020 (${primaryBank?.bankName || 'ZEEX Bank'})`}
      maxWidth="3xl"
    >
      <div className="space-y-4 text-xs">
        {/* Account Summary Banner */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{primaryBank.accountName}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded">
                ZEEX Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Account: {primaryBank.accountNumber} · GL Code: {primaryBank.glAccountCode}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">GL Cash Balance</span>
            <span className="text-lg font-bold font-mono tabular-nums text-emerald-400">
              {formatCurrency(primaryBank.balance)}
            </span>
          </div>
        </div>

        {/* Statement Lines Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900">
              Bank Statement Lines ({unreconciledCount} pending clearance)
            </h4>
            <span className="text-slate-500 text-[11px]">Auto-matched via reference IDs</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Narration / Description</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">GL Match Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bankStatementLines.map(line => {
                  const matchedJE = journalEntries.find(j => j.id === line.matchedJournalId);

                  return (
                    <tr key={line.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono text-slate-600">{line.date}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-900">{line.description}</div>
                        <div className="text-[11px] font-mono text-slate-400">Ref: {line.reference}</div>
                      </td>
                      <td className={`py-2.5 px-3 text-right font-mono font-semibold tabular-nums ${
                        line.amount > 0 ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {line.amount > 0 ? '+' : ''}{formatCurrency(line.amount)}
                      </td>
                      <td className="py-2.5 px-3">
                        {line.isReconciled ? (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                            <Check className="w-3.5 h-3.5" />
                            <span>Matched ({matchedJE?.entryNumber || 'GL Cleared'})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700 text-[11px]">
                            <Link className="w-3.5 h-3.5 text-amber-500" />
                            <span>Unmatched statement line</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {!line.isReconciled ? (
                          <button
                            onClick={() => reconcileStatementLine(line.id)}
                            className="px-2.5 py-1 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors cursor-pointer text-[11px]"
                          >
                            Reconcile
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Cleared</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px] leading-relaxed">
          <strong>Reconciliation Principle:</strong> In accordance with Master Blueprint Section 7, ZEEX Commerce performs strict double-entry verification between physical bank statements received from ZEEX Bank APIs and internal GL entries.
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
          >
            Close Reconciliation
          </button>
        </div>
      </div>
    </Modal>
  );
};
