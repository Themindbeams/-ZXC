import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConnectAnnouncement } from '../../types';
import {
  Megaphone,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  MessageSquare,
  Plus,
  Send,
  Eye,
  Building2,
  AlertCircle
} from 'lucide-react';

export const ConnectAnnouncements: React.FC = () => {
  const {
    connectAnnouncements,
    currentUser,
    acknowledgeAnnouncement,
    publishAnnouncement
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // New Announcement Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<ConnectAnnouncement['category']>('Company Update');
  const [newPriority, setNewPriority] = useState<ConnectAnnouncement['priority']>('Standard');
  const [newTargetAudience, setNewTargetAudience] = useState<ConnectAnnouncement['targetAudience']>('All Company');
  const [requiresAck, setRequiresAck] = useState(false);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'Company Update', label: 'Company Updates' },
    { id: 'Policy Change', label: 'Policy Changes' },
    { id: 'Branch Notice', label: 'Branch Notices' },
    { id: 'Staff Introduction', label: 'Staff Intros' },
    { id: 'Training', label: 'Training & Drills' }
  ];

  const filteredAnnouncements = activeCategory === 'all'
    ? connectAnnouncements
    : connectAnnouncements.filter(a => a.category === activeCategory);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    publishAnnouncement({
      title: newTitle,
      content: newContent,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      category: newCategory,
      priority: newPriority,
      targetAudience: newTargetAudience,
      requiresAcknowledgment: requiresAck,
      allowComments: true
    });

    setIsPublishModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setRequiresAck(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Official Company Announcements</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified corporate broadcasts, regulatory policy revisions with audit acknowledgment, and branch bulletins.
          </p>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
              activeCategory === c.id
                ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.map(ann => {
          const isAcknowledgedByMe = ann.acknowledgments.some(a => a.userId === currentUser.id);

          return (
            <div
              key={ann.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-all space-y-4 ${
                ann.requiresAcknowledgment && !isAcknowledgedByMe
                  ? 'border-amber-400/80 ring-1 ring-amber-300/40 bg-amber-50/10'
                  : 'border-slate-200'
              }`}
            >
              {/* Top metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    ann.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {ann.category}
                  </span>

                  <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    Audience: {ann.targetAudience}
                  </span>

                  {ann.requiresAcknowledgment && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-600" />
                      Statutory Acknowledgment Required
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.publishDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {ann.readCount} views
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {ann.content}
                </p>
              </div>

              {/* Bottom Row: Author details & Acknowledgment Action */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Published by <span className="font-semibold text-slate-800">{ann.authorName}</span> ({ann.authorRole})
                </div>

                <div className="flex items-center gap-3">
                  {ann.requiresAcknowledgment && (
                    <div className="flex items-center gap-2">
                      {isAcknowledgedByMe ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Acknowledged & Signed</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => acknowledgeAnnouncement(ann.id)}
                          className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                        >
                          Acknowledge & Sign Policy
                        </button>
                      )}
                    </div>
                  )}

                  <span className="text-[11px] text-slate-400">
                    {ann.acknowledgments.length} staff acknowledged
                  </span>
                </div>
              </div>

              {/* Acknowledged Roster Preview */}
              {ann.acknowledgments.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Audit Verification Sign-Offs:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ann.acknowledgments.map((ack, ai) => (
                      <span
                        key={ai}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] text-slate-700"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {ack.userName} ({ack.userRole}) · {ack.timestamp.slice(11, 16)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Publish Announcement Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Publish Corporate Notice</h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Revised Operational Till Policy"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notice Body *</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Detail the update, statutory rationale, and action expectations..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Company Update">Company Update</option>
                    <option value="Policy Change">Policy Change</option>
                    <option value="Branch Notice">Branch Notice</option>
                    <option value="Staff Introduction">Staff Introduction</option>
                    <option value="Training">Training & Drill</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Audience Scope</label>
                  <select
                    value={newTargetAudience}
                    onChange={e => setNewTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="All Company">All Company Staff</option>
                    <option value="Branch">Active Branch Only</option>
                    <option value="Department">Designated Department</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requiresAck"
                  checked={requiresAck}
                  onChange={e => setRequiresAck(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="requiresAck" className="font-medium text-amber-900 text-xs cursor-pointer">
                  Require explicit cryptographic employee acknowledgment (Mandatory Compliance Policy)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
