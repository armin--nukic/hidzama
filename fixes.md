# Fixes - Vercel, Render i Admin Ruta

## Problem: `/admin` na Vercelu vraća 404 NOT_FOUND

Ako otvoriš:

```text
https://hidzama.vercel.app/admin
```

i vidiš:

```text
404: NOT_FOUND
Code: NOT_FOUND
```

to nije backend problem i nije Render problem. To je frontend routing problem.

Aplikacija koristi React Router. Ruta `/admin` postoji unutar React aplikacije, ali Vercel pri direktnom otvaranju `/admin` prvo traži stvarni fajl ili folder `/admin`. Pošto takav fajl ne postoji u buildu, Vercel vrati 404 prije nego što React aplikacija uopšte krene.

## Popravka koja je dodana

Dodan je fajl:

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

Ovo kaže Vercelu:

- ako ruta nije `/api/...`
- pošalji je na `index.html`
- React Router će onda odlučiti da li je to `/admin`, `/admin/login`, `/blog/neki-blog`, `/contact`, itd.

Dodan je i fallback fajl:

```text
frontend/public/_redirects
```

Sadržaj:

```text
/* /index.html 200
```

Ovaj fajl pomaže ako isti frontend nekad prebaciš na Netlify ili drugi static hosting.

## Šta sada treba uraditi

Pushaj izmjene:

```bash
git add .
git commit -m "Fix Vercel SPA routing"
git push
```

Zatim na Vercelu:

1. Otvori Vercel projekat
2. Idi na `Deployments`
3. Klikni `Redeploy` na zadnji deployment ili sačekaj auto deploy nakon Git push-a
4. Kad završi, testiraj:

```text
https://hidzama.vercel.app/admin
https://hidzama.vercel.app/admin/login
https://hidzama.vercel.app/contact
https://hidzama.vercel.app/blog
```

## Vercel postavke za frontend

Provjeri da su postavke ovakve:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variable:

```env
VITE_API_URL=https://tvoj-render-backend.onrender.com/api
```

Primjer:

```env
VITE_API_URL=https://hidzama.onrender.com/api
```

Ako promijeniš `VITE_API_URL`, moraš uraditi novi Vercel deploy.

## Render backend provjera

Ako:

```text
https://tvoj-render-backend.onrender.com/health
```

vraća:

```json
{"ok":true,"service":"sifa-hijama-api"}
```

backend radi.

Ako blogovi i usluge rade na Vercelu, znači `VITE_API_URL` je dobar.

## Admin login

Admin login ruta:

```text
https://hidzama.vercel.app/admin/login
```

Nakon login-a aplikacija ide na:

```text
https://hidzama.vercel.app/admin
```

Ako ova ruta radi nakon novog Vercel deploya, fix je uspješan.

## Važno za Render CORS

Na Render backendu `FRONTEND_URL` mora biti tvoj Vercel URL:

```env
FRONTEND_URL=https://hidzama.vercel.app
```

Ako koristiš preview URL ili drugi Vercel domen, stavi baš taj URL.

Nakon promjene `FRONTEND_URL` na Renderu uradi:

```text
Manual Deploy -> Deploy latest commit
```

## Ukratko

Problem:

```text
Vercel nije znao da /admin treba poslati React aplikaciji.
```

Rješenje:

```text
frontend/vercel.json rewrite -> /index.html
```

Poslije push-a i redeploya, direktno otvaranje `/admin`, refresh na `/admin`, `/admin/login` i blog detail rute treba raditi normalno.
