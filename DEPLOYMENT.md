# Frontend deployment

## Build and validate

```sh
cd client-portal
npm ci
npm run lint
npm run build:prod
docker build -f Dockerfile.prod -t tradx-front:release .
```

For the repository-root production-style Compose configuration, run:

```sh
docker compose build frontend
docker compose up -d frontend
curl --fail http://127.0.0.1:8080/
```

The container serves the SPA on port `8080` by default. It requires the external
`trading-network` Docker network, which provides the backend/BFF upstream named
`nginx`. Create or connect that network before starting the full edge profile.
`VITE_REALTIME_V2_ENABLED` defaults to `false`; enable it only after the realtime
ownership, transport-routing, and end-to-end release gates are approved.

Set `VITE_API_BASE_URL` to the public HTTPS API endpoint when starting the container. The Nginx entrypoint injects it into `index.html`; no populated `.env` file is required or should be committed.

Serve the container behind TLS and add a strict Content Security Policy at the ingress after enumerating the application’s required third-party origins (TradingView, Segment, LiveChat, and market/news providers).

The generated application is a single-page app; Nginx routes unknown paths to `index.html`.

## Staging HTTPS

Copy `.env.staging.example` to `.env.staging`, set a DNS name that resolves to
the server, and start the edge profile:

```sh
docker compose --env-file .env.staging --profile edge up -d --build
curl --fail https://YOUR_STAGING_DOMAIN/
```

`deploy/Caddyfile.public` obtains and renews a public certificate automatically.
For a DNS-less local rehearsal, use `deploy/Caddyfile.staging`; it issues an
internal certificate and should not be used for public clients. Ports 80 and
443 must be free or mapped by the server's existing edge proxy.
