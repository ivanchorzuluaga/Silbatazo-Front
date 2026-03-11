/**
 * Página de gestión de tipos de partido (solo admin)
 */

import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useTiposPartidoAdmin } from "../hooks/useTiposPartidoAdmin";
import { TipoPartidoCard } from "../components/TipoPartidoCard";
import { TipoPartidoForm } from "../components/TipoPartidoForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type {
  TipoPartidoAdmin,
  TipoPartidoCreateData,
  TipoPartidoUpdateData,
} from "@/features/partidos/types/partido.types";

export function TiposPartidoPage() {
  const { tipos, isLoading, error, crearTipo, actualizarTipo, eliminarTipo, clearError } =
    useTiposPartidoAdmin();

  const [showForm, setShowForm] = useState(false);
  const [tipoEditando, setTipoEditando] = useState<TipoPartidoAdmin | null>(null);
  const activos = tipos.filter((tipo) => tipo.activo).length;
  const inactivos = tipos.length - activos;

  const handleCreate = () => {
    setTipoEditando(null);
    setShowForm(true);
  };

  const handleEdit = (tipo: TipoPartidoAdmin) => {
    setTipoEditando(tipo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTipoEditando(null);
  };

  const handleSubmit = async (data: TipoPartidoCreateData | TipoPartidoUpdateData) => {
    try {
      if (tipoEditando) {
        await actualizarTipo(tipoEditando.id, data as TipoPartidoUpdateData);
      } else {
        await crearTipo(data as TipoPartidoCreateData);
      }
      handleCloseForm();
    } catch {
      // El error ya está en el hook
    }
  };

  const handleToggleActivo = async (id: number, activo: boolean) => {
    try {
      await actualizarTipo(id, { activo });
    } catch {
      // El error ya está en el hook
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarTipo(id);
    } catch {
      // El error ya está en el hook
    }
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Tipos de partido"
      contentClassName="page-surface"
    >
      <div className="space-y-6">
        <div className="card-surface-strong p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Tipos de partido</h1>
              <p className="text-muted-foreground mt-1">
                Define lo que verá el cliente al crear un partido: nombre, duración y precio.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-semibold">
                  {activos} activos
                </span>
                <span className="rounded-full bg-muted/60 text-muted-foreground px-3 py-1 font-semibold">
                  {inactivos} inactivos
                </span>
                <span className="rounded-full bg-muted/60 text-muted-foreground px-3 py-1 font-semibold">
                  {tipos.length} total
                </span>
              </div>
            </div>
            <Button onClick={handleCreate} disabled={isLoading} className="h-10">
              Crear tipo de partido
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Cerrar
              </Button>
            </div>
          </div>
        )}

        {isLoading && tipos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando tipos de partido...</p>
          </div>
        )}

        {!isLoading && tipos.length === 0 && (
          <div className="text-center py-12 rounded-lg border bg-card">
            <p className="text-muted-foreground mb-4">
              No hay tipos de partido. Crea el primero para que los clientes puedan elegir al
              solicitar un partido.
            </p>
            <Button onClick={handleCreate}>Crear primer tipo de partido</Button>
          </div>
        )}

        {tipos.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tipos.map((tipo) => (
              <TipoPartidoCard
                key={tipo.id}
                tipo={tipo}
                onEdit={handleEdit}
                onToggleActivo={handleToggleActivo}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="w-[min(96vw,80rem)] max-w-7xl self-center max-h-[calc(100dvh-10rem)] sm:max-h-[calc(100dvh-12rem)] p-4 sm:p-5">
            <DialogHeader>
              <DialogTitle>
                {tipoEditando ? "Editar tipo de partido" : "Crear tipo de partido"}
              </DialogTitle>
            </DialogHeader>
            <TipoPartidoForm
              tipo={tipoEditando || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
