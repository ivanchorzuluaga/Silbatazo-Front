/**
 * Página principal de la aplicación
 * Muestra el nombre, imagen y botón de login
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthDialog } from "../components/AuthDialog";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";

export function HomePage() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isAuthenticated && user?.role) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute);
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 safe-area-inset">
      {/* Toggle de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4 safe-area-top safe-area-right">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-6 sm:gap-8 text-center px-4">
        {/* Logo/Imagen */}
        <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-12 w-12 sm:h-16 sm:w-16 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Nombre de la aplicación */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Plataforma de arbitraje deportivo
          </p>
        </div>

        {/* Botón de Login */}
        <Button
          onClick={handleLoginClick}
          size="lg"
          className="w-full sm:w-auto sm:min-w-[200px] touch-manipulation"
        >
          {isAuthenticated ? "Ir al Dashboard" : "Iniciar Sesión"}
        </Button>
      </div>

      {/* Dialog de autenticación */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={(open) => {
          setAuthDialogOpen(open);
          // Si se cierra y el usuario está autenticado, redirigir según su rol
          if (!open && isAuthenticated && user?.role) {
            const dashboardRoute = getDashboardRoute(user.role);
            navigate(dashboardRoute);
          }
        }}
      />
    </div>
  );
}

