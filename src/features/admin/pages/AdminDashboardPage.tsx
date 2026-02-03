/**
 * Dashboard específico para Administradores
 * Resumen y estadísticas; la navegación está en el sidebar
 */

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout";
import { useAdminDashboardStats } from "../hooks/useAdminDashboardStats";
import { getTodayLocalDate } from "@/lib/utils";
import { Users, Shield, Clock, AlertCircle, Trophy } from "lucide-react";

export function AdminDashboardPage() {
  const { user } = useAuth();
  const { stats, isLoading, error } = useAdminDashboardStats();

  const quickStats = [
    {
      title: "Árbitros Activos",
      value: stats?.arbitros_activos ?? (isLoading ? "…" : "0"),
      icon: Users,
      color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
      iconColor: "text-blue-500",
    },
    {
      title: "Partidos Hoy",
      value: stats?.partidos_hoy ?? (isLoading ? "…" : "0"),
      icon: Trophy,
      color: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      textColor: "text-green-600 dark:text-green-300",
      iconColor: "text-green-500",
    },
    {
      title: "Pendientes",
      value: stats?.pendientes ?? (isLoading ? "…" : "0"),
      icon: Clock,
      color: "from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      iconColor: "text-orange-500",
    },
    {
      title: "Verificaciones",
      value: stats?.verificaciones ?? (isLoading ? "…" : "0"),
      icon: AlertCircle,
      color: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
      textColor: "text-purple-600 dark:text-purple-300",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <PageLayout
      title="Panel de Administración"
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card
            key={stat.title}
            className={`group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br ${stat.color}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
              <p className={`text-xs ${stat.iconColor} mt-1`}>Vista general</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
