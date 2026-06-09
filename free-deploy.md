# Free Deploy Guide

This guide explains how to publish the project to GitHub and test it online for free or near-free.

## 1. Push To GitHub

From `C:\programming\hidzamaaaa`:

```bash
git init
git add .
git commit -m "Initial Sifa Hidžama app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sifa-hidzama.git
git push -u origin main
```

Do not commit `.env`. It is ignored by `.gitignore`.

## 2. Free Database

Use one of these:

- Neon: https://neon.tech
- Supabase: https://supabase.com

Create a PostgreSQL database and copy the connection string.

Example:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
postgresql://neondb_owner:npg_jKJ9MAR5wmuY@ep-quiet-hall-apqfadiy.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 3. Free Backend Deploy

Recommended for testing: Render free web service.

Render: https://render.com

Create a new Web Service:

- Source: GitHub repo
- Root directory: `backend`
- Runtime: Node
- Build command:

```bash
npm install && npx prisma generate && npm run build
```

- Start command:

```bash
npx prisma migrate deploy && npm run db:seed && npm start
```

Environment variables:

```env
NODE_ENV=production
DATABASE_URL=PASTE_NEON_OR_SUPABASE_DATABASE_URL
JWT_SECRET=CHANGE_THIS_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=CHANGE_THIS_ADMIN_PASSWORD
FRONTEND_URL=https://YOUR_FRONTEND.vercel.app
BACKEND_URL=https://YOUR_BACKEND.onrender.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_google_app_password
MAIL_FROM="Sifa Hidžama <yourgmail@gmail.com>"
NOTIFY_EMAIL=yourgmail@gmail.com
```

Render free services can sleep when not used. First request after sleep may be slow.

## 4. Free Frontend Deploy

Recommended: Vercel.

Vercel: https://vercel.com

Create new project:

- Source: GitHub repo
- Root directory: `frontend`
- Build command:

```bash
npm install && npm run build
```

- Output directory:

```bash
dist
```

Environment variable:

```env
VITE_API_URL=https://YOUR_BACKEND.onrender.com/api
```

After frontend deploy, copy the Vercel URL and update backend `FRONTEND_URL` on Render.

## 5. Free Subdomain

Free test subdomains:

- Vercel gives `your-project.vercel.app`
- Render gives `your-service.onrender.com`

For `sifahidzama.ba`, add DNS later:

- `A` or `CNAME` record for frontend
- API can be `api.sifahidzama.ba`

Simple production setup:

- `sifahidzama.ba` -> Vercel frontend
- `api.sifahidzama.ba` -> Render backend
- `DATABASE_URL` -> Neon/Supabase PostgreSQL

## 6. Important Upload Note

The current app stores admin blog attachments on backend disk at `/uploads`.

This is OK for:

- local Docker testing
- VPS deployment
- paid Render disk

On free Render, uploaded files may disappear after redeploy/restart because free filesystem storage is not permanent.

Best free production option for attachments:

- Cloudinary free tier for images
- Supabase Storage free tier for files

For owner demo/startup test, current upload is fine. For real production, move uploads to Cloudinary or Supabase Storage.

## 7. Check Production

Backend health:

```text
https://YOUR_BACKEND.onrender.com/health
```

Frontend:

```text
https://YOUR_FRONTEND.vercel.app
```

Admin:

```text
https://YOUR_FRONTEND.vercel.app/admin/login
```

## 8. Local Docker Still Works

For local development:

```bash
docker compose up -d --build
```

Local URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- MailHog: http://localhost:8025
