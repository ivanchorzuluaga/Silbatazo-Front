/**
 * Configuración de rutas de la aplicación
 */

import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "@/features/auth/pages/HomePage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ClienteDashboardGuard } from "@/features/cliente/components/ClienteDashboardGuard";
import { ClienteArbitrosPage } from "@/features/cliente/pages/ClienteArbitrosPage";
import { ClienteArbitroDetailPage } from "@/features/cliente/pages/ClienteArbitroDetailPage";
import { PerfilClientePage } from "@/features/cliente/pages/PerfilClientePage";
import { ArbitroDashboardGuard } from "@/features/arbitro/components/ArbitroDashboardGuard";
import { ArbitroOnboardingPage } from "@/features/arbitro/pages/ArbitroOnboardingPage";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { PerfilArbitroPage } from "@/features/arbitro/pages/PerfilArbitroPage";
import { ArbitrosListPage } from "@/features/marketplace/pages/ArbitrosListPage";
import { ArbitroDetailPage } from "@/features/marketplace/pages/ArbitroDetailPage";
import { VerificacionArbitrosPage } from "@/features/admin/pages/VerificacionArbitrosPage";
import { VerificarArbitroDetailPage } from "@/features/admin/pages/VerificarArbitroDetailPage";
import { GestionArbitrosPage } from "@/features/admin/pages/GestionArbitrosPage";
import { GestionPartidosPage } from "@/features/admin/pages/GestionPartidosPage";
import { CategoriasPage } from "@/features/admin/pages/CategoriasPage";
import { TiposPartidoPage } from "@/features/admin/pages/TiposPartidoPage";
import { AsignacionPartidosPage } from "@/features/admin/pages/AsignacionPartidosPage";
import { PartidosSolapadosPage } from "@/features/admin/pages/PartidosSolapadosPage";
import { PagosPendientesPage } from "@/features/admin/pages/PagosPendientesPage";
import { RetirosPage } from "@/features/admin/pages/RetirosPage";
import { PartidosListPage } from "@/features/partidos/pages/PartidosListPage";
import { PartidoCreatePage } from "@/features/partidos/pages/PartidoCreatePage";
import { PartidoDetailPage } from "@/features/partidos/pages/PartidoDetailPage";
import { PagoPartidoPage } from "@/features/partidos/pages/PagoPartidoPage";
import { BilleteraPage } from "@/features/arbitro/pages/BilleteraPage";
import {
  TerminosCondicionesPage,
  PoliticaPrivacidadPage,
  PoliticaReembolsoPage,
} from "@/features/legal";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardRedirect } from "./DashboardRedirect";
import { ROUTES, USER_ROLES } from "@/lib/constants";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    errorElement: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al cargar la página</h1>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Recargar
          </button>
        </div>
      </div>
    ),
  },
  {
    path: ROUTES.ARBITROS,
    element: <ArbitrosListPage />,
  },
  {
    path: ROUTES.ARBITRO_DETALLE,
    element: <ArbitroDetailPage />,
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
  // Dashboard específico para clientes (redirige a perfil si no está completo)
  {
    path: ROUTES.CLIENTE_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
        <ClienteDashboardGuard />
      </ProtectedRoute>
    ),
  },
  // Perfil del cliente (completar nombre y email)
  {
    path: ROUTES.CLIENTE_PERFIL,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
        <PerfilClientePage />
      </ProtectedRoute>
    ),
  },
  // Árbitros para clientes (con sidebar)
  {
    path: ROUTES.CLIENTE_ARBITROS,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
        <ClienteArbitrosPage />
      </ProtectedRoute>
    ),
  },
  // Detalle de árbitro para clientes (con sidebar)
  {
    path: ROUTES.CLIENTE_ARBITRO_DETALLE,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
        <ClienteArbitroDetailPage />
      </ProtectedRoute>
    ),
  },
  // Dashboard específico para árbitros (redirige a onboarding si perfil incompleto)
  {
    path: ROUTES.ARBITRO_DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
        <ArbitroDashboardGuard />
      </ProtectedRoute>
    ),
  },
  // Onboarding para árbitros nuevos (perfil, foto, disponibilidad)
  {
    path: ROUTES.ARBITRO_ONBOARDING,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
        <ArbitroOnboardingPage />
      </ProtectedRoute>
    ),
  },
  // Perfil de árbitro
  {
    path: ROUTES.ARBITRO_PERFIL,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
        <PerfilArbitroPage />
      </ProtectedRoute>
    ),
  },
  // Billetera de árbitro
  {
    path: ROUTES.ARBITRO_BILLETERA,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
        <BilleteraPage />
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
  // Panel de verificación de árbitros (admin)
  {
    path: ROUTES.ADMIN_VERIFICACION,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <VerificacionArbitrosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_VERIFICAR_ARBITRO,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <VerificarArbitroDetailPage />
      </ProtectedRoute>
    ),
  },
  // Gestión completa de árbitros (admin)
  {
    path: ROUTES.ADMIN_GESTION_ARBITROS,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <GestionArbitrosPage />
      </ProtectedRoute>
    ),
  },
  // Gestión de partidos (admin)
  {
    path: ROUTES.ADMIN_GESTION_PARTIDOS,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <GestionPartidosPage />
      </ProtectedRoute>
    ),
  },
  // Gestión de categorías (admin)
  {
    path: ROUTES.ADMIN_CATEGORIAS,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <CategoriasPage />
      </ProtectedRoute>
    ),
  },
  // Tipos de partido (admin)
  {
    path: ROUTES.ADMIN_TIPOS_PARTIDO,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <TiposPartidoPage />
      </ProtectedRoute>
    ),
  },
  // Asignación de árbitros a partidos (admin)
  {
    path: ROUTES.ADMIN_ASIGNACION_PARTIDOS,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <AsignacionPartidosPage />
      </ProtectedRoute>
    ),
  },
  // Partidos solapados (admin)
  {
    path: ROUTES.ADMIN_PARTIDOS_SOLAPADOS,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <PartidosSolapadosPage />
      </ProtectedRoute>
    ),
  },
  // Pagos pendientes (admin)
  {
    path: ROUTES.ADMIN_PAGOS_PENDIENTES,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <PagosPendientesPage />
      </ProtectedRoute>
    ),
  },
  // Gestión de retiros (admin)
  {
    path: ROUTES.ADMIN_RETIROS,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <RetirosPage />
      </ProtectedRoute>
    ),
  },
  // Partidos - Lista (requiere autenticación)
  {
    path: ROUTES.PARTIDOS,
    element: (
      <ProtectedRoute>
        <PartidosListPage />
      </ProtectedRoute>
    ),
  },
  // Partidos - Crear (solo clientes)
  {
    path: ROUTES.PARTIDOS_CREAR,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
        <PartidoCreatePage />
      </ProtectedRoute>
    ),
  },
  // Partidos - Detalle (requiere autenticación)
  {
    path: ROUTES.PARTIDO_DETALLE,
    element: (
      <ProtectedRoute>
        <PartidoDetailPage />
      </ProtectedRoute>
    ),
  },
  // Partidos - Pago (solo clientes)
  {
    path: ROUTES.PARTIDO_PAGO,
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
        <PagoPartidoPage />
      </ProtectedRoute>
    ),
  },
  // Páginas legales (públicas)
  {
    path: ROUTES.TERMINOS,
    element: <TerminosCondicionesPage />,
  },
  {
    path: ROUTES.PRIVACIDAD,
    element: <PoliticaPrivacidadPage />,
  },
  {
    path: ROUTES.REEMBOLSO,
    element: <PoliticaReembolsoPage />,
  },
]);
