# Migrating schema from Neon to Supabase (Prisma)

This document explains how to migrate the existing Prisma schema and database from Neon (or any Postgres) to Supabase, and how to apply the Prisma schema to a Supabase Postgres instance.

Important: migrations change your database. Do this in a development/test Supabase project first.

Prerequisites
- Node.js and pnpm/npm installed
- Supabase project created (https://app.supabase.com)
- Supabase CLI (optional but helpful): `npm i -g supabase`
- Access to the Supabase project's Database connection string (Settings → Database → Connection string)

High-level steps
1. Create a Supabase project and get the Postgres connection string.
2. Set `SUPABASE_DATABASE_URL` in your `.env` to that connection string.
3. Update Prisma config (already updated in this repo to use `SUPABASE_DATABASE_URL`).
4. Generate Prisma client and run migrations to create schema in Supabase.

Recommended commands (PowerShell)

# set .env (example)
# copy .env.example to .env and edit SUPABASE_DATABASE_URL
Copy-Item .env.example .env
# then edit .env and set SUPABASE_DATABASE_URL

# install deps
pnpm install

# generate prisma client
npx prisma generate

# Create a migration (dev flow) - this will create migration files and apply to the database
npx prisma migrate dev --name add-referral-loyalty-wallet

# For CI/production (apply existing migrations without prompting)
npx prisma migrate deploy

# Open Prisma Studio to inspect DB
npx prisma studio

Notes and caveats
- If you previously used Neon with a different schema name, update connection string `?schema=public` or the schema you want to use.
- Supabase may enable extensions (pg_trgm, postgis, etc.) automatically depending on your plan. If your Prisma schema or code expects specific extensions, ensure they are available in the Supabase DB.
- For production, use `npx prisma migrate deploy` (applies migrations already created) rather than `migrate dev`.
- If you have existing data to move from Neon to Supabase, use `pg_dump`/`pg_restore` or logical replication tools to migrate data, or export/import via `supabase db restore`.

Data migration hints
- To export from Neon:
  pg_dump --format=custom --file=neon_dump.dump --dbname="$NEON_DATABASE_URL"

- To import into Supabase (example using psql):
  pg_restore --verbose --clean --no-acl --no-owner -h <host> -U <user> -d <database> neon_dump.dump

- Alternatively, use Supabase's `pg:restore` CLI or the web UI in paid tiers.

Security
- Keep your Supabase credentials secret. Do not commit `.env` to Git.
- Use service_role keys and REST endpoints carefully; only use service_role server-side.

If you'd like, I can:
- (A) Generate a set of Prisma migration files here (scaffold) — note: applying them to Supabase requires running `npx prisma migrate dev` locally with `SUPABASE_DATABASE_URL` set.
- (B) Create a small PowerShell helper script `scripts/migrate-to-supabase.ps1` that runs the recommended commands.
- (C) Attempt to run `npx prisma generate` and create a migration here in the workspace (I can run commands), but I will not be able to connect to your Supabase instance unless you provide a connection string in `.env` in this environment.

Which option do you prefer?