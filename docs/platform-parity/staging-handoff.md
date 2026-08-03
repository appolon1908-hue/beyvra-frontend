# Codestra/Tradi platform parity staging handoff

Status: staging-only implementation, demo-first. Production is unchanged and
activation remains blocked.

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

The full browser matrix and staging deployment smoke test were not run in this
local pass because no staging deployment was authorized. Run the existing
Playwright suites at 360, 390, 768, 1024, 1280, and 1440px after staging deploy.

## Rollback

Revert the frontend commit and the additive backend platform-config commit in
staging, rebuild the existing images, and restart only staging services. No
database migration or production setting was changed by this pass.
