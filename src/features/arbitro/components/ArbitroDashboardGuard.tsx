/**
 * Guard que redirige al onboarding si el árbitro no tiene perfil completo (foto + disponibilidad).
 * Si está completo, renderiza el dashboard.
 * Espera a que termine la primera carga de perfil antes de decidir, para evitar bucle de redirección.
 */

import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";

import { ArbitroDashboardPage } from "../pages/ArbitroDashboardPage";
import { useArbitro } from "../hooks/useArbitro";
import { necesitaOnboardingArbitro } from "../utils/onboarding";
import { ROUTES } from "@/lib/constants";

export function ArbitroDashboardGuard() {
  const { arbitro, obtenerPerfil, isLoading } = useArbitro();
  const [verificacionHecha, setVerificacionHecha] = useState(false);
  const efectoEjecutado = useRef(false);

  useEffect(() => {
    if (efectoEjecutado.current) return;
    efectoEjecutado.current = true;

    obtenerPerfil()
      .then(() => setVerificacionHecha(true))
      .catch(() => setVerificacionHecha(true));
  }, [obtenerPerfil]);

  // No decidir nada hasta haber intentado cargar el perfil al menos una vez
  if (!verificacionHecha || (isLoading && !arbitro)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (necesitaOnboardingArbitro(arbitro)) {
    return <Navigate to={ROUTES.ARBITRO_ONBOARDING} replace />;
  }

  return <ArbitroDashboardPage />;
}
