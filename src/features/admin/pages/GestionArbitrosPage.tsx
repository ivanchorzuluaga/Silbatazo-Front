/**
 * Página de gestión completa de árbitros (Panel de administrador)
 * Permite ver todos los árbitros, filtrar, suspender, ver documentos, etc.
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { arbitroService } from "@/features/arbitro/services/arbitro.service";
import { ROUTES, getVerificarArbitroRoute } from "@/lib/constants";
import type { Arbitro, ArbitroVerificacionData } from "@/features/arbitro/types/arbitro.types";

export function GestionArbitrosPage() {
  const navigate = useNavigate();
  const [arbitros, setArbitros] = useState<Arbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [busqueda, setBusqueda] = useState("");
  const [ordenamiento, setOrdenamiento] = useState<string>("-created_at");

  // Estados para modales
  const [arbitroSeleccionado, setArbitroSeleccionado] = useState<Arbitro | null>(null);
  const [showSuspenderModal, setShowSuspenderModal] = useState(false);
  const [showActivarModal, setShowActivarModal] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [isProcesando, setIsProcesando] = useState(false);

  const cargarArbitros = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: {
        estado?: string;
        search?: string;
        ordering?: string;
      } = {};

      if (filtroEstado) {
        params.estado = filtroEstado;
      }
      if (busqueda) {
        params.search = busqueda;
      }
      if (ordenamiento) {
        params.ordering = ordenamiento;
      }

      const data = await arbitroService.listarTodos(params);
      setArbitros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar árbitros");
    } finally {
      setIsLoading(false);
    }
  }, [filtroEstado, ordenamiento, busqueda]);

  useEffect(() => {
    cargarArbitros();
  }, [cargarArbitros]);

  const handleBuscar = () => {
    cargarArbitros();
  };

  const handleSuspender = (arbitro: Arbitro) => {
    setArbitroSeleccionado(arbitro);
    setComentarios("");
    setShowSuspenderModal(true);
  };

  const handleActivar = (arbitro: Arbitro) => {
    setArbitroSeleccionado(arbitro);
    setComentarios("");
    setShowActivarModal(true);
  };

  const confirmarSuspender = async () => {
    if (!arbitroSeleccionado) return;

    setIsProcesando(true);
    setError(null);

    try {
      const data: ArbitroVerificacionData = {
        estado: "suspendido",
        comentarios: comentarios.trim() || undefined,
      };

      await arbitroService.verificarArbitro(arbitroSeleccionado.id, data);
      await cargarArbitros();
      setShowSuspenderModal(false);
      setArbitroSeleccionado(null);
      setComentarios("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al suspender árbitro");
    } finally {
      setIsProcesando(false);
    }
  };

  const confirmarActivar = async () => {
    if (!arbitroSeleccionado) return;

    setIsProcesando(true);
    setError(null);

    try {
      const data: ArbitroVerificacionData = {
        estado: "aprobado",
        comentarios: comentarios.trim() || undefined,
      };

      await arbitroService.verificarArbitro(arbitroSeleccionado.id, data);
      await cargarArbitros();
      setShowActivarModal(false);
      setArbitroSeleccionado(null);
      setComentarios("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al activar árbitro");
    } finally {
      setIsProcesando(false);
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "en_revision":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "aprobado":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "rechazado":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "suspendido":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background safe-area-inset">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
              ← Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-6 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Árbitros</h1>
            <p className="text-muted-foreground">
              Administra todos los árbitros registrados en la plataforma
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-6 space-y-4 rounded-lg border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="aprobado">Aprobado</option>
                  <option value="rechazado">Rechazado</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <select
                  value={ordenamiento}
                  onChange={(e) => setOrdenamiento(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="-created_at">Más recientes</option>
                  <option value="created_at">Más antiguos</option>
                  <option value="-experiencia_anos">Más experiencia</option>
                  <option value="experiencia_anos">Menos experiencia</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, email o username..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                    className="flex-1"
                  />
                  <Button onClick={handleBuscar}>Buscar</Button>
                </div>
              </div>
            </div>
          </div>

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
              <p className="text-sm text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
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
                  <div
                    key={arbitro.id}
                    className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">
                            {arbitro.full_name || arbitro.username}
                          </h3>
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
                              ⭐ {arbitro.experiencia_anos}{" "}
                              {arbitro.experiencia_anos === 1 ? "año" : "años"} de experiencia
                            </p>
                          )}
                          {arbitro.municipios.length > 0 && (
                            <p>📍 {arbitro.municipios.map((m) => m.nombre).join(", ")}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(getVerificarArbitroRoute(arbitro.id))}
                        >
                          Ver Detalles
                        </Button>
                        {arbitro.estado_verificacion === "aprobado" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuspender(arbitro)}
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
                            onClick={() => handleActivar(arbitro)}
                            className="border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                          >
                            Activar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Suspender */}
      {showSuspenderModal && arbitroSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Suspender Árbitro</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Árbitro:{" "}
                  <span className="font-medium">
                    {arbitroSeleccionado.full_name || arbitroSeleccionado.username}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">
                  Motivo de la suspensión (recomendado)
                </label>
                <textarea
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Explica el motivo de la suspensión..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={confirmarSuspender}
                  variant="destructive"
                  disabled={isProcesando}
                  className="flex-1"
                >
                  {isProcesando ? "Suspendiendo..." : "Confirmar Suspensión"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuspenderModal(false);
                    setArbitroSeleccionado(null);
                    setComentarios("");
                  }}
                  disabled={isProcesando}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Activar */}
      {showActivarModal && arbitroSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Activar Árbitro</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Árbitro:{" "}
                  <span className="font-medium">
                    {arbitroSeleccionado.full_name || arbitroSeleccionado.username}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Comentarios (opcional)</label>
                <textarea
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Comentarios sobre la activación..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={confirmarActivar}
                  disabled={isProcesando}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isProcesando ? "Activando..." : "Confirmar Activación"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowActivarModal(false);
                    setArbitroSeleccionado(null);
                    setComentarios("");
                  }}
                  disabled={isProcesando}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
