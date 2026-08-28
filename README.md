# Beyvra Frontend - Client Portal

A modern React 19-based trading platform frontend built with TypeScript, Vite, and Redux Toolkit.

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ (see `.nvmrc`)
- npm or pnpm

### Installation

```bash
cd client-portal
npm install
```

### Development

```bash
npm run dev
# Starts dev server at http://localhost:8080
```

### Build

```bash
# Production build with all checks
npm run build

# Build with analysis
npm run build:analyze
```

## 📁 Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # React components
├── config/          # Configuration (env, features)
├── store/           # Redux store and slices
├── pages/           # Page components (public/private)
├── hooks/           # Custom React hooks
├── security/        # Authentication and security
├── utils/           # Utility functions
├── styles/          # Global styles
└── i18n/            # Internationalization
```

## 🔒 Security Features

- ✅ Secure JWT handling with backend validation
- ✅ HttpOnly cookies (enforced server-side)
- ✅ CSRF protection with SameSite=Strict
- ✅ 7-day session timeout for trading app
- ✅ XSS protection via React's default escaping
- ✅ Error Boundary for crash prevention

## 🧪 Testing

```bash
# Unit tests
npm run test:errors
npm run test:realtime
npm run test:chart

# E2E tests
npm run test:e2e

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix
```

## 📝 Environment Variables

### Required
None currently (all have sensible defaults)

### Optional
- `VITE_API_BASE_URL` - API base URL (default: `/api`)
- `VITE_SOCKET_BASE_URL` - WebSocket URL (default: auto-detect)

Create `.env.development` and `.env.production` files based on `.env.example`.

## 🔑 Key Technologies

- **React 19.2.7** - UI framework
- **TypeScript 5.2** - Type safety
- **Vite 8.2** - Build tool
- **Redux Toolkit 2.12** - State management
- **React Query 5.101** - Server state
- **Ant Design 5.21** - UI components
- **Socket.io** - Real-time updates
- **Playwright** - E2E testing
- **i18next** - Internationalization

## 🚨 Known Issues & TODOs

### Performance
- [ ] Chart lazy loading not yet optimized
- [ ] Bundle size ~450KB (need further analysis)
- [ ] Consider switching from echarts to recharts

### Code Quality
- [ ] Remove remaining `any` types (25+ instances)
- [ ] Add component snapshot tests
- [ ] Increase test coverage to >50%

## 🔄 Recent Improvements (v2026.08.28)

- ✅ Fixed global state mutation issue (timeout state)
- ✅ Improved JWT handling security
- ✅ Replaced moment.js with date-fns (lighter)
- ✅ Removed jQuery dependency
- ✅ Added ErrorBoundary component
- ✅ Added environment validation
- ✅ Multi-stage Dockerfile for production
- ✅ Improved ESLint configuration

## 🛠️ Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run build:analyze` | Build and analyze bundle |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run all tests |
| `npm run test:e2e` | Run Playwright E2E tests |

## 📊 Code Quality Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Warnings for unused vars, any types
- **Code Coverage**: Target >50% (currently ~20%)
- **Bundle Size**: Target <400KB gzipped

## 🐛 Reporting Issues

Found a bug? Please report with:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser/OS details
4. Console errors (if any)

## 📚 Additional Documentation

- [Security](./docs/SECURITY.md)
- [API Contract](./docs/CHART-ENGINE.md)
- [Contributing Guidelines](./DEPLOYMENT.md)
- [Error Handling](./docs/USER_SAFE_ERROR_AUDIT.md)

## 📄 License

Proprietary - All rights reserved
