# IS-Frontend

This is the frontend for the ISTEAMX project, built with React.

## Running with Docker

The entire application stack can be run using Docker Compose from the `IS-DevOps` repository.

1. **Navigate to the `IS-DevOps` directory:**
   ```bash
   cd ../IS-DevOps
   ```

2. **Start the services:**
   ```bash
   docker-compose -f docker-compose/docker-compose.yml up -d --build
   ```

The frontend will be available at [http://localhost:80](http://localhost:80).
