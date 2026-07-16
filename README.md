# Mastering Financial Calculations — Digital Companion

Learning and practice app aligned with Robert Steiner’s *Mastering Financial Calculations*, covering:

| Chapter | Title |
|--------:|-------|
| 1 | Financial Arithmetic Basics |
| 2 | The Money Market |
| 3 | Forward-Forwards and FRAs |
| 4 | Interest Rate Futures |
| 8 | Interest Rate and Currency Swaps |
| 9 | Options |

Chapter 1 is fully implemented (explanations, formulas, calculators, exercises). Other chapters have dedicated section entry points ready for content.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase Auth (`@supabase/ssr`)
- Recharts (available for later chapter visuals)
- Vitest for pure finance math and auth orchestration tests

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase project URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars, learning content still works; sign-in/up reports that auth is not configured.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm test` | Unit tests (finance math + auth) |
| `npm run lint` | ESLint |

## Deploy (Vercel)

This is a standard **Next.js App Router** app. In-repo `vercel.json` sets `framework: nextjs` and `buildCommand: npm run build` (no SPA rewrites, no static `outputDirectory`).

On the Vercel project dashboard, confirm:

1. **Framework Preset:** Next.js (not “Other”)
2. **Root Directory:** repository root (where `package.json` and `vercel.json` live)
3. **Build Command:** `npm run build` (or leave default)
4. **Output Directory:** leave **empty** (do not set `out`, `public`, or `.next`)
5. **Install Command:** `npm install`
6. **Node.js:** 18.x or 20.x

Optional env vars for auth only: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The site serves without them.

## Structure

```
src/
  app/                 # Routes (home, auth, chapters/[slug])
  components/          # UI, Chapter 1 calculators, shell
  lib/
    finance/           # Pure financial math (tested)
    supabase/          # Browser + server clients, middleware helper
    auth/              # Server actions for sign-in / sign-up / sign-out
    chapters.ts        # Canonical chapter map
```

Not affiliated with the book’s publisher. Educational use of standard market formulas only.
