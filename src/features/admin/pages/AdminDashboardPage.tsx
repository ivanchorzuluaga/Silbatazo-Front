/**
 * Dashboard específico para Administradores
 * Muestra información y funcionalidades relevantes para administradores
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout";
import { ROUTES } from "@/lib/constants";
import { getTodayLocalDate } from "@/lib/utils";
import { 
  Users,
  Calendar,
  Shield,
  Settings,
  DollarSign,
  Clock,
  AlertCircle,
  Trophy,
  Wallet,
  UserCheck
} from "lucide-react";

export function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const adminActions = [
    {
      title: "Gestión de Árbitros",
      description: "Verificar y gestionar árbitros",
      icon: UserCheck,
      color: "from-blue-500 to-blue-600",
      route: ROUTES.ADMIN_GESTION_ARBITROS,
    },
    {
      title: "Gestión de Partidos",
      description: "Ver y gestionar partidos",
      icon: Trophy,
      color: "from-green-500 to-green-600",
      route: ROUTES.ADMIN_GESTION_PARTIDOS,
    },
    {
      title: "Verificar Árbitros",
      description: "Revisar documentos pendientes",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      route: ROUTES.ADMIN_VERIFICACION,
    },
    {
      title: "Categorías",
      description: "Gestionar categorías y tarifas",
      icon: Settings,
      color: "from-orange-500 to-orange-600",
      route: ROUTES.ADMIN_CATEGORIAS,
    },
    {
      title: "Asignar Árbitros",
      description: "Asignar árbitros a partidos",
      icon: Calendar,
      color: "from-cyan-500 to-cyan-600",
      route: ROUTES.ADMIN_ASIGNACION_PARTIDOS,
    },
    {
      title: "Pagos Pendientes",
      description: "Revisar y aprobar pagos",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      route: ROUTES.ADMIN_PAGOS_PENDIENTES,
    },
    {
      title: "Gestión de Retiros",
      description: "Procesar solicitudes de retiro",
      icon: Wallet,
      color: "from-pink-500 to-pink-600",
      route: ROUTES.ADMIN_RETIROS,
    },
  ];

  const quickStats = [
    {
      title: "Árbitros Activos",
      value: "-",
      icon: Users,
      color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
      textColor: "text-blue-600 dark:text-blue-300",
      iconColor: "text-blue-500",
    },
    {
      title: "Partidos Hoy",
      value: "-",
      icon: Trophy,
      color: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
      textColor: "text-green-600 dark:text-green-300",
      iconColor: "text-green-500",
    },
    {
      title: "Pendientes",
      value: "-",
      icon: Clock,
      color: "from-yellow-50 to-orange-100 dark:from-yellow-950 dark:to-orange-900",
      textColor: "text-orange-600 dark:text-orange-300",
      iconColor: "text-orange-500",
    },
    {
      title: "Verificaciones",
      value: "-",
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
            <p className="text-muted-foreground text-lg">
              Panel de control del sistema
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
              <div className={`text-3xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
              <p className={`text-xs ${stat.iconColor} mt-1`}>Vista general</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Actions Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Acciones Administrativas</h2>
            <p className="text-sm text-muted-foreground">Gestiona todos los aspectos del sistema</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => (
            <Card
              key={action.title}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 overflow-hidden"
              onClick={() => navigate(action.route)}
            >
              <div className={`h-2 bg-gradient-to-r ${action.color}`} />
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      <span>Abrir</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
