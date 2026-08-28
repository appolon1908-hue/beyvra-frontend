# Frontend deployment

The Beyvra frontend is built as an immutable static SPA and served from an
unprivileged Nginx container on port `8080`. Public TLS should terminate at the
approved edge proxy. Browser API and WebSocket traffic remains same-origin and is
proxied through `/api/*` and `/ws/*`; the frontend never receives provider secrets.

## Build and validate

Run from the repository root unless noted otherwise:

```sh
cd client-portal
npm ci
npm run typecheck
npm run lint
npm run build
cd ..
```

`npm run build` is the authoritative release build because it runs the repository
safety checks before Vite emits assets. Do not substitute `npm run build:prod` as a
release gate; that command is a raw Vite build and does not include all prerequisite
checks.

Build the container with immutable release metadata:

```sh
export VCS_REF="$(git rev-parse HEAD)"
export BUILD_VERSION="${BUILD_VERSION:-candidate}"
export BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

docker compose build frontend
```

For a release pipeline, set `FRONTEND_IMAGE` to an immutable registry reference and
record the resulting digest. Mutable tags are not production evidence.

## Local production-style rehearsal

The frontend container binds to loopback by default so the host edge remains the only
public ingress:

```sh
docker compose up -d frontend
curl --fail http://127.0.0.1:8080/healthz
```

The production container runs as an unprivileged user, uses a read-only root
filesystem, drops all Linux capabilities, sets `no-new-privileges`, and receives only
small tmpfs mounts for Nginx runtime state.

The external `trading-network` must provide the authoritative backend/BFF service under
the DNS name `nginx`. Nginx resolves that name lazily when `/api/*` or `/ws/*` is
requested, so the static frontend and `/healthz` can start independently during a
rolling deployment.

## Runtime configuration

Only public browser configuration belongs in runtime `VITE_*` variables. Never place
API keys, provider credentials, client secrets, signing keys, or database credentials
in any `VITE_*` value because runtime `config.js` is readable by every browser.

Recommended defaults:

```text
VITE_API_BASE_URL=/api
VITE_SOCKET_BASE_URL=AUTO
VITE_BRAND_NAME=Beyvra
VITE_REALTIME_V2_ENABLED=false
VITE_REALTIME_V2_V1_FALLBACK_ENABLED=false
```

Enable realtime V2 only after the realtime ownership, transport-routing, channel
authorization, and recovery gates are approved.

## Same-origin BFF and realtime boundary

The production Nginx configuration proxies:

```text
/api/* -> authoritative BFF/backend
/ws/*  -> authoritative realtime gateway
```

Market/news data is subscribe-only in the browser. User mutations such as orders,
cancellations, watchlist updates, compliance acknowledgements, and notification
settings remain authenticated REST commands.

The container access-log format deliberately omits query strings so a short-lived
`ws_ticket` cannot be written into normal request logs.

## Cache policy

- `/assets/*`: one-year immutable cache for Vite content-hashed assets.
- `/index.html`: `no-cache, no-store, must-revalidate`.
- `/config.js`: `no-store`.
- proxied `/api/*`: `no-store` at the frontend boundary.
- unknown SPA routes: serve `index.html` with revalidation.

This prevents a rollout from serving an old SPA shell that references assets from a
previous release and prevents browser/shared caches from persisting API responses at
the frontend edge.

## Staging HTTPS

Copy `.env.staging.example` to `.env.staging`, set a DNS name that resolves to the
server, and start the edge profile:

```sh
docker compose --env-file .env.staging --profile edge up -d --build
curl --fail https://YOUR_STAGING_DOMAIN/
```

`deploy/Caddyfile.public` obtains and renews a public certificate automatically. For a
DNS-less local rehearsal, use `deploy/Caddyfile.staging`; it issues an internal
certificate and should not be used for public clients. Ports 80 and 443 must be free or
mapped by the server's existing edge proxy.

## Production evidence

Before promotion record at minimum:

```text
COMMIT_SHA=
CONTAINER_IMAGE=
CONTAINER_DIGEST=
BUILD_DATE=
ENVIRONMENT=
DEPLOYMENT_REVISION=
HEALTHZ=PASS|FAIL
CONTAINER_USER=NONROOT|FAIL
ROOT_FILESYSTEM=READ_ONLY|FAIL
CAPABILITIES_DROPPED=PASS|FAIL
NO_NEW_PRIVILEGES=PASS|FAIL
SAME_ORIGIN_API_PROXY=PASS|FAIL
WEBSOCKET_PROXY=PASS|FAIL
QUERY_STRING_REDACTION=PASS|FAIL
```

Production approval requires the frontend production gates and runtime-cutover evidence
in this repository; a successful Docker build alone is not a production-ready verdict.
