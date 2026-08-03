# Codestra/Tradi redesign — Phase 0 audit

Captured 2026-08-03 against `https://staging.codestra.cloud/` before visual
changes. Existing worktrees were clean:

```text
frontend branch: realtime/frontend-manager
backend branch: realtime/discovery-and-services
```

## Architecture

- Frontend: React 19.2.7, TypeScript, Vite, React Router 7, Redux Toolkit,
  TanStack Query, Sass, Ant Design, Lightweight Charts, Playwright.
- Backend: Django 5.2/DRF/Channels, PostgreSQL, Redis, Celery and Daphne.
- Auth: JWT REST tokens in the existing cookie flow plus single-use WebSocket
  tickets. Route guards are `ProtectedRoute`/`PrivateRoute` variants.
- Existing media is mostly imported frontend assets and static files. A
  backend-managed media slot/upload system is not yet present.
- Existing CI/build checks include TypeScript, ESLint, i18n validation, Vite
  production build, route-contract scripts and Playwright.

## Route/feature inventory

Public routes include `/`, `/markets/*`, `/trading/*`, `/downloads`, `/prv`,
`/signIn`, and password reset. Authenticated routes include `/platform`,
`/home`, KYC, transactions, welcome walkthrough, and admin integrations.
The public header currently exposes Markets and Trading dropdowns and a
Registration CTA; it does not yet provide the requested compact Sign In/Try
Demo hierarchy.

The homepage currently renders a video/image hero, four numeric marketing
claims, an inline `SignInForm`, multiple legacy sections, and a footer. Staging
screenshots are under `test-results/redesign/current/`.

## Evidence findings

- Public route smoke test: 22 routes rendered successfully on staging.
- Desktop screenshot shows a dark hero, Tradx logo, Markets/Trading menus,
  language selector, and Registration CTA.
- Mobile screenshot shows the desktop marketing hero plus an embedded login
  form below the hero; this is not the intended dedicated authentication flow.
- Current hero contains `2 Trading Modes`, `0 Hidden Commissions`, `$1 Minimum
  Investment`, and `30+ Analytical Tools`. These are not backed by an approved
  content manifest in this repository and must be removed or approved before
  publication.
- Existing navigation contains MT4/MT5, CFD, copy-trading, deposits and
  withdrawal-related capabilities. Their product/legal truth is unresolved;
  no new live or funding behavior will be exposed.

## Product truth and ownership

```text
PRODUCT_TRUTH_STATUS=UNRESOLVED
PRODUCT_MODE_FOR_REDESIGN=DEMO_ONLY
LEGAL_IDENTITY_STATUS=UNVERIFIED_IN_THIS_PASS
MEDIA_OWNERSHIP_STATUS=UNVERIFIED_FOR_EXISTING_ASSETS
```

## Planned change boundaries

1. Add design tokens and shared public navigation primitives.
2. Replace the homepage hero claims with original, demo-first copy and clear
   Try Demo/Sign In actions.
3. Separate authentication routes from the public homepage.
4. Preserve existing API/auth contracts and legacy redirects while removing
   unsupported public claims.
5. Add managed-media interfaces only after backend ownership/storage contracts
   are approved.

No production files, databases, DNS, payment providers, or live trading paths
are in scope.

## Initial remediation completed

- `d1e46735`: centralized dark/demo-first tokens, removed the inline hero login,
  routed `/signIn` to the existing authenticated form, and added safe public
  CTA coverage.
- `7ed57195`: removed the unverified hero/media/withdrawal/testimonial marketing
  sections from the homepage and replaced them with three original demo-only
  capability cards. Existing legacy pages remain available by direct route but
  are not promoted from the homepage.
- Mobile navigation now uses semantic menu buttons and working Markets/Trading
  links. Focus-visible and reduced-motion rules are global.

Verification from the local frontend worktree:

```text
npm run lint=PASS
npm run typecheck=PASS
npm run i18n:check=PASS (339 keys across 7 catalogs)
npm run build=PASS (Vite warning: existing large chunks)
Playwright public-routes=3/3 PASS
```

Remaining release blockers are intentional: legal/entity approval, ownership
and licensing metadata for existing media, managed-media API/storage, full
auth lifecycle coverage (MFA/session expiry/logout), and a full platform
responsive/accessibility audit. Staging has not been redeployed from these
commits yet.
