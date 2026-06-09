import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(422).json({ message: 'Validation failed', issues: error.flatten() });
  }

  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
}
