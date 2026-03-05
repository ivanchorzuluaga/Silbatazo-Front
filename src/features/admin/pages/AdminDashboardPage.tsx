/**
 * Dashboard específico para Administradores
 * Resumen y estadísticas; la navegación está en el sidebar
 */

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { useAdminDashboardStats } from "../hooks/useAdminDashboardStats";
import { getTodayLocalDate } from "@/lib/utils";
import {
  Users,
  Shield,
  Clock,
  AlertCircle,
  Trophy,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatCop } from "@/lib/utils";

export function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, isLoading, error } = useAdminDashboardStats();

  const quickStats = [
    {
      title: "Árbitros Activos",
      value: stats?.arbitros_activos ?? (isLoading ? "…" : "0"),
      icon: Users,
      color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
      iconColor: "text-blue-500",
      route: ROUTES.ADMIN_GESTION_ARBITROS,
    },
    {
      title: "Partidos Hoy",
      value: stats?.partidos_hoy ?? (isLoading ? "…" : "0"),
      icon: Trophy,
      color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
      iconColor: "text-blue-500",
      route: ROUTES.ADMIN_GESTION_PARTIDOS,
    },
    {
      title: "Valor a pagar",
      value:
        stats?.total_cobrado != null
          ? formatCop(stats.total_cobrado)
          : isLoading
          ? "…"
          : "$0",
      icon: CreditCard,
      color: "from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900",
      textColor: "text-slate-600 dark:text-slate-300",
      iconColor: "text-slate-500",
      route: ROUTES.ADMIN_PAGOS_PENDIENTES,
    },
    {
      title: "Comisión app",
      value:
        stats?.comision_plataforma != null
          ? formatCop(stats.comision_plataforma)
          : isLoading
          ? "…"
          : "$0",
      icon: CreditCard,
      color: "from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      iconColor: "text-orange-500",
      route: ROUTES.ADMIN_PAGOS_PENDIENTES,
    },
    {
      title: "Valor servicio árbitros",
      value:
        stats?.saldo_arbitros != null
          ? formatCop(stats.saldo_arbitros)
          : isLoading
          ? "…"
          : "$0",
      icon: CreditCard,
      color: "from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900",
      textColor: "text-slate-600 dark:text-slate-300",
      iconColor: "text-slate-500",
      route: ROUTES.ADMIN_GESTION_PARTIDOS,
    },
    {
      title: "Buscando árbitro",
      value: stats?.pendientes_busqueda ?? (isLoading ? "…" : "0"),
      icon: Clock,
      color: "from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      iconColor: "text-orange-500",
      route: `${ROUTES.ADMIN_GESTION_PARTIDOS}?estado=buscando_arbitro`,
    },
    {
      title: "Pendientes",
      value: stats?.pendientes_confirmacion ?? (isLoading ? "…" : "0"),
      icon: Clock,
      color: "from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      iconColor: "text-orange-500",
      route: `${ROUTES.ADMIN_GESTION_PARTIDOS}?estado=pendiente`,
    },
    {
      title: "Verificaciones",
      value: stats?.verificaciones ?? (isLoading ? "…" : "0"),
      icon: AlertCircle,
      color: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
      textColor: "text-purple-600 dark:text-purple-300",
      iconColor: "text-purple-500",
      route: ROUTES.ADMIN_VERIFICACION,
    },
  ];

  const quickActions = [
    {
      title: "Pagos pendientes",
      value: stats?.pagos_pendientes ?? (isLoading ? "…" : "0"),
      icon: CreditCard,
      color: "from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      iconColor: "text-orange-500",
      route: ROUTES.ADMIN_PAGOS_PENDIENTES,
      helper: "Revisar pagos en revisión",
    },
    {
      title: "Verificaciones",
      value: stats?.verificaciones ?? (isLoading ? "…" : "0"),
      icon: AlertCircle,
      color: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
      textColor: "text-purple-600 dark:text-purple-300",
      iconColor: "text-purple-500",
      route: ROUTES.ADMIN_VERIFICACION,
      helper: "Aprobar árbitros",
    },
    {
      title: "Buscando árbitro",
      value: stats?.pendientes_busqueda ?? (isLoading ? "…" : "0"),
      icon: Clock,
      color: "from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      iconColor: "text-orange-500",
      route: `${ROUTES.ADMIN_GESTION_PARTIDOS}?estado=buscando_arbitro`,
      helper: "Partidos sin árbitro",
    },
    {
      title: "Pendientes",
      value: stats?.pendientes_confirmacion ?? (isLoading ? "…" : "0"),
      icon: Clock,
      color: "from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      iconColor: "text-orange-500",
      route: `${ROUTES.ADMIN_GESTION_PARTIDOS}?estado=pendiente`,
      helper: "Pendientes de confirmación",
    },
    {
      title: "Asignación",
      value: "→",
      icon: ClipboardList,
      color: "from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900",
      textColor: "text-indigo-600 dark:text-indigo-300",
      iconColor: "text-indigo-500",
      route: ROUTES.ADMIN_ASIGNACION_PARTIDOS,
      helper: "Asignar árbitros",
    },
  ];

  return (
    <PageLayout
      title="Panel de Administración"
      showNavigation={true}
      contentClassName="page-surface space-y-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                ¡Hola, <span className="text-primary">{user?.username || "Admin"}</span>! 👋
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">Panel de control del sistema</p>
          </div>
          <div className="hidden sm:block">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Fecha actual</p>
              <p className="font-semibold">{getTodayLocalDate()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error al cargar estadísticas */}
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {quickStats.map((stat) => (
          <Card
            key={stat.title}
            className={`group hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-br ${stat.color} cursor-pointer`}
            role="button"
            tabIndex={0}
            onClick={() => navigate(stat.route)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(stat.route);
              }
            }}
          >
            <CardHeader className="pb-2 pt-3">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-xs font-medium ${stat.textColor}`}>
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
              <p className={`text-[11px] ${stat.iconColor} mt-1`}>Vista general</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Caja y distribución */}
      <div className="card-surface-strong p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Caja y distribución</h2>
            <p className="text-sm text-muted-foreground">
              Resumen de valor a pagar, comisión app y valor del servicio árbitro.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Valor a pagar</p>
            <p className="text-2xl font-semibold text-slate-500">
              {stats?.total_cobrado != null ? formatCop(stats.total_cobrado) : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total acumulado a pagar por clientes</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Comisión app</p>
            <p className="text-2xl font-semibold text-orange-500">
              {stats?.comision_plataforma != null ? formatCop(stats.comision_plataforma) : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Según configuración por tipo de partido</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Valor servicio árbitros</p>
            <p className="text-2xl font-semibold text-slate-500">
              {stats?.saldo_arbitros != null ? formatCop(stats.saldo_arbitros) : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Valor neto de servicio</p>
          </div>
        </div>
      </div>

      {/* Control de usuarios */}
      <div className="card-surface-strong p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Control de usuarios</h2>
            <p className="text-sm text-muted-foreground">
              Gestión rápida de árbitros por estado.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.ADMIN_GESTION_ARBITROS)}
          >
            Abrir gestión completa
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="justify-between"
            onClick={() => navigate(`${ROUTES.ADMIN_GESTION_ARBITROS}?estado=pendiente`)}
          >
            Pendientes
            <span className="font-semibold">{stats?.arbitros_pendientes ?? 0}</span>
          </Button>
          <Button
            variant="outline"
            className="justify-between"
            onClick={() => navigate(`${ROUTES.ADMIN_GESTION_ARBITROS}?estado=en_revision`)}
          >
            En revisión
            <span className="font-semibold">{stats?.arbitros_en_revision ?? 0}</span>
          </Button>
          <Button
            variant="outline"
            className="justify-between"
            onClick={() => navigate(`${ROUTES.ADMIN_GESTION_ARBITROS}?estado=suspendido`)}
          >
            Suspendidos
            <span className="font-semibold">{stats?.arbitros_suspendidos ?? 0}</span>
          </Button>
          <Button
            variant="outline"
            className="justify-between"
            onClick={() => navigate(ROUTES.ADMIN_VERIFICACION)}
          >
            Por verificar
            <span className="font-semibold">{stats?.verificaciones ?? 0}</span>
          </Button>
        </div>
      </div>

      {/* Métricas de clientes */}
      <div className="card-surface-strong p-5 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Métricas de clientes</h2>
          <p className="text-sm text-muted-foreground">
            Registro de usuarios y consumo de servicios.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Usuarios registrados
            </p>
            <p className="text-2xl font-semibold">{stats?.usuarios_registrados ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Clientes registrados
            </p>
            <p className="text-2xl font-semibold">{stats?.clientes_registrados ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Clientes con servicios
            </p>
            <p className="text-2xl font-semibold">{stats?.clientes_con_servicios ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Partidos solicitados
            </p>
            <p className="text-2xl font-semibold">{stats?.partidos_solicitados_total ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Servicios completados
            </p>
            <p className="text-2xl font-semibold">{stats?.servicios_completados_total ?? 0}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-border/60 bg-background/60 p-4">
          <p className="text-sm font-medium mb-3">Top clientes por partidos solicitados</p>
          {stats?.top_clientes && stats.top_clientes.length > 0 ? (
            <div className="space-y-2">
              {stats.top_clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2"
                >
                  <p className="text-sm font-medium">{cliente.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {cliente.total_partidos} solicitados · {cliente.servicios_completados} completados
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aún no hay clientes con partidos solicitados.
            </p>
          )}
        </div>
      </div>

      {/* Accesos por categoría */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Accesos por categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((item) => (
            <Card
              key={item.title}
              className={`group hover:shadow-md transition-all duration-300 border-0 bg-gradient-to-br ${item.color} cursor-pointer`}
              role="button"
              tabIndex={0}
              onClick={() => navigate(item.route)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(item.route);
                }
              }}
            >
              <CardHeader className="pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-xs font-medium ${item.textColor}`}>
                    {item.title}
                  </CardTitle>
                  <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${item.textColor}`}>{item.value}</div>
                <p className={`text-[11px] ${item.iconColor} mt-1`}>{item.helper}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
