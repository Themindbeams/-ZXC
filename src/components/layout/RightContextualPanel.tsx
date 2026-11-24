import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MessageSquare,
  FileText,
  Users,
  CheckCircle2,
  Send,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Printer,
  Clock
} from 'lucide-react';

export const RightContextualPanel: React.FC = () => {
  const {
    rightPanelMode,
    setRightPanelMode,
    activeThreadMessageId,
    workspaceMessages,
    sendWorkspaceMessage,
    inspectedRecord,
    setInspectedRecord,
    currentUser,
    connectMeetings,
    projectTasks
  } = useApp();

  const [threadReplyInput, setThreadReplyInput] = useState('');

  if (rightPanelMode === 'closed') return null;

  // Find parent message for thread
  const parentMessage = workspaceMessages.find(m => m.id === activeThreadMessageId);
  const threadReplies = workspaceMessages.filter(m => m.replyToId === activeThreadMessageId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadReplyInput.trim() || !parentMessage) return;

    sendWorkspaceMessage(
      parentMessage.spaceId,
      threadReplyInput
    );
    setThreadReplyInput('');
  };

  return (
    <aside className="w-80 md:w-96 bg-white border-l border-slate-200 shadow-xl flex flex-col h-full z-30 shrink-0">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          {rightPanelMode === 'thread' && (
            <>
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Thread Discussion</h3>
            </>
          )}
          {rightPanelMode === 'record' && (
            <>
              <FileText className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Record Details</h3>
            </>
          )}
          {rightPanelMode === 'participants' && (
            <>
              <Users className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Meeting Participants</h3>
            </>
          )}
          {rightPanelMode === 'tasks' && (
            <>
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Related Tasks</h3>
            </>
          )}
        </div>

        <button
          onClick={() => setRightPanelMode('closed')}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Thread Mode */}
        {rightPanelMode === 'thread' && (
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3 flex-1 overflow-y-auto">
              {parentMessage ? (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold text-slate-900">{parentMessage.authorName}</span>
                    <span className="text-[10px]">{parentMessage.timestamp}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">{parentMessage.content}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Select a message to view replies.</p>
              )}

              <div className="pl-3 border-l-2 border-indigo-200 space-y-2 mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Replies ({threadReplies.length})
                </span>
                {threadReplies.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No replies yet. Start the thread below.</p>
                ) : (
                  threadReplies.map(rep => (
                    <div key={rep.id} className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span className="font-semibold text-slate-900">{rep.authorName}</span>
                        <span>{rep.timestamp}</span>
                      </div>
                      <p className="text-slate-700">{rep.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleSendReply} className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={threadReplyInput}
                  onChange={e => setThreadReplyInput(e.target.value)}
                  placeholder="Reply in thread..."
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!threadReplyInput.trim()}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Record Mode */}
        {rightPanelMode === 'record' && (
          <div className="space-y-4 text-xs">
            {inspectedRecord ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Type: {inspectedRecord.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{inspectedRecord.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Record ID: {inspectedRecord.id}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Quick Operational Actions</h5>
                  <button
                    onClick={() => {
                      setRightPanelMode('closed');
                      // trigger universal drawer if needed
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Full 360 Inspector</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No record selected for preview.</p>
            )}
          </div>
        )}

        {/* Participants Mode */}
        {rightPanelMode === 'participants' && (
          <div className="space-y-3 text-xs">
            {connectMeetings[0]?.participants.map(p => (
              <div key={p.userId} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.role}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {p.rsvp}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tasks Mode */}
        {rightPanelMode === 'tasks' && (
          <div className="space-y-2.5 text-xs">
            {projectTasks.slice(0, 5).map(task => (
              <div key={task.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{task.title}</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                    {task.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{task.description}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" />
                  Due: {task.dueDate}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
