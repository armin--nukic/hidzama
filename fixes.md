# Fixes - Vercel, Render, Admin i Night Mode

## 1. Header

U headeru je uklonjen tekst:

```text
Porječani, Visoko
```

Sada gore ostaje samo:

```text
Šifa Hidžama
```

Lokacija ostaje u footeru, kontakt stranici i SEO podacima.

## 2. Night mode footer

Problem je bio što je footer koristio Tailwind klasu `bg-ink`. U light mode-u je `ink` taman, ali u night mode-u `ink` postaje svijetla boja za tekst. Zato se footer pretvorio u svijetlu površinu sa bijelim tekstom.

Popravka:

```text
footer sada koristi posebnu klasu footer-dark
```

Ona ima stabilnu tamnu pozadinu i u light i u night mode-u.

## 3. Admin user i password nisu u Vercelu

Vercel hosta samo frontend.

Admin email i password dolaze iz Render backend Environment Variables:

```env
ADMIN_EMAIL
ADMIN_PASSWORD
```

To znači:

- Vercel nema admin password
- Vercel ima samo `VITE_API_URL`
- login request ide sa Vercela prema Render backendu
- Render provjerava email/password protiv korisnika u Neon bazi

## 4. Gdje naći ili promijeniti admin login

Idi na Render:

```text
Render -> tvoj backend service -> Environment
```

Tu traži:

```env
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=neka_tvoja_lozinka
```

Važno: Render obično ne prikazuje postojeću secret vrijednost normalno. Ako ne znaš password, najlakše je postaviti novi.

Primjer:

```env
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=NovaJakaLozinka123!
```

Zatim klikni:

```text
Manual Deploy -> Deploy latest commit
```

Backend start komanda pokreće seed:

```text
npm run db:migrate && npm run db:seed && npm start
```

Seed radi `upsert` admin korisnika i update-a password u Neon bazi.

## 5. Ako i dalje piše Invalid credentials

Provjeri ovo redom:

1. Render Environment ima tačan `ADMIN_EMAIL`.
2. Render Environment ima novi `ADMIN_PASSWORD`.
3. Render je redeployan nakon promjene.
4. Render logovi pokazuju da je prošao `npm run db:seed`.
5. Login koristi isti email i isti password.

Ako želiš reset ručno kroz deploy:

```env
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=NovaJakaLozinka123!
```

Redeploy Render backend, pa login:

```text
Email: admin@sifahidzama.ba
Password: NovaJakaLozinka123!
```

## 6. Vercel SPA routing

Za `/admin` 404 na Vercelu dodan je:

```text
frontend/vercel.json
```

Sadržaj:

```json
{
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```

Ovo omogućava da direktno rade:

```text
/admin
/admin/login
/blog/neki-blog
/contact
```

## 7. Šta pushati sada

```bash
git add .
git commit -m "Fix header footer dark mode and admin login notes"
git push
```

Nakon toga:

1. Vercel će redeployati frontend.
2. Ako si promijenio `ADMIN_PASSWORD`, redeployaj Render backend.
3. Testiraj:

```text
https://hidzama.vercel.app/admin/login
```

## 8. Kratko objašnjenje toka login-a

```text
Vercel frontend
  -> šalje email/password na VITE_API_URL/auth/login
Render backend
  -> provjerava korisnika u Neon PostgreSQL
Neon database
  -> čuva users tabelu i hashed password
```

Zato admin podaci nisu u browseru i nisu u Vercelu. Oni su u Render env varijablama i Neon bazi.

## 9. Invalid CSRF token na rezervaciji ili kontakt formi

Problem:

```text
Invalid CSRF token
```

Uzrok je bio Vercel + Render cross-domain setup. Frontend je na:

```text
https://hidzama.vercel.app
```

a backend je na:

```text
https://tvoj-render-backend.onrender.com
```

Stari CSRF sistem je očekivao cookie, ali browser često ne šalje cookie između različitih domena. Zato je rezervacija padala iako `/health`, blogovi i usluge rade.

Popravka:

- backend sada izdaje potpisan CSRF token kroz `/api/csrf-token`
- frontend token šalje u `X-CSRF-Token` headeru
- backend token provjerava bez cross-site cookie-a
- ako token istekne, frontend automatski uzme novi i ponovi zahtjev jednom

Promijenjeni fajlovi:

```text
backend/src/middleware/csrf.ts
frontend/src/lib/api.ts
```

Nakon ovoga moraš deployati oba dijela:

```bash
git add .
git commit -m "Fix CSRF for Vercel Render deployment"
git push
```

Zatim:

1. Render backend redeploy.
2. Vercel frontend redeploy.
3. Otvori `/booking` i pošalji test rezervaciju.

## 10. Gdje staviti email za kontakt i rezervacije

Email gdje vlasnik prima obavijesti ide u Render backend Environment Variables:

```env
NOTIFY_EMAIL=testict119@gmail.com
```

Na Renderu:

```text
Render -> backend service -> Environment -> NOTIFY_EMAIL
```

Stavi:

```env
NOTIFY_EMAIL=testict119@gmail.com
```

Zatim:

```text
Manual Deploy -> Deploy latest commit
```

Rezervacije šalju dvije poruke:

- potvrdu klijentu na `customerEmail`
- obavijest ordinaciji na `NOTIFY_EMAIL`

Kontakt forma šalje obavijest ordinaciji na:

```env
NOTIFY_EMAIL
```

Ako koristiš Gmail SMTP, provjeri i ove varijable na Renderu:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tvojgmail@gmail.com
SMTP_PASS=google_app_password
MAIL_FROM=Šifa Hidžama <tvojgmail@gmail.com>
NOTIFY_EMAIL=testict119@gmail.com
```

`SMTP_PASS` nije normalna Gmail lozinka. Mora biti Google App Password.
