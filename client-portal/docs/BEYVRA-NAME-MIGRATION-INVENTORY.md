# Beyvra name migration inventory

Snapshot: 2026-08-08 UTC. Authoritative scopes: `/root/realtime-front`, `/root/github-projects/backend`, `/root/github-projects/codestra-financial-service`, and active edge configuration under `/srv/codestra`. Generated output, dependencies, Git data, backups, test artifacts, compiled files, and virtual environments were excluded.

The initial boundary-aware scan found 413 matching lines: frontend 220, backend 149, and Financial Service 44. The term `trading` was not treated as a legacy name; only standalone `Tradi`, `Tradx`/`Tradex`/`Tradix`, `Trade-X`, `Trading-X`, Codestra families, Postiz, and legacy domains were counted.

## Changed public surfaces

| Surface | Classification | Resolution |
|---|---|---|
| Seven frontend locale catalogs | `USER_VISIBLE_REPLACE` | Tradi/Tradx/Tradex names and domains replaced with Beyvra/beyvra.com |
| Navbar, footer, landing, platform help, privacy and cookie pages | `USER_VISIBLE_REPLACE` | Visible brand normalized to Beyvra |
| Browser title, canonical, OpenGraph, robots, sitemap | `PUBLIC_METADATA_REPLACE` | Already Beyvra; now protected by the build gate |
| PWA name, short name, description and icon | `PUBLIC_METADATA_REPLACE` | Beyvra identity and new SVG mark |
| Frontend error surfaces | `ERROR_MESSAGE_REPLACE` | Protected by `toUserSafeError()` and the error-safety build gate |
| Django Spectacular title and description | `PUBLIC_API_DESCRIPTION_REPLACE` | Changed from Tradi to Beyvra API |
| Backend email templates and subjects | `EMAIL_TEMPLATE_REPLACE` | Verified Beyvra; backend identity gate covers active templates |
| OpenAPI document titles/descriptions | `PUBLIC_API_DESCRIPTION_REPLACE` | Verified Beyvra; compatibility artifact filenames retained |

## Retained frontend identifiers

| Location/value | Classification | Reason and retirement plan |
|---|---|---|
| `src/api/generated/codestraDemo.ts` and exported `codestra*Api` symbols | `INTERNAL_DO_NOT_RENAME` | Generated-client compatibility surface. Public copy and thrown error branding are Beyvra. Rename only with generated-client import migration and compatibility aliases. |
| `codestra.chart.drawings.v1` | `INTERNAL_DO_NOT_RENAME` | Browser persistence key; renaming would discard saved drawings. Add dual-read/write migration before retirement. |
| `codestra.chart.interval.v1` | `INTERNAL_DO_NOT_RENAME` | Browser preference compatibility. Add Beyvra key plus legacy fallback before retirement. |
| `codestra.chart.workspace-ui.v1` | `INTERNAL_DO_NOT_RENAME` | Browser workspace-state compatibility. Migrate with dual read. |
| `codestra.chart.indicators.v1` | `INTERNAL_DO_NOT_RENAME` | Saved indicator compatibility. Migrate with dual read. |
| `codestra.chart.event-filter.v1` | `INTERNAL_DO_NOT_RENAME` | Saved event-filter compatibility. Migrate with dual read. |
| `codestra:last-logout` in `requireAuth` and `ProfileMenu` | `INTERNAL_DO_NOT_RENAME` | Cross-tab logout protocol. Versioned dual-key transition required. |
| `/api/bank_account/tradxio/` | `HISTORICAL_DO_NOT_CHANGE` | Legacy public API route under compatibility freeze; remove through versioned API deprecation, not a brand-only edit. |
| legacy `tradxlogo.png` files | `HISTORICAL_DO_NOT_CHANGE` | No active UI references remain. Retained temporarily for rollback; remove only after asset-reference certification. |

## Retained backend identifiers

| Files/value family | Classification | Reason |
|---|---|---|
| `contracts/openapi/codestra-*.yaml` filenames | `INTERNAL_DO_NOT_RENAME` | Contract artifact paths consumed by tooling; document metadata says Beyvra. |
| `X-Codestra-*` headers in webhooks/realtime proxy | `INTERNAL_DO_NOT_RENAME` | Signed/versioned protocol compatibility; requires dual-header rollout. |
| `codestra.*` StatsD/Prometheus metrics and Grafana/alert files | `MONITORING_LABEL_REPLACE` deferred | Renaming would break dashboards and alert continuity; migrate with dual-emission and dashboard cutover. |
| `codestra.auth` logger | `INTERNAL_DO_NOT_RENAME` | Log routing compatibility. Add a new logger alias before retirement. |
| NATS/Centrifugo prefixes, durable names, JetStream identifiers | `INTERNAL_DO_NOT_RENAME` | Delivery, replay, and deduplication compatibility. |
| Docker networks, Compose projects, volumes and container names | `INTERNAL_DO_NOT_RENAME` | Runtime and rollback dependencies. |
| `/etc/codestra` and `/run/secrets/codestra` | `INTERNAL_DO_NOT_RENAME` | Operational secret mounts; renaming risks staging credentials. |
| `codestra.*` Django check IDs | `INTERNAL_DO_NOT_RENAME` | Stable machine identifiers consumed by deployment gates. |
| migration files, database roles/schemas/indexes and audit history | `MIGRATION_DO_NOT_CHANGE` / `IMMUTABLE_AUDIT_DO_NOT_CHANGE` | Persistence and historical integrity. No schema rename authorized. |
| dated reports and API-freeze documentation | `HISTORICAL_DO_NOT_CHANGE` | Preserve factual historical evidence. |

## Financial Service references

All 44 Financial Service matching lines are `INTERNAL_DO_NOT_RENAME`, `MIGRATION_DO_NOT_CHANGE`, or `HISTORICAL_DO_NOT_CHANGE`: Compose/network identity, database roles and schemas, mTLS configuration, systemd units, backup/restore tooling, NATS/JetStream subjects, stable error namespaces, contract paths, tests, and operational documentation. The Financial Service repository and financial state were not modified.

## Public compatibility domains

The active staging edge retains `staging.codestra.cloud` beside `staging.beyvra.com` as an approved compatibility hostname. It is not emitted by frontend metadata, application links, email, or API descriptions. Removal requires a separately approved redirect/traffic audit; production hostnames were not changed.

## Enforcement

`npm run brand:check` scans 672 active frontend/public files and fails on legacy visible brands or domains, except enumerated persistence/generated-client compatibility lines. `python3 scripts/check_public_identity.py` applies the same policy to active backend public configuration, API metadata, and email surfaces while explicitly allowing compatibility-only operational identifiers.
