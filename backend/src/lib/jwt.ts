import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from './env.js';

export type JwtUser = {
  sub: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
};

export function signToken(payload: JwtUser) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  } as SignOptions);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtUser;
}
