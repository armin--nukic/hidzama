# Sifa Hijama Upload and Deployment Guide

This file explains how to run locally, deploy to production, check the database, and configure email notifications.

## Local Setup

From `C:\programming\hidzamaaaa`:

```bash
docker compose up -d --build
```

Open:

- Website: http://localhost:3000
- API: http://localhost:4000/health
- Local email inbox: http://localhost:8025
- Admin: http://localhost:3000/admin/login

Default admin:

- Email: `admin@sifahidzama.ba`
- Password: `Admin123!ChangeMe`

## Production Setup

1. Upload the full project folder to the server.
2. Create `.env` from `.env.example`.
3. Change all passwords and secrets.
4. Start:

```bash
docker compose up -d --build
```

Recommended production `.env`:

```env
POSTGRES_USER=sifa
POSTGRES_PASSWORD=CHANGE_THIS_DATABASE_PASSWORD
POSTGRES_DB=sifa_hijama
DATABASE_URL=postgresql://sifa:CHANGE_THIS_DATABASE_PASSWORD@postgres:5432/sifa_hijama?schema=public
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_64_CHARS_MIN
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=CHANGE_THIS_ADMIN_PASSWORD
FRONTEND_URL=https://sifahidzama.ba
BACKEND_URL=https://sifahidzama.ba
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_google_app_password
MAIL_FROM="Sifa Hijama <yourgmail@gmail.com>"
NOTIFY_EMAIL=yourgmail@gmail.com
```

## Gmail Notifications

To receive notifications on Gmail:

1. Open Google Account security settings.
2. Enable 2-step verification.
3. Create an App Password for Mail.
4. Put that app password in `SMTP_PASS`.
5. Put the Gmail address that should receive notifications in `NOTIFY_EMAIL`.

When a customer books an appointment:

- Customer gets a confirmation email.
- `NOTIFY_EMAIL` receives the booking details.
- The appointment is stored in PostgreSQL table `appointments`.

When a customer submits contact form:

- `NOTIFY_EMAIL` receives the message.
- The message is stored in PostgreSQL table `contact_messages`.

## Database Storage

The database is PostgreSQL inside Docker.

Docker service: `postgres`

Database name: `sifa_hijama`

Docker volume: `hidzamaaaa_postgres_data`

Tables:

- `users`
- `appointments`
- `services`
- `blog_posts`
- `categories`
- `testimonials`
- `contact_messages`
- `settings`

## Check SQL Data

List tables:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "\dt"
```

Check latest appointments:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "select id, \"customerName\", \"customerEmail\", \"customerPhone\", date, time, status from appointments order by \"createdAt\" desc limit 20;"
```

Check contact messages:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "select id, name, email, phone, subject, \"createdAt\" from contact_messages order by \"createdAt\" desc limit 20;"
```

Check services:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "select slug, \"titleBs\", \"priceBam\", \"durationMin\", \"isActive\" from services;"
```

Open database shell:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama
```

## Backup Database

Create backup:

```bash
docker compose exec postgres pg_dump -U sifa sifa_hijama > sifa_hijama_backup.sql
```

Restore backup:

```bash
docker compose exec -T postgres psql -U sifa -d sifa_hijama < sifa_hijama_backup.sql
```

## Upload New Version

After changing code on the server:

```bash
docker compose up -d --build
```

Check logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

## Owner and Clinic Details

- Owner: Amir Uzunovic
- Location: Porjecani, Visoko
- Phone: 061 497 647
- Domain: sifahidzama.ba
