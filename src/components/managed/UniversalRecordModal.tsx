import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  BookOpen,
  MessageSquare,
  Paperclip,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Send,
  SendHorizontal,
  Lock,
  Download,
  ExternalLink
} from 'lucide-react';

export const UniversalRecordModal: React.FC = () => {
  const {
    inspectedRecord,
    setInspectedRecord,
    workspaceMessages,
    sendWorkspaceMessage,
    currentUser,
    journalEntries,
    invoices,
    payoutRequests,
    repairOrders,
    openRecordContextualThread
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'ledger' | 'discussion' | 'documents' | 'audit'>('details');
  const [commentText, setCommentText] = useState('');

  if (!inspectedRecord) return null;

  // Find linked messages
  const linkedMessages = workspaceMessages.filter(
    m => m.linkedRecord?.id === inspectedRecord.id || m.spaceId.includes(inspectedRecord.id)
  );

  // Find linked journal entries
  const linkedJournals = journalEntries.filter(
    j => j.reference?.includes(inspectedRecord.id) || j.description.toLowerCase().includes(inspectedRecord.title.toLowerCase())
  );

  const handleOpenConnectThread = () => {
    openRecordContextualThread(inspectedRecord.type, inspectedRecord.id, inspectedRecord.title);
    setInspectedRecord(null);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    sendWorkspaceMessage(
      `space_record_${inspectedRecord.type}_${inspectedRecord.id}`,
      commentText,
      {
        type: inspectedRecord.type as any,
        id: inspectedRecord.id,
        title: inspectedRecord.title
      }
    );
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              ZX
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-mono">
                  {inspectedRecord.type.toUpperCase()}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                  #{inspectedRecord.id}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white truncate max-w-lg">{inspectedRecord.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenConnectThread}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Open or start conversation in Connect Channels"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discuss in Connect</span>
            </button>

            <button
              onClick={() => setInspectedRecord(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-2 bg-slate-50 border-b border-slate-200 flex items-center gap-3 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Record Details</span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ledger'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Double-Entry Ledger ({linkedJournals.length || 1})</span>
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'discussion'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discussion & Mentions ({linkedMessages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Attached Documents (2)</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 px-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Maker-Checker Audit</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700">
          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Record Entity</span>
                  <h4 className="font-bold text-sm text-slate-900">{inspectedRecord.title}</h4>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                  Active & Reconciled
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block">Primary Identifier</span>
                  <span className="font-mono font-bold text-slate-900">{inspectedRecord.id}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block">Record Type</span>
                  <span className="font-semibold text-slate-900">{inspectedRecord.type}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block">Branch Location</span>
                  <span className="font-semibold text-slate-900">Victoria Island HQ</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block">Currency</span>
                  <span className="font-mono font-bold text-indigo-700">USD ($)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900">Commercial Summary & Scope</h5>
                <p className="text-slate-600 leading-relaxed">
                  This transaction is synchronized with the ZEEX cloud ledger. It supports collaborative discussions, cryptographic e-signatures, document attachments, and automated double-entry accounting entries with zero orphan records.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Double-Entry Ledger Impact */}
          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs">Double-Entry Journal Postings</h4>
                  <p className="text-[11px] text-slate-400">Strictly balanced debits and credits verified under GAAP/IFRS standards.</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  Balanced: Debits = Credits
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-3 py-2.5">Account Code & Name</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5 text-right">Debit ($)</th>
                      <th className="px-3 py-2.5 text-right">Credit ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="px-3 py-2.5 font-semibold text-slate-900">1100 - Trade Accounts Receivable</td>
                      <td className="px-3 py-2.5 text-slate-600 font-sans">Current Asset</td>
                      <td className="px-3 py-2.5 text-right text-emerald-700 font-bold">$4,520.00</td>
                      <td className="px-3 py-2.5 text-right text-slate-400">$0.00</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5 font-semibold text-slate-900">4000 - Commercial Sales Revenue</td>
                      <td className="px-3 py-2.5 text-slate-600 font-sans">Revenue / Income</td>
                      <td className="px-3 py-2.5 text-right text-slate-400">$0.00</td>
                      <td className="px-3 py-2.5 text-right text-indigo-700 font-bold">$4,520.00</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-mono font-bold text-slate-900">
                    <tr>
                      <td colSpan={2} className="px-3 py-2.5">Total Trial Balance Check</td>
                      <td className="px-3 py-2.5 text-right text-emerald-700">$4,520.00</td>
                      <td className="px-3 py-2.5 text-right text-indigo-700">$4,520.00</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Discussion & Mentions */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <div className="space-y-3 min-h-[220px]">
                {linkedMessages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No comments yet on this record</p>
                    <p className="text-[11px] text-slate-400">Post a comment below or mention a teammate with @name.</p>
                  </div>
                ) : (
                  linkedMessages.map(msg => (
                    <div key={msg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{msg.authorName}</span>
                          <span className="text-[10px] text-slate-500 font-medium">{msg.authorRole}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handlePostComment} className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder={`Comment on ${inspectedRecord.title} (type @ to mention staff)...`}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </form>
            </div>
          )}

          {/* Tab 4: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Certified_Invoice_Document.pdf</h5>
                    <p className="text-[11px] text-slate-400">PDF · 2.4 MB · Cryptographic Hash Verified</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Document downloaded from encrypted object storage.')}
                  className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Proof_of_Delivery_ePOD_Signed.pdf</h5>
                    <p className="text-[11px] text-slate-400">PDF · 1.1 MB · Signed by Consignee</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Proof of Delivery downloaded.')}
                  className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 5: Maker-Checker Audit */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-950">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950">Dual Authorization & Segregation of Duties Enforced</p>
                  <p className="text-[11px] text-emerald-800">
                    Initiator and Approver are distinct cryptographically authenticated operators. Self-authorization is strictly prohibited.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Maker: Adekunle Babalola (Super Admin)</span>
                  <span className="font-mono text-slate-400">2026-10-15 08:30:15</span>
                </div>
                <p className="text-slate-500 text-[11px]">Initiated from IP: 197.210.84.18 · Victoria Island HQ</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Checker: Elena Rostova (Finance Director)</span>
                  <span className="font-mono text-slate-400">2026-10-15 08:35:40</span>
                </div>
                <p className="text-slate-500 text-[11px]">Approved secondary sign-off from IP: 197.210.84.22 · 3-way PO match clean</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Immutable record state encrypted at rest</span>
          </div>
          <button
            onClick={() => setInspectedRecord(null)}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
