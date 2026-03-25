# IS-Frontend

The frontend for the ISTEAMX project, built with **React 19**, **TypeScript**, and **Vite**.

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 7
- **Routing:** React Router 7
- **HTTP Client:** Axios
- **Styling:** CSS Modules

---

## Running with Docker (Local Development)

The entire application stack (backend, frontend, database) can be run using Docker Compose from the `IS-DevOps` repository. See the [IS-DevOps README](../IS-DevOps/README.md) for instructions.

```bash
# From the IS-DevOps/ directory
docker-compose -f docker-compose/docker-compose.yml up --build -d
```

The frontend will be available at [http://localhost:80](http://localhost:80) (served via Nginx).

---

## Running Locally (Dev Server)

For a faster development experience with hot-reload:

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+ recommended)
- npm

### Install Dependencies

```bash
npm install
```

### Start the Dev Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Other Commands

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm run build` | Build for production           |
| `npm run lint`  | Run ESLint                     |
| `npm run preview` | Preview the production build |

---

## AWS Deployment

In production, the frontend is built locally and deployed as a static site to an **S3 bucket** with website hosting enabled.

```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist s3://isteamx-frontend-bucket-for-devops
```

The site is served at the S3 website endpoint. See the [IS-DevOps README](../IS-DevOps/README.md) for full deployment instructions.

| Resource | Details                                    |
|----------|--------------------------------------------|
| S3 Bucket | `isteamx-unisync`                        |
| Region    | `eu-central-1`                            |
