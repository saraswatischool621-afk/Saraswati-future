# Saraswati School Website

The public school website is a static React/Vite artifact with an external Supabase-powered staff content panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/saraswati-school run dev` — run the school website
- `pnpm --filter @workspace/saraswati-school run typecheck` — check the school website
- `pnpm --filter @workspace/saraswati-school run build` — build the static Netlify-ready site
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- School-site env: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Supabase public project URL and publishable/anon key
- API artifact env: `DATABASE_URL` — PostgreSQL connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- School site: React, Vite, Wouter, Tailwind CSS
- School content cloud: Supabase Auth, Postgres, and Storage

## Where things live

- `artifacts/saraswati-school/src/siteContent.ts` — bundled fallback school content
- `artifacts/saraswati-school/src/lib/supabase.ts` — browser-only Supabase client and content operations
- `artifacts/saraswati-school/src/pages/admin.tsx` — protected Principal/Admin content panel
- `artifacts/saraswati-school/supabase/schema.sql` — external Supabase schema and security policies
- `artifacts/saraswati-school/SUPABASE_ADMIN_SETUP.md` — one-time Supabase and Netlify setup

## Architecture decisions

- The public school site stays statically deployable and never calls the Replit API server.
- Supabase public credentials are browser-safe; authorization is enforced by database and storage Row Level Security.
- Public pages use the existing bundled content whenever Supabase is not configured or has no published records.
- Staff registration and role changes are deliberately managed in Supabase, not exposed in `/admin`.

## Product

- Public school information, admissions by WhatsApp, fees, gallery, contact, vision/mission, and mandatory disclosure
- Secure `/admin` content management for gallery photos, school notices, and disclosure PDFs

## User preferences

- Preserve the existing Saraswati design and current public features.
- Do not make the school site depend on the Replit backend or database.

## Gotchas

- Never put the Supabase `service_role` key in frontend code or Netlify variables used by Vite.
- Run the Supabase schema before enabling `/admin`, create users in Supabase Auth, then assign each user a `principal` or `admin` role.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
