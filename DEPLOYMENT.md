# Frontend deployment

## Build and validate

```sh
cd client-portal
npm ci
npm run lint
npm run build:prod
docker build -f Dockerfile.prod -t tradx-front:release .
```

Set `VITE_API_BASE_URL` to the public HTTPS API endpoint when starting the container. The Nginx entrypoint injects it into `index.html`; no populated `.env` file is required or should be committed.

Serve the container behind TLS and add a strict Content Security Policy at the ingress after enumerating the application’s required third-party origins (TradingView, Segment, LiveChat, and market/news providers).

The generated application is a single-page app; Nginx routes unknown paths to `index.html`.
