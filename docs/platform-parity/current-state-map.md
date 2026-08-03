# Codestra/Tradi platform parity — current-state map

Date: 2026-08-03

## Repository and runtime

The staging frontend is `/root/realtime-front/client-portal`: React 19,
TypeScript, Vite 8, React Router 7, Redux Toolkit, TanStack Query, Ant Design,
SCSS/Tailwind, Lightweight Charts, and Socket.IO/WebSocket clients. The staging
backend is `/root/realtime-back/FX`: Django/DRF, PostgreSQL, Redis, Channels,
Celery, and first-party market/news/account/platform streams.

Frontend branch: `realtime/frontend-manager` (clean before this work).
Backend branch: `realtime/discovery-and-services` (database verification commit
already recorded separately). No production services or data are in scope.

## Route inventory

Existing public routes include `/`, `/markets/*`, `/trading/*`, `/downloads`,
`/signIn`, `/login`, `/register`, `/password-reset`, `/forgot-password`,
`/verify-email`, `/session-expired`, `/logout`, `/prv`, and `/reg`. Protected
routes include `/platform`, `/home`, `/transactions`, `/kyc-document`,
`/statusDetails`, `/walkThrough`, `/welcome`, `/lender`, and
`/admin/integrations`.

The platform is a single protected workspace with a sidebar, Ant Design drawers,
top bar, asset selector, Lightweight Charts workspace, and TradeForm. Existing
drawers cover trades, market/assets, portfolio, help/news, account/profile and
settings/security surfaces.

## Existing contracts

- Authentication uses access/refresh cookies and existing login/register/reset/
  verification hooks. Logout calls the server token-revocation endpoint.
- Market REST: `trades/assets/`, `trades/market/history/`, and the newer
  `/api/v1/market/*` normalized endpoints.
- Realtime REST: `/api/v1/assets`, `/api/v1/market/snapshot`, `/api/v1/market/candles`,
  `/api/v1/news`, `/api/v1/economic-calendar`, `/api/v1/realtime/health`, and
  `/api/v1/realtime/ticket`.
- Realtime streams: `/ws/v1/market-data`, `/ws/v1/news`, `/ws/v1/account`, and
  `/ws/v1/platform`; the legacy `/ws/market-data/` path is still used by the
  current chart and will remain a compatibility path.
- Demo trade submission uses `POST trades/` with an `Idempotency-Key`; the
  frontend currently displays a receipt through mutation callbacks but needs a
  server-confirmed receipt state and stale-quote guard.

## Feature truth

The backend defaults to demo trading enabled and live trading, market ingestion,
and external financial streams disabled unless explicitly configured. Deposits,
withdrawals, rewards, referrals, tournaments, MT4/MT5, CFD, copy trading and
other unsupported financial surfaces must remain hidden in staging.

## Known gaps

1. The platform shell uses percentage/fixed positioning rather than the required
   64px rail / flexible chart / 320px ticket grid.
2. Asset selection is functional but lacks explicit favorites, categories,
   market-state labels, and a clear DEMO disclosure in the selector.
3. Chart controls currently rebuild the chart when data changes and expose only
   chart type and zoom; timeframe/indicator/drawing capability must be gated by
   actual support.
4. TradeForm has functional amount/duration and Up/Down controls but needs
   accessible labels, stale/offline blocking, stable submission/receipt states,
   and explicit demo wording.
5. Several legacy public routes and platform drawer modules contain unsupported
   third-party or live-finance language; flags must prevent exposure.
6. A server-supplied platform configuration contract is needed so the frontend
   does not infer financial capability from client-only state.

## Files expected to change

`src/config/platformFeatures.ts`, `src/api/endpoints.ts`, `src/api/platform/`,
`src/App.tsx`, platform shell/topbar/sidebar/chart/trade styles and components,
`src/pages/public/signIn/*`, design tokens, tests, and this documentation.
Backend additions are limited to a read-only platform configuration endpoint and
tests; no production or live-trading behavior is enabled.

## Verification commands

```bash
cd client-portal
npm run typecheck
npm run lint
npm run build:prod
npm run test:e2e -- e2e/dashboard-responsive-audit.spec.ts e2e/auth-trading.spec.ts
```

Product mode for this implementation is `DEMO_ONLY`. Legal identity and media
ownership remain governed by the existing staging approval records; no new
claims or third-party media are introduced here.
