# ARIA Live Product Template

Centralized baseline template for ARIA-generated MVPs. This repository is designed to be copied into E2B and then extended by agents with idea-specific features.

## Getting Started

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Template Goals

- End-user product app shell (not ARIA builder UI).
- Centralized auth and billing integration points.
- Predictable folder structure so agents can extend features quickly.
- Broad preloaded shadcn component set to avoid repetitive setup.

## Included Surfaces

- `/(auth)/login`: single auth entrypoint (`log in or sign up`).
- `/(app)/dashboard`: generic end-user dashboard baseline.
- `/(app)/billing`: centralized billing action UI.
- `/(app)/settings`: account preference baseline.

## Central Contracts

- Build config schema: `src/config/build-config.ts`
- Build config type: `src/types/build-config.ts`
- ARIA API client baseline: `src/lib/api/client.ts`
- Environment access helpers: `src/lib/env.ts`
- Neon auth wiring: `src/lib/auth/*` + `src/app/api/auth/[...path]/route.ts`

## Environment Variables

Copy `.env.example` to `.env.local` for local testing.

In production, ARIA should inject all required values automatically.

### ARIA domains

ARIA control-plane domains are:

- `https://alpha.ariaagi.com`
- `https://beta.ariaagi.com`
- `https://app.ariaagi.com`

When configuring Neon Auth providers, include callback/redirect URLs for these hosts.

### Neon Auth setup checklist (Google + Email OTP)

For each generated MVP app, ARIA should:

1. Provision Neon Auth for the app project.
2. Enable Google provider and Email OTP provider in Neon Auth.
3. Configure callback/redirect URLs for:
   - `https://alpha.ariaagi.com`
   - `https://beta.ariaagi.com`
   - `https://app.ariaagi.com`
   - the generated app domain
4. Inject:
   - `NEON_AUTH_BASE_URL`
   - `NEON_AUTH_COOKIE_SECRET`

If `NEON_AUTH_BASE_URL` is missing, `/login` shows a setup warning by design.

## Quality Gates

```bash
npm run lint
npm run build
npm run test:e2e
```
