/**
 * Dashboard específico para Clientes
 * Muestra información y funcionalidades relevantes para clientes
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ROUTES } from "@/lib/constants";

export function ClienteDashboardPage() {
  const { user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate(ROUTES.HOME);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm("¿Estás seguro de que quieres cerrar sesión en todos los dispositivos?")) {
      return;
    }

    try {
      await logoutAll();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error al cerrar todas las sesiones:", error);
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 safe-area-inset">
      {/* Toggle de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4 safe-area-top safe-area-right">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard - Cliente</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Bienvenido, {user?.username || "Cliente"}
          </p>
        </div>

        <div className="space-y-4">
          {/* Información del usuario */}
          <div className="space-y-3 rounded-md border bg-muted/50 p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre de usuario</p>
              <p className="text-lg font-semibold">{user?.username || "N/A"}</p>
            </div>

            {user?.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
            )}
          </div>

          {/* Funcionalidades para clientes */}
          <div className="space-y-2 rounded-md border bg-muted/30 p-4">
            <h2 className="text-sm font-semibold mb-2">Funcionalidades</h2>
            <p className="text-sm text-muted-foreground">
              Aquí podrás buscar árbitros, solicitar partidos, realizar pagos y calificar servicios.
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              (Próximamente en Fase 3)
            </p>
          </div>

          {/* Botones de cerrar sesión */}
          <div className="space-y-2">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full h-11 sm:h-9 touch-manipulation"
            >
              Cerrar Sesión
            </Button>
            <Button
              onClick={handleLogoutAll}
              variant="outline"
              className="w-full h-11 sm:h-9 touch-manipulation text-sm"
            >
              Cerrar Sesión en Todos los Dispositivos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

