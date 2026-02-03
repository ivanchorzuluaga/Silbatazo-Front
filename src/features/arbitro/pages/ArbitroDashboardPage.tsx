/**
 * Dashboard específico para Árbitros
 * Muestra información y funcionalidades relevantes para árbitros
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout";
import { ROUTES } from "@/lib/constants";
import { usePartidos } from "@/features/partidos/hooks/usePartidos";
import { Calendar, Clock, CheckCircle, DollarSign, User, Shield, Activity } from "lucide-react";
import { parseLocalDate, getTodayLocalDate, formatCop } from "@/lib/utils";

export function ArbitroDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { partidos, isLoading } = usePartidos();

  // Calcular estadísticas
  const totalPartidos = partidos.length;
  const partidosPendientes = partidos.filter(
    (p) => p.estado === "pendiente" || p.estado === "buscando_arbitro"
  ).length;
  const partidosAceptados = partidos.filter((p) => p.estado === "aceptado").length;
  const partidosCompletados = partidos.filter((p) => p.estado === "completado").length;

  // Calcular ganancias totales de partidos completados
  const gananciasTotal = partidos
    .filter((p) => p.estado === "completado")
    .reduce((total, partido) => {
      const monto = partido.monto_total ?? partido.tipo_partido?.monto ?? 0;
      return total + monto;
    }, 0);

  // Próximos partidos
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const proximosPartidos = partidos
    .filter((p) => {
      const fechaPartido = new Date(p.fecha);
      fechaPartido.setHours(0, 0, 0, 0);
      return fechaPartido >= hoy && p.estado === "aceptado";
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 3);

  return (
    <PageLayout
      title="Dashboard"
      showNavigation={true}
      contentClassName="container mx-auto px-4 py-6 sm:py-8 max-w-7xl space-y-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                ¡Hola, <span className="text-primary">{user?.username || "Árbitro"}</span>! 👋
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">Gestiona tus partidos y disponibilidad</p>
          </div>
          <div className="hidden sm:block">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Fecha actual</p>
              <p className="font-semibold">{getTodayLocalDate()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-300">
                Total Partidos
              </CardTitle>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
              {totalPartidos}
            </div>
            <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Partidos totales</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-300">
                Pendientes
              </CardTitle>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-300">
              {partidosPendientes}
            </div>
            <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">Por confirmar</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-300">
                Confirmados
              </CardTitle>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-300">
              {partidosAceptados}
            </div>
            <p className="text-xs text-green-500 dark:text-green-400 mt-1">Próximos partidos</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
                Ganancias
              </CardTitle>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">
              {formatCop(gananciasTotal)}
            </div>
            <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1">
              {partidosCompletados} completados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos partidos */}
      {proximosPartidos.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Próximos Partidos</h2>
              <p className="text-sm text-muted-foreground">Tus partidos confirmados</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proximosPartidos.map((partido) => (
              <Card
                key={partido.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/partidos/${partido.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Partido #{partido.id}
                  </CardTitle>
                  <CardDescription>
                    {parseLocalDate(partido.fecha).toLocaleDateString("es-CO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Categoría</span>
                    <span className="font-medium">{partido.categoria?.nombre}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lugar</span>
                    <span className="font-medium">{partido.lugar}</span>
                  </div>
                  {(partido.monto_total != null || partido.tipo_partido?.monto != null) && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Valor</span>
                      <span className="font-semibold text-primary tabular-nums">
                        {formatCop(partido.monto_total ?? partido.tipo_partido?.monto ?? 0)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && totalPartidos === 0 && (
        <Card className="text-center py-16 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                <Shield className="size-12 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground">¡Completa tu perfil!</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Actualiza tu información para empezar a recibir asignaciones de partidos
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(ROUTES.ARBITRO_PERFIL)}
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <User className="w-5 h-5 mr-2" />
                Completar mi perfil
              </Button>
              <Button
                onClick={() => navigate(ROUTES.PARTIDOS)}
                size="lg"
                variant="outline"
                className="border-2 hover:border-primary/50"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Ver partidos disponibles
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
