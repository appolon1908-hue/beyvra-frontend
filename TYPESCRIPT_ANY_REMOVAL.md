# TypeScript `any` Type Removal Guide

This guide helps developers fix the remaining `any` type violations in the codebase.

## Current Violations: 25+ instances

### Found In:
- [src/pages/private/platform/MainChart/AreaChart.tsx](src/pages/private/platform/MainChart/AreaChart.tsx)
- [src/pages/private/platform/MainChart/BarChart.tsx](src/pages/private/platform/MainChart/BarChart.tsx)
- [src/pages/private/platform/MainChart/index.tsx](src/pages/private/platform/MainChart/index.tsx)
- [src/pages/private/platform/platformMenus/cryptoPayments/CryptoPayments.tsx](src/pages/private/platform/platformMenus/cryptoPayments/CryptoPayments.tsx)
- And others...

## Priority Fixes

### 1. Chart Components (Highest Priority)
**Files to Fix**:
- `MainChart/index.tsx`
- `MainChart/AreaChart.tsx`
- `MainChart/BarChart.tsx`
- `MainChart/LineChart.tsx` (if exists)

**Pattern**:
```typescript
// ❌ BEFORE
const MainChart: React.FunctionComponent<any> = forwardRef(({ data, colors, type }, ref) => {
  // ...
});

// ✅ AFTER
interface MainChartProps {
  data: ChartDataPoint[];
  colors: ColorScheme;
  type: 'line' | 'area' | 'bar';
  chartScale?: number;
  refs?: React.Ref<ChartHandle>;
}

const MainChart = forwardRef<ChartHandle, MainChartProps>(
  ({ data, colors, type, chartScale, refs }, ref) => {
    // ...
  }
);
```

**Effort**: ~2 hours

---

### 2. Modal Components
**Files to Fix**:
- `platformMenus/cryptoPayments/CryptoPayments.tsx`
- `customModal/CustomModal.tsx`

**Pattern**:
```typescript
// ❌ BEFORE
isModalOpen: any;

// ✅ AFTER
isModalOpen: boolean;
```

**Effort**: ~1 hour

---

### 3. Error Handlers
**Pattern**:
```typescript
// ❌ BEFORE
onError: (error: any) => { ... }

// ✅ AFTER (Use discriminated unions)
onError: (error: ApiError | NetworkError) => { ... }

// Or use generics
onError: (error: Error) => { ... }
```

**Files**:
- `api/user/useRefreshToken.ts`
- `api/kyc/useKycInfo.ts`
- Other API hooks

**Effort**: ~2 hours

---

## Step-by-Step Fix Process

### 1. Identify the Type
```bash
# Find all 'any' usages
grep -r "any" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules
```

### 2. Analyze the Component
```typescript
// Look at actual usage
export const AreaChart = ({ chartData, liveLoading, bidOngoing, time, tradeType }: any) => {
  // What properties are actually used?
  console.log(chartData);      // What shape?
  console.log(liveLoading);    // boolean?
  console.log(bidOngoing);     // boolean?
  console.log(time);           // number?
  console.log(tradeType);      // string literal?
}
```

### 3. Create Proper Interface
```typescript
interface AreaChartProps {
  chartData: Array<{
    timestamp: number;
    value: number;
    high?: number;
    low?: number;
  }>;
  liveLoading?: boolean;
  bidOngoing?: boolean;
  time?: number;
  tradeType?: 'up' | 'down';
}

export const AreaChart: React.FC<AreaChartProps> = ({
  chartData,
  liveLoading = false,
  bidOngoing = false,
  time = 40,
  tradeType = "up"
}) => {
  // ...
}
```

### 4. Test
```bash
npm run typecheck
npm run lint
```

---

## Common Type Patterns

### API Response Types
```typescript
// ❌ DON'T
const data: any = await api.fetch(...);

// ✅ DO
interface UserResponse {
  id: string;
  email: string;
  profile: {
    name: string;
    avatar?: string;
  };
}

const data: UserResponse = await api.fetch(...);
```

### Event Handlers
```typescript
// ❌ DON'T
onChange={(e: any) => setValue(e.target.value)}

// ✅ DO
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
```

### Redux State
```typescript
// ❌ DON'T
const state: any = useSelector(state => state.user);

// ✅ DO
interface UserState {
  currentUser: User | null;
  loading: boolean;
  error?: string;
}

const state = useSelector((state: RootState) => state.user as UserState);
```

---

## Tools to Help

### TypeScript Strict Mode Checks
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### ESLint with TypeScript
```bash
npm run lint -- --fix
```

### Find and Replace (VS Code)
```regex
// Find
(\w+):\s*any

// Replace
$1: unknown  // Then refine manually
```

---

## Contribution Guide

### Before Submitting PR
1. ✅ Run `npm run typecheck`
2. ✅ Run `npm run lint --fix`
3. ✅ No new `any` types introduced
4. ✅ All affected components tested

### Commit Message
```
fix: remove 'any' types from MainChart components

- Typed MainChart props as ChartDataPoint[]
- Typed AreaChart with ColorScheme interface
- Typed BarChart with ChartHandle ref

Fixes #123
```

---

## Progress Tracking

Track fixes in a table:

| Component | Status | PR |
|-----------|--------|-----|
| MainChart/index.tsx | ⏳ TODO | - |
| MainChart/AreaChart.tsx | ⏳ TODO | - |
| MainChart/BarChart.tsx | ⏳ TODO | - |
| CryptoPayments.tsx | ⏳ TODO | - |
| ... | ... | ... |

---

## Resources

- [TypeScript Handbook - Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Effective TypeScript](https://www.oreilly.com/library/view/effective-typescript/9781492053736/)
- [React + TypeScript](https://www.typescriptlang.org/docs/handbook/react.html)

---

**Last Updated**: August 28, 2026
**Priority**: High - Part of code review fixes
**Estimated Total Time**: 5-8 hours
