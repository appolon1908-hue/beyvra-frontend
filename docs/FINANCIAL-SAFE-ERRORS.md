# Financial safe errors

All user-visible financial failures pass through `BeyvraErrorMapper`. Explicit mappings include `FEATURE_DISABLED`, `KYC_REQUIRED`, `COMPLIANCE_REVIEW_REQUIRED`, `JURISDICTION_RESTRICTED`, `STEP_UP_REQUIRED`, `DESTINATION_COOLDOWN`, `WITHDRAWAL_NOT_ALLOWED`, `INSUFFICIENT_AVAILABLE_BALANCE`, and `SERVICE_TEMPORARILY_UNAVAILABLE`.

Unknown values collapse to a generic retry message. UI text must not contain service URLs, provider responses, provider/customer/wallet/transaction identifiers, webhook details, request or correlation IDs, mTLS information, stack traces, database details, or secret material. A build gate checks user-safe error rendering and a separate source/compiled-output audit rejects direct OMS, Financial Service, custody-provider, or payment-provider calls.

Normal `FEATURE_DISABLED` is informational and must not claim that an intent, address, transfer, withdrawal, or financial effect was created.
