import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types/Auth.types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, userData } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userData && !userData.passwordChanged) {
    return <Navigate to="/change-password" replace />;
  }

  if (
    allowedRoles &&
    userData &&
    !allowedRoles.includes(userData.role as UserRole)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
