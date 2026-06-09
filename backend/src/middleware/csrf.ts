import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../lib/env.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const TOKEN_TTL_MS = 1000 * 60 * 60;

function sign(payload: string) {
  return createHmac('sha256', env.JWT_SECRET).update(payload).digest('base64url');
}

function constantTimeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function createToken() {
  const payload = `${Date.now()}.${randomBytes(24).toString('base64url')}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestamp, nonce, signature] = parts;
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > TOKEN_TTL_MS) return false;

  const payload = `${timestamp}.${nonce}`;
  return constantTimeEqual(signature, sign(payload));
}

export function issueCsrfToken(_req: Request, res: Response) {
  res.json({ csrfToken: createToken() });
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  const headerToken = req.header('x-csrf-token');
  if (!headerToken || !verifyToken(headerToken)) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  return next();
}
