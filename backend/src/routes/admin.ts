import { Router } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import multer from 'multer';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { env } from '../lib/env.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import {
  appointmentStatusSchema,
  blogPostSchema,
  serviceSchema,
  testimonialSchema,
  userSchema
} from '../lib/validators.js';

export const adminRouter = Router();
const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${randomUUID()}${extension}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  }
});

adminRouter.use(requireAuth);

adminRouter.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No valid file uploaded' });
  const url = `${env.BACKEND_URL}/uploads/${req.file.filename}`;
  return res.status(201).json({
    url,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size
  });
});

adminRouter.get('/stats', requireAdmin, async (_req, res) => {
  const [totalAppointments, upcomingAppointments, contactRequests, pendingAppointments] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.count({
      where: { date: { gte: new Date() }, status: { in: ['PENDING', 'APPROVED', 'RESCHEDULED'] } }
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.appointment.count({ where: { status: 'PENDING' } })
  ]);
  res.json({ totalAppointments, upcomingAppointments, contactRequests, pendingAppointments });
});

adminRouter.get('/appointments', requireAdmin, async (_req, res) => {
  const appointments = await prisma.appointment.findMany({
    include: { service: true },
    orderBy: [{ date: 'asc' }, { time: 'asc' }]
  });
  res.json(appointments);
});

adminRouter.patch('/appointments/:id', requireAdmin, async (req, res, next) => {
  try {
    const body = appointmentStatusSchema.parse(req.body);
    const appointment = await prisma.appointment.update({
      where: { id: String(req.params.id) },
      data: {
        status: body.status,
        date: body.date ? new Date(`${body.date}T00:00:00.000Z`) : undefined,
        time: body.time,
        adminNote: body.adminNote
      },
      include: { service: true }
    });
    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/services', async (_req, res) => {
  res.json(await prisma.service.findMany({ orderBy: { createdAt: 'desc' } }));
});

adminRouter.post('/services', async (req, res, next) => {
  try {
    const body = serviceSchema.parse(req.body);
    res.status(201).json(await prisma.service.create({ data: body }));
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/services/:id', async (req, res, next) => {
  try {
    const body = serviceSchema.parse(req.body);
    res.json(await prisma.service.update({ where: { id: String(req.params.id) }, data: body }));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete('/services/:id', requireAdmin, async (req, res) => {
  await prisma.service.update({ where: { id: String(req.params.id) }, data: { isActive: false } });
  res.status(204).send();
});

adminRouter.get('/blog-posts', async (_req, res) => {
  res.json(await prisma.blogPost.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }));
});

adminRouter.post('/blog-posts', async (req, res, next) => {
  try {
    const body = blogPostSchema.parse(req.body);
    res.status(201).json(await prisma.blogPost.create({
      data: {
        ...body,
        coverImage: body.coverImage || null,
        categoryId: body.categoryId || null,
        publishedAt: body.published ? new Date() : null
      }
    }));
  } catch (error) {
    next(error);
  }
});

adminRouter.put('/blog-posts/:id', async (req, res, next) => {
  try {
    const body = blogPostSchema.parse(req.body);
    res.json(await prisma.blogPost.update({
      where: { id: String(req.params.id) },
      data: {
        ...body,
        coverImage: body.coverImage || null,
        categoryId: body.categoryId || null,
        publishedAt: body.published ? new Date() : null
      }
    }));
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/testimonials', requireAdmin, async (_req, res) => {
  res.json(await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }));
});

adminRouter.post('/testimonials', requireAdmin, async (req, res, next) => {
  try {
    const body = testimonialSchema.parse(req.body);
    res.status(201).json(await prisma.testimonial.create({ data: body }));
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/contact-messages', requireAdmin, async (_req, res) => {
  res.json(await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }));
});

adminRouter.patch('/contact-messages/:id/read', requireAdmin, async (req, res) => {
  res.json(await prisma.contactMessage.update({ where: { id: String(req.params.id) }, data: { isRead: true } }));
});

adminRouter.get('/users', requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});

adminRouter.post('/users', requireAdmin, async (req, res, next) => {
  try {
    const body = userSchema.parse(req.body);
    const password = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: { ...body, password },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});
