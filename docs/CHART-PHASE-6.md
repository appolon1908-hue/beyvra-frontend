# Chart Phase 6 — Workspace integration and UX hardening

## Frozen boundaries

- Phase 5 frontend base: `5b1860b056599da62b79b93961eef9cae971ac0f`
- Phase 5 backend: `acb0df48822940f2e00fc9d066467cff44ef73a6`
- Financial service: `e27b9f67efca3dde5cb295712cb556133e4c00b3`
- No backend, financial-service, provider activation, ledger, real-money, or production changes are part of Phase 6.
- Genuine five-second market data remains unavailable. There is no synthetic fallback.

## Ownership and lifecycle

`PlatformChartContainer` creates exactly one `ChartDataController` and one `EChartsAdapter` for its mounted lifetime. Panel, drawer, toolbar, fullscreen, and mobile-sheet state is owned by `ChartWorkspaceUIStore`; those transitions do not appear in the adapter-mount effect dependencies.

Domain ownership remains isolated:

- `ChartDataController`: canonical candles, quote, market state, sequences, history, and market subscriptions.
- `IndicatorEngine`: indicator projections only.
- `DrawingStore`: account/instrument/timeframe-scoped display drawings and history.
- `TradeMarkerStore`: demo-trade marker projections.
- `NewsCalendarOverlayStore`: governed event projections, filters, clustering, selection, and bounded event deduplication.
- `ChartWorkspaceUIStore`: active toolbar, fullscreen/compact state, pointer mode, drawing tool, and chart type.

## Rendering and interaction

Graphics use deterministic z-order: drawings `60`, trade overlays `70`, news/calendar overlays `80`, and selected drawing handles `90`. Trade x-coordinates reserve an event lane; events that collide visually move to a secondary visual y-position without changing timestamps or candle positions. Same-kind events within 28 rendered pixels cluster deterministically.

Drawing creation disables event-marker activation and chart data-zoom interaction until the tool is cancelled or changed. Keyboard handling is scoped to the focused workspace and does not override editable controls:

- Escape cancels drawing first, otherwise closes the event drawer/toolbar.
- Delete/Backspace removes the selected display drawing.
- Ctrl/Cmd+Z undoes; Ctrl/Cmd+Shift+Z and Ctrl/Cmd+Y redo.
- Plus/minus zoom; Home centers live view.

## Accessibility and responsive behavior

All chart controls and canvas marker equivalents have accessible names. The desktop/tablet event drawer is non-modal; the compact/mobile bottom sheet traps focus. Both focus the drawer heading on open and restore focus to the origin on close. Mobile controls use approximately 44px minimum targets.

## Performance and memory

The deterministic reference-runtime suite measures normalization plus all five indicator projections at 500, 1,000, and 5,000 candles, along with candle update and local filter projections. News/calendar projections are capped at 1,000 loaded items and realtime event-id deduplication at 10,000 IDs to prevent unbounded growth.

These local measurements do not substitute for reference-browser staging measurements. Browser E2E and Axe coverage are defined in `e2e/chart-engine.spec.ts`, but this workspace denies Playwright loopback access during guest-session setup. Run the following in connected CI/staging:

```bash
npm run test:e2e -- e2e/chart-engine.spec.ts
```

## Rollback

The verified Phase 5 Git bundle and configuration hashes are recorded at `/root/rollback/phase6-20260807/ROLLBACK.md`. The container image digest could not be captured because this workspace cannot access the Docker socket. No deployment was replaced.

## Known release gate

`npm audit --omit=dev` reports the React Router RSC-mode CSRF advisory. This application does not use React Server Components, and npm offers only a breaking React Router 8 upgrade. Treat the upgrade as a separate reviewed dependency change rather than applying `npm audit fix --force` in Phase 6.
