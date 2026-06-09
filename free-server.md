# Free Server / Free VPS Opcije

Kratak odgovor: potpuno besplatan VPS koji je pouzdan za produkciju uglavnom ne postoji. Postoje free tier, trial i studentski krediti. Za testiranje su korisni, ali za ordinaciju i prave rezervacije treba plaćeni server ili managed platforma.

## Šta je realno besplatno

### 1. Render Free

Dobro za:

- demo backend
- frontend static site
- probu aplikacije

Ograničenja:

- free servisi mogu spavati ili imati limite
- nije idealno za ozbiljnu produkciju
- baza i storage moraju se pažljivo provjeriti

Linkovi:

- https://render.com/free
- https://render.com/pricing

### 2. Railway trial

Dobro za:

- brz demo
- backend + database u jednom dashboardu
- kratku validaciju projekta

Prema Railway dokumentaciji, trial traje do 30 dana i uključuje početni kredit, a poslije se prelazi na mali mjesečni free kredit.

Link:

- https://docs.railway.com/pricing/free-trial

### 3. Supabase Free baza

Dobro za:

- besplatni PostgreSQL za demo
- testiranje admin panela i rezervacija
- male projekte prije produkcije

Ograničenja:

- 500 MB database size na Free planu
- free projekti mogu biti pauzirani nakon neaktivnosti
- nema ozbiljnog backup nivoa kao na plaćenim planovima

Link:

- https://supabase.com/pricing

### 4. Vercel / Netlify za frontend

Dobro za:

- React frontend
- brz preview
- custom domen

Nije dovoljno samo po sebi jer ovoj aplikaciji treba backend i PostgreSQL.

## Free VPS opcije koje možeš istražiti

Ove opcije se često mijenjaju, pa ih uvijek provjeri prije planiranja:

- Oracle Cloud Always Free: zna nuditi free compute, ali registracija i dostupnost resursa nisu uvijek jednostavni.
- Google Cloud / AWS / Azure trial: obično traže karticu i imaju vremenski kredit, nije trajno besplatno.
- Fly.io / Koyeb / Railway / Render: često imaju free/trial nivo, ali limiti se mijenjaju.

Za produkciju ne bih obećavao vlasniku da će “besplatan server” raditi stabilno.

## Najbolji free demo plan za ovaj projekat

Ako želiš da vlasnik vidi aplikaciju bez plaćanja odmah:

```text
Frontend: Render Static Site ili Vercel
Backend: Render Web Service
Database: Supabase Free
Email: Gmail SMTP App Password
Domen za demo: render/vercel subdomena
```

Primjer demo URL-ova:

```text
https://sifa-hidzama-demo.onrender.com
https://sifa-hidzama.vercel.app
```

## Kada preći na plaćeni server

Pređi na plaćeni VPS kada:

- vlasnik počne primati stvarne rezervacije
- ima stvarne podatke klijenata
- želi `sifahidzama.ba`
- želi stabilan email
- treba backup baze
- želi više sajtova na jednom serveru

## Jeftina produkcija

Realna najjeftinija produkcija:

- VPS oko 5-15 EUR mjesečno
- domen posebno
- Gmail/Brevo SMTP
- Docker Compose
- dnevni backup baze

Ako koristiš Global.ba, gledaj VPS, ne samo shared hosting, jer ovaj projekat koristi Node.js i PostgreSQL.

## Više sajtova na jednom VPS-u

Da, možeš imati više sajtova ako VPS ima dovoljno resursa.

Primjer:

```text
/var/www/sifa-hidzama
/var/www/klijent-2
/var/www/klijent-3
```

Svaki projekat ima:

```text
docker-compose.yml
.env
postgres volume
backend uploads volume
```

Reverse proxy:

```text
sifahidzama.ba -> Sifa frontend
api.sifahidzama.ba -> Sifa backend
klijent2.ba -> Klijent 2 frontend
api.klijent2.ba -> Klijent 2 backend
```

## Zaključak

Za demo koristi free platforme. Za ozbiljan rad koristi mali VPS. Besplatan server je super za pokazati ideju, ali nije dobar temelj za posao koji čuva rezervacije i kontakt podatke klijenata.
