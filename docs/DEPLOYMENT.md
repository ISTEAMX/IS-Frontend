# Build & Deployment: IS-frontend

## Build Process
The project uses **Vite** for optimized production builds. To generate the static assets, run:
```bash
npm run build
```
The output will be located in the `dist/` directory.

## Deployment Strategy
We deploy the application as a **Docker** container, serving the static assets through an **Nginx** web server.

### Dockerized Setup
The `Dockerfile` in the root directory performs a multi-stage build:
1.  **Build Stage**: Installs dependencies and runs `npm run build`.
2.  **Production Stage**: Uses a lightweight Nginx image to serve the `dist/` folder.

#### Running with Docker
To build and run the container locally:
```bash
docker build -t is-frontend .
docker run -p 80:80 is-frontend
```

### Nginx Configuration
The `nginx.conf` file is optimized for SPA routing:
- **Fallback to index.html**: Ensures that React Router can handle direct URL navigation.
- **Caching**: Configured to serve static assets with appropriate cache headers.

## CI/CD Pipeline
(Currently, a GitHub Actions-based CI/CD pipeline is under development.)
The planned pipeline will:
1.  **Build**: Run `npm install` and `npm run build`.
2.  **Lint**: Ensure code quality before deployment.
3.  **Push**: Upload the Docker image to a container registry.
4.  **Deploy**: Trigger a rollout to the production environment (e.g., AWS ECS, Kubernetes).

## Static Hosting (Alternative)
Since the application is a SPA, it can be hosted on any static hosting service:
- **Netlify**: Upload the `dist/` folder.
- **Vercel**: Link your GitHub repository.
- **AWS S3 + CloudFront**: For a robust, scalable production deployment.
