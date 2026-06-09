import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './lib/env.js';
import { prisma } from './lib/prisma.js';
import { adminRouter } from './routes/admin.js';
import { authRouter } from './routes/auth.js';
import { publicRouter } from './routes/public.js';
import { errorHandler, notFound } from './middleware/error.js';
import { csrfProtection, issueCsrfToken } from './middleware/csrf.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(cors({
  origin: [env.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

app.use('/uploads', express.static(path.resolve('uploads'), {
  maxAge: env.NODE_ENV === 'production' ? '7d' : 0
}));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'sifa-hijama-api' }));
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.get('/api/csrf-token', issueCsrfToken);
app.use('/api', csrfProtection, publicRouter);
app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`Sifa Hijama API listening on port ${env.PORT}`);
});

process.on('SIGTERM', async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
