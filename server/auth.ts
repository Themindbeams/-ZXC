import crypto from 'crypto';
import { db, verifyPassword, hashPassword } from './db';
import {
  UserAccount,
  SessionToken,
  RoleAssignment,
  RoleName,
  ModuleName,
  ActionType,
  BranchSite,
  AuditRecord
} from './types';

export { hashPassword };

// Default session expiry: 12 hours
const SESSION_EXPIRY_MS = 12 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export interface AuthContext {
  user: UserAccount;
  session: SessionToken;
  roles: RoleAssignment[];
  activeBranch: BranchSite;
  authorizedBranches: BranchSite[];
}

export function sanitizeUser(u: UserAccount) {
  const { passwordHash, salt, ...safe } = u;
  return safe;
}

// Authenticate user with credentials, rate-limiting & failed-login lockout protection
export function authenticateUser(
  usernameOrEmail: string,
  plainPassword: string,
  ipAddress: string,
  userAgent: string
): { success: boolean; error?: string; context?: AuthContext; token?: string } {
  const data = db.getData();
  const lower = usernameOrEmail.toLowerCase().trim();

  const user = data.users.find(
    u => u.username.toLowerCase() === lower || u.email.toLowerCase() === lower
  );

  if (!user) {
    // Record failed login audit with fake identifier to prevent timing enumeration
    logAudit(
      'SYSTEM_TENANT',
      'AUTH_LOGIN_FAILED',
      'User',
      'unknown',
      `Unknown identifier attempted login: ${lower}`,
      ipAddress,
      'Denied'
    );
    return { success: false, error: 'Invalid credentials provided.' };
  }

  // Check account status
  if (user.status !== 'Active') {
    return { success: false, error: `Account is ${user.status.toLowerCase()}. Contact administrator.` };
  }

  // Check lockout
  const now = new Date();
  if (user.lockedUntil && new Date(user.lockedUntil) > now) {
    const remainingMin = Math.ceil((new Date(user.lockedUntil).getTime() - now.getTime()) / 60000);
    return {
      success: false,
      error: `Account temporarily locked due to excessive failed attempts. Try again in ${remainingMin} minute(s).`
    };
  }

  // Verify password using scrypt
  const isValid = verifyPassword(plainPassword, user.passwordHash, user.salt);

  if (!isValid) {
    user.failedLoginAttempts += 1;
    let lockoutNotice = '';

    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
      lockoutNotice = ' Account locked for 15 minutes.';
    }

    db.save();
    logAudit(
      user.tenantId,
      'AUTH_PASSWORD_FAILED',
      'User',
      user.id,
      `Failed password attempt (${user.failedLoginAttempts}/${MAX_FAILED_ATTEMPTS}).${lockoutNotice}`,
      ipAddress,
      'Denied',
      user.id,
      user.fullName
    );

    return { success: false, error: `Invalid credentials provided.${lockoutNotice}` };
  }

  // Password verified: reset counters
  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  user.lastLoginAt = now.toISOString();
  user.lastLoginIp = ipAddress;

  // Determine authorized branches
  const userRoles = data.roleAssignments.filter(
    ra => ra.userId === user.id && ra.tenantId === user.tenantId
  );

  const tenantBranches = data.branches.filter(
    b => b.tenantId === user.tenantId && b.status === 'Active'
  );

  // If role has specific branch, filter; if Global or OwnerDirector, all branches
  const isGlobalRole = userRoles.some(
    r => r.role === 'OwnerDirector' || r.role === 'OrgAdmin' || !r.branchId
  );

  const authorizedBranches = isGlobalRole
    ? tenantBranches
    : tenantBranches.filter(b => userRoles.some(r => r.branchId === b.id));

  const activeBranch = authorizedBranches[0] || tenantBranches[0];

  if (!activeBranch) {
    return { success: false, error: 'User has no authorized active branch in tenant.' };
  }

  // Generate secure 256-bit random session token
  const tokenString = crypto.randomBytes(32).toString('hex');
  const session: SessionToken = {
    id: `sess_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    token: tokenString,
    userId: user.id,
    tenantId: user.tenantId,
    legalEntityId: activeBranch.legalEntityId,
    activeBranchId: activeBranch.id,
    ipAddress,
    userAgent: userAgent.slice(0, 180),
    createdAt: now.toISOString(),
    lastActiveAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_EXPIRY_MS).toISOString(),
    status: 'Active'
  };

  data.sessions.push(session);
  db.save();

  logAudit(
    user.tenantId,
    'AUTH_LOGIN_SUCCESS',
    'Session',
    session.id,
    `Logged in from ${ipAddress} to ${activeBranch.name}`,
    ipAddress,
    'Success',
    user.id,
    user.fullName
  );

  return {
    success: true,
    token: tokenString,
    context: {
      user: sanitizeUser(user) as UserAccount,
      session,
      roles: userRoles,
      activeBranch,
      authorizedBranches
    }
  };
}

// Validate session token with expiry and update heartbeat
export function validateSession(token: string): AuthContext | null {
  if (!token) return null;
  const data = db.getData();
  const session = data.sessions.find(s => s.token === token && s.status === 'Active');

  if (!session) return null;

  const now = new Date();
  if (new Date(session.expiresAt) <= now) {
    session.status = 'Expired';
    db.save();
    return null;
  }

  const user = data.users.find(u => u.id === session.userId && u.status === 'Active');
  if (!user) return null;

  // Heartbeat
  session.lastActiveAt = now.toISOString();

  const userRoles = data.roleAssignments.filter(
    ra => ra.userId === user.id && ra.tenantId === user.tenantId
  );

  const tenantBranches = data.branches.filter(
    b => b.tenantId === user.tenantId && b.status === 'Active'
  );

  const isGlobalRole = userRoles.some(
    r => r.role === 'OwnerDirector' || r.role === 'OrgAdmin' || !r.branchId
  );

  const authorizedBranches = isGlobalRole
    ? tenantBranches
    : tenantBranches.filter(b => userRoles.some(r => r.branchId === b.id));

  const activeBranch = tenantBranches.find(b => b.id === session.activeBranchId) || authorizedBranches[0];

  return {
    user: sanitizeUser(user) as UserAccount,
    session,
    roles: userRoles,
    activeBranch,
    authorizedBranches
  };
}

// Revoke session remotely
export function revokeSession(sessionId: string, actorId: string): boolean {
  const data = db.getData();
  const session = data.sessions.find(s => s.id === sessionId);
  if (!session) return false;

  session.status = 'Revoked';
  db.save();

  logAudit(
    session.tenantId,
    'SESSION_REVOKED',
    'Session',
    session.id,
    `Session revoked by user ${actorId}`,
    session.ipAddress,
    'Success',
    actorId
  );

  return true;
}

// Switch active branch
export function switchSessionBranch(token: string, newBranchId: string): { success: boolean; error?: string; activeBranch?: BranchSite } {
  const ctx = validateSession(token);
  if (!ctx) return { success: false, error: 'Unauthorized or expired session.' };

  const targetBranch = ctx.authorizedBranches.find(b => b.id === newBranchId);
  if (!targetBranch) {
    return { success: false, error: 'Access Denied: You are not authorized for this branch site.' };
  }

  const data = db.getData();
  const sess = data.sessions.find(s => s.token === token);
  if (sess) {
    sess.activeBranchId = targetBranch.id;
    sess.legalEntityId = targetBranch.legalEntityId;
    db.save();
  }

  return { success: true, activeBranch: targetBranch };
}

// ---------------- Granular Role-Based Access Control (Default-Deny) ----------------
export function checkPermission(
  ctx: AuthContext,
  module: ModuleName,
  action: ActionType,
  targetBranchId?: string
): boolean {
  // If branch is specified, verify user has authorization for that branch
  if (targetBranchId && targetBranchId !== ctx.activeBranch.id) {
    const isBranchAuthorized = ctx.authorizedBranches.some(b => b.id === targetBranchId);
    if (!isBranchAuthorized) {
      return false; // Cross-branch violation denied!
    }
  }

  const roleNames = ctx.roles.map(r => r.role);

  // Default-Deny: Evaluate matrix
  for (const role of roleNames) {
    if (evaluateRoleCapability(role, module, action)) {
      return true;
    }
  }

  return false;
}

function evaluateRoleCapability(role: RoleName, module: ModuleName, action: ActionType): boolean {
  // 1. OwnerDirector: Full control across modules, but sensitive payroll requires dedicated check
  if (role === 'OwnerDirector') {
    return true;
  }

  // 2. OrgAdmin: Organization management, users, configurations
  if (role === 'OrgAdmin') {
    if (module === 'organization' || module === 'customization' || module === 'audit') return true;
    if (action === 'view') return true;
    if (module === 'payroll') return false; // Cannot execute payroll
    return true;
  }

  // 3. Accountant / Finance Director:
  // Strict Segregation: Can view/post ledger, approve payouts, but CANNOT view confidential individual employee compensation!
  if (role === 'Accountant' || role === 'AccountsPayableOfficer' || role === 'AccountsReceivableOfficer') {
    if (module === 'accounting' || module === 'treasury') return true;
    if (module === 'retail' && action === 'view') return true;
    if (module === 'payroll') {
      // Accountant can ONLY view summarized payroll journal, never individual wages!
      return action === 'view';
    }
    if (module === 'audit' && action === 'view') return true;
    return false;
  }

  // 4. PayrollOfficer:
  // Can manage payroll & compensation, but cannot alter General Ledger directly!
  if (role === 'PayrollOfficer') {
    if (module === 'payroll' || module === 'hr') return true;
    if (module === 'accounting') return action === 'view'; // read-only reference
    return false;
  }

  // 5. HROfficer: Employee master, profiles, not ledger
  if (role === 'HROfficer') {
    if (module === 'hr') return true;
    return false;
  }

  // 6. Cashier:
  // Strictly isolated to Retail POS till shifts & checkout! Books locked!
  if (role === 'Cashier') {
    if (module === 'retail') {
      return action === 'view' || action === 'create' || action === 'refund';
    }
    return false;
  }

  // 7. Technician: Automotive jobs & parts requests only
  if (role === 'Technician') {
    if (module === 'automotive') return true;
    if (module === 'inventory' && action === 'view') return true;
    return false;
  }

  // 8. Dispatcher / Driver: Logistics only
  if (role === 'Dispatcher' || role === 'Driver') {
    if (module === 'logistics') return true;
    return false;
  }

  // 9. InventoryOfficer / ProcurementOfficer:
  if (role === 'InventoryOfficer' || role === 'ProcurementOfficer') {
    if (module === 'inventory' || module === 'procurement' || module === 'retail') {
      return action !== 'refund';
    }
    return false;
  }

  // 10. BranchManager: Branch level operations, approvals within branch
  if (role === 'BranchManager') {
    if (module === 'payroll') return false; // Segregated
    return true;
  }

  // 11. Auditor: Read-only across system, zero mutation
  if (role === 'Auditor') {
    return action === 'view' || action === 'export';
  }

  return false;
}

// Structured Audit Logger
export function logAudit(
  tenantId: string,
  action: string,
  targetEntity: string,
  targetId: string,
  changesSummary: string,
  ipAddress: string,
  status: 'Success' | 'Denied' | 'Flagged' = 'Success',
  actorUserId: string = 'SYSTEM',
  actorName: string = 'System'
) {
  const data = db.getData();
  const record: AuditRecord = {
    id: `aud_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    tenantId,
    actorUserId,
    actorName,
    action,
    targetEntity,
    targetId,
    changesSummary,
    ipAddress,
    status,
    timestamp: new Date().toISOString()
  };
  data.auditRecords.unshift(record);
  db.save();
}
