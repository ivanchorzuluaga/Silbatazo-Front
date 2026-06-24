/**
 * Protege rutas del panel administrativo
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, type UserRole } from "@/lib/constants";
import { hasRoleAccess, getDashboardRoute } from "@/lib/routing";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectToDashboard?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectToDashboard = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRoleAccess(user?.role, allowedRoles)) {
      if (redirectToDashboard && user?.role) {
        const dashboardRoute = getDashboardRoute(user.role);
        return <Navigate to={dashboardRoute} replace />;
      }
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return <>{children}</>;
}
