# Nexom Client Code Restructuring Documentation

This document outlines the structural changes made to the `client` directory of the Nexom project. The goal of this refactoring was to align the codebase with industry-level standards, improving maintainability, scalability, and organization.

## Key Changes

### 1. Feature-Based Architecture
The application is now organized by features, co-locating related components, services, and context. Each feature uses a central `index.ts` for clean exports.
- `src/features/auth/`: Contains authentication-related logic, including services and context.
- `src/features/booking/`: Contains the booking wizard and related components.
- `src/features/contact/`: Contains contact-related logic and services.

### 2. Centralized Configuration
Environment variables and application-wide configurations are now managed centrally.
- `src/config/env.config.ts`: Centralized environment variable management.
- `src/lib/api/apiClient.ts`: A centralized Axios instance with request/response interceptors for consistent API interaction and authentication handling.

### 3. Type Safety
Extensive use of TypeScript interfaces and types, organized in a dedicated directory.
- `src/types/`: Contains type definitions for authentication, services, bookings, contact, and common types.
- `src/types/index.ts`: Centralized export point for all types.

### 4. Constants Management
Hardcoded strings for routes, API endpoints, and storage keys have been moved to a centralized location.
- `src/constants/app.constants.ts`: Contains app-wide constants like `APP_NAME`, `STORAGE_KEYS`, `API_ENDPOINTS`, and `ROUTES`.
- `src/constants/booking.constants.ts`: Contains booking-specific constants like `TIME_SLOTS`.
- `src/constants/index.ts`: Centralized export point for all constants.

### 5. Custom Hooks
Reusable logic has been extracted into custom hooks.
- `src/hooks/useServicesData.ts`: Manages fetching and augmenting service data.
- `src/hooks/useScrollToTop.ts`: Handles automatic scroll-to-top behavior on route changes.
- `src/hooks/useQuery.ts`: Simplifies URL query parameter parsing.
- `src/hooks/index.ts`: Centralized export point for all hooks.

### 6. Layout Abstraction
Page structures are now managed through reusable layout components.
- `src/layouts/MainLayout.tsx`: Encapsulates common layout elements (Navbar, Footer) and integrates the `useScrollToTop` hook.
- `src/layouts/index.ts`: Centralized export point for all layouts.

### 7. Utilities
Common utility functions are grouped by functionality.
- `src/utils/storage.utils.ts`: Helpers for `localStorage` management.
- `src/utils/validation.utils.ts`: Form validation functions.
- `src/utils/format.utils.ts`: Data formatting helpers (currency, date, text).
- `src/utils/index.ts`: Centralized export point for all utilities.

### 8. Improved Imports and Path Aliases
Configured path aliases to support cleaner and more maintainable imports using the `@/` prefix.
- Updated `tsconfig.app.json` and `vite.config.ts` to support `@/` aliases pointing to the `src` directory.

### 9. Code Cleanup
- Removed redundant files and directories (`src/services/`, `src/context/`, `src/components/ScrollToTop.tsx`).
- Updated all components and pages to use the new structure, constants, and utilities.
- Replaced hardcoded currency symbols with the `formatCurrency` utility.
- Replaced hardcoded routes with the `ROUTES` constant.

## Benefits
- **Maintainability**: Easier to locate and update code related to specific features.
- **Scalability**: New features can be added following the established pattern.
- **Consistency**: Centralized constants and utilities ensure a uniform approach across the application.
- **Type Safety**: Reduced risk of runtime errors through comprehensive type definitions.
- **Readability**: Cleaner imports and better organization improve code readability.
