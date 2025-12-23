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
import { APP_NAME } from "@/lib/constants";
import { ROUTES } from "@/lib/constants";

export function HomePage() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      {/* Toggle de tema en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-8 text-center">
        {/* Logo/Imagen */}
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-16 w-16 text-primary"
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
          <h1 className="text-4xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-lg text-muted-foreground">
            Plataforma de arbitraje deportivo
          </p>
        </div>

        {/* Botón de Login */}
        <Button
          onClick={handleLoginClick}
          size="lg"
          className="min-w-[200px]"
        >
          {isAuthenticated ? "Ir al Dashboard" : "Iniciar Sesión"}
        </Button>
      </div>

      {/* Dialog de autenticación */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={(open) => {
          setAuthDialogOpen(open);
          // Si se cierra y el usuario está autenticado, redirigir
          if (!open && isAuthenticated) {
            navigate(ROUTES.DASHBOARD);
          }
        }}
      />
    </div>
  );
}

