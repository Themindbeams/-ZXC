import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Building2,
  Mail,
  ShieldCheck,
  Video,
  MessageSquare,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ConnectPeopleProps {
  onNavigateTab: (tab: string) => void;
}

export const ConnectPeople: React.FC<ConnectPeopleProps> = ({ onNavigateTab }) => {
  const {
    users,
    currentUser,
    branches,
    createConnectMeeting,
    setActiveSpaceId,
    workspaceSpaces
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  const departments = Array.from(new Set(users.map(u => u.department)));

  const filteredUsers = users.filter(user => {
    if (selectedBranch !== 'all' && user.branchId !== selectedBranch) return false;
    if (selectedDepartment !== 'all' && user.department !== selectedDepartment) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStart1on1Call = (targetUser: typeof users[0]) => {
    createConnectMeeting({
      title: `1:1 Consultation with ${targetUser.name}`,
      description: `Direct alignment between ${currentUser.name} and ${targetUser.name}`,
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
        { userId: targetUser.id, name: targetUser.name, role: targetUser.role, rsvp: 'Accepted' }
      ],
      agendaItems: [
        { id: 'ag_p1', title: `Discussion with ${targetUser.name}`, completed: false }
      ],
      notes: '1-on-1 meeting',
      isRecording: false,
      recordingConsentAcknowledged: true
    });
    onNavigateTab('meetings');
  };

  const handleOpenDM = (targetUser: typeof users[0]) => {
    const dm = workspaceSpaces.find(
      s => s.type === 'direct' && s.directParticipantId === targetUser.id
    ) || workspaceSpaces.find(s => s.type === 'direct');
    if (dm) {
      setActiveSpaceId(dm.id);
    }
    onNavigateTab('direct');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Company People & Organization Directory</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified staff members, assigned operational branches, and statutory segregation boundaries.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, role or dept..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Row: Branch & Department Selectors */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden"
        >
          <option value="all">All Branches</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
          ))}
        </select>

        <select
          value={selectedDepartment}
          onChange={e => setSelectedDepartment(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden"
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <span className="text-slate-400 text-[11px] ml-auto">
          Showing {filteredUsers.length} of {users.length} staff
        </span>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => {
          const branch = branches.find(b => b.id === user.branchId);
          const isMe = user.id === currentUser.id;

          return (
            <div
              key={user.id}
              className={`bg-white rounded-xl border shadow-xs p-4 flex flex-col justify-between transition-all hover:border-indigo-300 ${
                isMe ? 'border-indigo-300 ring-1 ring-indigo-200/60 bg-indigo-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                {/* Top Profile */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-linear-to-tr from-slate-800 to-indigo-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {user.name}
                        {isMe && (
                          <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-semibold">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-indigo-600 font-semibold">{user.role}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-500 truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-medium">Assigned Branch:</span>
                    <span>{branch?.name || 'Victoria Island HQ'}</span>
                  </div>
                </div>

                {/* Statutory Permissions Summary Tags */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Statutory Segregation Privileges:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.canViewFinance && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono px-1.5 py-0.2 rounded border border-emerald-200">
                        GL Finance
                      </span>
                    )}
                    {user.permissions.canViewPayroll && (
                      <span className="text-[10px] bg-purple-50 text-purple-700 font-mono px-1.5 py-0.2 rounded border border-purple-200">
                        Payroll Isolated
                      </span>
                    )}
                    {user.permissions.canAccessPOS && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-mono px-1.5 py-0.2 rounded border border-blue-200">
                        Retail POS
                      </span>
                    )}
                    {user.permissions.canApprovePayouts && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 font-mono px-1.5 py-0.2 rounded border border-amber-200">
                        Maker-Checker
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {!isMe && (
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenDM(user)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>Message</span>
                  </button>
                  <button
                    onClick={() => handleStart1on1Call(user)}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>1:1 Call</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
