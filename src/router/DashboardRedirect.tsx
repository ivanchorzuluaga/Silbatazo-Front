/**
 * Componente para redirigir al dashboard según el rol del usuario
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardRoute } from "@/lib/routing";

export function DashboardRedirect() {
  const { user } = useAuth();
  const dashboardRoute = getDashboardRoute(user?.role);
  return <Navigate to={dashboardRoute} replace />;
}

