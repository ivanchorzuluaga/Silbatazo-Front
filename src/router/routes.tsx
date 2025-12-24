/**
 * Configuración de rutas de la aplicación
 */

import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "@/features/auth/pages/HomePage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ClienteDashboardPage } from "@/features/auth/pages/ClienteDashboardPage";
import { ArbitroDashboardPage } from "@/features/auth/pages/ArbitroDashboardPage";
import { AdminDashboardPage } from "@/features/auth/pages/AdminDashboardPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardRedirect } from "./DashboardRedirect";
import { ROUTES, USER_ROLES } from "@/lib/constants";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <LoginPage />, // El registro se maneja en el mismo componente
  },
  // Dashboard genérico (redirige según rol)
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardRedirect />
      </ProtectedRoute>
    ),
  },
  // Dashboard específico para clientes
  {
    path: ROUTES.CLIENTE_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
        <ClienteDashboardPage />
      </ProtectedRoute>
    ),
  },
  // Dashboard específico para árbitros
  {
    path: ROUTES.ARBITRO_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
        <ArbitroDashboardPage />
      </ProtectedRoute>
    ),
  },
  // Dashboard específico para administradores
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
]);
