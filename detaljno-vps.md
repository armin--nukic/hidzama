# Detaljno VPS Deploy - hidzama.ice.lol

Ovaj vodič je za deploy aplikacije **Šifa Hidžama** na VPS server:

```text
IP servera: 13.140.166.66
Prvi domen: hidzama.ice.lol
Kasnije drugi domen: vozilo.ice.lol
```

Preporučeni setup:

```text
hidzama.ice.lol        -> frontend
hidzama.ice.lol/api    -> backend API
hidzama.ice.lol/health -> backend health
```

Ne moraš koristiti `api.hidzama.ice.lol`. Jedan domen sa `/api` je jednostavniji i izbjegava CORS probleme.

## 1. DNS

U DNS panelu za `ice.lol` postavi:

```text
hidzama.ice.lol  A  13.140.166.66
vozilo.ice.lol   A  13.140.166.66
```

Za početak ti treba samo:

```text
hidzama.ice.lol  A  13.140.166.66
```

Provjera sa svog računara:

```bash
nslookup hidzama.ice.lol
```

Treba vratiti:

```text
13.140.166.66
```

## 2. SSH na server

Spoji se:

```bash
ssh root@13.140.166.66
```

Ako koristiš drugog usera:

```bash
ssh username@13.140.166.66
```

## 3. Osnovni update servera

Na serveru:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl ufw nginx ca-certificates
```

## 4. Firewall

Otvori samo SSH, HTTP i HTTPS:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

Ne otvaraj portove `3100`, `4100`, `55432`, `18025`. Oni ostaju lokalni iza Nginx-a.

## 5. Docker instalacija

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Ako si root, možeš nastaviti odmah. Ako nisi root, odjavi se i prijavi ponovo:

```bash
exit
ssh username@13.140.166.66
```

Provjeri:

```bash
docker --version
docker compose version
```

## 6. Folder za projekat

```bash
sudo mkdir -p /opt/hidzama
sudo chown -R $USER:$USER /opt/hidzama
cd /opt/hidzama
```

## 7. Prebaci kod na VPS

Opcija A: preko GitHub-a:

```bash
cd /opt
git clone https://github.com/USERNAME/REPO.git hidzama
cd /opt/hidzama
```

Opcija B: ako je folder već prazan i hoćeš pull:

```bash
cd /opt/hidzama
git init
git remote add origin https://github.com/USERNAME/REPO.git
git pull origin main
```

Zamijeni:

```text
USERNAME/REPO
```

tvojim GitHub repo nazivom.

## 8. Napravi `.env`

U `/opt/hidzama` napravi `.env`:

```bash
nano .env
```

Stavi:

```env
POSTGRES_BIND_IP=127.0.0.1
POSTGRES_PORT=55432
POSTGRES_USER=sifa
POSTGRES_PASSWORD=OVDJE_STAVI_JAKU_DB_LOZINKU
POSTGRES_DB=sifa_hijama
DATABASE_URL=postgresql://sifa:OVDJE_STAVI_JAKU_DB_LOZINKU@postgres:5432/sifa_hijama?schema=public

FRONTEND_BIND_IP=127.0.0.1
FRONTEND_PORT=3100
BACKEND_BIND_IP=127.0.0.1
BACKEND_PORT=4100
MAILHOG_BIND_IP=127.0.0.1
MAILHOG_PORT=18025

JWT_SECRET=OVDJE_STAVI_DUG_RANDOM_SECRET_MINIMUM_32_ZNAKA
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=OVDJE_STAVI_ADMIN_LOZINKU

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

Važno:

```env
VITE_API_URL=/api
```

To znači da frontend zove:

```text
https://hidzama.ice.lol/api
```

a ne `api.hidzama.ice.lol`.

## 9. Pokreni Docker Compose

```bash
cd /opt/hidzama
docker compose up -d --build
```

Provjeri:

```bash
docker compose ps
```

Treba izgledati približno ovako:

```text
frontend   127.0.0.1:3100->80
backend    127.0.0.1:4100->4000
postgres   127.0.0.1:55432->5432
mailhog    127.0.0.1:18025->8025
```

## 10. Provjeri backend i frontend lokalno na VPS-u

```bash
curl http://127.0.0.1:4100/
curl http://127.0.0.1:4100/health
curl http://127.0.0.1:4100/api/blog
curl -I http://127.0.0.1:3100
```

Ako `/api/blog` vrati JSON, backend i baza rade.

Ako vrati `[]`, pokreni seed:

```bash
docker compose exec backend npm run db:seed
```

## 11. Nginx reverse proxy za hidzama.ice.lol

Napravi config:

```bash
sudo nano /etc/nginx/sites-available/hidzama.ice.lol
```

Stavi:

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

Test iz browsera:

```text
http://hidzama.ice.lol
http://hidzama.ice.lol/health
http://hidzama.ice.lol/api/blog
```

## 12. SSL certifikat

Instaliraj certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Dodaj SSL:

```bash
sudo certbot --nginx -d hidzama.ice.lol
```

Test:

```text
https://hidzama.ice.lol
https://hidzama.ice.lol/health
https://hidzama.ice.lol/api/blog
```

## 13. Admin login

Otvori:

```text
https://hidzama.ice.lol/admin/login
```

Koristi:

```text
Email: vrijednost iz ADMIN_EMAIL
Password: vrijednost iz ADMIN_PASSWORD
```

Ako ne znaš password, promijeni ga u `.env`:

```env
ADMIN_PASSWORD=NovaJakaLozinka123!
```

Zatim:

```bash
docker compose up -d --build
```

Seed će updateovati admin korisnika.

## 14. Email notifikacije

Rezervacije i kontakt forme šalju obavijest na:

```env
NOTIFY_EMAIL=testict119@gmail.com
```

Za Gmail moraš koristiti Google App Password:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tvojgmail@gmail.com
SMTP_PASS=google_app_password
MAIL_FROM=Šifa Hidžama <tvojgmail@gmail.com>
NOTIFY_EMAIL=testict119@gmail.com
```

Nakon izmjene:

```bash
docker compose up -d --build
```

## 15. Update aplikacije kasnije

Kad napraviš promjene lokalno i push na GitHub:

```bash
cd /opt/hidzama
git pull
docker compose up -d --build
```

Ako frontend ne pokupi novi `VITE_API_URL`, koristi:

```bash
docker compose build frontend --no-cache
docker compose up -d
```

## 16. Backup baze

```bash
cd /opt/hidzama
mkdir -p backups
docker compose exec -T postgres pg_dump -U sifa sifa_hijama > backups/hidzama_$(date +%F).sql
```

Restore:

```bash
cat backups/hidzama_YYYY-MM-DD.sql | docker compose exec -T postgres psql -U sifa -d sifa_hijama
```

## 17. Kasnije deploy vozilo.ice.lol

Za drugi sajt koristi drugi folder i druge portove:

```bash
sudo mkdir -p /opt/vozilo
sudo chown -R $USER:$USER /opt/vozilo
cd /opt/vozilo
git clone https://github.com/USERNAME/VOZILO_REPO.git .
```

`.env` za vozilo neka koristi druge portove:

```env
POSTGRES_BIND_IP=127.0.0.1
POSTGRES_PORT=55433
POSTGRES_USER=vozilo
POSTGRES_PASSWORD=OVDJE_JAKA_DB_LOZINKA
POSTGRES_DB=vozilo
DATABASE_URL=postgresql://vozilo:OVDJE_JAKA_DB_LOZINKA@postgres:5432/vozilo?schema=public

FRONTEND_BIND_IP=127.0.0.1
FRONTEND_PORT=3200
BACKEND_BIND_IP=127.0.0.1
BACKEND_PORT=4200
MAILHOG_BIND_IP=127.0.0.1
MAILHOG_PORT=18026

FRONTEND_URL=https://vozilo.ice.lol
BACKEND_URL=https://vozilo.ice.lol
VITE_API_URL=/api
CORS_ORIGINS=https://vozilo.ice.lol
```

Pokretanje:

```bash
cd /opt/vozilo
docker compose up -d --build
```

Nginx za vozilo:

```bash
sudo nano /etc/nginx/sites-available/vozilo.ice.lol
```

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

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/vozilo.ice.lol /etc/nginx/sites-enabled/vozilo.ice.lol
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d vozilo.ice.lol
```

## 18. Brzi debug

Ako domen ne radi:

```bash
nslookup hidzama.ice.lol
sudo nginx -t
sudo systemctl status nginx
docker compose ps
docker compose logs backend --tail=100
```

Ako frontend radi, ali API ne:

```bash
curl http://127.0.0.1:4100/health
curl http://127.0.0.1:4100/api/blog
curl http://hidzama.ice.lol/api/blog
```

Ako `127.0.0.1:4100/api/blog` radi, a `hidzama.ice.lol/api/blog` ne radi, problem je Nginx config.

Ako oba rade, a frontend ne prikazuje blog, rebuild frontend:

```bash
docker compose build frontend --no-cache
docker compose up -d
```

## 19. Najkraći redoslijed

```bash
ssh root@13.140.166.66
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ufw nginx ca-certificates
curl -fsSL https://get.docker.com | sudo sh
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo mkdir -p /opt/hidzama
sudo chown -R $USER:$USER /opt/hidzama
cd /opt/hidzama
git clone https://github.com/USERNAME/REPO.git .
nano .env
docker compose up -d --build
sudo nano /etc/nginx/sites-available/hidzama.ice.lol
sudo ln -s /etc/nginx/sites-available/hidzama.ice.lol /etc/nginx/sites-enabled/hidzama.ice.lol
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d hidzama.ice.lol
```

Kad ovo prođe, otvori:

```text
https://hidzama.ice.lol
https://hidzama.ice.lol/api/blog
https://hidzama.ice.lol/admin/login
```
