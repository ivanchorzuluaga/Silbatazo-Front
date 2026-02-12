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
  const nombreCompleto =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || "Cliente";
  const iniciales = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`
    .toUpperCase()
    .trim();

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
      contentClassName="page-surface max-w-3xl pb-nav-mobile"
    >
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background/10 to-secondary/15 p-5 sm:p-8 shadow-xl">
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-background/80 text-lg font-semibold text-primary shadow-md">
                {iniciales || "CL"}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Perfil de cliente
                </p>
                <h1 className="text-2xl sm:text-3xl font-semibold">{nombreCompleto}</h1>
                {user?.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
              </div>
            </div>
            <div className="rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold">
              Información verificada por ti
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-5 sm:p-8 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Datos personales</h2>
              <p className="text-sm text-muted-foreground">
                Mantén tu información actualizada para recibir novedades y soporte.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-4 sm:p-8 shadow-lg backdrop-blur">
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
      </div>
    </PageLayout>
  );
}
