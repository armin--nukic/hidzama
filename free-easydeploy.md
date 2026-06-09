# Free Easy Deploy - Sifa Hidžama

Ovaj dokument je za najlakši način da vlasnik ili klijent vidi aplikaciju online bez kupovine servera odmah.

## Najlakša probna opcija

Preporuka za probu:

- Frontend: Render Static Site ili Vercel
- Backend: Render Web Service ili Railway
- Database: Supabase Free Postgres ili Render Postgres
- Email: Gmail App Password ili Brevo/SendGrid SMTP

Za ozbiljnu produkciju bolji je mali VPS sa Docker Compose, ali za demo i validaciju ovo je najbrže.

## Opcija A: Render + Supabase

Render može hostati frontend i backend. Supabase Free daje managed PostgreSQL bazu. Supabase Free trenutno navodi 500 MB database size, 1 GB file storage i pauziranje nakon neaktivnosti, pa je dobar za test, ne za ozbiljnu produkciju bez backup plana.

Linkovi:

- Render free: https://render.com/free
- Render pricing: https://render.com/pricing
- Supabase pricing: https://supabase.com/pricing

### 1. Napravi GitHub repo

```bash
git init
git add .
git commit -m "Initial Sifa Hidžama app"
git branch -M main
git remote add origin https://github.com/USERNAME/sifa-hidzama.git
git push -u origin main
```

### 2. Supabase baza

1. Otvori https://supabase.com
2. New project
3. Sačuvaj database password
4. Idi na Project Settings -> Database
5. Kopiraj connection string

Format koji treba backendu:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@HOST:5432/postgres?schema=public
```

### 3. Backend na Render

Napravi Render Web Service iz GitHub repo-a.

Postavke:

```text
Root Directory: backend
Build Command: npm install && npx prisma generate && npm run build
Start Command: npx prisma migrate deploy && npm run db:seed && npm start
```

Environment variables:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=OVDJE_STAVI_DUG_RANDOM_SECRET_MIN_32_ZNAKA
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tvoj-frontend.onrender.com
BACKEND_URL=https://tvoj-backend.onrender.com
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=PromijeniOvo123!
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tvojgmail@gmail.com
SMTP_PASS=GOOGLE_APP_PASSWORD
MAIL_FROM=Sifa Hidžama <tvojgmail@gmail.com>
NOTIFY_EMAIL=tvojgmail@gmail.com
```

### 4. Frontend na Render Static Site

Postavke:

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Environment variable:

```env
VITE_API_URL=https://tvoj-backend.onrender.com/api
```

### 5. Email notifikacije na Gmail

Ne koristi normalnu Gmail lozinku.

1. Uključi 2-Step Verification na Google računu
2. Otvori Google App Passwords
3. Napravi app password za “Mail”
4. Tu lozinku stavi u `SMTP_PASS`
5. Email gdje vlasnik prima notifikacije ide u `NOTIFY_EMAIL`

Ako vlasnik želi primati na Gmail:

```env
NOTIFY_EMAIL=vlasnik@gmail.com
SMTP_USER=tvojgmail@gmail.com
SMTP_PASS=google_app_password
MAIL_FROM=Sifa Hidžama <tvojgmail@gmail.com>
```

## Opcija B: Railway trial

Railway ima trial sa kreditom i može pokrenuti backend i bazu. Prema njihovoj dokumentaciji novi korisnici dobijaju probni period do 30 dana i početni kredit, a poslije prelazi na mali mjesečni free kredit.

Link: https://docs.railway.com/pricing/free-trial

Koristi Railway ako želiš sve na jednom mjestu brzo, ali provjeri limit i karticu prije produkcije.

## Šta ne treba zaboraviti

- Promijeni `ADMIN_PASSWORD`.
- Promijeni `JWT_SECRET`.
- Ne koristi demo/free bazu za prave medicinske podatke bez backup-a.
- Za `sifahidzama.ba` ili drugu domenu dodaj DNS record prema hostingu.
- Testiraj rezervaciju i provjeri da email stiže vlasniku.
