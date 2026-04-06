# Development Workflow: IS-frontend

## Folder Structure
We follow a feature-based organization to ensure that related files are grouped together. The core directories are:
```text
src/
├── api/            # API instance and service definitions
├── components/     # Reusable UI elements
├── hooks/          # Custom hooks for logic and state
├── pages/          # Full page components
├── store/          # Zustand global state management
├── types/          # Centralized TypeScript types
├── utils/          # Helper functions and formatting
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

## Testing Strategy (Future Work)
Currently, the project does not have automated tests. Planned additions include:
- **Unit Testing**: [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/).
- **Component Testing**: [React Testing Library](https://testing-library.com/).
- **E2E Testing**: [Cypress](https://www.cypress.io/) or [Playwright](https://playwright.dev/).
