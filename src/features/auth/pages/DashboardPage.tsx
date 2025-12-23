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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Toggle de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido a tu panel</p>
        </div>

        <div className="space-y-4">
          {/* Información del usuario */}
          <div className="space-y-3 rounded-md border bg-muted/50 p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nombre de usuario
              </p>
              <p className="text-lg font-semibold">{user?.username || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Tipo de usuario
              </p>
              <p className="text-lg font-semibold">
                {getRoleLabel(user?.role)}
              </p>
            </div>

            {user?.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
            )}
          </div>

          {/* Botón de cerrar sesión */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
}

