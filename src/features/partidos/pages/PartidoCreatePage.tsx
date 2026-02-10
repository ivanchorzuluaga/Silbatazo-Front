/**
 * Página para crear un nuevo partido
 */

import { PartidoForm } from "../components/PartidoForm";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { ROUTES } from "@/lib/constants";

export function PartidoCreatePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <PageLayout
      backButton={{ label: "Volver a Dashboard", to: ROUTES.DASHBOARD }}
      contentClassName="page-surface max-w-3xl"
    >
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Crear Nuevo Partido</h1>
        <p className="text-muted-foreground mt-1">
          Solicita un árbitro para tu partido
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
        <PartidoForm onSuccess={handleSuccess} />
      </div>
    </PageLayout>
  );
}
