# CI/CD za Sifa Hidzama na VPS-u

Ovaj dokument objasnjava sta se desi kad promijenis kod na GitHubu i kako najlakse napraviti deploy na VPS.

## Kratak odgovor

Ako samo promijenis kod na GitHubu, VPS se nece sam automatski updateovati.

Na VPS-u moras uraditi jedno od ovo dvoje:

```bash
git pull
docker compose build frontend backend --no-cache
docker compose up -d
```

ili napraviti automatiku preko GitHub Actions / webhooka.

## Najlaksi rucni deploy

Ovo je najjednostavnije i preporuceno dok jos testiras projekat.

Na VPS-u:

```bash
cd /opt/hidzama
git pull origin main
docker compose build frontend backend --no-cache
docker compose up -d
docker compose ps
```

Provjera:

```bash
curl http://127.0.0.1:4100/health
curl http://127.0.0.1:4100/api/blog
curl -I http://127.0.0.1:3100/
```

Ako mijenjas samo backend kod, mozes:

```bash
docker compose build backend --no-cache
docker compose up -d backend
```

Ako mijenjas frontend, CSS, React, Vite ili `VITE_API_URL`, moras rebuild frontend:

```bash
docker compose build frontend --no-cache
docker compose up -d frontend
```

## Bitno za Vite

`VITE_API_URL` se ugradi u frontend tokom builda.

Zato poslije promjene `.env` vrijednosti:

```env
VITE_API_URL=/api
```

obavezno:

```bash
docker compose build frontend --no-cache
docker compose up -d
```

Samo `docker compose restart` nije dovoljno za frontend env promjene.

## Najlaksi CI/CD bez komplikacije: SSH deploy iz GitHub Actions

Ovo radi ovako:

1. Pushas kod na GitHub.
2. GitHub Actions se spoji na VPS preko SSH.
3. Na serveru pokrene `git pull`, build i `docker compose up -d`.

## 1. Napravi SSH key za GitHub Actions

Na svom racunaru ili serveru napravi deploy key:

```bash
ssh-keygen -t ed25519 -C "github-actions-hidzama" -f hidzama_deploy_key
```

Dobicest dva fajla:

```txt
hidzama_deploy_key
hidzama_deploy_key.pub
```

Public key dodaj na VPS:

```bash
cat hidzama_deploy_key.pub
```

Kopiraj output i na VPS-u ga dodaj u:

```bash
nano ~/.ssh/authorized_keys
```

Private key ide u GitHub Secrets.

## 2. GitHub Secrets

U GitHub repo:

```txt
Settings -> Secrets and variables -> Actions -> New repository secret
```

Dodaj:

```txt
VPS_HOST=13.140.166.66
VPS_USER=root
VPS_SSH_KEY=ovdje ide cijeli private key iz hidzama_deploy_key
VPS_APP_DIR=/opt/hidzama
```

Ako koristis `ubuntu` usera:

```txt
VPS_USER=ubuntu
```

## 3. GitHub Actions workflow

U projektu napravi fajl:

```txt
.github/workflows/deploy.yml
```

Sadrzaj:

```yaml
name: Deploy Hidzama VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            set -e
            cd ${{ secrets.VPS_APP_DIR }}
            git pull origin main
            docker compose build frontend backend --no-cache
            docker compose up -d
            docker compose ps
```

Od tada, svaki push na `main` automatski deploya aplikaciju.

## Brzi CI/CD bez GitHub Actions: deploy skripta

Na VPS-u napravi:

```bash
nano /opt/hidzama/deploy.sh
```

Sadrzaj:

```bash
#!/usr/bin/env bash
set -e

cd /opt/hidzama
git pull origin main
docker compose build frontend backend --no-cache
docker compose up -d
docker compose ps
```

Dozvola:

```bash
chmod +x /opt/hidzama/deploy.sh
```

Deploy:

```bash
/opt/hidzama/deploy.sh
```

Ovo nije automatski, ali je najbrze i najmanje rizicno.

## Automatski deploy preko webhooka

Moze se napraviti i webhook endpoint na VPS-u, ali za pocetak nije preporuceno jer moras dodatno paziti sigurnost.

Bolje opcije:

- rucno `deploy.sh`
- GitHub Actions preko SSH

## Trenutni problem: blog ne radi

Ako browser pokazuje:

```txt
GET http://hidzama.ice.lol/api/blog 404 Not Found
```

provjeri prvo DNS:

```bash
nslookup hidzama.ice.lol
```

Treba pokazati IP tvog servera:

```txt
13.140.166.66
```

Ako pokazuje drugi IP, npr. `13.140.166.68`, onda gledas pogresan server. Tada promijeni A record za `hidzama.ice.lol` u DNS panelu na:

```txt
13.140.166.66
```

Zatim sacekaj DNS propagaciju par minuta.

## Provjera backend-a direktno na VPS-u

Na VPS-u:

```bash
cd /opt/hidzama
docker compose ps
curl http://127.0.0.1:4100/health
curl http://127.0.0.1:4100/api/blog
```

Ako ovo radi, backend je dobar.

Ako domen ne radi:

```bash
curl http://hidzama.ice.lol/api/blog
```

onda je problem DNS ili Nginx.

## Ispravan Nginx princip

Mora biti:

```txt
/api/       -> 127.0.0.1:4100
/uploads/   -> 127.0.0.1:4100
/health     -> 127.0.0.1:4100
/           -> 127.0.0.1:3100
```

Ne smije sve ici na backend.

Provjera:

```bash
nginx -T | grep -n "hidzama.ice.lol" -A120
```

## HTTPS problem: certbot nije instaliran

Poruka:

```txt
Command 'certbot' not found
```

znaci da certbot nije instaliran.

Instaliraj:

```bash
apt update
apt install -y certbot python3-certbot-nginx
```

Zatim prvo provjeri da HTTP radi:

```bash
curl http://hidzama.ice.lol
curl http://hidzama.ice.lol/api/blog
```

Tek onda pokreni:

```bash
certbot --nginx -d hidzama.ice.lol
```

Ako HTTP ne radi, HTTPS certifikat nece biti uspjesan.

## Zasto HTTPS trenutno ne radi

Ako dobijes:

```txt
curl: (7) Failed to connect to hidzama.ice.lol port 443
```

to znaci da Nginx jos nema HTTPS server block/certifikat ili port 443 nije otvoren.

Prvo instaliraj certbot i pokreni ga. Ako koristis firewall:

```bash
ufw allow 80
ufw allow 443
ufw allow OpenSSH
ufw status
```

## Redoslijed koji uvijek radi

1. DNS pokazuje na pravi IP.
2. Docker kontejneri rade.
3. `curl http://127.0.0.1:4100/api/blog` radi na VPS-u.
4. Nginx HTTP radi.
5. `curl http://hidzama.ice.lol/api/blog` radi.
6. Tek onda certbot za HTTPS.
7. Poslije certbota testiras `https://hidzama.ice.lol`.

