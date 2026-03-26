# GANASSA - Football Solutions Across Asia

## Quick Start (Recommended: Docker)

1. Make sure Docker Desktop is running.
2. From project root run:

```bash
npm run docker:up
```

3. Initialize schema and seed data inside app container:

```bash
docker compose exec app npm run db:init
docker compose exec app npm run db:seed
```

4. Open:
- http://localhost:3000/en/
- http://localhost:3000/admin/login
- http://localhost:3000/health

5. Stop everything:

```bash
npm run docker:down
```

Admin seed credentials:
- Email: admin@ganassa.jp
- Password: ganassa2026

## Environment Files

- `.env`: your local non-Docker environment.
- `.env.docker`: local Docker Compose environment.
- `.env.production.example`: production template for managed DB deployment.

Templates included:
- `.env.example`
- `.env.docker.example`
- `.env.production.example`

## Local Dev Without Docker

Use this if you already have PostgreSQL running locally or a managed DB URL.

1. Install dependencies:

```bash
npm install
```

2. Configure `.env` with either:
- `DATABASE_URL=postgresql://...`
- or `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

3. Run DB setup:

```bash
npm run db:init
npm run db:seed
```

4. Start app:

```bash
npm run dev
```

## Docker Compose Services

`docker-compose.yml` runs:
- `db`: PostgreSQL 16 with persistent volume `pgdata`
- `app`: Node/Express app on port 3000 (watch mode)

Useful commands:

```bash
npm run docker:ps
npm run docker:logs
npm run docker:down
```

## Production Plan (No Supabase Pause)

Recommended setup:
1. Deploy app on Render web service.
2. Use managed PostgreSQL (Render Postgres, Neon, Supabase Pro, RDS).
3. Set production env vars from `.env.production.example`.
4. Run one-time migrations/seed in deploy shell:

```bash
npm run db:init
npm run db:seed
```

5. Configure domain + HTTPS in hosting provider.

Why this setup:
- No free-tier pause issues.
- Backups and uptime are handled by provider.
- Lower ops risk versus self-hosting DB container in production.

## Security Notes

- In production, set a strong `JWT_SECRET` (required).
- Do not commit real `.env` files.
- Keep `GOOGLE_TRANSLATE_API_KEY` only in secure env configuration.

## Images

Copy your image assets into `public/img/`.
Expected structure includes:
- root images (team photos, logos)
- `public/img/clients/`
- `public/img/partners/`
- `public/img/Selected/`
- `public/img/home/`

## Project Structure

```text
ganassa-app/
|- server.js
|- config/
|- controllers/
|- db/
|- middleware/
|- public/
|- routes/
|- scripts/
|- services/
|- views/
|- Dockerfile
|- docker-compose.yml
```
