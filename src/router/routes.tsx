/**
 * Configuración de rutas: landing pública + panel admin
 */

import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROUTES, USER_ROLES } from "@/lib/constants";
import { SeoController } from "@/components/seo/SeoController";

const HomePage = lazy(() =>
  import("@/features/auth/pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const LegalTerminosPage = lazy(() =>
  import("@/features/legal/pages/LegalTerminosPage").then((m) => ({
    default: m.LegalTerminosPage,
  })),
);
const LegalPrivacidadPage = lazy(() =>
  import("@/features/legal/pages/LegalPrivacidadPage").then((m) => ({
    default: m.LegalPrivacidadPage,
  })),
);
const LegalReembolsoPage = lazy(() =>
  import("@/features/legal/pages/LegalReembolsoPage").then((m) => ({
    default: m.LegalReembolsoPage,
  })),
);
const ArbitrosListPage = lazy(() =>
  import("@/features/marketplace/pages/ArbitrosListPage").then((m) => ({
    default: m.ArbitrosListPage,
  })),
);
const ArbitroDetailPage = lazy(() =>
  import("@/features/marketplace/pages/ArbitroDetailPage").then((m) => ({
    default: m.ArbitroDetailPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import("@/features/admin/pages/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const FinanzasPage = lazy(() =>
  import("@/features/admin/pages/FinanzasPage").then((m) => ({
    default: m.FinanzasPage,
  })),
);
const VerificacionArbitrosPage = lazy(() =>
  import("@/features/admin/pages/VerificacionArbitrosPage").then((m) => ({
    default: m.VerificacionArbitrosPage,
  })),
);
const VerificarArbitroDetailPage = lazy(() =>
  import("@/features/admin/pages/VerificarArbitroDetailPage").then((m) => ({
    default: m.VerificarArbitroDetailPage,
  })),
);
const GestionArbitrosPage = lazy(() =>
  import("@/features/admin/pages/GestionArbitrosPage").then((m) => ({
    default: m.GestionArbitrosPage,
  })),
);
const UsuariosPage = lazy(() =>
  import("@/features/admin/pages/UsuariosPage").then((m) => ({
    default: m.UsuariosPage,
  })),
);
const GestionPartidosPage = lazy(() =>
  import("@/features/admin/pages/GestionPartidosPage").then((m) => ({
    default: m.GestionPartidosPage,
  })),
);
const AdminPartidoCreatePage = lazy(() =>
  import("@/features/admin/pages/AdminPartidoCreatePage").then((m) => ({
    default: m.AdminPartidoCreatePage,
  })),
);
const CategoriasPage = lazy(() =>
  import("@/features/admin/pages/CategoriasPage").then((m) => ({
    default: m.CategoriasPage,
  })),
);
const TiposPartidoPage = lazy(() =>
  import("@/features/admin/pages/TiposPartidoPage").then((m) => ({
    default: m.TiposPartidoPage,
  })),
);
const AsignacionPartidosPage = lazy(() =>
  import("@/features/admin/pages/AsignacionPartidosPage").then((m) => ({
    default: m.AsignacionPartidosPage,
  })),
);
const PartidosSolapadosPage = lazy(() =>
  import("@/features/admin/pages/PartidosSolapadosPage").then((m) => ({
    default: m.PartidosSolapadosPage,
  })),
);
const PagosPendientesPage = lazy(() =>
  import("@/features/admin/pages/PagosPendientesPage").then((m) => ({
    default: m.PagosPendientesPage,
  })),
);
const RetirosPage = lazy(() =>
  import("@/features/admin/pages/RetirosPage").then((m) => ({
    default: m.RetirosPage,
  })),
);
const EmailsOutboxPage = lazy(() =>
  import("@/features/admin/pages/EmailsOutboxPage").then((m) => ({
    default: m.EmailsOutboxPage,
  })),
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
      {
        path: ROUTES.DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_DASHBOARD,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<AdminDashboardPage />)}
          </ProtectedRoute>
        ),
      },
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
      {
        path: ROUTES.ADMIN_GESTION_ARBITROS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<GestionArbitrosPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_USUARIOS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<UsuariosPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_GESTION_PARTIDOS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<GestionPartidosPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_PARTIDOS_CREAR,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<AdminPartidoCreatePage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_CATEGORIAS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<CategoriasPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_TIPOS_PARTIDO,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<TiposPartidoPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_ASIGNACION_PARTIDOS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<AsignacionPartidosPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_PARTIDOS_SOLAPADOS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<PartidosSolapadosPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_PAGOS_PENDIENTES,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<PagosPendientesPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_FINANZAS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<FinanzasPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_RETIROS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<RetirosPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_EMAILS,
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            {withSuspense(<EmailsOutboxPage />)}
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
