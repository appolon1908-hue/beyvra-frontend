# Codestra/Tradi platform parity staging handoff

Status: staging-only implementation, demo-first. Deployed to staging on
2026-08-03. Production is unchanged and activation remains blocked.

## Current staging images

- Backend: `codestra-backend:staging-google-52989b3`
- Frontend: `codestra-frontend:staging-google-570f908`
- Staging URL: `https://staging.codestra.cloud/`
- Google provider response: `GET /api/v1/auth/providers` returns HTTP 200 with
  Google disabled until approved OAuth credentials and legal versions exist.
- The sign-in bundle contains the truthful disabled Google control; no live
  provider or financial capability was enabled.
- Route-repair image: `codestra-frontend:staging-route-repair-20260803`.
- Unauthenticated `/platform` and nested routes now redirect to `/login` with
  an encoded local `redirect` destination.
- `/platform-overview` is an original demo-workspace overview; legacy trading
  and unapproved legal routes show a content-under-review screen.
- Registration now uses the PostgreSQL-backed email OTP flow. The deployed
  registration bundle includes the responsive verification-code screen.
- Migration `users.0030_user_email_verification_source_and_more` is applied in
  staging. Transactional email delivery remains disabled; OTP and welcome
  events are queued in the outbox until an approved provider is configured.

## Implemented in this pass

- Added a repository current-state map and verified the existing React/Vite,
  Django/DRF, PostgreSQL, Redis, and WebSocket contracts.
- Added typed, server-supplied platform capability flags with safe demo defaults
  (`GET /api/v1/platform/config`).
- Hid unsupported MT4/MT5, copy-trading, CFD, and live/leveraged routes in
  staging instead of exposing non-functional controls.
- Reworked the platform shell at desktop/tablet breakpoints around a fixed 64px
  rail, flexible chart workspace, 320px order ticket, and mobile sheet behavior.
- Added explicit DEMO/simulated-feed status treatment and disabled the order
  ticket while the quote is unavailable or disconnected.
- Added timeframe controls for supported intervals and stopped rebuilding the
  chart instance for every candle update; updates now use `series.setData` on
  the existing series.
- Preserved the existing server-authoritative trade mutation and idempotency
  key path. No live orders, deposits, withdrawals, rewards, or tournaments were
  enabled.

## Button/action matrix (implemented surfaces)

| BUTTON_ID | SURFACE | ROUTE/API | FLAG / STATE | TEST |
| --- | --- | --- | --- | --- |
| topbar-account-mode | top bar | existing account drawer | demo account | existing auth/platform E2E |
| topbar-add-asset | asset selector | `trades/assets/` | authenticated | existing platform tests |
| rail-trades | left rail | trades drawer | authenticated | existing platform tests |
| rail-assets | left rail | asset drawer | authenticated | existing platform tests |
| rail-portfolio | left rail | portfolio surface | authenticated | existing platform tests |
| rail-help | left rail | help drawer | authenticated | existing platform tests |
| chart-type | chart | local chart state | supported chart types | typecheck/build |
| chart-timeframe | chart | `trades/market/history/` | `1m`, `5m`, `15m` | typecheck/build |
| chart-zoom-in/out | chart | local chart state | chart ready | existing chart tests |
| ticket-amount-decrease/increase | order ticket | local form state | valid demo amount | existing auth-trading E2E |
| ticket-duration | order ticket | local form state | valid demo duration | existing auth-trading E2E |
| ticket-up / ticket-down | order ticket | `POST trades/` + `Idempotency-Key` | connected quote, demo wallet | existing auth-trading E2E |
| profile-menu / sign-out | profile | existing secure logout endpoint | authenticated | existing auth tests |

Unsupported financial buttons are not rendered while the corresponding server
flags are false.

## Verification

```text
npm run typecheck       PASS
npm run lint            PASS
npm run build:prod      PASS (existing Sass/Vite/chunk warnings only)
npm run test:contract   PASS (42 frontend paths checked against 165 backend paths)
```

The deployed smoke checks passed for the staging homepage, sign-in bundle,
provider configuration endpoint, and backend/frontend container health. The
full browser matrix remains a follow-up because Playwright device coverage is
not available in this shell.

The targeted Playwright smoke check also passed for `/platform`, all required
platform subroutes, `/platform-overview`, `/trading/tradingPlatform`, `/prv`,
homepage CTA destinations, and the preserved local login redirect.

## Rollback

Revert the frontend commit and the additive backend platform-config commit in
staging, rebuild the existing images, and restart only staging services. No
database migration or production setting was changed by this pass.
