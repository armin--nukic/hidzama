import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const trimmedString = () => z.string().trim();

const schema = z.object({
  NODE_ENV: trimmedString().default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: trimmedString().url(),
  JWT_SECRET: trimmedString().min(24),
  JWT_EXPIRES_IN: trimmedString().default('7d'),
  FRONTEND_URL: trimmedString().url().default('http://localhost:3000'),
  BACKEND_URL: trimmedString().url().default('http://localhost:4000'),
  SMTP_HOST: trimmedString().default('mailhog'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: trimmedString().optional(),
  SMTP_PASS: trimmedString().optional(),
  MAIL_FROM: trimmedString().default('Sifa Hijama <no-reply@sifahidzama.ba>'),
  NOTIFY_EMAIL: trimmedString().email().default('info@sifahidzama.ba'),
  ADMIN_EMAIL: trimmedString().email().default('admin@sifahidzama.ba'),
  ADMIN_PASSWORD: trimmedString().min(8).default('Admin123!ChangeMe')
});

export const env = schema.parse(process.env);
