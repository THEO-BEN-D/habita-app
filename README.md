# Habita — Spanish rental property management

Property management platform for short-term rentals in Spain (Catalonia). Diagnostic onboarding, compliance tracking (HUTG licence, tax obligations, insurance), multi-property operations, occupancy calendar.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, and a **Supabase backend** (Postgres + Auth + Row Level Security). Each signed-in user only ever sees their own properties and tasks.

## Getting started

```bash
npm install
cp .env.example .env.local   # already points at the project's Supabase instance
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be asked to sign in with an email magic link (Supabase Auth — no password). First sign-in shows the onboarding flow (Variation B — Diagnostic): nationality, tax residence, property status, reminder delay.

## Backend

- **Project**: Supabase project `habita` (ref `xhssqgzsjlvvzbsyshhu`, region `eu-west-3`).
- **Schema**: `profiles` (one row per user, drives onboarding/fiscal logic), `properties`, `property_tags`, `gestion_tasks`, `conformite_categories`, `conformite_items`. See `store/backend.ts` for the full read/write layer and `lib/supabase/database.types.ts` for the generated types.
- **Auth**: Supabase email magic link (OTP). A Postgres trigger (`handle_new_user`) auto-creates an empty `profiles` row for every new user.
- **Row Level Security**: enabled on every table — a user can only read/write rows they own (properties directly via `user_id`, child tables via a join back to the owning property).
- The values in `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are safe to commit — they're the public, RLS-protected anon key, not a secret.

## Structure

- `app/` — Next.js routes (App Router), one page per screen (Dashboard, Properties, PropHub, Compliance, Operations, Calendar, Guests, Taxes, Help).
- `components/` — React components by domain (auth, onboarding, biens, prophub, conformite, gestion, calendrier) + shell (Sidebar/TopBar).
- `store/` — Zustand global state (`useAppStore.ts`), types (`types.ts`), Supabase data-access layer (`backend.ts`), gestion task selectors (`gestionSelectors.ts`).
- `lib/supabase/` — Supabase client (`client.ts`) and generated database types (`database.types.ts`).

## What's still mock / planned

- Occupancy calendar is illustrative — not wired to a real reservations table yet.
- No email/push reminders yet for expiring licences, insurance, or tax deadlines (the `reminder_delay_months` setting is captured but not acted on).
- No admin/multi-owner sharing on a single property yet.

## Deployment

Standard Next.js app — deploys to Vercel by importing this GitHub repo directly. Set the two `NEXT_PUBLIC_SUPABASE_*` env vars from `.env.example` in the Vercel project settings (Production + Preview).
