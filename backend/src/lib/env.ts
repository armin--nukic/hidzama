import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(24),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  BACKEND_URL: z.string().url().default('http://localhost:4000'),
  SMTP_HOST: z.string().default('mailhog'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default('Sifa Hijama <no-reply@sifahidzama.ba>'),
  NOTIFY_EMAIL: z.string().email().default('info@sifahidzama.ba'),
  ADMIN_EMAIL: z.string().email().default('admin@sifahidzama.ba'),
  ADMIN_PASSWORD: z.string().min(8).default('Admin123!ChangeMe')
});

export const env = schema.parse(process.env);
