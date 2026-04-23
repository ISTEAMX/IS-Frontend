# API Integration: IS-frontend

## Service Configuration
The application uses **Axios** for all HTTP requests to the backend API. The configuration is centralized in `src/api/axiosInstance.ts`.

### Axios Instance Setup
- **Base URL**: Set via the `VITE_API_URL` environment variable.
- **Interceptors**: 
  - **Request**: Automatically adds the `Authorization: Bearer <token>` header to all outgoing requests if a token exists in the `useAuthStore`.
  - **Response**: Handles global errors, specifically 401 (Unauthorized), by logging out the user and redirecting them to the `/login` page.

### Example Request
```typescript
import api, { type CustomConfig } from "@/api/axiosInstance";
import type { Group } from "@/types/Group.types";

export const groupService = {
  getAll: async () => {
    const response = await api.get<Group[]>("/group/user/groups", {
      noAuth: true,
    } as CustomConfig);
    return response.data;
  },
};
```

## Authentication Mechanism
Authentication is handled via **JSON Web Tokens (JWT)**.
- **Login**: Sends credentials to `/api/user/login`. Upon success, the backend returns a JWT access token and user data (`ResponseLoginDTO`).
- **Storage**: The token is stored in the `useAuthStore` (powered by Zustand) and persisted via Zustand's persistence middleware.
- **Revocation**: Logout clears the token and redirects the user to the login screen.
- **noAuth Requests**: Public endpoints (e.g., fetching rooms, groups) use `{ noAuth: true }` in the Axios config to skip the Authorization header.

## Endpoints Consumed
The frontend interacts with the following backend endpoint prefixes:
- `/api/user`: Authentication — login (`POST /user/login`) and registration (`POST /user/register`).
- `/api/group`: Management of student cohorts (`/group/user/groups`, `/group/create`, `/group/update`, `/group/delete/{id}`).
- `/api/room`: Classroom and facility data (`/room/user/rooms`, `/room/create`, `/room/update`, `/room/delete/{id}`).
- `/api/subject`: Academic subject definitions (`/subject/user`, `/subject/create`, `/subject/update`, `/subject/delete/{id}`).
- `/api/professor`: Teacher/professor profiles (`/professor/user`, `PUT /professor`, `DELETE /professor/{id}`).
- `/api/schedule`: Schedule entries and filtering (`/schedule/user`, `/schedule/user/filter`, `/schedule/add`, `/schedule/update`, `/schedule/delete/{id}`).
- `/api/monitoring`: Frontend error reporting (`POST /monitoring/error`).

## Request/Response Formats
- **Content-Type**: `application/json` for both requests and responses.
- **Authentication**: `Bearer <JWT_TOKEN>` in the `Authorization` header.
- **Error Responses**: Expects standardized error objects from the backend (e.g., `{ message: "Invalid credentials", status: 401 }`).
