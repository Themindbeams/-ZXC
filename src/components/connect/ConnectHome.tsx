import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video,
  Calendar,
  Megaphone,
  Users,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Lock,
  Plus
} from 'lucide-react';

interface ConnectHomeProps {
  onNavigateTab: (tab: string) => void;
  onOpenCreateMeeting?: () => void;
  onOpenPublishNotice?: () => void;
}

export const ConnectHome: React.FC<ConnectHomeProps> = ({
  onNavigateTab,
  onOpenCreateMeeting,
  onOpenPublishNotice
}) => {
  const {
    currentUser,
    activeBranch,
    connectMeetings,
    connectAnnouncements,
    onboardingTasks,
    workspaceSpaces,
    workspaceMessages,
    acknowledgeAnnouncement,
    toggleOnboardingTask,
    updateMeetingStatus,
    setExperienceArea
  } = useApp();

  // Find urgent unacknowledged policies
  const unacknowledgedAnnouncements = connectAnnouncements.filter(
    a => a.requiresAcknowledgment && !a.acknowledgments.some(ack => ack.userId === currentUser.id)
  );

  // Filter today's / live meetings
  const todayMeetings = connectMeetings.slice(0, 3);
  const liveMeeting = connectMeetings.find(m => m.status === 'Live');

  // Onboarding completion rate
  const completedOnboarding = onboardingTasks.filter(t => t.isCompleted).length;
  const onboardingPct = Math.round((completedOnboarding / onboardingTasks.length) * 100);

  // Recent messages
  const recentMessages = workspaceMessages.slice(-4).reverse();

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Connected Hub Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white border border-slate-800 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Connect · Internal Collaboration & Communications</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Welcome back, {currentUser.name}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              One connected identity across <span className="text-indigo-300 font-medium">{activeBranch.name}</span>. Stay aligned with your team, manage meetings, acknowledge compliance notices, and jump into operational discussions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (onOpenCreateMeeting) onOpenCreateMeeting();
                else onNavigateTab('meetings');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Instant Call</span>
            </button>
            <button
              onClick={() => {
                if (onOpenPublishNotice) onOpenPublishNotice();
                else onNavigateTab('announcements');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-sm transition-all cursor-pointer"
            >
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span>Post Notice</span>
            </button>
            <button
              onClick={() => setExperienceArea('work')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              <span>Back to Work Ops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Compliance / Policy Notice Banner if any unacknowledged */}
      {unacknowledgedAnnouncements.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded">
                  Policy Acknowledgment Required
                </span>
                <span className="text-xs text-amber-800/80 font-medium">Statutory Compliance</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 mt-1">
                {unacknowledgedAnnouncements[0].title}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                {unacknowledgedAnnouncements[0].content}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
            <button
              onClick={() => acknowledgeAnnouncement(unacknowledgedAnnouncements[0].id)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              I Acknowledge & Agree
            </button>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium cursor-pointer"
            >
              View All Notices
            </button>
          </div>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Live / Upcoming Meetings */}
        <div
          onClick={() => onNavigateTab('meetings')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Scheduled Meetings</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{connectMeetings.length}</span>
            {liveMeeting && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 1 Live
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">WebRTC encrypted audio/video</p>
        </div>

        {/* Metric 2: Active Channels */}
        <div
          onClick={() => onNavigateTab('channels')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Active Channels</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {workspaceSpaces.filter(s => s.type === 'channel').length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Across all teams</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Company, department & private</p>
        </div>

        {/* Metric 3: Announcements & Policy */}
        <div
          onClick={() => onNavigateTab('announcements')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Announcements</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{connectAnnouncements.length}</span>
            {unacknowledgedAnnouncements.length > 0 ? (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {unacknowledgedAnnouncements.length} action
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-600">All acknowledged</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Official bulletins & broadcasts</p>
        </div>

        {/* Metric 4: Onboarding Readiness */}
        <div
          onClick={() => onNavigateTab('onboarding')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-2">
            <span>Staff Onboarding</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{onboardingPct}%</span>
            <span className="text-[11px] text-slate-500 font-medium">
              {completedOnboarding}/{onboardingTasks.length} steps
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${onboardingPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Section: Left (Meetings & Conversations) + Right (Announcements & Onboarding) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide): Meetings & Recent Conversations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Meetings */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming & Live Meetings</h3>
              </div>
              <button
                onClick={() => onNavigateTab('meetings')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({connectMeetings.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {todayMeetings.map(meeting => (
                <div
                  key={meeting.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    meeting.status === 'Live'
                      ? 'bg-indigo-50/60 border-indigo-200 ring-1 ring-indigo-200'
                      : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {meeting.status === 'Live' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Live
                          </span>
                        )}
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          {meeting.category}
                        </span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {meeting.scheduledStartTime.includes('T') ? meeting.scheduledStartTime.split('T')[1].slice(0, 5) : '09:00'} ({meeting.durationMinutes} min)
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">{meeting.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-1">{meeting.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {meeting.status === 'Live' ? (
                        <button
                          onClick={() => onNavigateTab('meetings')}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join WebRTC Call</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateMeetingStatus(meeting.id, 'Live');
                            onNavigateTab('meetings');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                        >
                          Start Call
                        </button>
                      )}
                    </div>
                  </div>

                  {meeting.linkedRecord && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-500">Linked Record:</span>
                      <span className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded text-[11px]">
                        {meeting.linkedRecord.title}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Conversations & Cross-Channel Messages */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Operational Conversations</h3>
              </div>
              <button
                onClick={() => onNavigateTab('channels')}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Open Channels</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentMessages.map(msg => {
                const space = workspaceSpaces.find(s => s.id === msg.spaceId);
                return (
                  <div
                    key={msg.id}
                    onClick={() => onNavigateTab('channels')}
                    className="py-3 first:pt-0 last:pb-0 hover:bg-slate-50/80 rounded-lg p-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{msg.authorName}</span>
                        <span className="text-[11px] text-slate-400">({msg.authorRole})</span>
                        <span className="text-slate-300">in</span>
                        <span className="font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded text-[10px]">
                          #{space?.name || 'general'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {msg.timestamp.includes(' ') ? msg.timestamp.split(' ')[1] : msg.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-2">{msg.content}</p>

                    {msg.linkedRecord && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 font-medium">
                        <span>Record: {msg.linkedRecord.title}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide): Announcements & Onboarding Tasks */}
        <div className="space-y-6">
          {/* Announcements Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Latest Notices</h3>
              </div>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
              >
                All Notices
              </button>
            </div>

            <div className="space-y-3.5">
              {connectAnnouncements.slice(0, 3).map(ann => {
                const isAck = ann.acknowledgments.some(a => a.userId === currentUser.id);
                return (
                  <div key={ann.id} className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/40 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded text-[10px]">
                        {ann.category}
                      </span>
                      <span className="text-slate-400">{ann.publishDate}</span>
                    </div>
                    <h5 className="text-xs font-semibold text-slate-900 line-clamp-2">{ann.title}</h5>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{ann.content}</p>

                    {ann.requiresAcknowledgment && (
                      <div className="pt-1.5 flex items-center justify-between">
                        {isAck ? (
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Acknowledged
                          </span>
                        ) : (
                          <button
                            onClick={() => acknowledgeAnnouncement(ann.id)}
                            className="text-[11px] text-white bg-amber-600 hover:bg-amber-700 px-2 py-0.8 rounded font-semibold transition-colors cursor-pointer"
                          >
                            Acknowledge Policy
                          </button>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {ann.acknowledgments.length} acknowledged
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Onboarding Checklist Quick Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Your Onboarding Steps</h3>
              </div>
              <button
                onClick={() => onNavigateTab('onboarding')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
              >
                Guide
              </button>
            </div>

            <div className="space-y-2.5">
              {onboardingTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleOnboardingTask(task.id)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
