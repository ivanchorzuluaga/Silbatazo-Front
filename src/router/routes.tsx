/**
 * Configuración de rutas de la aplicación
 */

import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardRedirect } from "./DashboardRedirect";
import { ROUTES, USER_ROLES } from "@/lib/constants";
import { SeoController } from "@/components/seo/SeoController";

const HomePage = lazy(() =>
  import("@/features/auth/pages/HomePage").then((m) => ({ default: m.HomePage }))
);
const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RecuperarContrasenaPage = lazy(() =>
  import("@/features/auth/pages/RecuperarContrasenaPage").then((m) => ({
    default: m.RecuperarContrasenaPage,
  }))
);
const RecuperarContrasenaConfirmPage = lazy(() =>
  import("@/features/auth/pages/RecuperarContrasenaConfirmPage").then((m) => ({
    default: m.RecuperarContrasenaConfirmPage,
  }))
);
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  }))
);
const LegalTerminosPage = lazy(() =>
  import("@/features/legal/pages/LegalTerminosPage").then((m) => ({
    default: m.LegalTerminosPage,
  }))
);
const LegalPrivacidadPage = lazy(() =>
  import("@/features/legal/pages/LegalPrivacidadPage").then((m) => ({
    default: m.LegalPrivacidadPage,
  }))
);
const LegalReembolsoPage = lazy(() =>
  import("@/features/legal/pages/LegalReembolsoPage").then((m) => ({
    default: m.LegalReembolsoPage,
  }))
);
const VerificarCorreoConfirmPage = lazy(() =>
  import("@/features/auth/pages/VerificarCorreoConfirmPage").then((m) => ({
    default: m.VerificarCorreoConfirmPage,
  }))
);
const VerificarCorreoPage = lazy(() =>
  import("@/features/auth/pages/VerificarCorreoPage").then((m) => ({
    default: m.VerificarCorreoPage,
  }))
);
const ClienteDashboardGuard = lazy(() =>
  import("@/features/cliente/components/ClienteDashboardGuard").then((m) => ({
    default: m.ClienteDashboardGuard,
  }))
);
const ClienteArbitrosPage = lazy(() =>
  import("@/features/cliente/pages/ClienteArbitrosPage").then((m) => ({
    default: m.ClienteArbitrosPage,
  }))
);
const ClienteArbitroDetailPage = lazy(() =>
  import("@/features/cliente/pages/ClienteArbitroDetailPage").then((m) => ({
    default: m.ClienteArbitroDetailPage,
  }))
);
const PerfilClientePage = lazy(() =>
  import("@/features/cliente/pages/PerfilClientePage").then((m) => ({
    default: m.PerfilClientePage,
  }))
);
const ArbitroDashboardGuard = lazy(() =>
  import("@/features/arbitro/components/ArbitroDashboardGuard").then((m) => ({
    default: m.ArbitroDashboardGuard,
  }))
);
const ArbitroOnboardingPage = lazy(() =>
  import("@/features/arbitro/pages/ArbitroOnboardingPage").then((m) => ({
    default: m.ArbitroOnboardingPage,
  }))
);
const ArbitroPartidosDisponiblesPage = lazy(() =>
  import("@/features/arbitro/pages/ArbitroPartidosDisponiblesPage").then((m) => ({
    default: m.ArbitroPartidosDisponiblesPage,
  }))
);
const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  }))
);
const FinanzasPage = lazy(() =>
  import("@/features/admin/pages/FinanzasPage").then((m) => ({
    default: m.FinanzasPage,
  }))
);
const PerfilArbitroPage = lazy(() =>
  import("@/features/arbitro/pages/PerfilArbitroPage").then((m) => ({
    default: m.PerfilArbitroPage,
  }))
);
const ArbitrosListPage = lazy(() =>
  import("@/features/marketplace/pages/ArbitrosListPage").then((m) => ({
    default: m.ArbitrosListPage,
  }))
);
const ArbitroDetailPage = lazy(() =>
  import("@/features/marketplace/pages/ArbitroDetailPage").then((m) => ({
    default: m.ArbitroDetailPage,
  }))
);
const VerificacionArbitrosPage = lazy(() =>
  import("@/features/admin/pages/VerificacionArbitrosPage").then((m) => ({
    default: m.VerificacionArbitrosPage,
  }))
);
const VerificarArbitroDetailPage = lazy(() =>
  import("@/features/admin/pages/VerificarArbitroDetailPage").then((m) => ({
    default: m.VerificarArbitroDetailPage,
  }))
);
const GestionArbitrosPage = lazy(() =>
  import("@/features/admin/pages/GestionArbitrosPage").then((m) => ({
    default: m.GestionArbitrosPage,
  }))
);
const GestionPartidosPage = lazy(() =>
  import("@/features/admin/pages/GestionPartidosPage").then((m) => ({
    default: m.GestionPartidosPage,
  }))
);
const AdminPartidoCreatePage = lazy(() =>
  import("@/features/admin/pages/AdminPartidoCreatePage").then((m) => ({
    default: m.AdminPartidoCreatePage,
  }))
);
const CategoriasPage = lazy(() =>
  import("@/features/admin/pages/CategoriasPage").then((m) => ({
    default: m.CategoriasPage,
  }))
);
const TiposPartidoPage = lazy(() =>
  import("@/features/admin/pages/TiposPartidoPage").then((m) => ({
    default: m.TiposPartidoPage,
  }))
);
const AsignacionPartidosPage = lazy(() =>
  import("@/features/admin/pages/AsignacionPartidosPage").then((m) => ({
    default: m.AsignacionPartidosPage,
  }))
);
const PartidosSolapadosPage = lazy(() =>
  import("@/features/admin/pages/PartidosSolapadosPage").then((m) => ({
    default: m.PartidosSolapadosPage,
  }))
);
const PagosPendientesPage = lazy(() =>
  import("@/features/admin/pages/PagosPendientesPage").then((m) => ({
    default: m.PagosPendientesPage,
  }))
);
const RetirosPage = lazy(() =>
  import("@/features/admin/pages/RetirosPage").then((m) => ({
    default: m.RetirosPage,
  }))
);
const EmailsOutboxPage = lazy(() =>
  import("@/features/admin/pages/EmailsOutboxPage").then((m) => ({
    default: m.EmailsOutboxPage,
  }))
);
const PartidosListPage = lazy(() =>
  import("@/features/partidos/pages/PartidosListPage").then((m) => ({
    default: m.PartidosListPage,
  }))
);
const PartidoCreatePage = lazy(() =>
  import("@/features/partidos/pages/PartidoCreatePage").then((m) => ({
    default: m.PartidoCreatePage,
  }))
);
const PartidoDetailPage = lazy(() =>
  import("@/features/partidos/pages/PartidoDetailPage").then((m) => ({
    default: m.PartidoDetailPage,
  }))
);
const PagoPartidoPage = lazy(() =>
  import("@/features/partidos/pages/PagoPartidoPage").then((m) => ({
    default: m.PagoPartidoPage,
  }))
);
const BilleteraPage = lazy(() =>
  import("@/features/arbitro/pages/BilleteraPage").then((m) => ({
    default: m.BilleteraPage,
  }))
);

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-muted-foreground">Cargando...</div>
    </div>
  );
}

function withSuspense(element: React.ReactElement) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

function RouteErrorFallback() {
  return (
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
  );
}

function SeoLayout() {
  return (
    <>
      <SeoController />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SeoLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: ROUTES.HOME,
        element: withSuspense(<HomePage />),
      },
      {
        path: ROUTES.ARBITROS,
        element: withSuspense(<ArbitrosListPage />),
      },
      {
        path: ROUTES.ARBITRO_DETALLE,
        element: withSuspense(<ArbitroDetailPage />),
      },
      {
        path: ROUTES.LOGIN,
        element: withSuspense(<LoginPage />),
      },
      {
        path: ROUTES.RECUPERAR_CONTRASENA,
        element: withSuspense(<RecuperarContrasenaPage />),
      },
      {
        path: ROUTES.RECUPERAR_CONTRASENA_CONFIRM,
        element: withSuspense(<RecuperarContrasenaConfirmPage />),
      },
      {
        path: ROUTES.VERIFICAR_CORREO,
        element: (
          <ProtectedRoute>
            {withSuspense(<VerificarCorreoPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.VERIFICAR_CORREO_CONFIRM,
        element: withSuspense(<VerificarCorreoConfirmPage />),
      },
      {
        path: ROUTES.REGISTER,
        element: withSuspense(<RegisterPage />),
      },
      {
        path: "/legal/terminos",
        element: withSuspense(<LegalTerminosPage />),
      },
      {
        path: "/legal/privacidad",
        element: withSuspense(<LegalPrivacidadPage />),
      },
      {
        path: "/legal/reembolso",
        element: withSuspense(<LegalReembolsoPage />),
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
            {withSuspense(<ClienteDashboardGuard />)}
          </ProtectedRoute>
        ),
      },
      // Perfil del cliente (completar nombre y email)
      {
        path: ROUTES.CLIENTE_PERFIL,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
            {withSuspense(<PerfilClientePage />)}
          </ProtectedRoute>
        ),
      },
      // Árbitros para clientes (con sidebar)
      {
        path: ROUTES.CLIENTE_ARBITROS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
            {withSuspense(<ClienteArbitrosPage />)}
          </ProtectedRoute>
        ),
      },
      // Detalle de árbitro para clientes (con sidebar)
      {
        path: ROUTES.CLIENTE_ARBITRO_DETALLE,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
            {withSuspense(<ClienteArbitroDetailPage />)}
          </ProtectedRoute>
        ),
      },
      // Dashboard específico para árbitros (redirige a onboarding si perfil incompleto)
      {
        path: ROUTES.ARBITRO_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
            {withSuspense(<ArbitroDashboardGuard />)}
          </ProtectedRoute>
        ),
      },
      // Onboarding para árbitros nuevos (perfil, foto, disponibilidad)
      {
        path: ROUTES.ARBITRO_ONBOARDING,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
            {withSuspense(<ArbitroOnboardingPage />)}
          </ProtectedRoute>
        ),
      },
      // Partidos disponibles para árbitros
      {
        path: ROUTES.ARBITRO_PARTIDOS_DISPONIBLES,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
            {withSuspense(<ArbitroPartidosDisponiblesPage />)}
          </ProtectedRoute>
        ),
      },
      // Perfil de árbitro
      {
        path: ROUTES.ARBITRO_PERFIL,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
            {withSuspense(<PerfilArbitroPage />)}
          </ProtectedRoute>
        ),
      },
      // Billetera de árbitro
      {
        path: ROUTES.ARBITRO_BILLETERA,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ARBITRO]}>
            {withSuspense(<BilleteraPage />)}
          </ProtectedRoute>
        ),
      },
      // Dashboard específico para administradores
      {
        path: ROUTES.ADMIN_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<AdminDashboardPage />)}
          </ProtectedRoute>
        ),
      },
      // Panel de verificación de árbitros (admin)
      {
        path: ROUTES.ADMIN_VERIFICACION,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<VerificacionArbitrosPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_VERIFICAR_ARBITRO,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<VerificarArbitroDetailPage />)}
          </ProtectedRoute>
        ),
      },
      // Gestión completa de árbitros (admin)
      {
        path: ROUTES.ADMIN_GESTION_ARBITROS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<GestionArbitrosPage />)}
          </ProtectedRoute>
        ),
      },
      // Gestión de partidos (admin)
      {
        path: ROUTES.ADMIN_GESTION_PARTIDOS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<GestionPartidosPage />)}
          </ProtectedRoute>
        ),
      },
      // Crear partido abierto (admin)
      {
        path: ROUTES.ADMIN_PARTIDOS_CREAR,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<AdminPartidoCreatePage />)}
          </ProtectedRoute>
        ),
      },
      // Gestión de categorías (admin)
      {
        path: ROUTES.ADMIN_CATEGORIAS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<CategoriasPage />)}
          </ProtectedRoute>
        ),
      },
      // Tipos de partido (admin)
      {
        path: ROUTES.ADMIN_TIPOS_PARTIDO,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<TiposPartidoPage />)}
          </ProtectedRoute>
        ),
      },
      // Asignación de árbitros a partidos (admin)
      {
        path: ROUTES.ADMIN_ASIGNACION_PARTIDOS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<AsignacionPartidosPage />)}
          </ProtectedRoute>
        ),
      },
      // Partidos solapados (admin)
      {
        path: ROUTES.ADMIN_PARTIDOS_SOLAPADOS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<PartidosSolapadosPage />)}
          </ProtectedRoute>
        ),
      },
      // Pagos pendientes (admin)
      {
        path: ROUTES.ADMIN_PAGOS_PENDIENTES,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<PagosPendientesPage />)}
          </ProtectedRoute>
        ),
      },
      // Finanzas (admin)
      {
        path: ROUTES.ADMIN_FINANZAS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<FinanzasPage />)}
          </ProtectedRoute>
        ),
      },
      // Gestión de retiros (admin)
      {
        path: ROUTES.ADMIN_RETIROS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<RetirosPage />)}
          </ProtectedRoute>
        ),
      },
      // Correos fallidos (admin)
      {
        path: ROUTES.ADMIN_EMAILS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<EmailsOutboxPage />)}
          </ProtectedRoute>
        ),
      },
      // Partidos - Lista (requiere autenticación)
      {
        path: ROUTES.PARTIDOS,
        element: (
          <ProtectedRoute>
            {withSuspense(<PartidosListPage />)}
          </ProtectedRoute>
        ),
      },
      // Partidos - Crear (solo clientes)
      {
        path: ROUTES.PARTIDOS_CREAR,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
            {withSuspense(<PartidoCreatePage />)}
          </ProtectedRoute>
        ),
      },
      // Partidos - Detalle (requiere autenticación)
      {
        path: ROUTES.PARTIDO_DETALLE,
        element: (
          <ProtectedRoute>
            {withSuspense(<PartidoDetailPage />)}
          </ProtectedRoute>
        ),
      },
      // Partidos - Pago (solo clientes)
      {
        path: ROUTES.PARTIDO_PAGO,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
            {withSuspense(<PagoPartidoPage />)}
          </ProtectedRoute>
        ),
      },
      // Páginas legales (públicas)
    ],
  },
]);
