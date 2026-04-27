<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## ARIA Template Guardrails

- Treat this repository as a reusable baseline for end-user SaaS apps.
- Do not add marketing landing pages. Focus on authenticated product surfaces.
- Keep auth centralized (Google + email OTP via Neon/Auth provider integration).
- Keep billing actions centralized through ARIA backend endpoints.
- Extend domain logic under `src/features/*` instead of rewriting `src/components/ui/*`.
- Preserve `src/config/build-config.ts` contract and validate input before use.
- Run `npm run lint` and `npm run build` after substantial changes.
