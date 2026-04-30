# Build & Deployment: IS-Frontend

## Build Process
The project uses **Vite 7** for optimized production builds. To generate the static assets, run:
```bash
npm run build
```
The output will be located in the `dist/` directory.

## Deployment Strategy

### Production: AWS S3 Static Website Hosting
The frontend is deployed as a **static SPA** to an **AWS S3 bucket** configured for website hosting. The deployment is automated via GitHub Actions.

### Local Docker: Nginx
For local Docker testing, the `Dockerfile` performs a multi-stage build:
1.  **Build Stage**: Uses Node.js 22 Alpine to install dependencies and run `npm run build`.
2.  **Production Stage**: Uses Nginx Alpine to serve the `dist/` folder.

#### Running with Docker (Local)
```bash
docker build -t is-frontend .
docker run -p 80:80 is-frontend
```

### Nginx Configuration
The `nginx.conf` is optimized for SPA routing and security:
- **Fallback to index.html**: Ensures React Router handles all client-side routes.
- **Security Headers**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`.
- **API Proxy**: Routes `/api/` requests to the backend container (Docker Compose only).
- **Static Asset Caching**: CSS, JS, fonts, and images cached for 1 year with `immutable`.

## CI/CD Pipeline (GitHub Actions)

The frontend uses a fully automated CI/CD pipeline via reusable workflows in `IS-DevOps`:

### Build Pipeline (on push/PR to `main`)
**Workflow**: `build.yml` → calls `IS-DevOps/continuous-build-frontend.yml`
1. **Install**: `npm ci` (Node.js 22)
2. **Lint**: `npm run lint` (ESLint with TypeScript and React Hooks plugins)
3. **Test**: `npm run test` (Vitest with jsdom)
4. **Build**: `npm run build`
5. **Artifact Upload**: Build output uploaded for 7 days
6. **Docker Build**: Validates the Dockerfile builds successfully

### Release Pipeline (on push to `main`)
**Workflow**: `release.yml` → calls `IS-DevOps/continuous-release-frontend.yml`
1. Reads current version from `package.json`
2. Calculates next semantic version (patch by default)
3. Creates a git tag (e.g., `v1.0.16`)
4. Bumps version in `package.json`
5. Creates a GitHub Release

### Deploy Pipeline (manual trigger)
**Workflow**: `deploy.yml` → calls `IS-DevOps/continuous-deployment-frontend.yml`
1. **Install & Lint**: `npm ci` + `npm run lint`
2. **Build**: `npm run build` with `VITE_API_URL=http://35.158.14.254:8080`
3. **Deploy to S3**: `aws s3 sync dist/ s3://isteamx-unisync --delete`

The frontend is immediately available at the S3 website endpoint after deployment.

## ESLint Configuration
The project uses ESLint 9 with flat config (`eslint.config.js`):
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` (with `set-state-in-effect` and `incompatible-library` disabled)
- `eslint-plugin-react-refresh` for Vite HMR
