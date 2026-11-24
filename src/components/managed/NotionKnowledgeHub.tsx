import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotionPage, NotionBlock } from '../../types';
import {
  BookOpen,
  CheckSquare,
  AlertCircle,
  Info,
  AlertTriangle,
  Plus,
  Search,
  Calendar,
  User,
  Tag,
  ShieldCheck,
  Calculator,
  Wrench,
  Wheat,
  FileText
} from 'lucide-react';

export const NotionKnowledgeHub: React.FC = () => {
  const {
    notionPages,
    activeNotionPageId,
    setActiveNotionPageId,
    toggleChecklistItem,
    createNotionPage,
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'SOP' | 'Policy' | 'Checklist' | 'Guide'>('SOP');
  const [newDocSummary, setNewDocSummary] = useState('');

  const activePage = notionPages.find(p => p.id === activeNotionPageId) || notionPages[0];

  const filteredPages = searchQuery
    ? notionPages.filter(
        p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notionPages;

  const getPageIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-4 h-4 text-emerald-600" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'Wheat': return <Wheat className="w-4 h-4 text-amber-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-rose-600" />;
      default: return <FileText className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    createNotionPage({
      title: newDocTitle,
      category: newDocCategory,
      author: `${currentUser.name} (${currentUser.role})`,
      icon: newDocCategory === 'SOP' ? 'Calculator' : 'FileText',
      badge: 'Company Standard',
      summary: newDocSummary || 'Standard procedure documentation for operational compliance.',
      contentBlocks: [
        {
          id: `blk_${Date.now()}_1`,
          type: 'callout',
          calloutType: 'info',
          content: 'Operating Notice: Adherence to this procedure is audited quarterly under corporate governance guidelines.'
        },
        {
          id: `blk_${Date.now()}_2`,
          type: 'heading',
          content: '1. Standard Execution Checklist'
        },
        {
          id: `blk_${Date.now()}_3`,
          type: 'checklist',
          content: 'Verify the following operational steps:',
          checklistItems: [
            { id: `chk_${Date.now()}_1`, label: 'Inspect physical readiness and workstation clearance', checked: false, mandatory: true },
            { id: `chk_${Date.now()}_2`, label: 'Obtain supervisor secondary approval in system ledger', checked: false, mandatory: true },
            { id: `chk_${Date.now()}_3`, label: 'Archive signed documentation in digital vault', checked: false, mandatory: false }
          ]
        }
      ]
    });

    setNewDocTitle('');
    setNewDocSummary('');
    setIsCreatingDoc(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[750px]">
      {/* Left Navigation: Notion Style Page Tree */}
      <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-4 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-800" />
            <h3 className="font-bold text-slate-900 text-sm">Knowledge & SOPs</h3>
          </div>
          <button
            onClick={() => setIsCreatingDoc(true)}
            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Create new SOP Document"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Doc</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search procedures & SOPs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Categories & Pages List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
          {filteredPages.map(page => {
            const isSelected = activeNotionPageId === page.id;
            return (
              <button
                key={page.id}
                onClick={() => setActiveNotionPageId(page.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-white border-indigo-200 shadow-xs'
                    : 'border-transparent hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {getPageIcon(page.icon)}
                    <span className="font-semibold text-slate-900 truncate max-w-[170px]">{page.title}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mb-1.5">{page.summary}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                    {page.category}
                  </span>
                  <span>{page.updatedAt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Notion Style Quick Tip */}
        <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600">
          <p className="font-semibold text-slate-800 mb-0.5">SOP Compliance Audit</p>
          <p className="text-slate-500">
            Checklist ticks are cryptographically recorded in the system audit trail with employee identity and timestamp.
          </p>
        </div>
      </div>

      {/* Main Notion-Style Document Editor & Viewer */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white min-w-0">
        {activePage ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header Area */}
            <div className="border-b border-slate-100 pb-5">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs mb-4">
                {getPageIcon(activePage.icon)}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                  {activePage.category}
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                  {activePage.badge}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                {activePage.title}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activePage.summary}
              </p>

              {/* Document Metadata Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Author: {activePage.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last Updated: {activePage.updatedAt}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Standard Operating Protocol</span>
                </div>
              </div>
            </div>

            {/* Document Blocks */}
            <div className="space-y-5">
              {activePage.contentBlocks.map(block => {
                if (block.type === 'callout') {
                  const calloutStyle =
                    block.calloutType === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : block.calloutType === 'danger'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-blue-50 border-blue-200 text-blue-900';

                  const calloutIcon =
                    block.calloutType === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : block.calloutType === 'danger' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    );

                  return (
                    <div
                      key={block.id}
                      className={`p-3.5 rounded-lg border flex items-start gap-3 text-xs leading-relaxed ${calloutStyle}`}
                    >
                      {calloutIcon}
                      <div>{block.content}</div>
                    </div>
                  );
                }

                if (block.type === 'heading') {
                  return (
                    <h2
                      key={block.id}
                      className="text-base font-bold text-slate-900 border-b border-slate-100 pb-1 pt-2"
                    >
                      {block.content}
                    </h2>
                  );
                }

                if (block.type === 'paragraph') {
                  return (
                    <p key={block.id} className="text-xs text-slate-700 leading-relaxed">
                      {block.content}
                    </p>
                  );
                }

                if (block.type === 'checklist') {
                  return (
                    <div key={block.id} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2.5">
                      <p className="text-xs font-semibold text-slate-800 mb-2">{block.content}</p>
                      <div className="space-y-2">
                        {block.checklistItems?.map(item => (
                          <label
                            key={item.id}
                            className={`flex items-start gap-2.5 text-xs p-2 rounded-lg transition-colors cursor-pointer ${
                              item.checked
                                ? 'bg-emerald-50/60 text-emerald-900 line-through decoration-emerald-700/60'
                                : 'bg-white hover:bg-slate-100/80 text-slate-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleChecklistItem(activePage.id, block.id, item.id)}
                              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <div className="flex-1 flex items-center justify-between gap-2">
                              <span>{item.label}</span>
                              {item.mandatory && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                                  Mandatory
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            Select an SOP document from the left navigation tree.
          </div>
        )}
      </div>

      {/* Create New Document Modal */}
      {isCreatingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Operating Document</h3>
            <p className="text-xs text-slate-500 mb-4">
              Publish a new Standard Operating Procedure (SOP), Policy, or Interactive Checklist for team execution.
            </p>

            <form onSubmit={handleCreateDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. End-of-Day Store Vault Reconciliation Protocol"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={newDocCategory}
                  onChange={e => setNewDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800"
                >
                  <option value="SOP">SOP (Standard Operating Procedure)</option>
                  <option value="Policy">Policy & Statutory Rule</option>
                  <option value="Checklist">Operational Checklist</option>
                  <option value="Guide">Training & Onboarding Guide</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Executive Summary</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of required steps and compliance requirements..."
                  value={newDocSummary}
                  onChange={e => setNewDocSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingDoc(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  Publish Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
