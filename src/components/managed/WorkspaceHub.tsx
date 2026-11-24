import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceMessage } from '../../types';
import {
  Hash,
  MessageSquare,
  Lock,
  Wrench,
  CreditCard,
  Truck,
  FileText,
  FileCheck,
  Send,
  Paperclip,
  Smile,
  AtSign,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

export const WorkspaceHub: React.FC = () => {
  const {
    workspaceSpaces,
    activeSpaceId,
    setActiveSpaceId,
    workspaceMessages,
    sendWorkspaceMessage,
    addMessageReaction,
    currentUser,
    users,
    setInspectedRecord
  } = useApp();

  const [inputContent, setInputContent] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSpace = workspaceSpaces.find(s => s.id === activeSpaceId) || workspaceSpaces[0];

  const currentMessages = workspaceMessages.filter(
    m => m.spaceId === activeSpaceId || (activeSpace?.linkedRecordId && m.linkedRecord?.id === activeSpace.linkedRecordId)
  );

  const filteredMessages = searchQuery
    ? currentMessages.filter(
        m =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentMessages;

  const getSpaceIcon = (iconName: string, category: string) => {
    switch (iconName) {
      case 'Megaphone': return <Megaphone className="w-4 h-4 text-amber-500" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'Lock': return <Lock className="w-4 h-4 text-rose-500" />;
      case 'Truck': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'FileCheck': return <FileCheck className="w-4 h-4 text-indigo-500" />;
      case 'FileText': return <FileText className="w-4 h-4 text-sky-500" />;
      default:
        return category === 'finance' ? (
          <Lock className="w-4 h-4 text-rose-400" />
        ) : (
          <Hash className="w-4 h-4 text-slate-400" />
        );
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) return;

    let attachments = undefined;
    if (selectedAttachment) {
      attachments = [{
        name: selectedAttachment,
        size: '1.8 MB',
        type: 'application/pdf'
      }];
    }

    sendWorkspaceMessage(activeSpace.id, inputContent, undefined, attachments);
    setInputContent('');
    setSelectedAttachment(null);
  };

  const handleMentionStaff = (userName: string) => {
    setInputContent(prev => `${prev} @${userName} `);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[780px]">
      {/* Discord / Slack Style Left Sidebar: Channels, Spaces, & Presence */}
      <div className="w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        {/* Workspace Organization Switcher Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              ZX
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white truncate">Apex Horizon Hub</h3>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                <span>Active Workspace</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            v2026.10
          </span>
        </div>

        {/* Channels & Record Discussion Groups */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Operations Channels */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Team Spaces</span>
              <span className="text-[10px] text-slate-400">{workspaceSpaces.filter(s => s.type === 'channel').length}</span>
            </div>
            <div className="space-y-0.5">
              {workspaceSpaces
                .filter(s => s.type === 'channel')
                .map(space => (
                  <button
                    key={space.id}
                    onClick={() => setActiveSpaceId(space.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors text-left cursor-pointer ${
                      activeSpaceId === space.id
                        ? 'bg-slate-800 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getSpaceIcon(space.iconName, space.category)}
                      <span className="truncate">{space.name}</span>
                    </div>
                    {space.unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500 text-white font-mono">
                        {space.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </div>

          {/* Business Record Discussion Threads (Slack Contextual Discussions) */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Record Discussions</span>
              <span className="text-[10px] text-slate-400">{workspaceSpaces.filter(s => s.type === 'record_thread').length}</span>
            </div>
            <div className="space-y-0.5">
              {workspaceSpaces
                .filter(s => s.type === 'record_thread')
                .map(space => (
                  <button
                    key={space.id}
                    onClick={() => setActiveSpaceId(space.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors text-left cursor-pointer ${
                      activeSpaceId === space.id
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{space.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">thread</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Active Teammates Presence */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Online Staff ({users.length})</span>
              <Users className="w-3 h-3 text-slate-400" />
            </div>
            <div className="space-y-1">
              {users.slice(0, 5).map((user, idx) => (
                <div
                  key={user.id}
                  onClick={() => handleMentionStaff(user.name)}
                  className="px-2.5 py-1 rounded flex items-center justify-between hover:bg-slate-800/40 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
                  title="Click to mention in message"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${idx === 0 ? 'bg-emerald-400' : 'bg-emerald-500/80'}`}></span>
                    <span className="truncate text-xs">{user.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[80px]">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current User Session Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium truncate text-xs">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.role}</p>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-800">
            Online
          </span>
        </div>
      </div>

      {/* Main Conversation & Feed Area */}
      <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
        {/* Channel Header with Contextual Info & Search */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
              {getSpaceIcon(activeSpace.iconName, activeSpace.category)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm truncate">#{activeSpace.name}</h3>
                <span className="text-[11px] text-slate-400 hidden sm:inline">· {activeSpace.description}</span>
              </div>
              {activeSpace.linkedRecordId && (
                <button
                  onClick={() =>
                    setInspectedRecord({
                      type: activeSpace.linkedRecordType || 'record',
                      id: activeSpace.linkedRecordId || '',
                      title: activeSpace.name
                    })
                  }
                  className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Inspect Linked Record ({activeSpace.linkedRecordType})</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44"
              />
            </div>
            <span className="text-xs text-slate-400 px-2 py-1 bg-slate-100 rounded-md font-mono hidden md:inline">
              {activeSpace.membersCount} members
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No messages yet in #{activeSpace.name}</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Start the discussion, mention teammates with @name, or link a business record to coordinate daily operations.
              </p>
            </div>
          ) : (
            filteredMessages.map(msg => (
              <div key={msg.id} className="group flex gap-3 p-2.5 rounded-lg hover:bg-white hover:shadow-xs transition-all">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {msg.authorName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-slate-900 text-xs">{msg.authorName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                      {msg.authorRole}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  {/* Message Content with Mention Highlighting */}
                  <div className="text-xs text-slate-800 leading-relaxed break-words whitespace-pre-wrap">
                    {msg.content.split(/(@[a-zA-Z0-9_\s]+?)(?=\s|$|[.,!?])/g).map((part, i) => {
                      if (part.startsWith('@')) {
                        return (
                          <span
                            key={i}
                            className="bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded font-semibold border border-indigo-200/60"
                          >
                            {part}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </div>

                  {/* Linked Business Record Card */}
                  {msg.linkedRecord && (
                    <div className="mt-2.5 p-3 rounded-lg border border-indigo-200 bg-indigo-50/60 flex items-center justify-between gap-3 max-w-lg">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                          Linked Business Record ({msg.linkedRecord.type})
                        </span>
                        <h4 className="text-xs font-semibold text-slate-900 truncate">{msg.linkedRecord.title}</h4>
                        {msg.linkedRecord.amount !== undefined && (
                          <p className="text-[11px] font-mono text-slate-700 mt-0.5">
                            Amount: ${msg.linkedRecord.amount.toFixed(2)} · Status: {msg.linkedRecord.status}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setInspectedRecord({
                            type: msg.linkedRecord!.type,
                            id: msg.linkedRecord!.id,
                            title: msg.linkedRecord!.title
                          })
                        }
                        className="px-2.5 py-1 text-xs font-semibold bg-white text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-100 transition-colors shrink-0 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  )}

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-700 shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-500" />
                          <span className="font-medium truncate max-w-[160px]">{att.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions & Action Bar */}
                  <div className="mt-2 flex items-center gap-2">
                    {msg.reactions &&
                      msg.reactions.map((react, i) => (
                        <button
                          key={i}
                          onClick={() => addMessageReaction(msg.id, react.emoji)}
                          className="px-2 py-0.5 rounded-full text-xs bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{react.emoji}</span>
                          <span className="text-[10px] font-bold text-slate-600">{react.count}</span>
                        </button>
                      ))}
                    <button
                      onClick={() => addMessageReaction(msg.id, '👍')}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded hover:bg-slate-200 transition-all cursor-pointer"
                      title="Add reaction"
                    >
                      <Smile className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
          {selectedAttachment && (
            <div className="mb-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-xs text-indigo-800 flex items-center justify-between">
              <span className="truncate">Attached: {selectedAttachment}</span>
              <button
                onClick={() => setSelectedAttachment(null)}
                className="text-indigo-600 hover:text-indigo-900 font-bold ml-2 cursor-pointer"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder={`Message #${activeSpace.name} (type @ to mention teammates)...`}
                value={inputContent}
                onChange={e => setInputContent(e.target.value)}
                className="w-full pl-3.5 pr-20 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
              />
              <div className="absolute right-2 flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => setSelectedAttachment('Diagnostic_Report_Export.pdf')}
                  className="p-1 hover:text-slate-700 rounded transition-colors cursor-pointer"
                  title="Attach sample PDF report"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setInputContent(prev => `${prev} @Elena Rostova `)}
                  className="p-1 hover:text-slate-700 rounded transition-colors cursor-pointer"
                  title="Mention Finance"
                >
                  <AtSign className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Tip: Discussions are audited and linked directly to ledger journals and operation tickets.</span>
            <span className="font-mono text-[10px]">Encrypted at Rest</span>
          </div>
        </div>
      </div>
    </div>
  );
};
