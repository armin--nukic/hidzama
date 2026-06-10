# Sifa Hijama

Production-ready full-stack web application for a Hijama clinic in Bosnia and Herzegovina.

- Frontend: React 19, Vite, TypeScript, TailwindCSS, React Router, React Query, i18next
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Deployment: Docker and Docker Compose

## Quick Start

Start the full system:

```bash
docker compose up -d --build
```

Open:

- Website: http://localhost:3100
- API health: http://localhost:4100/health
- MailHog email inbox: http://localhost:18025

Docker Compose binds services to `127.0.0.1` by default and uses VPS-safe host ports so it does not interfere with other apps using `localhost:3000`, `4000`, standard PostgreSQL `5432`, or Redis `6379`.

Default admin:

- Email: `admin@sifahidzama.ba`
- Password: `Admin123!ChangeMe`

Change these values in `.env` before deploying.

Clinic details used by the app:

- Owner: Amir Uzunovic
- Location: Porjecani, Visoko, Bosnia and Herzegovina
- Phone: `061 497 647`

## Email Notifications

Local development uses MailHog. Open http://localhost:8025 to see booking confirmations and owner notifications.

For Gmail notifications in production, set these variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_google_app_password
MAIL_FROM="Sifa Hijama <yourgmail@gmail.com>"
NOTIFY_EMAIL=yourgmail@gmail.com
```

Use a Google App Password, not the normal Gmail password.

## Database

PostgreSQL runs in Docker as service `postgres`. Data is stored in the Docker volume `hidzamaaaa_postgres_data`.

Check tables:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "\dt"
```

Check appointments:

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "select id, \"customerName\", \"customerPhone\", date, time, status from appointments order by \"createdAt\" desc;"
```

## Project Structure

```text
sifa-hijama/
  backend/
    prisma/
      migrations/
      schema.prisma
      seed.ts
    src/
      emails/
      lib/
      middleware/
      routes/
      server.ts
  frontend/
    public/
      robots.txt
      sitemap.xml
    src/
      components/
      i18n/
      layouts/
      lib/
      pages/
  docker-compose.yml
```

## Production Notes

- Set a long random `JWT_SECRET`.
- Put the API behind HTTPS.
- Use a real SMTP provider for confirmation emails.
- Restrict PostgreSQL port exposure in production.
- Update `sitemap.xml` if public routes change.

## API

The backend exposes public endpoints for services, blog posts, testimonials, contact forms and bookings. Admin endpoints are protected by JWT and role checks.

## Security

The API includes Helmet, rate limiting, CORS allow-listing, secure JWT verification, bcrypt password hashing, Prisma-backed persistence, Zod validation, CSRF double-submit protection for mutating browser requests, and centralized error handling.
