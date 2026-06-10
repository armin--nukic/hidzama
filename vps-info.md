# VPS Info - Šifa Hidžama

Ovaj projekat može raditi na VPS-u zajedno sa drugim sajtovima na istoj IP adresi. Najvažnije je da Docker portovi ne zauzimaju javne portove `80`, `443`, `3000`, `4000` ili `5432` ako ih koriste drugi projekti.

## Šta je promijenjeno u Docker Compose

`docker-compose.yml` sada koristi konfigurabilne portove i binduje ih na `127.0.0.1` po defaultu.

To znači:

- PostgreSQL nije javno otvoren na internetu
- backend nije javno otvoren bez reverse proxy-ja
- frontend nije javno otvoren bez reverse proxy-ja
- MailHog nije javno otvoren
- nema Redis servisa i nema Redis porta

Default portovi:

```env
FRONTEND_PORT=3000
BACKEND_PORT=4000
POSTGRES_PORT=5432
MAILHOG_PORT=8025
```

Na VPS-u preporuka je da koristiš druge portove, npr:

```env
FRONTEND_PORT=3100
BACKEND_PORT=4100
POSTGRES_PORT=55432
MAILHOG_PORT=18025
```

Svi su bindovani na localhost:

```env
FRONTEND_BIND_IP=127.0.0.1
BACKEND_BIND_IP=127.0.0.1
POSTGRES_BIND_IP=127.0.0.1
MAILHOG_BIND_IP=127.0.0.1
```

## Zašto je ovo bolje za VPS

Ako imaš više sajtova na istoj IP adresi, ne može svaki koristiti:

```text
0.0.0.0:3000
0.0.0.0:4000
0.0.0.0:5432
```

Zato svaki projekat dobije svoje interne localhost portove:

```text
Šifa frontend  -> 127.0.0.1:3100
Šifa backend   -> 127.0.0.1:4100
Drugi frontend -> 127.0.0.1:3200
Drugi backend  -> 127.0.0.1:4200
```

Nginx, Caddy ili Nginx Proxy Manager onda radi javni ulaz preko:

```text
80
443
```

## Preporučeni VPS `.env`

Na serveru napravi `.env` u root folderu projekta:

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
ADMIN_PASSWORD=OVDJE_ADMIN_PASSWORD

FRONTEND_URL=https://sifahidzama.ba
BACKEND_URL=https://api.sifahidzama.ba

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tvojgmail@gmail.com
SMTP_PASS=google_app_password
MAIL_FROM=Šifa Hidžama <tvojgmail@gmail.com>
NOTIFY_EMAIL=testict119@gmail.com
```

## Pokretanje na VPS-u

```bash
cd /opt/sifa-hidzama
docker compose up -d --build
docker compose ps
```

Provjera lokalno na serveru:

```bash
curl http://127.0.0.1:4100/health
curl http://127.0.0.1:3100
```

## Nginx reverse proxy primjer

Frontend domen:

```nginx
server {
  listen 80;
  server_name sifahidzama.ba www.sifahidzama.ba;

  location / {
    proxy_pass http://127.0.0.1:3100;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Backend API domen:

```nginx
server {
  listen 80;
  server_name api.sifahidzama.ba;

  location / {
    proxy_pass http://127.0.0.1:4100;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Nakon toga dodaj SSL:

```bash
sudo certbot --nginx -d sifahidzama.ba -d www.sifahidzama.ba -d api.sifahidzama.ba
```

## Caddy alternativa

Ako koristiš Caddy:

```caddyfile
sifahidzama.ba, www.sifahidzama.ba {
  reverse_proxy 127.0.0.1:3100
}

api.sifahidzama.ba {
  reverse_proxy 127.0.0.1:4100
}
```

Caddy automatski uzima SSL certifikate.

## Više sajtova na istom VPS-u

Primjer:

```text
/opt/sifa-hidzama   -> frontend 3100, backend 4100, postgres 55432
/opt/klijent-drugi  -> frontend 3200, backend 4200, postgres 55433
/opt/klijent-treci  -> frontend 3300, backend 4300, postgres 55434
```

Svaki projekat ima svoj `.env` i svoje Docker volume-e.

Ne smiju se sudarati:

- `FRONTEND_PORT`
- `BACKEND_PORT`
- `POSTGRES_PORT`
- `MAILHOG_PORT`

## Redis

Ovaj projekat ne koristi Redis.

Ako drugi projekat na VPS-u koristi Redis port `6379`, ovaj projekat mu neće smetati jer nema Redis servis.

## Sigurnost

Na VPS firewall-u otvori samo:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Ne otvaraj javno:

```text
5432
55432
4000
4100
3000
3100
8025
18025
```

Ti portovi ostaju lokalni iza reverse proxy-ja.

## Backup baze

```bash
mkdir -p backups
docker compose exec -T postgres pg_dump -U sifa sifa_hijama > backups/sifa_$(date +%F).sql
```

Vrati backup:

```bash
cat backups/sifa_YYYY-MM-DD.sql | docker compose exec -T postgres psql -U sifa -d sifa_hijama
```

## setup.vps

Dodan je helper fajl:

```text
setup.vps
```

Možeš ga kopirati na VPS i pokrenuti:

```bash
chmod +x setup.vps
APP_DIR=/opt/sifa-hidzama DOMAIN=sifahidzama.ba API_DOMAIN=api.sifahidzama.ba ./setup.vps
```

On:

- provjeri/installira Docker
- napravi `.env` primjer
- napravi `nginx-sifa-example.conf`
- ne briše postojeći `.env`

Prije produkcije obavezno zamijeni sve `change_this` vrijednosti.
