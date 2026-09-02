# Horizon portfolio-shell adoption

## Authority

- Horizon repository: `appolon1908-hue/SDK-repository`
- Foundation PR: `#73`
- Foundation exact head: `7db4c6549a0a007922355090f03c082a308f3855`
- Adoption branch: `feature/horizon-portfolio-shell-v1`
- Product theme: `beyvra`
- Runtime activation: **not included**

## Canonical domains

| Role | Domain |
|---|---|
| Public website | `https://beyvra.com` |
| Public alias | `https://www.beyvra.com` |
| Client platform | `https://platform.beyvra.com` |
| Administration | `https://admin.beyvra.com` |
| Public API | `https://api.beyvra.com` |
| Staging | `https://staging.beyvra.com` |
| Shared identity | `https://auth.codestra.co` |
| Corporate authority | `https://codestra.co` |

No `ws.beyvra.com` or `status.beyvra.com` hostname is introduced. The backend public-identity inventory explicitly requires independently created and certified DNS/TLS before either dedicated hostname may be used.

## Scope

- replace the legacy public navbar with the shared Horizon header
- preserve market, trading, platform, download, sign-in, demo-registration and language behavior
- replace empty social-icon footer links with real market, platform, trust and Codestra product-network links
- add visible `Beyvra · platform.beyvra.com` identity to the authenticated top bar
- align canvas, surfaces, borders, radii, focus and typography with Horizon
- preserve financial semantic colors for positive, negative, warning and danger
- preserve demo-account and virtual-funds disclosure

## Safety

This branch does not:

- enable live trading, deposits, withdrawals or providers
- convert demo funds into money or hide the demo label
- change order, market-data, account, authentication or reconciliation APIs
- alter CORS, CSRF, cookies, OAuth, DNS, TLS, deployment or production runtime
- invent a status or WebSocket hostname

## Validation

```bash
cd client-portal
npm ci
npm run lint
npm run typecheck
npm run i18n:check
npm run brand:check
npm run errors:check
npm run test:errors
npm run test:realtime
npm run test:chart
npm run test:contract
npm run build
npm run test:e2e
```

Representative visual and accessibility checks must cover public navigation, the demo sign-in flow, market pages, platform top bar, account chooser, mobile navigation, legal pages and all loading/error/degraded states.
