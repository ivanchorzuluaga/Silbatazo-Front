/**
 * Página para que el cliente complete o edite su perfil (nombre y email)
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { PageLayout } from "@/components/layout";
import { PerfilClienteForm } from "../components/PerfilClienteForm";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";

export function PerfilClientePage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { user, isLoading, error, obtenerPerfil, actualizarPerfil, clearError } = useUserProfile();
  const cargaHecha = useRef(false);

  useEffect(() => {
    if (cargaHecha.current) return;
    cargaHecha.current = true;
    obtenerPerfil().catch(() => {});
  }, [obtenerPerfil]);

  const handleSubmit = async (data: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }) => {
    const actualizado = await actualizarPerfil(data);
    updateUser(actualizado);
    navigate(ROUTES.CLIENTE_DASHBOARD, { replace: true });
  };

  return (
    <PageLayout
      title="Mi perfil"
      backButton={{ label: "Dashboard", to: ROUTES.CLIENTE_DASHBOARD }}
      contentClassName="container max-w-md mx-auto p-4 sm:p-6 pb-nav-mobile"
    >
      <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Datos personales</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Completa tu nombre y correo para que podamos contactarte sobre tus partidos.
        </p>
        {isLoading && !user ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : (
          <PerfilClienteForm
            user={user}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
          />
        )}
      </div>
    </PageLayout>
  );
}
