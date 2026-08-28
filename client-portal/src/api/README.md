# API Documentation & Best Practices

## Overview

The API layer is organized by domain with consistent patterns for authentication, error handling, and type safety.

```
src/api/
├── client.ts              # Core HTTP client with auth
├── endpoints.ts           # API endpoint definitions
├── errors.ts             # Error handling
├── types.ts              # Shared type definitions
├── hooks/                # Hook factory and utilities
│   ├── createMutationHook.ts
│   └── index.ts
├── user/                 # Auth & user endpoints
├── wallet/              # Wallet/balance endpoints
├── bank/               # Bank account endpoints
├── trading/            # Trading simulation endpoints
├── marketData/        # Market data endpoints
└── generated/        # Auto-generated API clients
```

---

## Core Patterns

### 1. API Hooks

All API hooks follow this pattern:

```typescript
// ✅ CORRECT
import type { BaseMutationHookOptions } from "api/types";

export async function fetchData(input: Input): Promise<Output> {
  try {
    return await apiClient.getData(input);
  } catch (error) {
    logInternalError(error, { endpoint: "domain.action" });
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

type UseDataProps = BaseMutationHookOptions<Output, Input>;

export const useData = (props?: UseDataProps) => {
  const receivedProps = props || ({} as UseDataProps);
  const { onSuccess: onSuccessOverride, onError: onErrorOverride, ...rest } = receivedProps;

  return useMutation<Output, Error, Input>({
    mutationFn: fetchData,
    onSuccess: (data, variables, context) => {
      if (onSuccessOverride) onSuccessOverride(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (onErrorOverride) onErrorOverride(error, variables, context);
    },
    ...(rest || {}),
  });
};

export default useData;
```

### 2. Error Handling

All API functions **must** handle errors consistently:

```typescript
// ✅ CORRECT
async function fetchSomething(token: string) {
  try {
    return await beyvraApi.get(token);
  } catch (error) {
    // Log with endpoint for debugging
    logInternalError(error, { endpoint: "domain.action" });
    
    // Ensure ApiError is thrown
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

// ❌ WRONG - Loses error context
async function fetchSomething(token: string) {
  try {
    return await beyvraApi.get(token);
  } catch (error) {
    throw new Error(error as string);  // ❌ Generic error!
  }
}
```

### 3. Type Safety

Always define proper types instead of using `any`:

```typescript
// ✅ CORRECT - Define the shape
interface UserResponse {
  id: string;
  email: string;
  name: string;
}

async function fetchUser(token: string): Promise<UserResponse> {
  return authenticatedRequest<UserResponse>("v1/users/profile", token);
}

// ❌ WRONG - Loses all type info
async function fetchUser(token: string): Promise<any> {
  return authenticatedRequest<any>("v1/users/profile", token);
}
```

### 4. Pagination

Use the `PaginatedResponse` type for list endpoints:

```typescript
import type { PaginatedResponse } from "api/types";

async function fetchUsers(token: string): Promise<PaginatedResponse<User>> {
  return authenticatedRequest<PaginatedResponse<User>>("v1/users", token);
}

// Usage
const { results, count } = await fetchUsers(token);
```

---

## Authentication

All authenticated requests use the `authenticatedRequest` function:

```typescript
import { authenticatedRequest } from "api/client";

// GET request
const user = await authenticatedRequest<User>(
  "v1/users/profile",
  token,
  { method: "GET" }
);

// POST request
const result = await authenticatedRequest<LoginResponse>(
  "v1/auth/login",
  "",  // No token for login endpoint
  {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }
);

// With custom timeout
const data = await authenticatedRequest<Data>(
  "v1/data",
  token,
  { method: "GET", timeoutMs: 30_000 }  // 30 second timeout
);
```

### Request ID Tracking

Every request includes a `X-Request-ID` header for debugging:

```typescript
// Automatically generated UUID for each request
const response = await authenticatedRequest<T>(
  endpoint,
  token,
  { requestId: "custom-id" }  // Optional: override
);

// Available in error logs as requestId property
```

---

## Error Handling

### ApiError Class

```typescript
import { ApiError } from "api/errors";

try {
  await someApiCall();
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status);      // HTTP status code
    console.log(error.code);        // Error code from server
    console.log(error.requestId);   // Request ID for tracking
    console.log(error.message);     // User-safe message
  }
}
```

### Error Codes

Common error codes to handle:

| Code | Status | Meaning |
|------|--------|---------|
| `REQUEST_TIMEOUT` | 408 | Request took too long |
| `NETWORK_ERROR` | 0 | Network connection issue |
| `INVALID_CREDENTIALS` | 401 | Login failed |
| `AUTHORIZATION_DENIED` | 403 | No permission |
| `RESOURCE_NOT_FOUND` | 404 | Not found |
| `UNKNOWN` | 500 | Unknown error |

See [errors/userSafeError.ts](../errors/userSafeError.ts) for complete mapping.

---

## Usage Examples

### Authentication Flow

```typescript
import { useLogin } from "api/user/useLogin";
import { useRefreshToken } from "api/user/useRefreshToken";

function LoginForm() {
  const { mutate: login } = useLogin({
    onSuccess: (response) => {
      if (response.access) {
        setCookie("access_token", response.access, cookieOptions());
      }
      if (response.refresh) {
        setCookie("refresh_token", response.refresh, cookieOptions());
      }
      navigate("/platform");
    },
    onError: (error) => {
      // Error already logged and shown as toast
      console.error("Login failed:", error.message);
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login({ email: "user@example.com", password: "..." });
    }}>
      {/* form fields */}
    </form>
  );
}
```

### Wallet Data

```typescript
import { useWallet } from "api/wallet/useWallet";

function WalletList() {
  const { mutate: fetchWallets, data, isPending } = useWallet({
    onSuccess: (wallets) => {
      console.log(`Loaded ${wallets.count} wallets`);
    },
  });

  useEffect(() => {
    fetchWallets(accessToken);
  }, [accessToken]);

  return (
    <div>
      {isPending && <Spinner />}
      {data?.results.map(wallet => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}
```

### Trading Orders

```typescript
import { previewSimulationOrder, createSimulationOrder } from "api/trading/simulation";

async function placeOrder(token: string, instrument: string, quantity: string) {
  try {
    // Preview the order first
    const preview = await previewSimulationOrder(token, {
      instrument,
      quantity,
      side: "BUY",
      order_type: "MARKET",
    });

    if (preview.decision === "ALLOW") {
      // Create the order
      const order = await createSimulationOrder(token, {
        instrument,
        quantity,
        side: "BUY",
        order_type: "MARKET",
      });
      
      return order;
    } else {
      // Order was rejected
      throw new Error(`Order review required: ${preview.reason_codes[0]}`);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      toast.error(toUserSafeErrorText(error, "trading"));
    }
  }
}
```

---

## Testing

### Unit Testing Hooks

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useProfile } from "api/user/useProfile";

describe("useProfile", () => {
  it("should fetch user profile", async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useProfile(), { wrapper });

    result.current.mutate("test-token");

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### Mocking API Calls

```typescript
vi.mock("api/generated/beyvra", () => ({
  beyvraProfileApi: {
    profile: vi.fn(async (token) => ({
      id: "123",
      email: "user@example.com",
    })),
  },
}));
```

---

## Best Practices

### ✅ DO

- Use proper types for all responses
- Log errors with endpoint context
- Handle both ApiError and unexpected errors
- Use pagination types for list endpoints
- Document all public API functions
- Test error paths in unit tests
- Use proper HTTP methods (GET, POST, etc.)
- Validate response data structure

### ❌ DON'T

- Use `any` types in API code
- Silently swallow errors
- Throw generic `Error` objects
- Ignore pagination in list responses
- Mix different error handling patterns
- Make API calls outside of hooks
- Trust unvalidated external data
- Hardcode API URLs (use endpoints.ts)

---

## Migration Guide

If updating existing code to follow new patterns:

1. Replace `fethXxx` with `fetchXxx`
2. Remove all `any` types
3. Add `logInternalError` calls
4. Ensure `ApiError` is thrown in catch blocks
5. Add JSDoc comments
6. Update unit tests

---

## Debugging

### Check Request Details

All requests include tracking headers:
- `X-Request-ID`: Unique request ID
- `Authorization`: Bearer token
- `Accept`: application/json

View in browser DevTools Network tab.

### Common Issues

| Issue | Solution |
|-------|----------|
| Type errors on response | Define proper interface for response |
| Lost error context | Add `logInternalError` call |
| Silent failures | Ensure proper error handling |
| Timeout errors | Increase `timeoutMs` if needed |
| Auth failures | Check token validity and expiration |

---

**Last Updated**: August 28, 2026
**API Version**: v1
**Status**: ✅ Production Ready
