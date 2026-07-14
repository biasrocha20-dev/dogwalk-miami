# PawMiami — Dog Walking Booking System

Phase 1 MVP: auth, owner/walker profiles, pet profiles, browsing walkers by
Miami neighborhood, and the booking request flow (no payments yet).

## Setup

1. Create a project at [supabase.com](https://supabase.com) (or run `supabase start` locally
   with the Supabase CLI if you prefer local dev).
2. Copy `.env.local.example` to `.env.local` and fill in your project's URL and anon key
   (Project Settings → API in the Supabase dashboard):

   ```bash
   cp .env.local.example .env.local
   ```

3. Apply the schema in [`supabase/schema.sql`](./supabase/schema.sql) — paste it into the
   Supabase SQL Editor and run it, or `supabase db push` if using the CLI. This creates all
   tables, row-level security policies, and seed neighborhood data.
4. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000). Sign up as an owner or a walker —
   walkers are redirected to `/walker/onboarding` to set their bio, rate, and service
   neighborhoods before they appear in `/walkers`.

## Project structure

- `src/app/actions/*` — Server Actions for auth, pets, walker profiles, and bookings
- `src/lib/supabase/*` — Supabase client (browser/server) and session-refresh proxy
- `supabase/schema.sql` — full Postgres schema + RLS policies
- `src/app/walkers` — public browse + walker detail/booking pages
- `src/app/owner`, `src/app/walker` — role-specific dashboards

## Roadmap (not yet built)

- Stripe Connect payments + payouts
- GPS tracking during walks, photo updates
- SMS/email notifications
- Reviews UI, admin dashboard
- Recurring booking rules, cancellation policy enforcement
