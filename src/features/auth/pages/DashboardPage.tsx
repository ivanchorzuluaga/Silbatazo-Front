/**
 * Página de dashboard después del login
 * Muestra información del usuario y botón de cerrar sesión
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ROUTES, USER_ROLES } from "@/lib/constants";

export function DashboardPage() {
  const { user, logout, logoutAll } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así, redirigir al home si falla
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
      // Aún así, redirigir al home si falla
      navigate(ROUTES.HOME);
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case USER_ROLES.CLIENTE:
        return "Cliente";
      case USER_ROLES.ARBITRO:
        return "Árbitro";
      case USER_ROLES.ADMIN:
        return "Administrador";
      default:
        return "Usuario";
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 safe-area-inset">
      {/* Toggle de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4 safe-area-top safe-area-right">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-6 shadow-ios-lg backdrop-blur">
        <div className="space-y-2 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Bienvenido a tu panel</p>
        </div>

        <div className="space-y-4">
          {/* Información del usuario */}
          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre de usuario</p>
              <p className="text-lg font-semibold">{user?.username || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo de usuario</p>
              <p className="text-lg font-semibold">{getRoleLabel(user?.role)}</p>
            </div>

            {user?.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
            )}
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
