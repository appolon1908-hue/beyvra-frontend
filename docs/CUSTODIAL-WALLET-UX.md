# Custodial wallet UX

The protected `/platform/wallet` route is the provider-neutral real-funds workspace. It is visibly separate from the Demo / Simulation platform and never substitutes a demo balance for a real wallet snapshot.

Capabilities come only from `GET /api/v1/features`. Missing, malformed, string-valued, or failed discovery is interpreted as disabled. While `REAL_WALLET_READ_ENABLED=false`, the page displays “Real-money services are unavailable” and makes no wallet-snapshot request. If a future approved response enables reading, the page renders only backend-returned `asset`, `available`, `reserved`, `pending`, `total`, and `as_of` fields.

No financial value is synthesized, cached in browser storage, or placed in a URL. The page links back to the explicitly labeled virtual-funds platform without combining the two domains.
