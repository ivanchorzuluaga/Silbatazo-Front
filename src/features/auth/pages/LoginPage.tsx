/**
 * Página de login
 * Componente de página que contiene el layout y el formulario
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "../components/AuthDialog";
import { ROUTES } from "@/lib/constants";

export function LoginPage() {
  const [authDialogOpen, setAuthDialogOpen] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDialogClose = (open: boolean) => {
    setAuthDialogOpen(open);
    // Si se cierra y el usuario está autenticado, redirigir al dashboard
    if (!open && isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
    // Si se cierra sin autenticar, redirigir a home
    if (!open && !isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <AuthDialog
          open={authDialogOpen}
          onOpenChange={handleDialogClose}
        />
      </div>
    </div>
  );
}

