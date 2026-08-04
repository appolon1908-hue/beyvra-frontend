# Codestra/Tradi platform parity staging handoff

Status: staging-only implementation, demo-first. Updated 2026-08-04. Production
is unchanged and activation remains blocked.

## Current staging images

- Backend: `codestra-backend:staging-demo-entry-20260804a`
- Frontend: `codestra-frontend:staging-google-570f908`
- Staging URL: `https://staging.codestra.cloud/`
- Google provider response: `GET /api/v1/auth/providers` returns HTTP 200 with
  Google disabled until approved OAuth credentials and legal versions exist.
- The sign-in bundle contains the truthful disabled Google control; no live
  provider or financial capability was enabled.
- Frontend: `codestra-frontend:staging-demo-entry-20260804a`.
- `POST /api/v1/demo/sessions` issues a server-created, 30-minute,
  non-refreshable guest Demo token and an HttpOnly `codestra_guest_session`
  cookie. It accepts no PII, is idempotent with `Idempotency-Key`, and creates
  one 10,000-unit virtual wallet while `PAPER_TRADING_ONLY=true`.
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
- Fixed platform sizing for phone, tablet, desktop, ultra-wide and headset-like
  viewports: removed the `100vw` plus fixed-rail overflow, removed the duplicated
  desktop top-bar offset, added resize-aware measurements, constrained chart and
  order-ticket flex sizing, and reserved mobile safe-area space for the bottom
  navigation and order sheet.
- Added ultra-wide overview scaling so the demo entry surface remains readable
  at 1920px+ and 3200px+ widths rather than collapsing into a tiny centered card.
- Restored graph-first platform proportions: the desktop shell now owns a 64px
  top bar, flexible chart workspace, 320px ticket column, and 48px status area;
  the chart host fills its workspace and resizes through `ResizeObserver`.
  Reconnecting state is a compact non-blocking badge, while quote safety still
  disables order submission.
- Moved the demo ticket into a real right-side desktop column, a closed-by-default
  right drawer at 768–1279px, and a bottom sheet below 768px. Added an accessible
  Open Demo Trade trigger, Escape/backdrop close behavior, and focus-safe close
  control. Payments and live features remain absent.
- Applied the approved Codestra visual density: 64px rail, 64px top bar, compact
  56px rail targets, dark slate surfaces, muted labels, tabular balances, green
  primary demo actions, and red directional Down actions. Unsupported Payments,
  Rewards, InZone and shop controls remain hidden by feature policy.
- Replaced the ticket's separate oversized amount/duration button rows with
  bounded 70px combined steppers. Each has an accessible minus/value/plus
  control and preserves the existing server-authoritative demo order path.

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

Responsive smoke evidence (staging, guest Demo) passed with no horizontal
overflow at `360x800`, `768x1024`, `1363x936`, and `3840x2160`. Screenshots were
captured under `/tmp/codestra-final-*.png` during the deployment check.

The platform geometry was captured through the staging guest Demo session at
1899x908, 1280x800, 1024x768, 768x1024, and 390x844. The endpoint returned HTTP
201 with `guestDemo=true`, `demoOnly=true`, `expiresIn=1800`, and JWT claims
`guest_demo=true` and `demo_only=true`; an authenticated market-history request
returned HTTP 200. Market data itself may still show the truthful unavailable
state when the authorized snapshot provider is unhealthy.

## Rollback

Rollback staging only by restoring the prior frontend image and
`codestra-backend:staging-otp-20260803b`, then restart only the `front` and
`backend` compose projects. The additive `users.0031` migration is reversible
only with an approved database rollback; production was not touched.
