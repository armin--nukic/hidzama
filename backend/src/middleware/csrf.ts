import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../lib/env.js';

const COOKIE_NAME = 'sifa_csrf';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function constantTimeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function issueCsrfToken(_req: Request, res: Response) {
  const token = randomBytes(32).toString('hex');
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
    path: '/api'
  });
  res.json({ csrfToken: token });
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  const cookieToken = req.cookies?.[COOKIE_NAME];
  const headerToken = req.header('x-csrf-token');

  if (!cookieToken || !headerToken || !constantTimeEqual(cookieToken, headerToken)) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  return next();
}
