import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const appointmentSchema = z.object({
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6).max(40),
  notes: z.string().max(1000).optional().or(z.literal(''))
});

export const appointmentStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'RESCHEDULED', 'COMPLETED']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  adminNote: z.string().max(1000).optional()
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal('')),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(2000)
});

export const serviceSchema = z.object({
  slug: z.string().min(2).max(120),
  titleBs: z.string().min(2),
  titleEn: z.string().min(2),
  summaryBs: z.string().min(5),
  summaryEn: z.string().min(5),
  descriptionBs: z.string().min(10),
  descriptionEn: z.string().min(10),
  durationMin: z.coerce.number().int().positive(),
  priceBam: z.coerce.number().positive(),
  isActive: z.boolean().default(true)
});

export const blogPostSchema = z.object({
  slug: z.string().min(2).max(160),
  titleBs: z.string().min(2),
  titleEn: z.string().min(2),
  excerptBs: z.string().min(5),
  excerptEn: z.string().min(5),
  contentBs: z.string().min(10),
  contentEn: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(false),
  categoryId: z.string().optional().or(z.literal(''))
});

export const testimonialSchema = z.object({
  name: z.string().min(2).max(120),
  quoteBs: z.string().min(5),
  quoteEn: z.string().min(5),
  rating: z.coerce.number().int().min(1).max(5),
  isActive: z.boolean().default(true)
});

export const userSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'STAFF']).default('STAFF')
});
