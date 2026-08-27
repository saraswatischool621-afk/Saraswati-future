# Saraswati School Website

The public school website is a static React/Vite artifact for Saraswati Primary English Medium School.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/saraswati-school run dev` — run the school website
- `pnpm --filter @workspace/saraswati-school run typecheck` — check the school website
- `pnpm --filter @workspace/saraswati-school run build` — build the static Netlify-ready site
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- API artifact env: `DATABASE_URL` — PostgreSQL connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- School site: React, Vite, Wouter, Tailwind CSS

## Where things live

- `artifacts/saraswati-school/src/siteContent.ts` — bundled fallback school content

## Architecture decisions

- The public school site stays statically deployable and never calls the Replit API server.

## Product

- Public school information, admissions by WhatsApp, fees, gallery, contact, vision/mission, and mandatory disclosure

## User preferences

- Preserve the existing Saraswati design and current public features.
- Do not make the school site depend on the Replit backend or database.

## Gotchas


## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
