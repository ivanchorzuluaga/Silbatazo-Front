/**
 * Página de gestión completa de árbitros (Panel de administrador)
 * Permite ver todos los árbitros, filtrar, suspender, ver documentos, etc.
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/layout";
import { FilterTabs } from "@/components/ui/FilterTabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGestionArbitros } from "../hooks/useGestionArbitros";
import { ROUTES, getVerificarArbitroRoute } from "@/lib/constants";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

const TABS_ESTADO_ARBITRO: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "en_revision", label: "En Revisión" },
  { value: "aprobado", label: "Aprobado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "suspendido", label: "Suspendido" },
];

// Utilidad para obtener color del badge según estado
function getEstadoBadgeColor(estado: string): string {
  const colores: Record<string, string> = {
    pendiente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    en_revision: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    aprobado: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    rechazado: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    suspendido: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  };
  return colores[estado] || "bg-muted text-muted-foreground";
}

// Componente de filtros (estado se maneja con tabs arriba)
interface FiltrosArbitrosProps {
  filtros: { estado: string; busqueda: string; ordenamiento: string };
  onOrdenamientoChange: (ordenamiento: string) => void;
  onBusquedaChange: (busqueda: string) => void;
  onBuscar: () => void;
}

function FiltrosArbitros({
  filtros,
  onOrdenamientoChange,
  onBusquedaChange,
  onBuscar,
}: FiltrosArbitrosProps) {
  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-ios backdrop-blur">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Ordenar por</label>
          <select
            value={filtros.ordenamiento}
            onChange={(e) => onOrdenamientoChange(e.target.value)}
            className="field-select"
          >
            <option value="-created_at">Más recientes</option>
            <option value="created_at">Más antiguos</option>
            <option value="-experiencia_anos">Más experiencia</option>
            <option value="experiencia_anos">Menos experiencia</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="text-sm font-medium mb-2 block">Buscar</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar por nombre, email o username..."
              value={filtros.busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onBuscar()}
              className="flex-1"
            />
            <Button onClick={onBuscar}>Buscar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de tarjeta de árbitro
interface ArbitroCardProps {
  arbitro: Arbitro;
  onVerDetalles: (id: number) => void;
  onSuspender: (arbitro: Arbitro) => void;
  onActivar: (arbitro: Arbitro) => void;
}

function ArbitroCard({ arbitro, onVerDetalles, onSuspender, onActivar }: ArbitroCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold">{arbitro.full_name || arbitro.username}</h3>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${getEstadoBadgeColor(
                arbitro.estado_verificacion
              )}`}
            >
              {arbitro.estado_verificacion_display}
            </span>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            {arbitro.email && <p>📧 {arbitro.email}</p>}
            {arbitro.telefono && <p>📞 {arbitro.telefono}</p>}
            {arbitro.experiencia_anos > 0 && (
              <p>
                ⭐ {arbitro.experiencia_anos} {arbitro.experiencia_anos === 1 ? "año" : "años"} de
                experiencia
              </p>
            )}
            {arbitro.municipios.length > 0 && (
              <p>📍 {arbitro.municipios.map((m) => m.nombre).join(", ")}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
          <Button variant="outline" size="sm" onClick={() => onVerDetalles(arbitro.id)}>
            Ver Detalles
          </Button>
          {arbitro.estado_verificacion === "aprobado" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSuspender(arbitro)}
              className="border-orange-500 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              Suspender
            </Button>
          )}
          {(arbitro.estado_verificacion === "suspendido" ||
            arbitro.estado_verificacion === "rechazado") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onActivar(arbitro)}
              className="border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
            >
              Activar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Modal de confirmación
interface ConfirmacionModalProps {
  open: boolean;
  titulo: string;
  arbitro: Arbitro | null;
  comentarios: string;
  onComentariosChange: (value: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  isProcesando: boolean;
  tipo: "suspender" | "activar";
}

function ConfirmacionModal({
  open,
  titulo,
  arbitro,
  comentarios,
  onComentariosChange,
  onConfirmar,
  onCancelar,
  isProcesando,
  tipo,
}: ConfirmacionModalProps) {
  if (!arbitro) return null;

  const esActivar = tipo === "activar";
  const labelComentarios = esActivar
    ? "Comentarios (opcional)"
    : "Motivo de la suspensión (recomendado)";
  const placeholder = esActivar
    ? "Comentarios sobre la activación..."
    : "Explica el motivo de la suspensión...";
  const botonTexto = esActivar ? "Confirmar Activación" : "Confirmar Suspensión";
  const botonProcesando = esActivar ? "Activando..." : "Suspendiendo...";

  return (
    <Dialog open={open} onOpenChange={onCancelar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Árbitro: <span className="font-medium">{arbitro.full_name || arbitro.username}</span>
          </p>
          <div>
            <label className="text-sm font-medium block mb-2">{labelComentarios}</label>
            <textarea
              value={comentarios}
              onChange={(e) => onComentariosChange(e.target.value)}
              className="field-textarea min-h-[100px]"
              placeholder={placeholder}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancelar} disabled={isProcesando}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirmar}
            disabled={isProcesando}
            variant={esActivar ? "default" : "destructive"}
            className={esActivar ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isProcesando ? botonProcesando : botonTexto}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente principal
export function GestionArbitrosPage() {
  const navigate = useNavigate();
  const {
    arbitros,
    isLoading,
    error,
    filtros,
    setFiltroEstado,
    setBusqueda,
    setOrdenamiento,
    arbitroSeleccionado,
    showSuspenderModal,
    showActivarModal,
    comentarios,
    isProcesando,
    handleBuscar,
    handleSuspender,
    handleActivar,
    confirmarSuspender,
    confirmarActivar,
    cerrarModales,
    setComentarios,
  } = useGestionArbitros();

  const handleVerDetalles = (id: number) => {
    navigate(getVerificarArbitroRoute(id));
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Gestión de Árbitros"
      contentClassName="page-surface"
    >
      {/* Header Section */}
      <div className="mb-6 space-y-4">
        <p className="text-muted-foreground">
          Administra todos los árbitros registrados en la plataforma
        </p>
      </div>

      {/* Tabs por estado */}
      <FilterTabs
        className="mb-6"
        label="Estado de verificación"
        tabs={TABS_ESTADO_ARBITRO}
        value={filtros.estado}
        onValueChange={setFiltroEstado}
      />

      {/* Filtros */}
      <FiltrosArbitros
        filtros={filtros}
        onOrdenamientoChange={setOrdenamiento}
        onBusquedaChange={setBusqueda}
        onBuscar={handleBuscar}
      />

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando árbitros...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && arbitros.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <p className="text-lg text-muted-foreground">No se encontraron árbitros</p>
          <p className="text-sm text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Lista de árbitros */}
      {!isLoading && !error && arbitros.length > 0 && (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {arbitros.length}{" "}
              {arbitros.length === 1 ? "árbitro encontrado" : "árbitros encontrados"}
            </p>
          </div>
          <div className="space-y-4">
            {arbitros.map((arbitro) => (
              <ArbitroCard
                key={arbitro.id}
                arbitro={arbitro}
                onVerDetalles={handleVerDetalles}
                onSuspender={handleSuspender}
                onActivar={handleActivar}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal Suspender */}
      <ConfirmacionModal
        open={showSuspenderModal}
        titulo="Suspender Árbitro"
        arbitro={arbitroSeleccionado}
        comentarios={comentarios}
        onComentariosChange={setComentarios}
        onConfirmar={confirmarSuspender}
        onCancelar={cerrarModales}
        isProcesando={isProcesando}
        tipo="suspender"
      />

      {/* Modal Activar */}
      <ConfirmacionModal
        open={showActivarModal}
        titulo="Activar Árbitro"
        arbitro={arbitroSeleccionado}
        comentarios={comentarios}
        onComentariosChange={setComentarios}
        onConfirmar={confirmarActivar}
        onCancelar={cerrarModales}
        isProcesando={isProcesando}
        tipo="activar"
      />
    </PageLayout>
  );
}
