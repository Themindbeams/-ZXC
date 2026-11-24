import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { StatCard } from '../../common/StatCard';
import { Modal } from '../../common/Modal';
import {
  ShieldCheck,
  Lock,
  Users,
  Clock,
  AlertTriangle,
  Monitor,
  CheckCircle2,
  XCircle,
  Search,
  UserPlus,
  KeyRound
} from 'lucide-react';
import { api } from '../../../services/api';

export const SecurityAccessModule: React.FC = () => {
  const {
    currentUser,
    activeBranch,
    branches,
    posSessions,
    formatCurrency,
    setNotificationMessage
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'staff' | 'sessions' | 'pos_shifts' | 'matrix'>('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Retail Storefront');
  const [selectedRole, setSelectedRole] = useState('Cashier');
  const [selectedBranchId, setSelectedBranchId] = useState(activeBranch.id);
  const [tempPassword, setTempPassword] = useState('SecurePass2026!');

  const loadData = async () => {
    const staffRes = await api.auth.getStaff();
    if (staffRes.success && staffRes.data?.staff) {
      setStaffList(staffRes.data.staff);
    }
    const sessRes = await api.auth.getSessions();
    if (sessRes.success && sessRes.data?.sessions) {
      setSessionsList(sessRes.data.sessions);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeBranch]);

  const handleRevoke = async (sessionId: string) => {
    const res = await api.auth.revokeSession(sessionId);
    if (res.success) {
      setNotificationMessage('Session revoked successfully.');
      loadData();
    } else {
      setNotificationMessage(res.error || 'Failed revoking session.');
    }
  };

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.auth.inviteStaff({
      fullName,
      username,
      email,
      temporaryPassword: tempPassword,
      role: selectedRole,
      department,
      branchId: selectedBranchId
    });

    if (res.success) {
      setNotificationMessage(`Staff account for ${fullName} created successfully.`);
      setIsInviteModalOpen(false);
      setFullName('');
      setUsername('');
      setEmail('');
      loadData();
    } else {
      setNotificationMessage(res.error || 'Failed inviting staff member.');
    }
  };

  const filteredStaff = staffList.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.primaryDepartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSessionsCount = sessionsList.filter(s => s.status === 'Active').length;
  const activeTillShiftsCount = posSessions.filter(p => p.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Identity, Access & Shift Accountability</span>
            <span>·</span>
            <span>Enterprise Zero-Trust Governance</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
            Staff & Access Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite Staff Member
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Provisioned Staff Accounts"
          value={String(staffList.length || 8)}
          secondary="Role-Scoped & Password Hashed"
          icon={<Users className="w-4 h-4 text-slate-800" />}
        />
        <StatCard
          label="Active Connected Sessions"
          value={String(activeSessionsCount || 1)}
          secondary="Tracked with Device Fingerprints"
          icon={<Monitor className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Active POS Till Shifts"
          value={String(activeTillShiftsCount)}
          secondary="Physical Drawer Shift Custody"
          icon={<Clock className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Segmented Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveSubTab('staff')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'staff' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Staff Directory & Roles ({staffList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('sessions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'sessions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Device Sessions ({sessionsList.length})
          </button>
          <button
            onClick={() => setActiveSubTab('pos_shifts')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'pos_shifts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Till Shifts & Cash Reconciliation
          </button>
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'matrix' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Granular Separation of Duties (SoD)
          </button>
        </div>

        {activeSubTab === 'staff' && (
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search staff by name or dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden"
            />
          </div>
        )}
      </div>

      {/* SubTab 1: Staff Directory & Scoped Roles */}
      {activeSubTab === 'staff' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Enterprise staff directory. Passwords are securely hashed using cryptographic scrypt; credentials and passkeys are never retrievable or exposed in plaintext.
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Username & Email</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Assigned Roles</th>
                  <th className="py-3 px-4">MFA Status</th>
                  <th className="py-3 px-4">Account State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((staff: any) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {staff.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div>{staff.username}</div>
                      <span className="text-[11px] text-slate-400">{staff.email}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{staff.primaryDepartment}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {staff.roles?.map((r: any, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                            {r.role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        staff.mfaEnabled ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {staff.mfaEnabled ? 'MFA Active' : 'Password Only'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {staff.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 2: Connected Device Sessions & Revocation */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Real-time active sessions. Administrators or employees can remotely terminate compromised or forgotten device connections.
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <tr>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Operating Branch</th>
                  <th className="py-3 px-4">Device & Browser</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Login Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {sessionsList.map((sess: any) => (
                  <tr key={sess.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-sans font-semibold text-slate-900">{sess.userName}</td>
                    <td className="py-3 px-4 font-sans text-slate-700">{sess.branchName}</td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">{sess.deviceType}</td>
                    <td className="py-3 px-4 text-slate-600">{sess.ipAddress}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{sess.loginTime?.slice(0, 19).replace('T', ' ')}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {sess.status} {sess.isCurrent ? '(This Device)' : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => handleRevoke(sess.id)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 3: Till Shifts & Cash Reconciliation */}
      {activeSubTab === 'pos_shifts' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Audit of cashier custody shifts, opening floats, sales collected by payment tender, and drawer variance reconciliation.
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 font-sans">
                <tr>
                  <th className="py-3 px-4">Till Station</th>
                  <th className="py-3 px-4">Cashier</th>
                  <th className="py-3 px-4 text-right">Opening Float</th>
                  <th className="py-3 px-4 text-right">Cash Collected</th>
                  <th className="py-3 px-4 text-right">Card / Transfer</th>
                  <th className="py-3 px-4 text-right">Expected Drawer</th>
                  <th className="py-3 px-4 text-right">Variance</th>
                  <th className="py-3 px-4">Shift State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posSessions.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 font-sans">{s.tillNumber}</td>
                    <td className="py-3 px-4 font-sans text-slate-800">{s.cashierName}</td>
                    <td className="py-3 px-4 text-right text-slate-700">{formatCurrency(s.openingFloat)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">{formatCurrency(s.cashCollected)}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(s.cardCollected + (s.transferCollected || 0))}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(s.expectedCashInDrawer)}</td>
                    <td className="py-3 px-4 text-right font-bold">
                      <span className={s.cashVariance && s.cashVariance < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                        {s.status === 'Closed' ? (s.cashVariance ? formatCurrency(s.cashVariance) : '$0.00 (Balanced)') : 'Active Shift'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        s.status === 'Active' || s.status === 'Open' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SubTab 4: Separation of Duties Matrix */}
      {activeSubTab === 'matrix' && (
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 text-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Enterprise Separation of Duties (SoD) Protocol</h3>
            <p className="text-slate-500">
              Enforced consistently on the server-side API layer. Frontline personnel cannot inspect company financial ledgers; accountants are barred from viewing individual payroll wages; cashiers are confined to POS registers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 block">Finance vs. Payroll Segregation</span>
              <p className="text-[11px] text-slate-600">
                Personnel in charge of General Ledger accounting only receive aggregated, summarized payroll batches. Individual employee salaries and bank routing numbers are shielded.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 block">Dual-Authorization Payouts</span>
              <p className="text-[11px] text-slate-600">
                Makers of disbursement requests are prohibited from self-approving payouts above the threshold. A separate authorized checker must verify and approve before release.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 block">Branch Scoped Confinement</span>
              <p className="text-[11px] text-slate-600">
                Frontline staff and branch managers are restricted to their authorized operating sites. Cross-branch transactions require consolidated group credentials.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invite Staff Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite New Staff Member"
        subtitle="Provision account with scrypt-hashed credentials and assigned branch role."
        maxWidth="md"
      >
        <form onSubmit={handleInviteStaff} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Babatunde Fashola"
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">System Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="babatunde.f"
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="b.fashola@apexhorizon.com"
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Assigned Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-medium"
              >
                <option value="Cashier">Cashier (Retail & POS Till)</option>
                <option value="Technician">Technician (Automotive Workshop)</option>
                <option value="Dispatcher">Dispatcher (Fleet Logistics)</option>
                <option value="Accountant">Accountant (Finance & Ledger)</option>
                <option value="PayrollOfficer">Payroll Officer (Compensation)</option>
                <option value="BranchManager">Branch Manager</option>
                <option value="InventoryOfficer">Inventory & Procurement</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Operating Branch</label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Temporary Initial Password</label>
            <input
              type="password"
              required
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-800 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Hashed securely on the server with salt using scrypt.</span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 cursor-pointer shadow-xs"
            >
              Confirm & Provision Staff Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
