# ARIA Live Product Template

Production template for ARIA-generated end-user MVP apps.

This repo is meant to be used as a **GitHub template repository**. ARIA (or a developer) creates a new app repo from this base, injects build config + env vars, and extends features in `Home`.

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
- `ARIA_BUILD_CONFIG_JSON`
- `E2E_BYPASS_AUTH` (test-only)

### Google OAuth Redirect URI

If Google OAuth is enabled, configure:

- `${NEXT_PUBLIC_APP_URL}/api/auth/callback/google`

## Build Config Contract

These files define the serialized configuration ARIA injects at build time:

- `src/config/build-config.ts`
- `src/types/build-config.ts`

## Quality Checks

```bash
npm run lint
npm run build
npm run test:e2e
```
