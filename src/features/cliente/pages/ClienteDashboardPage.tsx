/**
 * Dashboard específico para Clientes
 * Muestra información relevante: estadísticas, próximos partidos, pagos pendientes
 */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useClienteDashboard } from "../hooks/useClienteDashboard";
import { Sidebar } from "@/components/layout/Sidebar";
import logoImage from "@/assets/Silbatazo-bordes.png";
import {
  Calendar,
  Clock,
  CheckCircle,
  MapPin,
  Trophy,
  ArrowRight,
  Star,
  Loader2,
  CreditCard,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { parseLocalDate, cn } from "@/lib/utils";

export function ClienteDashboardPage() {
  const {
    username,
    isLoading,
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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-72">
        <DashboardContainer>
          {/* Header de bienvenida */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-white/60 text-sm">En línea</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  ¡Hola, <span className="text-primary">{username}</span>!
                </h1>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-white/40 text-sm">Hoy es</p>
                <p className="text-white/80 font-medium capitalize">{fechaHoy}</p>
              </div>
            </div>
          </header>

          {/* Alerta de pagos pendientes - Prioridad alta */}
          {partidosPagosPendientes.length > 0 && (
            <section className="mb-8">
              <div className="p-5 bg-amber-500/10 backdrop-blur-md rounded-2xl border border-amber-500/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <CreditCard className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">Pagos Pendientes</h3>
                    <p className="text-white/60 text-sm mb-4">
                      Completa el pago para confirmar la asignación del árbitro
                    </p>
                    <div className="space-y-2">
                      {partidosPagosPendientes.map((partido) => (
                        <button
                          key={partido.id}
                          onClick={() => navigateToPago(partido.id)}
                          className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-lg font-bold text-amber-400">
                                {parseLocalDate(partido.fecha).getDate()}
                              </p>
                              <p className="text-xs text-white/50">
                                {parseLocalDate(partido.fecha)
                                  .toLocaleDateString("es-CO", { month: "short" })
                                  .toUpperCase()}
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="text-white font-medium">Partido #{partido.id}</p>
                              <p className="text-white/50 text-sm">{partido.lugar}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-400 font-bold">
                              ${parseFloat(partido.tarifa).toLocaleString("es-CO")}
                            </span>
                            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
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
            <h2 className="text-lg font-semibold text-white/80 mb-4">Resumen</h2>
            {isLoading ? (
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
          {isLoading ? (
            <PartidosLoading title="Próximos Partidos" />
          ) : proximosPartidos.length > 0 ? (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Próximos Partidos</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToPartidos}
                  className="text-white/60 hover:text-white hover:bg-white/10"
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
          {!isLoading && partidosRecientes.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Clock className="w-5 h-5 text-white/60" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Actividad Reciente</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToPartidos}
                  className="text-white/60 hover:text-white hover:bg-white/10"
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

          {/* Empty state - Solo si no hay nada */}
          {!isLoading && stats.total === 0 && <EmptyState />}
        </DashboardContainer>
      </main>
    </div>
  );
}

// =============================================================================
// Componentes auxiliares
// =============================================================================

function DashboardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Fondo */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-background" />
      <div className="fixed top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

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
    blue: "border-blue-500/20 text-blue-400",
    amber: "border-amber-500/20 text-amber-400",
    green: "border-green-500/20 text-green-400",
    purple: "border-purple-500/20 text-purple-400",
  };

  return (
    <div className={cn("p-4 rounded-xl border bg-white/5 backdrop-blur-md", colorClasses[color])}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="text-white/50 text-sm">{label}</p>
    </div>
  );
}

function StatsLoading() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md animate-pulse"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-5 h-5 bg-white/10 rounded" />
            <div className="w-8 h-7 bg-white/10 rounded" />
          </div>
          <div className="h-4 w-16 bg-white/10 rounded" />
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
    tarifa: string;
    arbitro_info?: { full_name: string } | null;
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
      className="w-full p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left group"
    >
      <div className="flex gap-4">
        {/* Fecha */}
        <div className="text-center px-3 py-2 bg-primary/10 rounded-lg">
          <p className="text-2xl font-bold text-primary">{fecha.getDate()}</p>
          <p className="text-xs text-white/60">
            {fecha.toLocaleDateString("es-CO", { month: "short" }).toUpperCase()}
          </p>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <code className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded">
              #{partido.id}
            </code>
            <Badge
              className={cn(
                "text-xs",
                isAceptado
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/30",
              )}
            >
              {partido.estado_display}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm mb-1">
            <MapPin className="w-3 h-3 text-white/40 shrink-0" />
            <span className="text-white truncate">{partido.lugar}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/50">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {partido.categoria.nombre}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {partido.hora.substring(0, 5)}
            </span>
          </div>
        </div>

        {/* Precio */}
        <div className="text-right">
          <p className="text-lg font-bold text-primary">
            ${parseFloat(partido.tarifa).toLocaleString("es-CO")}
          </p>
          <p className="text-xs text-white/40 group-hover:text-primary transition-colors">
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
        return "text-green-400";
      case "completado":
        return "text-purple-400";
      case "pendiente":
      case "buscando_arbitro":
        return "text-amber-400";
      case "cancelado":
      case "rechazado":
        return "text-red-400";
      default:
        return "text-white/60";
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors group"
    >
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <Calendar className="w-5 h-5 text-white/60" />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-white font-medium truncate">
          Partido #{partido.id} - {partido.lugar}
        </p>
        <p className="text-white/50 text-sm">
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
        <p className="text-white/40 text-xs">
          {createdAt.toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
        </p>
      </div>

      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
    </button>
  );
}

function PartidosLoading({ title }: { title: string }) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/10 rounded-lg w-9 h-9 animate-pulse" />
        <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-20 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-32 bg-white/10 rounded" />
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
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center">
      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Calendar className="w-10 h-10 text-primary" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Sin actividad aún</h3>
      <p className="text-white/60 max-w-sm mx-auto">
        Cuando crees partidos, aquí verás un resumen de tu actividad y próximos eventos.
      </p>
    </div>
  );
}
