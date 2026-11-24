import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceMessage } from '../../types';
import {
  Hash,
  Lock,
  Megaphone,
  Wrench,
  CreditCard,
  Truck,
  Building2,
  Layers,
  Smile,
  Search,
  Pin,
  Bookmark,
  Bell,
  BellOff,
  Video,
  Send,
  Paperclip,
  AtSign,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Users
} from 'lucide-react';

export const ConnectChannels: React.FC = () => {
  const {
    workspaceSpaces,
    activeSpaceId,
    setActiveSpaceId,
    workspaceMessages,
    sendWorkspaceMessage,
    addMessageReaction,
    currentUser,
    users,
    invoices,
    repairOrders,
    payoutRequests,
    waybills,
    setRightPanelMode,
    setActiveThreadMessageId,
    openRecordInInspector,
    convertDiscussionToTask,
    createConnectMeeting
  } = useApp();

  const [inputContent, setInputContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordToAttach, setSelectedRecordToAttach] = useState<{
    type: 'invoice' | 'repair_order' | 'purchase_order' | 'dispatch_trip' | 'payout' | 'harvest';
    id: string;
    title: string;
    amount?: number;
    status?: string;
  } | null>(null);
  const [isRecordPickerOpen, setIsRecordPickerOpen] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);

  // Filter channels (exclude direct messages from this view)
  const channels = workspaceSpaces.filter(s => s.type === 'channel' || s.type === 'record_thread');
  const activeChannel = channels.find(s => s.id === activeSpaceId) || channels[0];

  // Group channels by category / channelType
  const companyChannels = channels.filter(c => c.channelType === 'company' || c.channelType === 'announcement');
  const deptChannels = channels.filter(c => c.channelType === 'department');
  const branchChannels = channels.filter(c => c.channelType === 'branch');
  const projectChannels = channels.filter(c => c.channelType === 'project');
  const privateChannels = channels.filter(c => c.channelType === 'private');
  const socialChannels = channels.filter(c => c.channelType === 'social');
  const threadChannels = channels.filter(c => c.type === 'record_thread');

  // Messages in active channel
  const channelMessages = workspaceMessages.filter(
    m => m.spaceId === activeChannel?.id || (activeChannel?.linkedRecordId && m.linkedRecord?.id === activeChannel.linkedRecordId)
  );

  const filteredMessages = searchQuery
    ? channelMessages.filter(
        m =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.authorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : channelMessages;

  const getChannelIcon = (channel: typeof channels[0]) => {
    if (channel.isPrivate) return <Lock className="w-3.5 h-3.5 text-rose-400" />;
    if (channel.isAnnouncementOnly) return <Megaphone className="w-3.5 h-3.5 text-amber-400" />;
    switch (channel.channelType) {
      case 'branch': return <Building2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'department': return <Hash className="w-3.5 h-3.5 text-indigo-400" />;
      case 'project': return <Layers className="w-3.5 h-3.5 text-sky-400" />;
      case 'social': return <Smile className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return channel.type === 'record_thread' ? (
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Hash className="w-3.5 h-3.5 text-slate-400" />
        );
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim() && !selectedRecordToAttach) return;

    sendWorkspaceMessage(
      activeChannel.id,
      inputContent,
      selectedRecordToAttach || undefined
    );

    setInputContent('');
    setSelectedRecordToAttach(null);
  };

  const handleMentionStaff = (userName: string) => {
    setInputContent(prev => `${prev} @${userName} `);
  };

  const handleOpenThread = (msgId: string) => {
    setActiveThreadMessageId(msgId);
    setRightPanelMode('thread');
  };

  const handleStartInstantCall = () => {
    createConnectMeeting({
      title: `Call in #${activeChannel.name}`,
      description: `Instant audio/video meeting initiated in channel #${activeChannel.name}`,
      scheduledStartTime: new Date().toISOString(),
      durationMinutes: 30,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostRole: currentUser.role,
      type: 'instant',
      status: 'Live',
      category: 'Operational Review',
      waitingRoomEnabled: false,
      provider: 'ZEEX Cloud WebRTC',
      participants: [
        { userId: currentUser.id, name: currentUser.name, role: currentUser.role, rsvp: 'Accepted', isHost: true, hasVideo: true, isMuted: false }
      ],
      agendaItems: [
        { id: 'ag_c1', title: `Review action items for #${activeChannel.name}`, completed: false }
      ],
      notes: `Call started from #${activeChannel.name}`,
      isRecording: false,
      recordingConsentAcknowledged: true
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[780px]">
      {/* Channels Sidebar (Categorized) */}
      <div className="w-full md:w-68 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Connect Channels</h3>
            <p className="text-[10px] text-slate-400">Authorized Company Spaces</p>
          </div>
          <span className="text-[10px] bg-indigo-600/30 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-semibold">
            {channels.length}
          </span>
        </div>

        {/* Channel Categories List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs">
          {/* Company-Wide */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Company-Wide</span>
            </div>
            <div className="space-y-0.5">
              {companyChannels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveSpaceId(ch.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeChannel?.id === ch.id
                      ? 'bg-indigo-600 text-white font-medium shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getChannelIcon(ch)}
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {ch.unreadCount > 0 && (
                    <span className="text-[10px] bg-amber-500 text-slate-900 font-bold px-1.5 py-0.2 rounded-full font-mono">
                      {ch.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Department Channels */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Departments
            </div>
            <div className="space-y-0.5">
              {deptChannels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveSpaceId(ch.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeChannel?.id === ch.id
                      ? 'bg-indigo-600 text-white font-medium shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getChannelIcon(ch)}
                    <span className="truncate">{ch.name}</span>
                  </div>
                  {ch.unreadCount > 0 && (
                    <span className="text-[10px] bg-indigo-500 text-white font-bold px-1.5 py-0.2 rounded-full font-mono">
                      {ch.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Branch / Site Specific */}
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Branches & Sites
            </div>
            <div className="space-y-0.5">
              {branchChannels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveSpaceId(ch.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeChannel?.id === ch.id
                      ? 'bg-indigo-600 text-white font-medium shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getChannelIcon(ch)}
                    <span className="truncate">{ch.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Projects & Initiatives */}
          {projectChannels.length > 0 && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Projects
              </div>
              <div className="space-y-0.5">
                {projectChannels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveSpaceId(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeChannel?.id === ch.id
                        ? 'bg-indigo-600 text-white font-medium shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getChannelIcon(ch)}
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Private Channels (Audited) */}
          {privateChannels.length > 0 && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>Audited Private</span>
              </div>
              <div className="space-y-0.5">
                {privateChannels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveSpaceId(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeChannel?.id === ch.id
                        ? 'bg-rose-900/80 text-white font-medium border border-rose-700'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getChannelIcon(ch)}
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Record Threads */}
          {threadChannels.length > 0 && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                Record Threads
              </div>
              <div className="space-y-0.5">
                {threadChannels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveSpaceId(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeChannel?.id === ch.id
                        ? 'bg-amber-600 text-white font-medium shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getChannelIcon(ch)}
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Social */}
          {socialChannels.length > 0 && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Social
              </div>
              <div className="space-y-0.5">
                {socialChannels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveSpaceId(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      activeChannel?.id === ch.id
                        ? 'bg-pink-600 text-white font-medium shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getChannelIcon(ch)}
                      <span className="truncate">{ch.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Conversation Feed Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Channel Header Bar */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded bg-slate-100 text-slate-700">
              {getChannelIcon(activeChannel)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  #{activeChannel?.name}
                </h3>
                {activeChannel?.isPrivate && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">
                    Audited Private
                  </span>
                )}
                {activeChannel?.isAnnouncementOnly && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded font-semibold">
                    Read Only Broadcast
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {activeChannel?.topic || activeChannel?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Search within Channel */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-36 lg:w-48"
              />
            </div>

            {/* Start Instant Call Button */}
            <button
              onClick={handleStartInstantCall}
              title="Start instant video call in this channel"
              className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4" />
            </button>

            {/* Channel Info Toggle */}
            <button
              onClick={() => setShowChannelInfo(!showChannelInfo)}
              title="Channel members & policy"
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audit policy disclaimer for private channels */}
        {activeChannel?.isPrivate && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center justify-between text-xs text-rose-800">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              Statutory Privacy: Access is strictly restricted and logged to the compliance ledger.
            </span>
            <span className="text-[11px] text-rose-600 font-mono">SoD Rule 4.2</span>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No messages in this channel yet.</p>
              <p className="text-xs text-slate-400 mt-1">Start the conversation or share a business record.</p>
            </div>
          ) : (
            filteredMessages.map(msg => (
              <div
                key={msg.id}
                className="group p-3 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100 space-y-2"
              >
                {/* Author row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-linear-to-tr from-indigo-600 to-sky-500 text-white font-bold text-xs flex items-center justify-center">
                      {msg.authorName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">{msg.authorName}</span>
                      <span className="text-[11px] text-slate-500 ml-1.5 font-medium">
                        ({msg.authorRole})
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                </div>

                {/* Message body */}
                <div className="text-xs text-slate-800 pl-9 leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Linked Business Record Card (Cross-Experience Link!) */}
                {msg.linkedRecord && (
                  <div className="ml-9 p-3 rounded-lg bg-indigo-50/60 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
                        <span>Connected Business Record</span>
                        <span className="text-indigo-400">·</span>
                        <span className="font-mono">{msg.linkedRecord.type}</span>
                      </div>
                      <h5 className="text-xs font-semibold text-slate-900">
                        {msg.linkedRecord.title}
                      </h5>
                      {msg.linkedRecord.amount !== undefined && (
                        <p className="text-[11px] text-slate-600 font-mono">
                          Value: ${msg.linkedRecord.amount.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openRecordInInspector(msg.linkedRecord!.type, msg.linkedRecord!.id, msg.linkedRecord!.title)}
                        className="px-2.5 py-1 rounded bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect in Work</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Attachments if any */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="ml-9 flex flex-wrap gap-2">
                    {msg.attachments.map((att, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200"
                      >
                        <Paperclip className="w-3 h-3 text-slate-400" />
                        <span>{att.name}</span>
                        <span className="text-[10px] text-slate-400">({att.size})</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reactions & Actions Row */}
                <div className="ml-9 flex items-center justify-between pt-1">
                  {/* Reactions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {msg.reactions?.map((r, ri) => (
                      <button
                        key={ri}
                        onClick={() => addMessageReaction(msg.id, r.emoji)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 border border-slate-200 cursor-pointer"
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] font-bold">{r.count}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => addMessageReaction(msg.id, '👍')}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 p-1 text-xs cursor-pointer"
                      title="Add reaction"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions: Open Thread & Convert to Task */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenThread(msg.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-indigo-600 font-medium px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Thread Reply</span>
                    </button>
                    <button
                      onClick={() => convertDiscussionToTask(msg)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-emerald-600 font-medium px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                      title="Convert discussion to action task"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Turn into Task</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        {activeChannel?.isAnnouncementOnly && currentUser.role !== 'Super Admin' ? (
          <div className="p-3 bg-amber-50 text-amber-800 text-xs text-center border-t border-amber-200 font-medium">
            This channel is an official read-only broadcast space for executive and statutory notices.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
            {/* If record attached */}
            {selectedRecordToAttach && (
              <div className="mb-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between">
                <span className="font-medium">
                  Attached Record: {selectedRecordToAttach.title}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRecordToAttach(null)}
                  className="text-indigo-500 hover:text-indigo-700 font-bold ml-2 cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 p-2">
                <textarea
                  rows={2}
                  value={inputContent}
                  onChange={e => setInputContent(e.target.value)}
                  placeholder={`Message #${activeChannel?.name}... (type @ to mention)`}
                  className="w-full text-xs bg-transparent focus:outline-hidden resize-none text-slate-900 placeholder:text-slate-400"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1 text-slate-500 text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* Attach Record Button */}
                    <button
                      type="button"
                      onClick={() => setIsRecordPickerOpen(!isRecordPickerOpen)}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                      title="Link a business record"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Attach Record</span>
                    </button>

                    {/* Mention Button */}
                    <button
                      type="button"
                      onClick={() => handleMentionStaff(users[1]?.name || 'Tariq')}
                      className="p-1 rounded hover:bg-slate-200 text-slate-600 flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                    >
                      <AtSign className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mention</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    Press Enter to send · Shift+Enter for newline
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!inputContent.trim() && !selectedRecordToAttach}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Record Attachment Picker Dropdown */}
            {isRecordPickerOpen && (
              <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-lg space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Select Business Record to Share</span>
                  <button
                    type="button"
                    onClick={() => setIsRecordPickerOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {/* Job cards */}
                  {repairOrders.slice(0, 2).map(ro => (
                    <button
                      type="button"
                      key={ro.id}
                      onClick={() => {
                        setSelectedRecordToAttach({
                          type: 'repair_order',
                          id: ro.id,
                          title: `Job Card #${ro.orderNumber} (${ro.vehicleSummary})`,
                          amount: ro.totalCost,
                          status: ro.status
                        });
                        setIsRecordPickerOpen(false);
                      }}
                      className="p-2 rounded-lg border border-slate-200 hover:border-indigo-400 text-left cursor-pointer"
                    >
                      <span className="font-semibold text-slate-900 block">#{ro.orderNumber}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{ro.customerName} · ${ro.totalCost}</span>
                    </button>
                  ))}

                  {/* Payouts */}
                  {payoutRequests.slice(0, 2).map(p => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        setSelectedRecordToAttach({
                          type: 'payout',
                          id: p.id,
                          title: `Payout #${p.id} (${p.beneficiaryName})`,
                          amount: p.amount,
                          status: p.status
                        });
                        setIsRecordPickerOpen(false);
                      }}
                      className="p-2 rounded-lg border border-slate-200 hover:border-indigo-400 text-left cursor-pointer"
                    >
                      <span className="font-semibold text-slate-900 block">Payout #{p.id}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{p.beneficiaryName} · ${p.amount}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
