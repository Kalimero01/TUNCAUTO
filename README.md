# TUNCAUTO

Full-stack monorepo for the Tuncauto platform.

## Structure

```
TUNCAUTO/
├── frontend/   Next.js 16 + Tailwind
├── backend/    Express API + Prisma
└── docker-compose.yml   Local PostgreSQL
```

## Quick start

```bash
cp .env.example .env
docker compose up -d          # PostgreSQL (requires Docker)
npm install
npm run db:push               # Apply schema
npm run dev                   # Frontend :3000 + Backend :4000
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | API status |
| GET | `/api/health/ready` | DB connectivity |
| GET | `/api/vehicles` | List vehicles |
| POST | `/api/vehicles` | Create vehicle |
| GET | `/api/vehicles/:id` | Get vehicle |
| PATCH | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |

## Deploy (Railway)

Project: **Tuncauto** — PostgreSQL + backend + frontend services linked to GitHub.
