/**
 * Página de billetera para árbitros
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageLayout } from "@/components/layout";
import { useRetiros } from "../hooks/useRetiros";
import { RetiroForm } from "../components/RetiroForm";
import { RetiroCard } from "../components/RetiroCard";
import { ROUTES } from "@/lib/constants";
import { formatCop } from "@/lib/utils";

export function BilleteraPage() {
  const {
    retiros,
    saldo,
    isLoading,
    isLoadingSaldo,
    isLoadingList,
    error,
    listarRetiros,
    obtenerSaldo,
    clearError,
  } = useRetiros();
  const [showFormModal, setShowFormModal] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<
    "pendiente" | "procesado" | "rechazado" | "todos"
  >("todos");

  useEffect(() => {
    obtenerSaldo();
    listarRetiros();
  }, [obtenerSaldo, listarRetiros]);

  const handleFormSuccess = () => {
    setShowFormModal(false);
    obtenerSaldo();
    listarRetiros();
  };

  const retirosFiltrados =
    filtroEstado === "todos" ? retiros : retiros.filter((r) => r.estado === filtroEstado);

  return (
    <PageLayout
      title="Mi Billetera"
      backButton={{ label: "Dashboard", to: ROUTES.ARBITRO_DASHBOARD }}
      contentClassName="page-surface max-w-4xl"
    >
      <div className="space-y-6">
        {/* Resumen de saldo - siempre visible */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Saldo Disponible</p>
            {isLoadingSaldo ? (
              <p className="text-2xl font-bold text-primary animate-pulse">—</p>
            ) : (
              <p className="text-2xl font-bold text-primary">
                {formatCop(saldo?.saldo_real_disponible ?? 0)}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">COP</p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Total Ingresos</p>
            {isLoadingSaldo ? (
              <p className="text-2xl font-bold text-green-600 animate-pulse">—</p>
            ) : (
              <p className="text-2xl font-bold text-green-600">
                {formatCop(saldo?.total_ingresos ?? 0)}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {saldo?.partidos_completados ?? 0} partidos
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground mb-1">Total Retirado</p>
            {isLoadingSaldo ? (
              <p className="text-2xl font-bold text-muted-foreground animate-pulse">—</p>
            ) : (
              <p className="text-2xl font-bold text-muted-foreground">
                {formatCop(saldo?.total_retirado ?? 0)}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">COP</p>
          </div>
        </div>
        {!isLoadingSaldo && !isLoadingList && error && (
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm text-destructive flex-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearError();
                obtenerSaldo();
                listarRetiros();
              }}
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Mis Retiros</h2>
          <Button
            onClick={() => setShowFormModal(true)}
            disabled={isLoading || isLoadingSaldo || (saldo?.saldo_real_disponible ?? 0) <= 0}
          >
            Solicitar Retiro
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filtroEstado === "todos" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("todos")}
          >
            Todos
          </Button>
          <Button
            variant={filtroEstado === "pendiente" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("pendiente")}
          >
            Pendientes
          </Button>
          <Button
            variant={filtroEstado === "procesado" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("procesado")}
          >
            Procesados
          </Button>
          <Button
            variant={filtroEstado === "rechazado" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado("rechazado")}
          >
            Rechazados
          </Button>
        </div>

        {/* Lista de retiros */}
        {isLoadingList && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando retiros...</p>
          </div>
        )}

        {!isLoadingList && (
          <>
            {retirosFiltrados.length === 0 ? (
              <div className="text-center py-12 rounded-lg border bg-card">
                <p className="text-muted-foreground mb-4">
                  {filtroEstado === "todos"
                    ? "No has realizado ningún retiro aún."
                    : `No hay retiros ${filtroEstado}.`}
                </p>
                {filtroEstado === "todos" && (saldo?.saldo_real_disponible ?? 0) > 0 && (
                  <Button onClick={() => setShowFormModal(true)}>Solicitar Primer Retiro</Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {retirosFiltrados.map((retiro) => (
                  <RetiroCard key={retiro.id} retiro={retiro} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de formulario */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto pb-24 sm:pb-6 ios-scroll">
          <DialogHeader>
            <DialogTitle>Solicitar Retiro</DialogTitle>
          </DialogHeader>
          <RetiroForm
            saldo={saldo}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowFormModal(false)}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
