# Troubleshooting & Debugging: IS-frontend

## Common Issues & Solutions

### 1. API Connection Failure
- **Error**: `ERR_CONNECTION_REFUSED` when fetching data.
- **Solution**: Ensure the `IS-backend` is running and accessible at the URL specified in your `.env.local` file (e.g., `VITE_API_URL=http://localhost:8080/api`).

### 2. Unauthorized (401) Error
- **Error**: Redirected to `/login` unexpectedly.
- **Solution**: Your JWT token may have expired. Log in again to refresh your session. If the issue persists, check if the backend is correctly verifying the `Authorization: Bearer <token>` header.

### 3. Environment Variables Not Working
- **Error**: `undefined` when accessing `import.meta.env.VITE_API_URL`.
- **Solution**: Restart the Vite development server after modifying `.env` files. Vite only loads environment variables on startup.

### 4. Build Failures (TypeScript)
- **Error**: `TS2322: Type 'string' is not assignable to type 'number'`.
- **Solution**: Ensure your component props and state match the defined TypeScript interfaces in `src/types`. Run `npm run build` locally to catch these errors before deployment.

## Debugging Techniques

### React Developer Tools
Use the [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbhfkeoomhpbbjdf) extension to:
- **Inspect Components**: View props and state in real-time.
- **Profiling**: Audit performance to identify unnecessary re-renders.

### Network Tab
Check the **Network** tab in your browser's inspect tool to:
- **Inspect Requests**: Verify request headers, payloads, and response data.
- **Debugging CORS**: Look for CORS-related errors if the frontend and backend are on different domains.

### Console Logging
While we strive for clean code, `console.log()` can still be a valuable tool for:
- **Tracing Logic**: Check the order of operations in hooks and components.
- **Inspecting State**: Log Zustand store updates for complex state transitions.
