# Development Workflow: IS-frontend

## Folder Structure
We follow a feature-based organization to ensure that related files are grouped together. The core directories are:
```text
src/
├── api/            # Axios instance and common API utilities
├── assets/         # Static assets (e.g., logo SVG)
├── components/     # Reusable UI elements (dataTable, header, footer, timetable, ui, userAvatar)
├── constants/      # Application constants (rooms, timetable)
├── hooks/          # Custom hooks for actions and API interactions
├── layouts/        # Page layout wrappers (MainLayout, AdminLayout, Sidebar)
├── pages/          # Full page components (home, login, register, admin/*, notFound)
├── routes/         # Application routing (AppRouter, ProtectedRoute)
├── services/       # API service modules (auth, group, room, subject, teacher, scheduleEvent, errorReport)
├── store/          # Zustand global state management
├── types/          # Centralized TypeScript interfaces and types
└── utils/          # Helper functions and formatting
```

## Branching Strategy
We recommend using a feature-based branching strategy:
- `main`: Production-ready code.
- `develop`: Ongoing development.
- `feature/*`: New functionalities.
- `bugfix/*`: Bug fixes.

## Coding Standards & Best Practices
- **TypeScript First**: Always use types for components, props, and states. Avoid using `any`.
- **CSS Modules**: Use `.module.css` for component-scoped styling to avoid global naming collisions.
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into custom hooks or utility functions.
- **Keep Components Small**: Break down large components into smaller, focused sub-components.

## Linting & Formatting
The project uses **ESLint** for code quality. Ensure you're running the linter frequently and fixing issues:
```bash
npm run lint
```
Pre-commit hooks (if configured) will run automatically.

## API Integration Workflow
When adding new endpoints:
1.  Define the request/response types in `src/types`.
2.  Use the `api` instance from `src/api/axiosInstance.ts`.
3.  Implement the data fetching logic within the relevant page or a custom hook.

## Testing Strategy
The project uses **Vitest** for unit testing. Tests are co-located alongside their source files (e.g., `authService.test.ts` alongside `authService.ts`).

### Running Tests
```bash
npm run test
```

### Current Test Coverage
- **Service Tests**: All API service modules (`authService`, `groupService`, `roomService`, `subjectService`, `teacherService`, `scheduleEventService`) have unit tests that mock Axios calls.
- **Component Tests**: `App.test.tsx` provides basic component rendering tests.

### Planned Additions
- **Component Testing**: Expanded tests with [React Testing Library](https://testing-library.com/).
- **E2E Testing**: [Cypress](https://www.cypress.io/) or [Playwright](https://playwright.dev/).
