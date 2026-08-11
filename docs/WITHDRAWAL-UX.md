# Withdrawal and transfer UX

The Withdrawal tab prepares asset, network/rail, verified masked destination, amount, estimated fee/receive, limits, requirements, review, and confirmation contracts. The Transfer tab prepares asset, destination account, amount, and review. Both remain disabled under server policy; preview and submission are not invoked while their features are false.

Future previews use only `/api/v1/withdrawals/preview` and `/api/v1/transfers/preview` and may display backend-authoritative eligibility, fee, receive amount, cooldown, per-transaction limit, daily remaining, and weekly remaining. The browser does not hardcode a business limit or calculate an authoritative fee.

Security UX handles verified, pending, locked, and revoked destinations; recent session/MFA requirements; step-up; compliance review; and destination cooldown. Authentication is Beyvra session/MFA only. Failures offer the Beyvra support workflow and never expose external diagnostics.
