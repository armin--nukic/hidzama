# Bosnian Deploy - Opcije za BiH, Global.ba i vlastiti server

Ovaj projekat je full-stack aplikacija: React frontend, Node/Express backend i PostgreSQL baza. Najbolje radi na VPS/serveru sa Docker Compose.

## Najbolja produkcijska opcija

Za vlasnika i pravi rad ordinacije preporuka je:

- 1 VPS server
- Ubuntu 24.04 LTS
- Docker + Docker Compose
- Nginx ili Caddy reverse proxy
- PostgreSQL u Docker volume ili managed baza
- SSL certifikat preko Let's Encrypt
- dnevni backup baze

Ovo omogućava da jedna komanda diže cijeli sistem:

```bash
docker compose up -d --build
```

## Global.ba / Globalhost opcije

Globalhost ima web hosting i VPS ponudu. Shared/cPanel hosting je dobar za statične sajtove ili PHP/MySQL projekte, ali ova aplikacija traži Node.js backend, PostgreSQL, upload fajlove i dugoročni proces. Zato je VPS bolja opcija.

Korisni linkovi:

- Web hosting: https://www.global.ba/en/webhosting.php
- VPS: https://www.global.ba/en/vps.php

Prema javnoj stranici Globalhost VPS ponude, KVM Micro VPS ima 1 vCore, 2 GB RAM, 20 GB SSD i cijenu oko 12.28 EUR mjesečno. Cijene uvijek provjeriti direktno na Global.ba prije kupovine.

## Da li shared hosting može?

Može samo ako hosting podržava:

- Node.js aplikacije koje stalno rade
- PostgreSQL ili udaljeni PostgreSQL connection
- reverse proxy prema Node aplikaciji
- SSH pristup
- build komande za frontend/backend

U praksi je za ovu aplikaciju bolje uzeti VPS. Shared hosting sa cPanel-om je lakši, ali često nije dobar za Docker Compose i PostgreSQL.

## Mogu li imati više sajtova na jednom serveru?

Da. Jedan VPS može hostati više sajtova ako ima dovoljno RAM-a i diska.

Primjer strukture:

```text
/var/www/sifa-hidzama
/var/www/drugi-sajt
/var/www/treci-sajt
```

Svaki sajt može imati svoj `docker-compose.yml`, npr:

```text
sifahidzama.ba -> container frontend/backend/db
drugi-domen.ba -> drugi containeri
test.sifahidzama.ba -> staging containeri
```

Reverse proxy odlučuje koji domen ide na koji container.

Primjer:

```text
sifahidzama.ba      -> localhost:3000
api.sifahidzama.ba  -> localhost:4000
demo.sifahidzama.ba -> drugi frontend
```

## Preporučeni server za više sajtova

Minimalno za jedan mali sajt:

- 1-2 vCPU
- 2 GB RAM
- 20-40 GB SSD

Bolje za više sajtova:

- 2-4 vCPU
- 4-8 GB RAM
- 80+ GB SSD

Ako će svaki sajt imati svoju PostgreSQL bazu, upload slike i email, uzmi najmanje 4 GB RAM.

## Produkcijski setup na VPS

### 1. Instalacija paketa

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git ufw ca-certificates curl
```

### 2. Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Odjavi se i prijavi ponovo.

### 3. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Ne otvaraj PostgreSQL port `5432` javno.

### 4. Upload projekta

```bash
cd /var/www
git clone https://github.com/USERNAME/sifa-hidzama.git
cd sifa-hidzama
```

### 5. `.env` fajl

U root folderu napravi `.env`:

```env
POSTGRES_USER=sifa
POSTGRES_PASSWORD=JAKA_DB_LOZINKA
POSTGRES_DB=sifa_hijama
DATABASE_URL=postgresql://sifa:JAKA_DB_LOZINKA@postgres:5432/sifa_hijama?schema=public
JWT_SECRET=DUG_RANDOM_SECRET_MINIMUM_32_ZNAKA
ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=JakaAdminLozinka123!
FRONTEND_URL=https://sifahidzama.ba
BACKEND_URL=https://api.sifahidzama.ba
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tvojgmail@gmail.com
SMTP_PASS=GOOGLE_APP_PASSWORD
MAIL_FROM=Sifa Hidžama <tvojgmail@gmail.com>
NOTIFY_EMAIL=amir@gmail.com
```

### 6. Pokretanje

```bash
docker compose up -d --build
docker compose ps
```

### 7. Provjera baze

```bash
docker compose exec postgres psql -U sifa -d sifa_hijama -c "\dt"
docker compose exec postgres psql -U sifa -d sifa_hijama -c "select id, email, role from users;"
```

### 8. Backup baze

```bash
mkdir -p backups
docker compose exec -T postgres pg_dump -U sifa sifa_hijama > backups/sifa_$(date +%F).sql
```

Za produkciju dodati cron job koji radi backup svaki dan.

## Domen i DNS

Za produkciju je najbolje:

```text
sifahidzama.ba      A record -> IP servera
www.sifahidzama.ba  CNAME    -> sifahidzama.ba
api.sifahidzama.ba  A record -> IP servera
```

Ako koristiš jedan domen bez posebnog API subdomena, može i:

```text
sifahidzama.ba/api -> backend proxy
sifahidzama.ba     -> frontend
```

Ali odvojeni `api.sifahidzama.ba` je čistije.

## SSL

Najlakše:

- Caddy automatski radi Let's Encrypt certifikate
- Nginx Proxy Manager ima web UI
- ručni Nginx + Certbot je fleksibilan, ali traži više rada

Za početnika preporuka: Nginx Proxy Manager ili Caddy.

## Šta bih ja izabrao

Za demo:

- Render + Supabase

Za vlasnika i pravi rad:

- Global.ba VPS ili drugi VPS
- Docker Compose
- dnevni backup
- Gmail/Brevo SMTP
- domen `sifahidzama.ba`

Za više klijenata/sajtova:

- jedan jači VPS
- svaki projekat u svom folderu
- Nginx Proxy Manager
- odvojene baze i volume-i po projektu
