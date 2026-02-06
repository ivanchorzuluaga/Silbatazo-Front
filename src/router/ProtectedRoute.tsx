/**
 * Componente para proteger rutas que requieren autenticación
 * Opcionalmente puede validar roles específicos
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, type UserRole } from "@/lib/constants";
import { hasRoleAccess, getDashboardRoute } from "@/lib/routing";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Roles permitidos para acceder a esta ruta
   * Si no se especifica, cualquier usuario autenticado puede acceder
   */
  allowedRoles?: UserRole[];
  /**
   * Si es true, redirige al dashboard del usuario si no tiene el rol correcto
   * Si es false, redirige al login
   * Por defecto: true
   */
  redirectToDashboard?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectToDashboard = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

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

  const email = user?.email?.trim();
  const isEmailVerified = !!user?.email_verificado;
  const emailVerificationAllowedPaths: string[] = [
    ROUTES.VERIFICAR_CORREO,
    ROUTES.ARBITRO_ONBOARDING,
    ROUTES.ARBITRO_PERFIL,
    ROUTES.CLIENTE_PERFIL,
  ];

  if (email && !isEmailVerified && !emailVerificationAllowedPaths.includes(location.pathname)) {
    return <Navigate to={ROUTES.VERIFICAR_CORREO} replace />;
  }

  // Si hay restricciones de rol, verificar acceso
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRoleAccess(user?.role, allowedRoles)) {
      // Si no tiene acceso, redirigir al dashboard del usuario o al login
      if (redirectToDashboard && user?.role) {
        const dashboardRoute = getDashboardRoute(user.role);
        return <Navigate to={dashboardRoute} replace />;
      }
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
  }

  return <>{children}</>;
}
