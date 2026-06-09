import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { appointmentSchema, contactSchema } from '../lib/validators.js';
import { sendAppointmentConfirmation, sendAppointmentNotification, sendContactNotification } from '../emails/mailer.js';

export const publicRouter = Router();

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

publicRouter.get('/services', async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { priceBam: 'asc' }
  });
  res.json(services);
});

publicRouter.get('/testimonials', async (_req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(testimonials);
});

publicRouter.get('/blog', async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      category: category ? { slug: category } : undefined
    },
    include: { category: true },
    orderBy: { publishedAt: 'desc' }
  });
  res.json(posts);
});

publicRouter.get('/blog/:slug', async (req, res) => {
  const post = await prisma.blogPost.findFirst({
    where: { slug: req.params.slug, published: true },
    include: { category: true }
  });
  if (!post) return res.status(404).json({ message: 'Blog post not found' });
  return res.json(post);
});

publicRouter.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { nameBs: 'asc' } });
  res.json(categories);
});

publicRouter.get('/availability', async (req, res) => {
  const date = typeof req.query.date === 'string' ? req.query.date : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(422).json({ message: 'Valid date is required' });
  }

  const booked = await prisma.appointment.findMany({
    where: {
      date: new Date(`${date}T00:00:00.000Z`),
      status: { in: ['PENDING', 'APPROVED', 'RESCHEDULED'] }
    },
    select: { time: true }
  });
  const bookedSlots = booked.map((item: { time: string }) => item.time);
  const blocked = new Set(bookedSlots);
  return res.json({
    all: timeSlots,
    available: timeSlots.filter((slot) => !blocked.has(slot)),
    booked: bookedSlots
  });
});

publicRouter.post('/appointments', async (req, res, next) => {
  try {
    const body = appointmentSchema.parse(req.body);
    const date = new Date(`${body.date}T00:00:00.000Z`);

    const service = await prisma.service.findFirst({ where: { id: body.serviceId, isActive: true } });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const existing = await prisma.appointment.findFirst({
      where: { date, time: body.time, status: { in: ['PENDING', 'APPROVED', 'RESCHEDULED'] } }
    });
    if (existing) return res.status(409).json({ message: 'Selected time slot is no longer available' });

    const appointment = await prisma.appointment.create({
      data: {
        serviceId: body.serviceId,
        date,
        time: body.time,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        notes: body.notes || null
      },
      include: { service: true }
    });

    await sendAppointmentConfirmation(body.customerEmail, body.customerName, body.date, body.time).catch(console.error);
    await sendAppointmentNotification({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      date: body.date,
      time: body.time,
      serviceName: service.titleBs,
      notes: body.notes || null
    }).catch(console.error);
    return res.status(201).json(appointment);
  } catch (error) {
    return next(error);
  }
});

publicRouter.post('/contact', async (req, res, next) => {
  try {
    const body = contactSchema.parse(req.body);
    const message = await prisma.contactMessage.create({ data: body });
    await sendContactNotification(body).catch(console.error);
    return res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
});

publicRouter.get('/settings', async (_req, res) => {
  const settings = await prisma.setting.findMany();
  res.json(Object.fromEntries(settings.map((setting: { key: string; value: string }) => [setting.key, setting.value])));
});
