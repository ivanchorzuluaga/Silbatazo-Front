/**
 * Página de correos fallidos (outbox) para administradores
 */

import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ROUTES } from "@/lib/constants";
import { useEmailOutbox } from "../hooks/useEmailOutbox";
import { EmailOutboxCard } from "../components/EmailOutboxCard";

type FiltroCorreo = "todos" | "fallido" | "pendiente" | "enviado";

const TABS_CORREO: { value: FiltroCorreo; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "fallido", label: "Fallidos" },
  { value: "pendiente", label: "Pendientes" },
  { value: "enviado", label: "Enviados" },
];

export function EmailsOutboxPage() {
  const { emails, isLoading, error, listar, reenviar } = useEmailOutbox();
  const [tabEstado, setTabEstado] = useState<FiltroCorreo>("fallido");

  useEffect(() => {
    listar(tabEstado === "todos" ? undefined : tabEstado);
  }, [listar, tabEstado]);

  return (
    <PageLayout
      title="Correos fallidos"
      backButton={{ label: "Dashboard Admin", to: ROUTES.ADMIN_DASHBOARD }}
      contentClassName="page-surface"
    >
      <div className="space-y-6">
        <FilterTabs
          label="Estado"
          tabs={TABS_CORREO}
          value={tabEstado}
          onValueChange={setTabEstado}
        />

        {error && (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando correos...</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-12 rounded-lg border bg-card">
            <p className="text-muted-foreground">No hay correos en este estado.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emails.map((email) => (
              <EmailOutboxCard
                key={email.id}
                email={email}
                onReenviar={reenviar}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
