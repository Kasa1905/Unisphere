# College Discovery Platform (MVP)

This repository contains the Phase 1 artifacts for the College Discovery Platform MVP: a production-ready Prisma schema and an idempotent seed script to populate a Neon/Postgres database.

## What is included

- `prisma/schema.prisma` — normalized, indexed schema for `User`, `College`, `Course`, `PlacementStat`, `Review`, `CutOffRequirement`, `SavedCollege`.
- `prisma/seed.ts` — realistic seed data across multiple colleges, exams, cutoffs, placements, and reviews.
- `package.json` & `tsconfig.json` — scripts to generate Prisma client and run the seed.

## Prerequisites

- Node.js 18+ and npm
- A PostgreSQL-compatible database (Neon recommended for serverless)

## Environment variables

Create a `.env` file at the project root with:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

When deploying to Vercel, set `DATABASE_URL` in the project environment settings.

## Quick local setup

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client

```bash
npx prisma generate --schema=prisma/schema.prisma
```

3. (Optional) Run migrations and create the local DB (development only)

```bash
npx prisma migrate dev --name init --schema=prisma/schema.prisma
```

4. Run the seed script

```bash
npm run seed
```

## Notes

- The seed is idempotent for the purposes of initial testing, but it does create new users/colleges every run; in CI or repeated runs consider wrapping creates with `upsert` logic.
- For production data import, replace the `seed.ts` with controlled ETL that validates source data and writes normalized records.

## Next steps (Phase 2 prep)

- Implement `/api/colleges` with robust filtering and pagination.
- Implement `/api/predict` to accept exam/rank/percentile and return scored matches.

If you'd like, I can now expand the seed to cover additional edge cases (TBD categories, quotas, multi-year historical variations), or proceed to Phase 2 and scaffold the backend API handlers.
