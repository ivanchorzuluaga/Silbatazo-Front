/**
 * Dashboard específico para Clientes
 * Muestra información y funcionalidades relevantes para clientes
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton, PartidoCardSkeleton, DashboardStatsSkeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout";
import { ROUTES } from "@/lib/constants";
import { usePartidos } from "@/features/partidos/hooks/usePartidos";
import { Calendar, Search, Plus, TrendingUp, Clock, CheckCircle, Users, MapPin, DollarSign, Activity, ArrowRight, Star, Shield } from "lucide-react";
import { parseLocalDate, getTodayLocalDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { getPartidoDetailRoute } from "@/lib/constants";

export function ClienteDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { partidos, isLoading } = usePartidos();

  // Calcular estadísticas
  const totalPartidos = partidos.length;
  const partidosPendientes = partidos.filter((p) => p.estado === "pendiente" || p.estado === "buscando_arbitro").length;
  const partidosAceptados = partidos.filter((p) => p.estado === "aceptado").length;
  const partidosCompletados = partidos.filter((p) => p.estado === "completado").length;
  
  // Partidos recientes (últimos 3)
  const partidosRecientes = partidos
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Próximos partidos
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const proximosPartidos = partidos
    .filter((p) => {
      const fechaPartido = new Date(p.fecha);
      fechaPartido.setHours(0, 0, 0, 0);
      return fechaPartido >= hoy && (p.estado === "aceptado" || p.estado === "pendiente");
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 3);

  return (
    <PageLayout
      title="Dashboard"
      showNavigation={true}
      contentClassName="container mx-auto px-4 py-6 sm:py-8 max-w-7xl space-y-8"
    >
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                ¡Hola, <span className="text-primary">{user?.username || "Cliente"}</span>! 👋
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              ¿Listo para organizar tu próximo partido?
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Fecha actual</p>
              <p className="font-semibold">{getTodayLocalDate()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de métricas mejoradas */}
      {isLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Partidos</CardTitle>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">{totalPartidos}</div>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">En total organizados</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-300">Pendientes</CardTitle>
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-300">{partidosPendientes}</div>
              <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">Esperando árbitro</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-600 dark:text-green-300">Confirmados</CardTitle>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-300">{partidosAceptados}</div>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">Árbitro asignado</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-300">Completados</CardTitle>
                <Star className="w-5 h-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">{partidosCompletados}</div>
              <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">Partidos jugados</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Acciones rápidas mejoradas */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Button
          onClick={() => navigate(ROUTES.PARTIDOS_CREAR)}
          size="lg"
          className="h-auto flex-col gap-4 py-8 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group"
        >
          <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
            <Plus className="size-6" />
          </div>
          <div className="text-center">
            <span className="text-base font-semibold">Crear Partido</span>
            <p className="text-xs opacity-80 mt-1">Nuevo evento</p>
          </div>
        </Button>

        <Button
          onClick={() => navigate(ROUTES.ARBITROS)}
          size="lg"
          variant="outline"
          className="h-auto flex-col gap-4 py-8 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
        >
          <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Search className="size-6 text-primary" />
          </div>
          <div className="text-center">
            <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">Buscar Árbitros</span>
            <p className="text-xs text-muted-foreground mt-1">Explorar disponibles</p>
          </div>
        </Button>

        <Button
          onClick={() => navigate(ROUTES.PARTIDOS)}
          size="lg"
          variant="outline"
          className="h-auto flex-col gap-4 py-8 border-2 hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-300 group"
        >
          <div className="p-3 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
            <Calendar className="size-6 text-secondary" />
          </div>
          <div className="text-center">
            <span className="text-base font-semibold text-foreground group-hover:text-secondary transition-colors">Mis Partidos</span>
            <p className="text-xs text-muted-foreground mt-1">Ver todos</p>
          </div>
        </Button>
      </div>

      {/* Próximos partidos mejorados */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="size-5 text-primary" />
              </div>
              <div>
                <Skeleton variant="text" className="h-8 w-40" />
                <Skeleton variant="text" className="h-4 w-32 mt-1" />
              </div>
            </div>
            <Skeleton variant="rectangular" className="h-8 w-20" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <PartidoCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : proximosPartidos.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="size-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Próximos Partidos</h2>
                <p className="text-sm text-muted-foreground">Tus partidos confirmados</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.PARTIDOS)} className="group">
              Ver todos
              <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proximosPartidos.map((partido) => (
              <Link key={partido.id} to={getPartidoDetailRoute(partido.id)}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden bg-gradient-to-br from-card to-card/80">
                  {/* Status badge */}
                  <div className="relative">
                    <div className="absolute top-3 right-3 z-10">
                      <Badge 
                        variant={partido.estado === "aceptado" ? "success" : "warning"}
                        className="shadow-md"
                      >
                        {partido.estado_display}
                      </Badge>
                    </div>
                    
                    {/* Date display */}
                    <div className="h-32 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">
                          {parseLocalDate(partido.fecha).getDate()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {parseLocalDate(partido.fecha).toLocaleDateString("es-CO", { month: "short" }).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="bg-primary/10 px-2 py-1 rounded text-sm font-mono">#{partido.id}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {parseLocalDate(partido.fecha).toLocaleDateString("es-CO", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{partido.lugar}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{partido.categoria?.nombre || "Categoría"}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <p className="text-xl font-bold text-green-600">
                          ${(parseFloat(partido.tarifa) || 0).toLocaleString("es-CO")}
                        </p>
                      </div>
                      <div className="text-xs text-primary font-medium group-hover:text-primary/80 transition-colors">
                        Ver detalles →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Partidos recientes */}
      {partidosRecientes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="size-5" />
              Partidos Recientes
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.PARTIDOS)}>
              Ver todos
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partidosRecientes.map((partido) => (
              <Link key={partido.id} to={getPartidoDetailRoute(partido.id)}>
                <Card variant="elevated" className="hover:shadow-ios-lg transition-ios cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Partido #{partido.id}</CardTitle>
                      <Badge variant="soft">{partido.estado_display}</Badge>
                    </div>
                    <CardDescription>
                      {parseLocalDate(partido.fecha).toLocaleDateString("es-CO")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{partido.categoria.nombre}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state mejorado */}
      {!isLoading && totalPartidos === 0 && (
        <Card className="text-center py-16 border-0 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                <Calendar className="size-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground">¡Es hora del primer partido!</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Crea tu primer partido y conecta con árbitros profesionales certificados
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate(ROUTES.PARTIDOS_CREAR)} 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear mi primer partido
              </Button>
              <Button 
                onClick={() => navigate(ROUTES.ARBITROS)} 
                size="lg" 
                variant="outline"
                className="border-2 hover:border-primary/50"
              >
                <Search className="w-5 h-5 mr-2" />
                Explorar árbitros
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Árbitros verificados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Calificación garantizada</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}

