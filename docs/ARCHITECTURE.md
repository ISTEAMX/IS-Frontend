# Architecture: IS-frontend

## High-level Overview
IS-frontend is a modern Single-Page Application (SPA) built using **React 19** and **Vite**. The project is designed with a modular structure to ensure scalability, maintainability, and clear separation of concerns.

## Technical Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **API Client**: [Axios](https://axios-http.com/)
- **Form/Table Utilities**: [TanStack Table](https://tanstack.com/table/v8)

## Core Architectural Layers

### Component Interactions
The application's architecture is based on functional components and hooks. Hierarchically:
- **Layouts**: Global page structures (e.g., `AdminLayout`, `AuthLayout`).
- **Pages**: Top-level route components representing different views.
- **Store**: Global state management powered by Zustand for centralized data access.
- **Hooks**: Custom logic reusable across multiple components (e.g., data fetching, form handling).

### State Management (Zustand)
We use Zustand for its lightweight nature and simplicity. Typical stores include:
- `useAuthStore`: Manages user credentials and session status.
- `useAdminStore`: (Future) Handles cached data for administrative entities.

### Data Flow
1.  **User Action**: Component triggers an action or updates its local state.
2.  **API Call**: Triggers a service/API request via Axios (configured in `src/api/axiosInstance.ts`).
3.  **Global UI Update**: Updates relevant state in Zustand stores, which in turn triggers re-renders across the application.
4.  **Persistent Storage**: Auth tokens are stored in the terminal session or local storage (dependent on store implementation).

## Key Directory Structure
- `src/api`: Axios instance and common API utilities.
- `src/components`: Reusable UI elements (buttons, inputs, tables).
- `src/pages`: Feature-specific page components.
- `src/store`: Zustand state definitions.
- `src/types`: Centralized TypeScript interfaces and types.
- `src/utils`: Helper functions for date formatting, validation, etc.
