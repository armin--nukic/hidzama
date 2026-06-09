import nodemailer from 'nodemailer';
import { env } from '../lib/env.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
});

export async function sendAppointmentConfirmation(to: string, name: string, date: string, time: string) {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject: 'Sifa Hijama - potvrda zahtjeva za termin',
    text: `Postovani/a ${name}, zaprimili smo Vas zahtjev za termin ${date} u ${time}. Kontaktirat cemo Vas nakon potvrde.`,
    html: `<p>Postovani/a ${name},</p><p>Zaprimili smo Vas zahtjev za termin <strong>${date} u ${time}</strong>.</p><p>Kontaktirat cemo Vas nakon potvrde.</p>`
  });
}

export async function sendAppointmentNotification(details: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  serviceName: string;
  notes?: string | null;
}) {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.NOTIFY_EMAIL,
    subject: `Novi termin - ${details.customerName}`,
    text: [
      'Novi zahtjev za termin:',
      `Ime: ${details.customerName}`,
      `Email: ${details.customerEmail}`,
      `Telefon: ${details.customerPhone}`,
      `Usluga: ${details.serviceName}`,
      `Datum: ${details.date}`,
      `Vrijeme: ${details.time}`,
      `Napomena: ${details.notes || '-'}`
    ].join('\n'),
    html: `<h2>Novi zahtjev za termin</h2>
      <p><strong>Ime:</strong> ${details.customerName}</p>
      <p><strong>Email:</strong> ${details.customerEmail}</p>
      <p><strong>Telefon:</strong> ${details.customerPhone}</p>
      <p><strong>Usluga:</strong> ${details.serviceName}</p>
      <p><strong>Datum:</strong> ${details.date}</p>
      <p><strong>Vrijeme:</strong> ${details.time}</p>
      <p><strong>Napomena:</strong> ${details.notes || '-'}</p>`
  });
}

export async function sendContactNotification(details: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.NOTIFY_EMAIL,
    subject: `Nova kontakt poruka - ${details.subject}`,
    text: [
      'Nova kontakt poruka:',
      `Ime: ${details.name}`,
      `Email: ${details.email}`,
      `Telefon: ${details.phone || '-'}`,
      `Naslov: ${details.subject}`,
      `Poruka: ${details.message}`
    ].join('\n'),
    html: `<h2>Nova kontakt poruka</h2>
      <p><strong>Ime:</strong> ${details.name}</p>
      <p><strong>Email:</strong> ${details.email}</p>
      <p><strong>Telefon:</strong> ${details.phone || '-'}</p>
      <p><strong>Naslov:</strong> ${details.subject}</p>
      <p><strong>Poruka:</strong><br/>${details.message}</p>`
  });
}
