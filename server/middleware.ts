import { Request, Response, NextFunction } from 'express';
import { validateSession, checkPermission, AuthContext, logAudit } from './auth';
import { ModuleName, ActionType } from './types';

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export function extractAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.cookies && req.cookies.zeex_session) {
    token = req.cookies.zeex_session;
  }

  if (token) {
    const ctx = validateSession(token);
    if (ctx) {
      req.auth = ctx;
    }
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) {
    return res.status(401).json({
      error: 'AuthenticationRequired',
      message: 'You must provide a valid session token to access this endpoint.'
    });
  }
  next();
}

export function requirePermission(module: ModuleName, action: ActionType) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        error: 'AuthenticationRequired',
        message: 'Valid session required.'
      });
    }

    // Branch context check if target branch is specified in params or query
    const targetBranchId = (req.params.branchId || req.query.branchId || req.body?.branchId) as string | undefined;

    const allowed = checkPermission(req.auth, module, action, targetBranchId);

    if (!allowed) {
      logAudit(
        req.auth.user.tenantId,
        'API_PERMISSION_DENIED',
        module,
        action,
        `User ${req.auth.user.username} denied ${action} on ${module} (Branch: ${targetBranchId || req.auth.activeBranch.code})`,
        req.ip || '127.0.0.1',
        'Denied',
        req.auth.user.id,
        req.auth.user.fullName
      );

      return res.status(403).json({
        error: 'AccessDenied',
        module,
        action,
        message: `Separation of Duties Policy: Your assigned role (${req.auth.roles.map(r => r.role).join(', ')}) lacks '${action}' authorization on module '${module}'.`
      });
    }

    next();
  };
}
