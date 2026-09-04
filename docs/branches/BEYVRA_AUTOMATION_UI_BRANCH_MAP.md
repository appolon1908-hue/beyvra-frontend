# Beyvra Automation UI Extraction Map

## Current contract candidate

```text
PARENT_BRANCH=integration/automation-status-ui-v2-20260827
BASE=protected main
RUNTIME_UI_ADDED=NO
BACKEND_DEPENDENCY=appolon1908-hue/beyvra-backend#89
BACKEND_STATE=PENDING_PROTECTED_MERGE
```

After the backend contract is protected-merged and an accepted schema is available, extract implementation into narrow current-main branches rather than stacking the historical PR chain:

1. `feature/automation-status-center-v1`
2. `feature/automation-request-forms-v1`
3. `feature/automation-alert-center-v1`
4. `test/automation-ui-contracts-v1`

Each branch must start from the latest protected `main`, identify the accepted backend SHA and schema checksum, pass exact-head CI and independent review, and preserve the same-origin BFF and read-only release controls.

Do not bundle backend, identity, provider, deployment, n8n workflow, Middleware runtime, trading, order, wallet, ledger, payment, custody, or money-movement changes into these frontend branches.
