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

In production, the frontend is deployed as a static website to an **AWS S3 bucket**. It communicates with the backend EC2 server via the `VITE_API_BASE_URL` defined in `.env.production`.

```bash
# 1. Update .env.production with the active backend IP
# VITE_API_BASE_URL=http://35.158.14.254:8080

# 2. Build the production application
npm run build

# 3. Deploy to S3
aws s3 sync dist s3://isteamx-unisync
```

| Resource | Details                                    |
|----------|--------------------------------------------|
| S3 Bucket | `isteamx-unisync`                        |
| Region    | `eu-central-1`                            |

### AWS Cost Management (Power Scheduler)
Need to pause the infrastructure to save money? See the **AWS Power Scheduler** feature documented in the [IS-DevOps README](../IS-DevOps/README.md) to safely start and stop the backend servers without losing data.
