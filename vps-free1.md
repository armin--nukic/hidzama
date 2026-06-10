# VPS Free1 - hidzama.ice.lol i vise sajtova na jednom VPS-u

Ovaj vodič je za deploy na jedan VPS/IP gdje sada želiš:

```text
hidzama.ice.lol
```

a kasnije:

```text
vozilo.ice.lol
```

Najstabilniji način je da ne koristiš `api.hidzama.ice.lol` dok DNS/proxy nije siguran. Umjesto toga koristi:

```text
https://hidzama.ice.lol        -> frontend
https://hidzama.ice.lol/api    -> backend API
https://hidzama.ice.lol/health -> backend health
```

Tako frontend i API rade na istom domenu i nema CORS problema.

## 1. DNS

U DNS panelu već imaš:

```text
hidzama.ice.lol  A  44.44.44.44
vozilo.ice.lol   A  44.44.44.44
```

To je ispravno ako je `44.44.44.44` IP tvog VPS-a.

Za ovaj setup ne moraš praviti:

```text
api.hidzama.ice.lol
```

Ako ga kasnije želiš, može, ali nije potrebno.

## 2. VPS folderi

Na serveru koristi odvojene foldere:

```text
/opt/hidzama
/opt/vozilo
```

Svaki projekat ima svoj `.env`, svoje portove i svoje Docker volume-e.

## 3. Hidzama `.env`

U `/opt/hidzama/.env` stavi:

```env
POSTGRES_BIND_IP=127.0.0.1
POSTGRES_PORT=55432
POSTGRES_USER=sifa
POSTGRES_PASSWORD=OVDJE_JAKA_DB_LOZINKA
POSTGRES_DB=sifa_hijama
DATABASE_URL=postgresql://sifa:OVDJE_JAKA_DB_LOZINKA@postgres:5432/sifa_hijama?schema=public

FRONTEND_BIND_IP=127.0.0.1
FRONTEND_PORT=3100
BACKEND_BIND_IP=127.0.0.1
BACKEND_PORT=4100
MAILHOG_BIND_IP=127.0.0.1
MAILHOG_PORT=18025

JWT_SECRET=OVDJE_DUG_RANDOM_SECRET_MINIMUM_32_ZNAKA
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=OVDJE_ADMIN_LOZINKA

FRONTEND_URL=https://hidzama.ice.lol
BACKEND_URL=https://hidzama.ice.lol
VITE_API_URL=/api
CORS_ORIGINS=https://hidzama.ice.lol

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tvojgmail@gmail.com
SMTP_PASS=google_app_password
MAIL_FROM=Šifa Hidžama <tvojgmail@gmail.com>
NOTIFY_EMAIL=testict119@gmail.com
```

Najvažnije:

```env
VITE_API_URL=/api
BACKEND_URL=https://hidzama.ice.lol
FRONTEND_URL=https://hidzama.ice.lol
```

Ovo znači da frontend neće zvati `api.hidzama.ice.lol`, nego isti domen:

```text
https://hidzama.ice.lol/api/blog
```

## 4. Pokretanje Docker Compose

U folderu projekta:

```bash
cd /opt/hidzama
docker compose up -d --build
docker compose ps
```

Trebaš vidjeti portove ovako:

```text
127.0.0.1:3100->80
127.0.0.1:4100->4000
127.0.0.1:55432->5432
127.0.0.1:18025->8025
```

Test na VPS-u:

```bash
curl http://127.0.0.1:4100/health
curl http://127.0.0.1:4100/api/blog
curl http://127.0.0.1:3100
```

Ako otvoriš samo:

```text
http://127.0.0.1:4100
```

backend treba vratiti JSON info. Pravi API je:

```text
http://127.0.0.1:4100/api/blog
```

## 5. Nginx reverse proxy za hidzama.ice.lol

Napravi fajl:

```bash
sudo nano /etc/nginx/sites-available/hidzama.ice.lol
```

Sadržaj:

```nginx
server {
  listen 80;
  server_name hidzama.ice.lol;

  location /api/ {
    proxy_pass http://127.0.0.1:4100/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /uploads/ {
    proxy_pass http://127.0.0.1:4100/uploads/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /health {
    proxy_pass http://127.0.0.1:4100/health;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    proxy_pass http://127.0.0.1:3100;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/hidzama.ice.lol /etc/nginx/sites-enabled/hidzama.ice.lol
sudo nginx -t
sudo systemctl reload nginx
```

Test:

```text
http://hidzama.ice.lol
http://hidzama.ice.lol/health
http://hidzama.ice.lol/api/blog
```

## 6. SSL

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d hidzama.ice.lol
```

Poslije toga koristi:

```text
https://hidzama.ice.lol
https://hidzama.ice.lol/api/blog
```

## 7. Kasnije vozilo.ice.lol

Za drugi projekat koristi druge portove:

```env
FRONTEND_PORT=3200
BACKEND_PORT=4200
POSTGRES_PORT=55433
MAILHOG_PORT=18026
FRONTEND_URL=https://vozilo.ice.lol
BACKEND_URL=https://vozilo.ice.lol
VITE_API_URL=/api
CORS_ORIGINS=https://vozilo.ice.lol
```

Nginx za vozilo:

```nginx
server {
  listen 80;
  server_name vozilo.ice.lol;

  location /api/ {
    proxy_pass http://127.0.0.1:4200/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /uploads/ {
    proxy_pass http://127.0.0.1:4200/uploads/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    proxy_pass http://127.0.0.1:3200;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

SSL:

```bash
sudo certbot --nginx -d vozilo.ice.lol
```

## 8. Ako blog opet ne radi

Provjeri iz browsera:

```text
https://hidzama.ice.lol/api/blog
```

Ako se vidi JSON, backend radi.

Ako `/api/blog` radi, ali frontend kaže CORS, onda frontend vjerovatno nije rebuildan sa:

```env
VITE_API_URL=/api
```

Rješenje:

```bash
cd /opt/hidzama
docker compose build frontend --no-cache
docker compose up -d
```

Ako `/api/blog` vrati `[]`, seed nije ubacio blogove ili nema published blogova:

```bash
docker compose logs backend --tail=100
docker compose exec backend npm run db:seed
```

## 9. Firewall

Otvori samo:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Ne otvaraj:

```text
3100
4100
55432
18025
```

Oni su samo localhost portovi iza Nginx-a.

## 10. Brzi checklist

```bash
cd /opt/hidzama
grep VITE_API_URL .env
docker compose up -d --build
curl http://127.0.0.1:4100/health
curl http://127.0.0.1:4100/api/blog
sudo nginx -t
sudo systemctl reload nginx
curl http://hidzama.ice.lol/health
curl http://hidzama.ice.lol/api/blog
```

Kad ovo radi, sajt treba normalno prikazivati blogove bez `api.hidzama.ice.lol`.
