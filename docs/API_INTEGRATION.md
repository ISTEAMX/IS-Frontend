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
import api from "@/api/axiosInstance";

export const getGroups = async () => {
    try {
        const response = await api.get("/groups");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch groups", error);
        throw error;
    }
};
```

## Authentication Mechanism
Authentication is handled via **JSON Web Tokens (JWT)**.
- **Login**: Sends credentials to `/login`. Upon success, the backend returns a JWT access token.
- **Storage**: The token is stored in the `useAuthStore` (powered by Zustand) and persisted in common storage.
- **Revocation**: Logout clears the token and redirects the user to the login screen.

## Endpoints Consumed
The frontend interacts with the following endpoint prefixes:
- `/api/groups`: Management of student cohorts.
- `/api/rooms`: Classroom and facility data.
- `/api/subjects`: Academic subject definitions.
- `/api/teachers`: Staff profiles and availability.
- `/api/auth`: Login, registration, and session management.

## Request/Response Formats
- **Content-Type**: `application/json` for both requests and responses.
- **Authentication**: `Bearer <JWT_TOKEN>` in the `Authorization` header.
- **Error Responses**: Expects standardized error objects from the backend (e.g., `{ message: "Invalid credentials", status: 401 }`).
