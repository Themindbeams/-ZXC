import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Modal } from '../../common/Modal';
import { Plus, Trash2, AlertCircle, Check } from 'lucide-react';

interface NewJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewJournalModal: React.FC<NewJournalModalProps> = ({
  isOpen,
  onClose
}) => {
  const { chartOfAccounts, postJournalEntry, currentUser } = useApp();

  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [reference, setReference] = useState('ADJ-2026-');
  const [description, setDescription] = useState('');
  const [sourceModule, setSourceModule] = useState<'Manual' | 'Sales' | 'Purchases' | 'Payroll'>('Manual');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [lines, setLines] = useState([
    { id: '1', accountCode: '1020', debit: 0, credit: 0, memo: '' },
    { id: '2', accountCode: '4010', debit: 0, credit: 0, memo: '' }
  ]);

  const addLine = () => {
    setLines(prev => [
      ...prev,
      { id: String(Date.now()), accountCode: '1010', debit: 0, credit: 0, memo: '' }
    ]);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(prev => prev.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: string, val: string | number) => {
    setLines(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const difference = Number((totalDebit - totalCredit).toFixed(2));
  const isBalanced = Math.abs(difference) < 0.01 && totalDebit > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!description.trim()) {
      setErrorMsg('Please provide a memo / description for this journal entry.');
      return;
    }

    if (!isBalanced) {
      setErrorMsg(`Entry is out of balance. Debits ($${totalDebit.toFixed(2)}) must equal Credits ($${totalCredit.toFixed(2)}). Variance: $${difference.toFixed(2)}`);
      return;
    }

    const formattedLines = lines.map(line => {
      const acc = chartOfAccounts.find(a => a.code === line.accountCode);
      return {
        id: `line_${Date.now()}_${Math.random()}`,
        accountCode: line.accountCode,
        accountName: acc ? acc.name : 'Unknown Account',
        debit: Number(line.debit) || 0,
        credit: Number(line.credit) || 0,
        memo: line.memo || description
      };
    });

    const result = postJournalEntry({
      date,
      reference,
      description,
      sourceModule,
      createdBy: currentUser.name,
      lines: formattedLines
    });

    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to post journal entry.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Double-Entry Journal Entry"
      subtitle="Guaranteed balanced entry: Total debits must strictly equal total credits."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Posting Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Reference / Voucher #</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. ADJ-2026-001"
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Source Module</label>
            <select
              value={sourceModule}
              onChange={(e) => setSourceModule(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800 font-medium"
            >
              <option value="Manual">Manual Journal Entry</option>
              <option value="Sales">Sales & Accounts Receivable</option>
              <option value="Purchases">Purchasing & Payables</option>
              <option value="Payroll">Payroll Adjustment</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-medium mb-1">Description / Narration</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Month-end depreciation adjustment for workshop machinery"
            className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-800"
            required
          />
        </div>

        {/* Journal Lines Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2 px-3">Chart of Account</th>
                <th className="py-2 px-3 w-40">Line Memo</th>
                <th className="py-2 px-3 w-28 text-right">Debit ($)</th>
                <th className="py-2 px-3 w-28 text-right">Credit ($)</th>
                <th className="py-2 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((line, idx) => (
                <tr key={line.id} className="hover:bg-slate-50/50">
                  <td className="p-2">
                    <select
                      value={line.accountCode}
                      onChange={(e) => updateLine(idx, 'accountCode', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800"
                    >
                      {chartOfAccounts.map(acc => (
                        <option key={acc.code} value={acc.code}>
                          {acc.code} - {acc.name} ({acc.type})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={line.memo}
                      onChange={(e) => updateLine(idx, 'memo', e.target.value)}
                      placeholder="Optional memo"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.debit || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateLine(idx, 'debit', val);
                        if (val > 0) updateLine(idx, 'credit', 0);
                      }}
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-right font-mono tabular-nums text-slate-800"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.credit || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        updateLine(idx, 'credit', val);
                        if (val > 0) updateLine(idx, 'debit', 0);
                      }}
                      placeholder="0.00"
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-right font-mono tabular-nums text-slate-800"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      disabled={lines.length <= 2}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/80 border-t border-slate-200 font-semibold font-mono text-slate-800">
              <tr>
                <td colSpan={2} className="py-2 px-3 text-right">Totals:</td>
                <td className="py-2 px-3 text-right tabular-nums text-slate-900">${totalDebit.toFixed(2)}</td>
                <td className="py-2 px-3 text-right tabular-nums text-slate-900">${totalCredit.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={addLine}
            className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold hover:text-slate-950 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Journal Line
          </button>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Imbalance Variance:</span>
            <span className={`font-mono font-bold tabular-nums ${isBalanced ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${Math.abs(difference).toFixed(2)}
            </span>
            {isBalanced && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <Check className="w-3.5 h-3.5" /> Balanced
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isBalanced}
            className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          >
            Post Journal to General Ledger
          </button>
        </div>
      </form>
    </Modal>
  );
};
