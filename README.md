# ARIA Live Product Template

Production template for ARIA-generated end-user MVP apps.

This repo is meant to be used as a **GitHub template repository**. ARIA (or a developer) creates a new app repo from this base, commits **product config** into the repo, injects **secrets** via env on Vercel, and extends features in `Home`.

## What This Template Includes

- Better Auth + Neon Postgres baseline auth wiring.
- App shell with `Home`, `Billing`, and `Settings`.
- Centralized build configuration contract for branding, pricing, and app metadata.
- Ready-to-extend structure for agent-generated product features.

## Routes

- Auth: `/auth/sign-in`, `/auth/sign-up`, `/login`
- App: `/home`, `/billing`, `/settings`
- API: `/api/auth/*`, `/api/settings/profile`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The repo includes a default **`aria-build.config.json`** at the root so `npm run dev` matches production behavior without setting env.

## Environment Variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required for normal auth + DB behavior:

- `NEXT_PUBLIC_APP_URL`
- `BETTER_AUTH_SECRET`
- `DATABASE_URL` (or `NEON_DATABASE_URL`)

Optional / feature-specific:

- `BETTER_AUTH_URL`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `NEXT_PUBLIC_ARIA_API_BASE_URL`
- `ARIA_BUILD_CONFIG_JSON` (primary runtime source set by ARIA on Vercel)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (only if client Stripe.js is needed)
- `E2E_BYPASS_AUTH` (test-only)

### Google OAuth Redirect URI

If Google OAuth is enabled, configure:

- `${NEXT_PUBLIC_APP_URL}/api/auth/callback/google`

## Build Config Contract

**Product copy, pricing, and branding** live in **`aria-build.config.json`** at the repository root. ARIA should **commit** that file (and optional assets under `public/`) **before** the first Vercel deploy. Use **`branding.logoUrl`** as a path served from `public/` (e.g. `/brand/logo.png`) or an `https://` URL—not secrets.

Resolution order in **`getBuildConfig()`**:

1. **`ARIA_BUILD_CONFIG_JSON`** (when set by ARIA at deploy time)
2. **`aria-build.config.json`** on disk (repo root)
3. Built-in defaults

Reference files:

- `aria-build.config.json` — injected / committed by ARIA (source of truth for deploys)
- `src/config/build-config.ts` — loads config (env → file → defaults)
- `src/types/build-config.ts` — TypeScript types

## Quality Checks

```bash
npm run lint
npm run build
npm run test:e2e
```
