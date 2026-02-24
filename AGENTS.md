# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Nexom is a home cleaning services platform with a microservices backend (Node.js/Express/TypeScript/MongoDB) and a React frontend (Vite/TypeScript/TailwindCSS). Authentication uses Firebase on the client side, with the backend verifying Firebase ID tokens and issuing local JWTs for inter-service authorization.

## Commands

### Backend (all services)

```bash
# Install all service dependencies
cd server && npm install && npm run install-all

# Run all microservices concurrently (auth:8081, catalog:8082, contact:8083, payment:8084, booking:8085)
cd server && npm run dev

# Run a single service
cd server/<service-name> && npm run dev

# Build a single service
cd server/<service-name> && npm run build

# Build all services
cd server && npm run build-all
```

### Frontend

```bash
cd client && npm install
cd client && npm run dev       # Dev server on port 5173
cd client && npm run build     # TypeScript check + Vite build
cd client && npm run lint      # ESLint
cd client && npm run preview   # Preview production build
```

### Generating a test Firebase token

```bash
node get_test_token.js
```

## Architecture

### Backend — Microservices

Each service lives under `server/<service-name>/` with its own `package.json`, `tsconfig.json`, and `src/` directory. Services follow a consistent internal layout:

```
src/
  config/config.ts      — env loading (dotenv) and exported config object
  controllers/          — Express route handlers
  middleware/           — auth middleware, error converters
  models/ (or database/)— Mongoose schemas
  routes/               — Express routers
  services/             — business logic
  utils/                — ApiError class, helpers
  server.ts             — entry point (connects DB, starts Express)
```

**Shared code** lives in `server/common/`:
- `db/connection.ts` — `connectDB(mongooseInstance, mongoUri)` accepts a Mongoose instance and URI via dependency injection. This pattern exists to avoid duplicate Mongoose instance issues in the non-workspace monorepo layout. Every service must pass its own local `mongoose` import and its config's `MONGO_URI` when calling `connectDB`.

**Service communication:**
- Payment → Booking: direct HTTP calls (axios) to update booking status after payment verification.

**Authentication flow:**
1. Client authenticates via Firebase (Google sign-in or email/password).
2. Client sends the Firebase ID token to `POST /api/v1/auth/firebase-login`.
3. Auth service verifies the token with Firebase Admin SDK, upserts the user in MongoDB, and returns a local JWT.
4. Other services verify the JWT via their own `auth.middleware.ts` using a shared `JWT_SECRET`.

**Environment variables:**
- Each service has its own `.env` file. In development, `service-catalog` loads shared config (`MONGO_URI`, `JWT_SECRET`) from `auth-service/.env` first, then overrides with its own `.env`.
- The `NODE_ENV` variable controls dotenv loading — in production, env vars are expected to be set externally.

**Error handling pattern:**
- Services use a custom `ApiError` class thrown in controllers/services.
- `errorConverter` middleware normalizes errors to `ApiError`.
- `errorHandler` middleware sends the response with the correct HTTP status code.

### Frontend — React SPA

The client uses a **feature-based architecture** with path alias `@/` → `src/`.

Key structural conventions:
- **`src/features/<feature>/`** — co-located components, services, context, and types. Each feature exports through `index.ts`.
  - `auth/` — `AuthContext` (React context + provider), `auth.service.ts` (API calls)
  - `booking/` — multi-step booking wizard (`BookService.tsx`)
  - `admin/`, `contact/`, `sp/` — other feature modules
- **`src/lib/api/apiClient.ts`** — singleton `ApiClient` class wrapping axios with auto-attached JWT from `localStorage('token')` and global error toasting via `react-hot-toast`. 401 responses trigger logout and redirect to `/login`.
- **`src/config/env.config.ts`** — all `VITE_*` env vars centralized in `ENV_CONFIG`.
- **`src/constants/`** — `ROUTES`, `API_ENDPOINTS`, `STORAGE_KEYS`, `APP_CONSTANTS`, `TIME_SLOTS`.
- **`src/types/`** — shared TypeScript interfaces per domain (`auth.types.ts`, `booking.types.ts`, etc.).
- **`src/hooks/`** — `useServicesData`, `useScrollToTop`, `useQuery`.
- **`src/layouts/MainLayout.tsx`** — wraps pages with Navbar + Footer.
- **`src/contexts/ThemeContext.tsx`** — dark/light mode toggle, persisted to `localStorage`.

**Provider hierarchy** (in `App.tsx`): `ThemeProvider` → `Router` → `AuthProvider` → `Toaster` → `MainLayout` → `Routes`.

**Styling:** TailwindCSS with CSS custom properties for theming. Gold accent color `#d4af37` is used throughout. Currency displayed in INR (₹).

## Conventions

- **Commits:** Conventional Commits format: `<type>(<scope>): <subject>`. Scopes include `auth-service`, `service-catalog`, `booking-service`, `payment-service`, `contact-service`, `common`, `client`. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`. A commit template is available at `.gitmessage`.
- **Branching:** Git Flow — `main` (production), `develop` (integration), `feature/*`, `bugfix/*`, `hotfix/*`, `release/*`.
- **TypeScript:** Strict mode enabled on both client and server. Client uses `noUnusedLocals` and `noUnusedParameters`.
- **Backend response shape:** `{ status: <number>, message: <string>, data?: <any> }` with matching HTTP status codes.
- **Path aliases:** Client uses `@/` for `src/`. Server auth-service uses `@common/*` for `../common/*`.
- **Extending Express Request:** done via `declare global { namespace Express { interface Request { ... } } }` in middleware files (not separate `.d.ts`).
