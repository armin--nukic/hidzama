# Detaljno VPS deploy: hidzama.ice.lol + vise sajtova na istom serveru

Ovaj dokument je za server IP:

```txt
13.140.166.66
```

Glavni cilj:

- `https://hidzama.ice.lol` prikazuje frontend
- `https://hidzama.ice.lol/api/...` ide na backend
- kasnije mozes dodati `https://vozilo.ice.lol`
- kasnije mozes dodati `https://farmaoglasi.ice.lol` ili drugi naziv
- svaki projekat ima svoje Docker portove, da se ne sudaraju

Najvaznije: ne treba ti `api.hidzama.ice.lol`. Jednostavnije je da backend radi preko istog domena:

```txt
https://hidzama.ice.lol/api
```

## Zasto sada blog ne radi

Na slici se vidi da request za `logo-shifa.svg` vraca:

```json
{"message":"Route not found"}
```

To znaci da Nginx pogresno salje frontend fajlove na backend. `logo-shifa.svg`, `/blog`, `/assets/...` i ostale frontend rute moraju ici na frontend kontejner. Samo `/api/`, `/uploads/` i `/health` idu na backend.

Ispravna logika:

```txt
/api/...        -> backend 127.0.0.1:4100
/uploads/...    -> backend 127.0.0.1:4100
/health         -> backend 127.0.0.1:4100
sve ostalo      -> frontend 127.0.0.1:3100
```

## 1. DNS

U DNS panelu za `ice.lol` dodaj A recorde:

```txt
hidzama.ice.lol       A       13.140.166.66
vozilo.ice.lol        A       13.140.166.66
farmaoglasi.ice.lol   A       13.140.166.66
```

Ako jos nemas farmu, mozes preskociti treci record.

Provjera sa tvog racunara:

```bash
nslookup hidzama.ice.lol
```

Treba vratiti `13.140.166.66`.

## 2. Prijava na server

Na svom racunaru:

```bash
ssh root@13.140.166.66
```

Ako koristis drugog usera:

```bash
ssh ubuntu@13.140.166.66
```

## 3. Instalacija Docker, Git i Nginx

Na serveru:

```bash
apt update
apt install -y ca-certificates curl gnupg git nginx certbot python3-certbot-nginx
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
systemctl enable --now nginx
```

Provjera:

```bash
docker --version
docker compose version
nginx -v
```

## 4. Upload ili clone projekta

Preporuka je da projekti budu u `/opt`.

```bash
mkdir -p /opt
cd /opt
git clone https://github.com/TVOJ-USERNAME/TVOJ-REPO.git hidzama
cd /opt/hidzama
```

Ako si vec uploadovao fajlove drugim nacinom, samo udji u folder:

```bash
cd /opt/hidzama
```

## 5. .env za hidzama.ice.lol

Na serveru u `/opt/hidzama` napravi `.env`:

```bash
nano .env
```

Primjer:

```env
POSTGRES_USER=sifa
POSTGRES_PASSWORD=promijeni_ovu_lozinku
POSTGRES_DB=sifa_hijama
DATABASE_URL=postgresql://sifa:promijeni_ovu_lozinku@postgres:5432/sifa_hijama?schema=public

POSTGRES_BIND_IP=127.0.0.1
POSTGRES_PORT=55432

FRONTEND_BIND_IP=127.0.0.1
FRONTEND_PORT=3100

BACKEND_BIND_IP=127.0.0.1
BACKEND_PORT=4100

MAILHOG_BIND_IP=127.0.0.1
MAILHOG_PORT=18025

JWT_SECRET=napravi_dug_random_secret_minimum_32_karaktera
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@sifahidzama.ba
ADMIN_PASSWORD=Admin123!ChangeMe

FRONTEND_URL=https://hidzama.ice.lol
BACKEND_URL=https://hidzama.ice.lol
VITE_API_URL=/api
CORS_ORIGINS=https://hidzama.ice.lol

SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM="Sifa Hidzama <no-reply@sifahidzama.ba>"
NOTIFY_EMAIL=testict119@gmail.com
```

Bitno:

- `VITE_API_URL=/api` je za VPS najbolja opcija
- `FRONTEND_URL` mora biti `https://hidzama.ice.lol`
- `BACKEND_URL` mora biti `https://hidzama.ice.lol`
- `NOTIFY_EMAIL` je mail gdje dolaze obavijesti
- admin login je ono sto stavis u `ADMIN_EMAIL` i `ADMIN_PASSWORD`

## 6. Pokretanje Docker aplikacije

U folderu `/opt/hidzama`:

```bash
docker compose build frontend backend --no-cache
docker compose up -d
```

Provjeri kontejnere:

```bash
docker compose ps
```

Provjeri logove:

```bash
docker compose logs -f backend
```

Ako backend radi, ovo treba proci:

```bash
curl http://127.0.0.1:4100/
curl http://127.0.0.1:4100/health
curl http://127.0.0.1:4100/api/blog
```

Ako frontend radi, ovo treba vratiti HTML ili staticki fajl:

```bash
curl -I http://127.0.0.1:3100/
curl -I http://127.0.0.1:3100/logo-shifa.svg
```

`logo-shifa.svg` ne smije vratiti `{"message":"Route not found"}`.

## 7. Ispravan Nginx za hidzama.ice.lol

Ovo je najbitniji dio.

Napravi config:

```bash
nano /etc/nginx/sites-available/hidzama.ice.lol
```

Stavi:

```nginx
server {
    listen 80;
    server_name hidzama.ice.lol;

    client_max_body_size 20m;

    location /api/ {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /health {
        proxy_pass http://127.0.0.1:4100/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktiviraj:

```bash
ln -s /etc/nginx/sites-available/hidzama.ice.lol /etc/nginx/sites-enabled/hidzama.ice.lol
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

Provjeri:

```bash
curl http://hidzama.ice.lol/api/blog
curl -I http://hidzama.ice.lol/logo-shifa.svg
```

Ocekivano:

- `/api/blog` vraca JSON blogove
- `/logo-shifa.svg` vraca `Content-Type: image/svg+xml` ili slican static content
- `/blog` otvara frontend stranicu, ne backend JSON

## 8. SSL certifikat

Kada HTTP proradi:

```bash
certbot --nginx -d hidzama.ice.lol
```

Certbot ce sam dodati HTTPS u Nginx.

Provjera:

```bash
curl https://hidzama.ice.lol/api/blog
curl -I https://hidzama.ice.lol/logo-shifa.svg
```

## 9. Ako si promijenio .env, obavezno rebuild

Za backend env cesto je dovoljan restart, ali `VITE_API_URL` se ugradjuje u frontend tokom builda. Zato poslije promjene `VITE_API_URL` uradi:

```bash
cd /opt/hidzama
docker compose build frontend --no-cache
docker compose up -d
```

Ako mijenjas i backend:

```bash
docker compose build frontend backend --no-cache
docker compose up -d
```

## 10. Debug komande za trenutni problem

Ako opet vidis `Route not found` za frontend fajlove:

```bash
nginx -T | grep -n "hidzama.ice.lol" -A120
```

Gledaj da `location /` ide na:

```txt
http://127.0.0.1:3100
```

Ne smije ici na:

```txt
http://127.0.0.1:4100
```

Provjeri sve:

```bash
curl http://127.0.0.1:4100/api/blog
curl -I http://127.0.0.1:3100/logo-shifa.svg
curl http://hidzama.ice.lol/api/blog
curl -I http://hidzama.ice.lol/logo-shifa.svg
```

Ako lokalni backend na serveru radi, a domen ne radi, problem je Nginx.

Ako ni `127.0.0.1:4100/api/blog` ne radi, problem je backend/Docker/logovi.

## 11. Portovi za vise sajtova

Da vise aplikacija radi na istom VPS-u, svaka mora imati druge host portove.

Primjer:

```txt
Sifa Hidzama:
frontend 3100
backend  4100
postgres 55432
mailhog  18025

Vozilo:
frontend 3200
backend  4200
postgres 55433
mailhog  18026

Farma oglasi pro:
frontend 3300
backend  4300
postgres 55434
mailhog  18027
```

Za svaki projekat u njegovom `.env` promijenis samo portove i domene.

## 12. Primjer .env za vozilo.ice.lol

U `/opt/vozilo/.env`:

```env
POSTGRES_BIND_IP=127.0.0.1
POSTGRES_PORT=55433

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

Ostale varijable zavise od vozilo projekta.

## 13. Primjer .env za farma oglasi pro

Ako domen bude `farmaoglasi.ice.lol`, u `/opt/farmaoglasi/.env`:

```env
POSTGRES_BIND_IP=127.0.0.1
POSTGRES_PORT=55434

FRONTEND_BIND_IP=127.0.0.1
FRONTEND_PORT=3300

BACKEND_BIND_IP=127.0.0.1
BACKEND_PORT=4300

MAILHOG_BIND_IP=127.0.0.1
MAILHOG_PORT=18027

FRONTEND_URL=https://farmaoglasi.ice.lol
BACKEND_URL=https://farmaoglasi.ice.lol
VITE_API_URL=/api
CORS_ORIGINS=https://farmaoglasi.ice.lol
```

Ako domen bude drugaciji, zamijeni `farmaoglasi.ice.lol`.

## 14. Full Nginx za tri sajta

Ovo je primjer kako bi izgledao kompletan Nginx za tri sajta. Svaki server block ide u svoj fajl ili sve moze u jedan fajl.

### Hidzama

`/etc/nginx/sites-available/hidzama.ice.lol`

```nginx
server {
    listen 80;
    server_name hidzama.ice.lol;

    client_max_body_size 20m;

    location /api/ {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /health {
        proxy_pass http://127.0.0.1:4100/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Vozilo

`/etc/nginx/sites-available/vozilo.ice.lol`

```nginx
server {
    listen 80;
    server_name vozilo.ice.lol;

    client_max_body_size 20m;

    location /api/ {
        proxy_pass http://127.0.0.1:4200;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:4200;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /health {
        proxy_pass http://127.0.0.1:4200/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3200;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Farma oglasi pro

`/etc/nginx/sites-available/farmaoglasi.ice.lol`

```nginx
server {
    listen 80;
    server_name farmaoglasi.ice.lol;

    client_max_body_size 20m;

    location /api/ {
        proxy_pass http://127.0.0.1:4300;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:4300;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location = /health {
        proxy_pass http://127.0.0.1:4300/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3300;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktiviranje sva tri:

```bash
ln -s /etc/nginx/sites-available/hidzama.ice.lol /etc/nginx/sites-enabled/hidzama.ice.lol
ln -s /etc/nginx/sites-available/vozilo.ice.lol /etc/nginx/sites-enabled/vozilo.ice.lol
ln -s /etc/nginx/sites-available/farmaoglasi.ice.lol /etc/nginx/sites-enabled/farmaoglasi.ice.lol
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

SSL za sva tri:

```bash
certbot --nginx -d hidzama.ice.lol
certbot --nginx -d vozilo.ice.lol
certbot --nginx -d farmaoglasi.ice.lol
```

## 15. Docker compose razlika za drugi i treci projekat

Ako drugi projekti imaju slican `docker-compose.yml`, nemoj mijenjati portove direktno u compose fajlu. Drzi compose isti, a u `.env` svakog projekta stavi druge portove.

Primjer foldera:

```txt
/opt/hidzama
/opt/vozilo
/opt/farmaoglasi
```

Pokretanje:

```bash
cd /opt/hidzama
docker compose up -d

cd /opt/vozilo
docker compose up -d

cd /opt/farmaoglasi
docker compose up -d
```

Docker Compose ce napraviti odvojene mreze po folderu, a portovi se nece sudarati ako su drugaciji u `.env`.

## 16. Brza procedura za popravak trenutnog VPS-a

Na serveru uradi:

```bash
cd /opt/hidzama
nano .env
```

Provjeri da imas:

```env
FRONTEND_URL=https://hidzama.ice.lol
BACKEND_URL=https://hidzama.ice.lol
VITE_API_URL=/api
CORS_ORIGINS=https://hidzama.ice.lol
FRONTEND_PORT=3100
BACKEND_PORT=4100
```

Zatim:

```bash
docker compose build frontend backend --no-cache
docker compose up -d
```

Popravi Nginx:

```bash
nano /etc/nginx/sites-available/hidzama.ice.lol
nginx -t
systemctl reload nginx
```

Test:

```bash
curl https://hidzama.ice.lol/api/blog
curl -I https://hidzama.ice.lol/logo-shifa.svg
```

Ako `/api/blog` radi i `logo-shifa.svg` vise ne vraca backend JSON, blog ce se prikazati normalno.
