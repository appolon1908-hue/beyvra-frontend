# Deposit UX

The Deposit tab prepares a future backend-governed request without implying that funding is operational. With deposits disabled, its controls are disabled and it states: “Deposits are not currently available.” No POST is made and no success, confirmation, address, or bank instruction is fabricated.

`BackendDepositDestination` accepts only an object returned by Beyvra. A virtual account may display an account name, optional bank name, masked account, and reference. A crypto destination may display the exact asset, network, address, QR encoding of that address, and a supported-network warning. The browser never generates an address or bank detail.

Canonical states are `CREATED`, `AWAITING_FUNDING`, `DETECTED`, `PENDING_CONFIRMATION`, `COMPLIANCE_REVIEW`, `CREDIT_PENDING`, `CREDITED`, `FAILED`, `CANCELLED`, and `REVERSED`. No external-provider state is accepted.
