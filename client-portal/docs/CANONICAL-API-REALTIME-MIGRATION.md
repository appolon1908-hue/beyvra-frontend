# Canonical API and Realtime Migration

## Inventory

The inventory covers API hooks, the generated client facade, the endpoint
registry, chart data controllers, integrations administration, and the single
shared realtime client. Direct browser access is centralized through
`authenticatedRequest` or the generated Beyvra facade.

| Surface | Previous caller | Canonical target | State |
| --- | --- | --- | --- |
| Login, logout, refresh, password, MFA | `user/*` | `/api/v1/auth/*` | Migrated |
| Profile | `user/me/` | `/api/v1/me/` | Migrated |
| Demo wallet/orders/trades | mixed demo routes | `/api/v1/demo/*` | Migrated |
| Market snapshot/candles/quotes | trade history/market-data routes | `/api/v1/market/*` | Migrated where response-compatible |
| Notifications | `notification/*` | `/api/v1/notifications/*` | Migrated |
| Trading P0 | legacy trades routes | `/api/v1/trading/*` | Canonical for P0; legacy UI callers retained pending response migration |
| Real wallet/financial | wallet/payment routes | `/api/v1/wallets|deposits|withdrawals|transfers/*` | Canonical authority remains fail-closed; demo-era callers retained |
| Compliance | user KYC routes | `/api/v1/compliance/*` | Retained pending canonical response compatibility |
| Realtime | `/ws/v1/` and path-specific sockets | `/ws/v2/` | Shared client migrated; fallback opt-in only |

## Realtime recovery

Realtime v2 is the default transport. Legacy v1 fallback requires the explicit
`VITE_REALTIME_V2_V1_FALLBACK_ENABLED=true` compatibility flag. Ordered events
are tracked per channel. A detected sequence gap invokes the registered REST
snapshot recovery callback before live delivery resumes. Duplicate events do
not trigger false gaps.

Private subscription tokens and server-side authorization derive identity from
authenticated credentials. Callers cannot select another user's identity.

## Remaining compatibility callers

The retained wallet, payment, portfolio, KYC, bank, and legacy trade callers
have incompatible legacy response models or demo semantics. They remain
explicitly inventoried instead of being redirected to real-value contracts.
Their backend wrappers are measured and must not be retired until usage reaches
zero and contract migration tests pass.

## Error and release safety

User-visible failures continue through `toUserSafeError`. Diagnostic request
identifiers, raw response objects, exception names, paths, and internal service
names remain log-only. Real money, real trading, external execution, providers,
and 5-second data remain disabled. This work does not change production or the
Financial Service.
