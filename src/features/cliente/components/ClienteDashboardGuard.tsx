/**
 * Guard que redirige a completar perfil si el cliente no tiene nombre y email.
 * Espera a cargar el perfil una vez antes de decidir.
 */

import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import { ClienteDashboardPage } from "../pages/ClienteDashboardPage";
import { useUserProfile } from "../hooks/useUserProfile";
import { necesitaOnboardingCliente } from "../utils/onboarding";
import { ROUTES } from "@/lib/constants";

export function ClienteDashboardGuard() {
  const { user, obtenerPerfil, isLoading } = useUserProfile();
  const [verificacionHecha, setVerificacionHecha] = useState(false);
  const efectoEjecutado = useRef(false);

  useEffect(() => {
    if (efectoEjecutado.current) return;
    efectoEjecutado.current = true;

    obtenerPerfil()
      .then(() => setVerificacionHecha(true))
      .catch(() => setVerificacionHecha(true));
  }, [obtenerPerfil]);

  if (!verificacionHecha || (isLoading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (necesitaOnboardingCliente(user)) {
    return <Navigate to={ROUTES.CLIENTE_PERFIL} replace />;
  }

  return <ClienteDashboardPage />;
}
