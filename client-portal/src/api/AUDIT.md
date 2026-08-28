# API Codebase Audit & Improvements

## 🔴 Critical Issues Found

### 1. **Naming Inconsistencies (Typos)**
- ❌ `fethLogin` → ✅ `fetchLogin`
- ❌ `fethProfile` → ✅ `fetchProfile`
- ❌ `fethRegister` → ✅ `fetchRegister`
- ❌ `fethRefreshToken` → ✅ `fetchRefreshToken`
- ❌ `fethWallet` → ✅ `fetchWallet`
- ❌ `withdrawWireTransferFetcher` → ✅ `fetchBankDetails`

**Files Affected**: 6 API hooks
**Impact**: Inconsistent naming, deprecated aliases

---

### 2. **Generic `any` Types Everywhere**
```typescript
// ❌ FOUND IN:
return useMutation<any, unknown, any>({...})
const result = await beyvraWalletApi.wallets(token) as any;
[index: string]: any;
```

**Files**: 10+ API hooks
**Impact**: Loss of type safety, IDE autocomplete unreliable

---

### 3. **Inconsistent Error Handling**
```typescript
// ❌ PATTERN 1: Silent error swallowing
catch (error) {
  throw new Error(error as string);  // Loses context
}

// ❌ PATTERN 2: Missing error context
onError: () => { }  // Empty handler

// ✅ PATTERN 3 (Only in auth): Proper handling
catch (error) {
  logInternalError(error, { endpoint: "auth.login" });
  toast.error(toUserSafeErrorText(error, "auth"));
  throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
}
```

**Impact**: Hard to debug production issues

---

### 4. **Missing Response Type Definitions**
```typescript
// ❌ BEFORE
return await beyvraWalletApi.wallets(token) as any;

// ✅ AFTER
interface WalletResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IWallet[];
}
return await beyvraWalletApi.wallets(token);  // Typed response
```

---

### 5. **Boilerplate-Heavy Hook Patterns**
Every hook repeats the same mutation setup code. Needs helper factory.

---

## 📊 Files to Fix

| File | Issues | Severity |
|------|--------|----------|
| `api/user/useLogin.ts` | Typo alias, good error handling ✓ | 🟡 Low |
| `api/user/useProfile.ts` | Typo, `any` types, no error handling | 🔴 High |
| `api/user/useRegister.ts` | Typo alias, good error handling ✓ | 🟡 Low |
| `api/user/useRefreshToken.ts` | Typo, `any` types, no error logging | 🔴 High |
| `api/wallet/useWallet.ts` | Typo, `any` types, generic Error throws | 🔴 High |
| `api/bank/useAdminBankDetails.ts` | Generic error handling, `any` types | 🔴 High |
| `api/marketData/useMarketData.ts` | Generic error handling, `any` types | 🔴 High |
| `api/trading/simulation.ts` | ✓ Good type definitions | 🟢 Good |

---

## ✅ Improvements Planned

1. **Create API Response Types** - `src/api/types.ts`
2. **Create Mutation Hook Factory** - `src/api/hooks/createMutationHook.ts`
3. **Standardize Error Handling** - Consistent with auth pattern
4. **Fix All Typos & Naming**
5. **Remove All `any` Types**
6. **Create API Documentation**

---

## Implementation Order

1. Create shared types and utilities
2. Fix user API hooks (auth critical path)
3. Fix wallet/bank hooks
4. Fix market data hooks
5. Add comprehensive tests

---

**Total Changes**: ~15 files
**Estimated Impact**: 40% less boilerplate, 100% type safe, much better error handling
