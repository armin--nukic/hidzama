---
name: sifa-hijama-maintainer
description: Maintain, deploy, and improve the Sifa Hijama full-stack app. Use when updating clinic details, UI/UX, booking flow, admin panel, PostgreSQL/Prisma schema, Docker deployment, email notification settings, SEO files, or production setup docs for sifahidzama.ba.
---

# Sifa Hijama Maintainer

## Project Facts

- Project root: `C:\programming\hidzamaaaa`
- Brand: Sifa Hijama
- Domain: `sifahidzama.ba`
- Owner: Amir Uzunovic
- Phone: `061 497 647`
- Location: Porjecani, Visoko, Bosnia and Herzegovina

## Stack

- Frontend: React, Vite, TypeScript, TailwindCSS, React Router, React Query, i18next
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Deployment: Docker Compose

## Workflow

1. Read the relevant files before editing.
2. Keep UI mobile-first and clinic-focused.
3. Preserve Bosnian as the default language and English as secondary.
4. Keep owner notifications controlled by `NOTIFY_EMAIL`.
5. Keep production secrets in `.env`, never hard-code passwords.
6. After backend or frontend changes, run `docker compose build`.
7. After deployment changes, run `docker compose config`.

## Important Files

- `docker-compose.yml`: services and environment variables
- `.env.example`: production variable template
- `backend/prisma/schema.prisma`: database schema
- `backend/prisma/seed.ts`: seed data and clinic settings
- `backend/src/emails/mailer.ts`: email confirmation and owner notification logic
- `frontend/src/layouts/PublicLayout.tsx`: nav, footer, mobile sticky CTA
- `frontend/src/pages/Home.tsx`: hero and homepage content
- `frontend/src/pages/Contact.tsx`: public contact details and map
- `frontend/public/logo-shifa.svg`: current brand mark
- `upload.md`: deployment and operations notes

## Email Rules

Use MailHog locally. Use Gmail or domain SMTP in production.

For Gmail:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=google_app_password
MAIL_FROM="Sifa Hijama <yourgmail@gmail.com>"
NOTIFY_EMAIL=yourgmail@gmail.com
```

Use a Google App Password.

## Database Checks

List tables:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "\dt"
```

Latest appointments:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "select id, \"customerName\", \"customerPhone\", date, time, status from appointments order by \"createdAt\" desc limit 20;"
```
