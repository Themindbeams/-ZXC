import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ConnectMeeting } from '../../types';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Users,
  MessageSquare,
  ListTodo,
  Disc,
  Clock,
  Calendar,
  Lock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Plus,
  AlertCircle,
  Settings,
  Sparkles
} from 'lucide-react';

export const ConnectMeetings: React.FC = () => {
  const {
    connectMeetings,
    currentUser,
    users,
    createConnectMeeting,
    updateMeetingStatus,
    toggleMeetingRecording,
    openRecordInInspector,
    setNotificationMessage
  } = useApp();

  const [activeMeetingId, setActiveMeetingId] = useState<string>(
    connectMeetings.find(m => m.status === 'Live')?.id || connectMeetings[0]?.id
  );

  // In-call media controls state
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTabInCall, setActiveTabInCall] = useState<'chat' | 'agenda' | 'participants'>('agenda');
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: 'cm_1', sender: 'Sarah Chen, FCA', text: 'Welcome everyone to the operations alignment.', time: '09:02' },
    { id: 'cm_2', sender: 'Tariq Al-Mansoor', text: 'Job Card RO-8821 engine scan diagnostic is linked to this call.', time: '09:04' }
  ]);
  const [newChatText, setNewChatText] = useState('');

  // New Meeting modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newCategory, setNewCategory] = useState<ConnectMeeting['category']>('Internal Staff');
  const [newStartTime, setNewStartTime] = useState(new Date().toISOString().slice(0, 16));

  const activeMeeting = connectMeetings.find(m => m.id === activeMeetingId) || connectMeetings[0];

  const handleSendInCallChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        id: `cm_${Date.now()}`,
        sender: currentUser.name,
        text: newChatText,
        time: new Date().toTimeString().slice(0, 5)
      }
    ]);
    setNewChatText('');
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    setNotificationMessage(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing active');
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createConnectMeeting({
      title: newTitle,
      description: newDescription,
      scheduledStartTime: newStartTime,
      durationMinutes: Number(newDuration),
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostRole: currentUser.role,
      type: 'scheduled',
      status: 'Upcoming',
      category: newCategory,
      waitingRoomEnabled: false,
      provider: 'ZEEX Cloud WebRTC',
      participants: [
        { userId: currentUser.id, name: currentUser.name, role: currentUser.role, rsvp: 'Accepted', isHost: true, hasVideo: true }
      ],
      agendaItems: [
        { id: `ag_${Date.now()}`, title: 'Review operational milestones & dependencies', completed: false }
      ],
      notes: newDescription,
      isRecording: false,
      recordingConsentAcknowledged: false
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Meeting Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">ZEEX Connected Meetings</h2>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              Provider: {activeMeeting?.provider || 'ZEEX Cloud WebRTC'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted audio/video sessions, recorded action items, and live links to business records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Main View: Active Meeting Stage & Call Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Stage & Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Grid Stage */}
          <div className="bg-slate-950 rounded-2xl p-4 min-h-[460px] flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Top Overlay: Call Details & Recording Status */}
            <div className="flex items-center justify-between text-white text-xs z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[11px] font-bold uppercase tracking-wider animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white"></span> Live
                </span>
                <span className="font-semibold text-slate-200 truncate">{activeMeeting?.title}</span>
              </div>

              <div className="flex items-center gap-2">
                {activeMeeting?.isRecording && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[11px] border border-rose-500/40">
                    <Disc className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                    <span>REC (30d retention)</span>
                  </span>
                )}
                <span className="text-[11px] text-slate-400">
                  {activeMeeting?.participants.length || 4} participants
                </span>
              </div>
            </div>

            {/* Simulated Live WebRTC Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 flex-1 items-center">
              {/* Participant 1: Current User */}
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-md">
                {isCameraOn ? (
                  <div className="w-full h-full bg-linear-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-linear-to-tr from-indigo-600 to-sky-500 text-white font-bold text-xl flex items-center justify-center shadow-lg ring-4 ring-indigo-500/20">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-xs text-indigo-300 font-medium mt-2">
                      Live HD Video (Active Speaker)
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-500">
                    <VideoOff className="w-8 h-8 mb-1" />
                    <span className="text-xs">Camera Off</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  <span className="font-semibold">{currentUser.name} (You)</span>
                  <div className="flex items-center gap-1.5">
                    {isMicOn ? (
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <MicOff className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Participant 2: Tariq */}
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-linear-to-br from-slate-900 to-indigo-950/60 flex flex-col items-center justify-center p-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                    T
                  </div>
                  <span className="text-xs text-slate-400 font-medium mt-2">
                    Tariq Al-Mansoor (Workshop Bay 2)
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  <span className="font-semibold">Tariq Al-Mansoor</span>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Participant 3: Barr. Folake */}
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-14 h-14 rounded-full bg-purple-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                    F
                  </div>
                  <span className="text-xs text-slate-400 font-medium mt-2">
                    Barr. Folake Adeleke
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  <span className="font-semibold">Folake Adeleke (HR)</span>
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                </div>
              </div>

              {/* Participant 4: Screen Share or Silo Feed */}
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-md">
                {isScreenSharing ? (
                  <div className="w-full h-full bg-indigo-900/40 p-3 flex flex-col justify-between text-xs text-indigo-200">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Monitor className="w-4 h-4 text-indigo-400" />
                      Screen Sharing: ZEEX ERP Diagnostic Ledger
                    </span>
                    <div className="p-2 bg-slate-950/80 rounded border border-indigo-500/30 font-mono text-[11px] text-indigo-300">
                      [DIAG-RO-8821] OBD-II: Cylinder 3 Misfire Solved
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400">
                    <div className="w-14 h-14 rounded-full bg-lime-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                      H
                    </div>
                    <span className="text-xs text-slate-400 font-medium mt-2">
                      Dr. Haruna Bello (Agro Silos)
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  <span className="font-semibold">
                    {isScreenSharing ? 'Your Presentation Screen' : 'Dr. Haruna Bello'}
                  </span>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Bottom Call Controls Bar */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-800/80 z-10 flex-wrap">
              {/* Mic Toggle */}
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full text-white transition-all cursor-pointer shadow-md ${
                  isMicOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-3 rounded-full text-white transition-all cursor-pointer shadow-md ${
                  isCameraOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
                title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              {/* Screen Share Toggle */}
              <button
                onClick={handleToggleScreenShare}
                className={`p-3 rounded-full transition-all cursor-pointer shadow-md ${
                  isScreenSharing
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Share Screen"
              >
                <Monitor className="w-4 h-4" />
              </button>

              {/* Recording Toggle with Consent Notice */}
              <button
                onClick={() => toggleMeetingRecording(activeMeeting.id)}
                className={`p-3 rounded-full transition-all cursor-pointer shadow-md ${
                  activeMeeting?.isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title="Toggle Meeting Recording"
              >
                <Disc className="w-4 h-4" />
              </button>

              {/* Leave / End Call */}
              <button
                onClick={() => {
                  updateMeetingStatus(activeMeeting.id, 'Ended');
                  setNotificationMessage('Meeting concluded.');
                }}
                className="px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave Call</span>
              </button>
            </div>
          </div>

          {/* Recording Notice & Compliance Banner */}
          {activeMeeting?.isRecording && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Disc className="w-4 h-4 text-rose-600 animate-spin" />
                This call is being recorded with full participant consent. Audio/video logs are encrypted and scheduled for automatic expiration in 30 days.
              </span>
              <span className="text-[11px] font-mono text-rose-600">AES-256</span>
            </div>
          )}

          {/* Linked Record Quick Card */}
          {activeMeeting?.linkedRecord && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Linked Operational Record
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  {activeMeeting.linkedRecord.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  Access real-time inventory parts, diagnostic logs, and accounting journals associated with this meeting.
                </p>
              </div>

              <button
                onClick={() => openRecordInInspector(activeMeeting.linkedRecord!.type, activeMeeting.linkedRecord!.id, activeMeeting.linkedRecord!.title)}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Inspect Record</span>
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: In-Call Drawer (Agenda / Chat / Participants) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px]">
          {/* Drawer Header Tabs */}
          <div className="flex border-b border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTabInCall('agenda')}
              className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition-colors ${
                activeTabInCall === 'agenda'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Agenda & Notes
            </button>
            <button
              onClick={() => setActiveTabInCall('chat')}
              className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition-colors ${
                activeTabInCall === 'chat'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Meeting Chat ({chatMessages.length})
            </button>
            <button
              onClick={() => setActiveTabInCall('participants')}
              className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition-colors ${
                activeTabInCall === 'participants'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Roster ({activeMeeting?.participants.length || 0})
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTabInCall === 'agenda' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Action Items & Checklist
                  </h4>
                  <div className="space-y-2">
                    {activeMeeting?.agendaItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={item.completed}
                          className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{item.title}</p>
                          {item.linkedTaskId && (
                            <span className="text-[10px] text-indigo-600 font-mono">
                              Linked to task: #{item.linkedTaskId}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Meeting Notes
                  </h4>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    {activeMeeting?.notes || 'No meeting notes recorded yet.'}
                  </div>
                </div>
              </div>
            )}

            {activeTabInCall === 'chat' && (
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {chatMessages.map(cm => (
                    <div key={cm.id} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-700">{cm.sender}</span>
                        <span>{cm.time}</span>
                      </div>
                      <p className="bg-slate-50 p-2 rounded-lg text-slate-800 border border-slate-100">
                        {cm.text}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendInCallChat} className="mt-3 pt-2 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={newChatText}
                    onChange={e => setNewChatText(e.target.value)}
                    placeholder="Message call room..."
                    className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

            {activeTabInCall === 'participants' && (
              <div className="space-y-2.5">
                {activeMeeting?.participants.map(p => (
                  <div
                    key={p.userId}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{p.role}</span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                      {p.rsvp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Schedule New Meeting</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Weekly Workshop & Inventory Coordination"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description & Objective</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Key topics, review of invoices or job cards..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
                  <select
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Meeting Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Internal Staff">Internal Staff Meeting</option>
                  <option value="Customer Appointment">Customer Appointment</option>
                  <option value="Operational Review">Operational Review</option>
                  <option value="All-Hands">Company All-Hands</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Create Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
