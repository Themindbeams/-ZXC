import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Users,
  Search,
  Video,
  Send,
  Paperclip,
  Smile,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const ConnectDirectMessages: React.FC = () => {
  const {
    users,
    currentUser,
    workspaceMessages,
    sendWorkspaceMessage,
    activeSpaceId,
    setActiveSpaceId,
    workspaceSpaces,
    createConnectMeeting,
    openRecordInInspector
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    users.find(u => u.id !== currentUser.id)?.id || users[0].id
  );
  const [inputContent, setInputContent] = useState('');

  const otherStaff = users.filter(u => u.id !== currentUser.id);
  const filteredStaff = searchQuery
    ? otherStaff.filter(
        u =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : otherStaff;

  const activeStaff = users.find(u => u.id === selectedStaffId) || otherStaff[0];

  // Find or create virtual direct message space
  const dmSpace = workspaceSpaces.find(
    s => s.type === 'direct' && s.directParticipantId === activeStaff?.id
  ) || workspaceSpaces.find(s => s.type === 'direct');

  // Filter messages for direct conversation
  const dmMessages = workspaceMessages.filter(
    m =>
      (m.authorId === currentUser.id && m.spaceId === dmSpace?.id) ||
      (m.authorId === activeStaff?.id) ||
      (m.mentions.includes(`@${currentUser.name}`) && m.authorId === activeStaff?.id)
  );

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim()) return;

    sendWorkspaceMessage(
      dmSpace?.id || 'dm_tariq_mansoor',
      inputContent
    );
    setInputContent('');
  };

  const handleStartDirectCall = () => {
    createConnectMeeting({
      title: `1:1 Call with ${activeStaff.name}`,
      description: `Direct encrypted WebRTC consultation with ${activeStaff.name} (${activeStaff.role})`,
      scheduledStartTime: new Date().toISOString(),
      durationMinutes: 20,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostRole: currentUser.role,
      type: 'instant',
      status: 'Live',
      category: 'Internal Staff',
      waitingRoomEnabled: false,
      provider: 'ZEEX Cloud WebRTC',
      participants: [
        { userId: currentUser.id, name: currentUser.name, role: currentUser.role, rsvp: 'Accepted', isHost: true, hasVideo: true },
        { userId: activeStaff.id, name: activeStaff.name, role: activeStaff.role, rsvp: 'Accepted' }
      ],
      agendaItems: [
        { id: 'ag_dm1', title: `1-on-1 alignment with ${activeStaff.name}`, completed: false }
      ],
      notes: 'Direct meeting',
      isRecording: false,
      recordingConsentAcknowledged: true
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[780px]">
      {/* Staff Directory Column */}
      <div className="w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Direct Messages</h3>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
              {otherStaff.length} Team Members
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter staff by name or dept..."
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredStaff.map(staff => (
            <button
              key={staff.id}
              onClick={() => setSelectedStaffId(staff.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                activeStaff?.id === staff.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs border border-slate-700">
                  {staff.name.charAt(0)}
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 absolute -bottom-0.5 -right-0.5"></span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold truncate">{staff.name}</h4>
                  <span className="text-[10px] opacity-75">{staff.role.slice(0, 10)}</span>
                </div>
                <p className="text-[11px] opacity-75 truncate">{staff.department}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Direct Conversation Feed */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-600 to-sky-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {activeStaff?.name.charAt(0)}
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">{activeStaff?.name}</h3>
              <p className="text-xs text-slate-500 truncate">
                {activeStaff?.role} · {activeStaff?.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartDirectCall}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Start 1:1 Call</span>
            </button>
          </div>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center py-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-bold text-base flex items-center justify-center mx-auto mb-2">
              {activeStaff?.name.charAt(0)}
            </div>
            <h4 className="text-sm font-bold text-slate-900">{activeStaff?.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5 max-w-md mx-auto">
              This is the start of your direct, end-to-end isolated internal conversation with {activeStaff?.name}. You can exchange messages, schedule calls, and share business records.
            </p>
          </div>

          {dmMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No previous direct messages. Say hello to {activeStaff?.name}!
            </div>
          ) : (
            dmMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.authorId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-3.5 space-y-1 shadow-2xs ${
                    msg.authorId === currentUser.id
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-80">
                    <span className="font-semibold">{msg.authorName}</span>
                    <span>{msg.timestamp.includes(' ') ? msg.timestamp.split(' ')[1] : msg.timestamp}</span>
                  </div>
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputContent}
              onChange={e => setInputContent(e.target.value)}
              placeholder={`Message ${activeStaff?.name}...`}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputContent.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
