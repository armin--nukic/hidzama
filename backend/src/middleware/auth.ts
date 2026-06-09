import type { NextFunction, Request, Response } from 'express';
import { verifyToken, type JwtUser } from '../lib/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
}
