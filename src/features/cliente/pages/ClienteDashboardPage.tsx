/**
 * Dashboard específico para Clientes
 * Muestra información relevante: estadísticas, próximos partidos, pagos pendientes
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClienteDashboard } from "../hooks/useClienteDashboard";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import logoImage from "@/assets/Silbatazo-bordes.png";
import {
  Calendar,
  Clock,
  CheckCircle,
  MapPin,
  Trophy,
  ArrowRight,
  Star,
  CreditCard,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { parseLocalDate, cn, formatCop } from "@/lib/utils";

export function ClienteDashboardPage() {
  const {
    username,
    isLoading,
    error,
    refetch,
    stats,
    proximosPartidos,
    partidosRecientes,
    partidosPagosPendientes,
    navigateToPartidos,
    navigateToPartido,
    navigateToPago,
  } = useClienteDashboard();

  // Fecha actual formateada
  const fechaHoy = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-72 pb-nav-mobile sm:pb-0">
        <DashboardContainer>
          {/* Header de bienvenida */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-muted-foreground text-sm">En línea</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  ¡Hola, <span className="text-primary">{username}</span>!
                </h1>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-muted-foreground text-sm">Hoy es</p>
                <p className="text-foreground font-medium capitalize">{fechaHoy}</p>
              </div>
            </div>
          </header>

          {/* Error al cargar partidos */}
          {error && (
            <section className="mb-8">
              <div className="p-5 bg-destructive/10 backdrop-blur-md rounded-2xl border border-destructive/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-destructive/20 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      Error al cargar partidos
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{error}</p>
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      Reintentar
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Alerta de pagos pendientes - Prioridad alta */}
          {!error && partidosPagosPendientes.length > 0 && (
            <section className="mb-8">
              <div className="p-5 bg-warning/10 backdrop-blur-md rounded-2xl border border-warning/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-warning/20 rounded-xl">
                    <CreditCard className="w-6 h-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-1">Pagos Pendientes</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Completa el pago para confirmar la asignación del árbitro
                    </p>
                    <div className="space-y-2">
                      {partidosPagosPendientes.map((partido) => (
                        <button
                          key={partido.id}
                          onClick={() => navigateToPago(partido.id)}
                          className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted rounded-xl border border-border transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-lg font-bold text-warning">
                                {parseLocalDate(partido.fecha).getDate()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {parseLocalDate(partido.fecha)
                                  .toLocaleDateString("es-CO", { month: "short" })
                                  .toUpperCase()}
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="text-foreground font-medium">Partido #{partido.id}</p>
                              <p className="text-muted-foreground text-sm">{partido.lugar}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {(partido.monto_total != null || "tipo_partido" in partido) &&
                              (partido.monto_total ??
                                (partido as { tipo_partido?: { monto: number } }).tipo_partido
                                  ?.monto) != null && (
                                <p className="text-sm font-semibold text-warning tabular-nums">
                                  {formatCop(
                                    partido.monto_total ??
                                      (partido as { tipo_partido?: { monto: number } }).tipo_partido
                                        ?.monto ??
                                      0
                                  )}
                                </p>
                              )}
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-warning group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Estadísticas */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Resumen</h2>
            {error ? null : isLoading ? (
              <StatsLoading />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={TrendingUp} label="Total" value={stats.total} color="blue" />
                <StatCard icon={Clock} label="Pendientes" value={stats.pendientes} color="amber" />
                <StatCard
                  icon={CheckCircle}
                  label="Confirmados"
                  value={stats.aceptados}
                  color="green"
                />
                <StatCard
                  icon={Star}
                  label="Completados"
                  value={stats.completados}
                  color="purple"
                />
              </div>
            )}
          </section>

          {/* Próximos partidos */}
          {error ? null : isLoading ? (
            <PartidosLoading title="Próximos Partidos" />
          ) : proximosPartidos.length > 0 ? (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-success" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Próximos Partidos</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToPartidos}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {proximosPartidos.map((partido) => (
                  <PartidoCard
                    key={partido.id}
                    partido={partido}
                    onClick={() => navigateToPartido(partido.id)}
                    variant="upcoming"
                  />
                ))}
              </div>
            </section>
          ) : null}

          {/* Actividad reciente */}
          {!error && !isLoading && partidosRecientes.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Actividad Reciente</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToPartidos}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Ver historial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="space-y-3">
                {partidosRecientes.slice(0, 5).map((partido) => (
                  <ActivityItem
                    key={partido.id}
                    partido={partido}
                    onClick={() => navigateToPartido(partido.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state - Solo si no hay error y no hay partidos */}
          {!error && !isLoading && stats.total === 0 && <EmptyState />}
        </DashboardContainer>
      </main>
      <BottomNav />
    </div>
  );
}

// =============================================================================
// Componentes auxiliares
// =============================================================================

function DashboardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative bg-background">
      {/* Fondo con gradiente adaptativo */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10 dark:from-background dark:via-background dark:to-primary/20" />

      {/* Efectos de luz - solo en modo oscuro */}
      <div className="fixed top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none dark:block hidden" />
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none dark:block hidden" />

      {/* Logo de fondo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img src={logoImage} alt="" className="w-[500px] h-[500px] object-contain opacity-[0.02]" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "blue" | "amber" | "green" | "purple";
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: "border-primary/20 text-primary",
    amber: "border-warning/20 text-warning",
    green: "border-success/20 text-success",
    purple: "border-accent/20 text-accent",
  };

  return (
    <div className={cn("p-4 rounded-xl border bg-card backdrop-blur-md", colorClasses[color])}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-border bg-card backdrop-blur-md animate-pulse"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-5 h-5 bg-muted rounded" />
            <div className="w-8 h-7 bg-muted rounded" />
          </div>
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

interface PartidoCardProps {
  partido: {
    id: number;
    fecha: string;
    hora: string;
    lugar: string;
    estado: string;
    estado_display: string;
    categoria: { nombre: string };
    arbitro_info?: { full_name: string } | null;
    monto_total?: number | null;
    tipo_partido?: { monto: number } | null;
  };
  onClick: () => void;
  variant?: "upcoming" | "recent";
}

function PartidoCard({ partido, onClick }: PartidoCardProps) {
  const fecha = parseLocalDate(partido.fecha);
  const isAceptado = partido.estado === "aceptado";

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-card backdrop-blur-md rounded-xl border border-border hover:bg-muted hover:border-primary/50 transition-all duration-300 text-left group"
    >
      <div className="flex gap-4">
        {/* Fecha */}
        <div className="text-center px-3 py-2 bg-primary/10 rounded-lg">
          <p className="text-2xl font-bold text-primary">{fecha.getDate()}</p>
          <p className="text-xs text-muted-foreground">
            {fecha.toLocaleDateString("es-CO", { month: "short" }).toUpperCase()}
          </p>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
              #{partido.id}
            </code>
            <Badge
              className={cn(
                "text-xs",
                isAceptado
                  ? "bg-success/20 text-success border-success/30"
                  : "bg-warning/20 text-warning border-warning/30"
              )}
            >
              {partido.estado_display}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm mb-1">
            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-foreground truncate">{partido.lugar}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {partido.categoria?.nombre ?? "—"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {partido.hora ? partido.hora.substring(0, 5) : "—"}
            </span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end justify-center gap-0.5">
          {(partido.monto_total != null || partido.tipo_partido?.monto != null) && (
            <p className="text-sm font-semibold text-primary tabular-nums">
              {formatCop(partido.monto_total ?? partido.tipo_partido?.monto ?? 0)}
            </p>
          )}
          <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
            Ver más →
          </p>
        </div>
      </div>
    </button>
  );
}

interface ActivityItemProps {
  partido: {
    id: number;
    fecha: string;
    estado: string;
    estado_display: string;
    lugar: string;
    created_at: string;
  };
  onClick: () => void;
}

function ActivityItem({ partido, onClick }: ActivityItemProps) {
  const fecha = parseLocalDate(partido.fecha);
  const createdAt = new Date(partido.created_at);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "aceptado":
        return "text-success";
      case "completado":
        return "text-accent";
      case "pendiente":
      case "buscando_arbitro":
        return "text-warning";
      case "cancelado":
      case "rechazado":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 bg-card hover:bg-muted rounded-xl border border-border transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-foreground font-medium truncate">
          Partido #{partido.id} - {partido.lugar}
        </p>
        <p className="text-muted-foreground text-sm">
          {fecha.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className={cn("text-sm font-medium", getStatusColor(partido.estado))}>
          {partido.estado_display}
        </p>
        <p className="text-muted-foreground text-xs">
          {createdAt.toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
        </p>
      </div>

      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </button>
  );
}

function PartidosLoading({ title: _title }: { title: string }) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-muted rounded-lg w-9 h-9 animate-pulse" />
        <div className="h-6 w-40 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 bg-card rounded-xl border border-border animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-12 text-center">
      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Calendar className="w-10 h-10 text-primary" />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">Sin actividad aún</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Cuando crees partidos, aquí verás un resumen de tu actividad y próximos eventos.
      </p>
    </div>
  );
}
