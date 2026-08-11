# Frontend API contract certification

Certification date: 2026-08-11.

- The frontend registry contains 50 distinct API path templates.
- All 50 resolve to paths in the 324-path backend OpenAPI snapshot.
- The snapshot records its backend source revision and SHA-256 schema digest.
- The contract command refuses to pass when zero frontend paths are discovered.
- `npm test` runs the contract command before its production build.
- No browser caller targets a custody, payment, execution, or Polygon OMS provider directly.

The path snapshot is a review-time dependency pin. Exact-head/base CI must refresh it
when the backend OpenAPI changes; it is not a substitute for protected-chain review.
