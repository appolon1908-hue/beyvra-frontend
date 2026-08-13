# Staging dependency security note — 2026-08-06

`npm audit --omit=dev` reports GHSA-qwww-vcr4-c8h2 through the installed
React Router 7 dependency chain. The advisory concerns React Server Components
action execution. This frontend is a client-only Vite SPA and does not enable
React Router RSC/framework mode, so the vulnerable execution path is absent.

The registry currently offers patched `react-router` 8.3.0 but no matching
`react-router-dom` 8.3.0 package; forcing the suggested update would create an
invalid dependency graph. Keep monitoring the advisory and upgrade both
packages together when a compatible patched pair is published.
