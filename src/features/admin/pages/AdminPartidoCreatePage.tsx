/**
 * Página admin para crear partidos abiertos
 */

import { PageLayout } from "@/components/layout";
import { PartidoForm } from "@/features/partidos/components/PartidoForm";
import { partidoService } from "@/features/partidos/services/partido.service";
import { ROUTES } from "@/lib/constants";

export function AdminPartidoCreatePage() {
  return (
    <PageLayout
      backButton={{ label: "Gestión de Partidos", to: ROUTES.ADMIN_GESTION_PARTIDOS }}
      title="Crear Partido Abierto"
      contentClassName="page-surface max-w-3xl"
    >
      <PartidoForm
        modoAdmin={true}
        onCreate={async (data) => {
          const partido = await partidoService.crearPartidoAdmin(data);
          return { id: partido.id, estado: partido.estado };
        }}
        onSuccess={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </PageLayout>
  );
}
