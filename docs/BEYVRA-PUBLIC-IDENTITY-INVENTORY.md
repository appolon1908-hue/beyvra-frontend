# Beyvra frontend public identity inventory

Snapshot date: 2026-08-07. Source base:
`6c6eb8b4e6475e7b230dc852021296dfbb9bc8d0`.

This change prepares source and staging configuration. It does not change DNS,
issue certificates, update an OAuth provider console, deploy staging, redirect
legacy domains, or cut over production.

## Classification

| Match family | Classification | Decision |
|---|---|---|
| Visible page copy and translations containing `Codestra` | `USER_VISIBLE_BRAND` | Changed to Beyvra. |
| Staging API, WebSocket, load-test, and handoff URLs | `STAGING_CONFIG` | Changed to `staging.beyvra.com`. |
| Title, description, canonical/OpenGraph metadata, manifest, robots, sitemap | `PUBLIC_DOMAIN` / `USER_VISIBLE_BRAND` | Added Beyvra production metadata. |
| `codestraDemo.ts`, exported `codestra*Api` symbols, API error class | `INTERNAL_IDENTIFIER` | Preserved to avoid an unrelated generated-client/import migration. They are not rendered to users. |
| `codestra.chart.*`, `codestra:last-logout`, and other local-storage keys | `INTERNAL_IDENTIFIER` | Preserved so deployment does not discard user chart/preferences state. |
| Phase reports and screenshots describing earlier Codestra staging runs | `HISTORICAL_RECORD` | Preserved as immutable certification evidence. |
| Historical style comments naming Codestra/Tradi parity | `DO_NOT_CHANGE` | Preserved because they are non-runtime implementation context. |
| Existing logo filenames and asset paths | `INTERNAL_IDENTIFIER` | Paths remain stable; public text and metadata identify Beyvra. Visual asset redesign is not fabricated by a text migration. |

## Host ownership

- `beyvra.com`, `www.beyvra.com`, `platform.beyvra.com`: frontend.
- `api.beyvra.com`: Django/API and `/ws/v2/` realtime edge.
- `admin.beyvra.com`: admin application.
- `staging.beyvra.com`: staging frontend with explicit API/WebSocket routing.

No dedicated `ws.beyvra.com` is used because it has not been independently
created and certified.

## External gates

The following require the approved connected host or external provider owner:

1. DNS resolution for every hostname.
2. Public ACME certificate issuance and renewal.
3. Google/OAuth callback registration.
4. Browser CORS, CSRF, cookie, CSP, and WebSocket certification.
5. Staging deployment, email-link delivery, monitoring, and rollback testing.
6. Separately authorized production cutover and any old-domain redirects.
