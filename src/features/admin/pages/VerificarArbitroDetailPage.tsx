/**
 * Página de detalle para verificar un árbitro
 * Permite ver documentos, información y aprobar/rechazar
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { arbitroService } from "@/features/arbitro/services/arbitro.service";
import { ROUTES } from "@/lib/constants";
import type {
  Arbitro,
  DocumentoArbitro,
  ArbitroVerificacionData,
} from "@/features/arbitro/types/arbitro.types";

export function VerificarArbitroDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [arbitro, setArbitro] = useState<Arbitro | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoArbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerificando, setIsVerificando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comentarios, setComentarios] = useState("");
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  // Estados para revisión de documentos
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<DocumentoArbitro | null>(null);
  const [comentariosDocumento, setComentariosDocumento] = useState("");
  const [showAprobarDocumentoModal, setShowAprobarDocumentoModal] = useState(false);
  const [showRechazarDocumentoModal, setShowRechazarDocumentoModal] = useState(false);
  const [isRevisandoDocumento, setIsRevisandoDocumento] = useState(false);

  useEffect(() => {
    if (id) {
      cargarDatos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cargarDatos = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [arbitroData, documentosData] = await Promise.all([
        arbitroService.obtenerArbitro(parseInt(id)),
        arbitroService.listarDocumentosArbitro(parseInt(id)),
      ]);
      setArbitro(arbitroData);
      setDocumentos(documentosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificar = async (estado: "aprobado" | "rechazado") => {
    if (!arbitro || !id) return;

    setIsVerificando(true);
    setError(null);

    try {
      const data: ArbitroVerificacionData = {
        estado,
        comentarios: comentarios.trim() || undefined,
      };

      await arbitroService.verificarArbitro(parseInt(id), data);

      // Redirigir a la lista de pendientes
      navigate(ROUTES.ADMIN_VERIFICACION);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al verificar árbitro");
      setIsVerificando(false);
    }
  };

  const handleAprobar = () => {
    setShowAprobarModal(true);
  };

  const handleRechazar = () => {
    setShowRechazarModal(true);
  };

  const confirmarAprobar = () => {
    handleVerificar("aprobado");
    setShowAprobarModal(false);
  };

  const confirmarRechazar = () => {
    handleVerificar("rechazado");
    setShowRechazarModal(false);
  };

  // Funciones para revisar documentos
  const handleAprobarDocumento = (doc: DocumentoArbitro) => {
    setDocumentoSeleccionado(doc);
    setComentariosDocumento("");
    setShowAprobarDocumentoModal(true);
  };

  const handleRechazarDocumento = (doc: DocumentoArbitro) => {
    setDocumentoSeleccionado(doc);
    setComentariosDocumento("");
    setShowRechazarDocumentoModal(true);
  };

  const confirmarAprobarDocumento = async () => {
    if (!documentoSeleccionado) return;

    setIsRevisandoDocumento(true);
    setError(null);

    try {
      await arbitroService.revisarDocumento(documentoSeleccionado.id, {
        estado: "aprobado",
        comentarios: comentariosDocumento.trim() || undefined,
      });

      // Recargar documentos
      await cargarDatos();
      setShowAprobarDocumentoModal(false);
      setDocumentoSeleccionado(null);
      setComentariosDocumento("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aprobar documento");
    } finally {
      setIsRevisandoDocumento(false);
    }
  };

  const confirmarRechazarDocumento = async () => {
    if (!documentoSeleccionado) return;

    setIsRevisandoDocumento(true);
    setError(null);

    try {
      await arbitroService.revisarDocumento(documentoSeleccionado.id, {
        estado: "rechazado",
        comentarios: comentariosDocumento.trim() || undefined,
      });

      // Recargar documentos
      await cargarDatos();
      setShowRechazarDocumentoModal(false);
      setDocumentoSeleccionado(null);
      setComentariosDocumento("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al rechazar documento");
    } finally {
      setIsRevisandoDocumento(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background safe-area-inset">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando árbitro...</p>
        </div>
      </div>
    );
  }

  if (error && !arbitro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background safe-area-inset">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => navigate(ROUTES.ADMIN_VERIFICACION)}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  if (!arbitro) {
    return null;
  }

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
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEstadoDocumentoColor = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "rechazado":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "pendiente":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
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
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.ADMIN_VERIFICACION)}>
              ← Volver
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Información principal */}
          <div className="mb-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {arbitro.full_name || arbitro.username}
                  </h1>
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${getEstadoBadgeColor(
                      arbitro.estado_verificacion
                    )}`}
                  >
                    {arbitro.estado_verificacion_display}
                  </span>
                </div>
                {arbitro.email && <p className="text-muted-foreground">{arbitro.email}</p>}
                {arbitro.telefono && (
                  <p className="text-sm text-muted-foreground">📞 {arbitro.telefono}</p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            {(arbitro.estado_verificacion === "pendiente" ||
              arbitro.estado_verificacion === "en_revision") && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button onClick={handleAprobar} disabled={isVerificando} className="flex-1">
                  Aprobar Árbitro
                </Button>
                <Button
                  onClick={handleRechazar}
                  variant="destructive"
                  disabled={isVerificando}
                  className="flex-1"
                >
                  Rechazar Árbitro
                </Button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Información profesional */}
          <div className="space-y-6">
            {/* Experiencia */}
            {arbitro.experiencia_anos > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Experiencia</h2>
                <p className="text-muted-foreground">
                  {arbitro.experiencia_anos} {arbitro.experiencia_anos === 1 ? "año" : "años"} de
                  experiencia
                </p>
              </div>
            )}

            {/* Biografía */}
            {arbitro.biografia && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Biografía</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{arbitro.biografia}</p>
              </div>
            )}

            {/* Municipios */}
            {arbitro.municipios.length > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Áreas de Cobertura</h2>
                <div className="flex flex-wrap gap-2">
                  {arbitro.municipios.map((municipio) => (
                    <span
                      key={municipio.id}
                      className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 text-sm font-medium"
                    >
                      {municipio.nombre}
                      {municipio.departamento && `, ${municipio.departamento}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categorías */}
            {arbitro.categorias.length > 0 && (
              <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Categorías</h2>
                <div className="flex flex-wrap gap-2">
                  {arbitro.categorias.map((categoria) => (
                    <span
                      key={categoria.id}
                      className="inline-flex items-center rounded-md bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium"
                    >
                      {categoria.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Documentos */}
            <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Documentos</h2>
              {documentos.length === 0 ? (
                <p className="text-muted-foreground">No hay documentos cargados</p>
              ) : (
                <div className="space-y-4">
                  {documentos.map((doc) => (
                    <div key={doc.id} className="rounded-md border p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{doc.nombre || doc.tipo_display}</p>
                            <span
                              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getEstadoDocumentoColor(
                                doc.estado
                              )}`}
                            >
                              {doc.estado_display}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{doc.tipo_display}</p>
                          {doc.comentarios && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              💬 {doc.comentarios}
                            </p>
                          )}
                          {doc.fecha_revision && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Revisado el {new Date(doc.fecha_revision).toLocaleDateString("es-ES")}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {doc.archivo_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(doc.archivo_url, "_blank")}
                            >
                              Ver Documento
                            </Button>
                          )}
                          {doc.estado === "pendiente" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAprobarDocumento(doc)}
                                disabled={isRevisandoDocumento}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRechazarDocumento(doc)}
                                disabled={isRevisandoDocumento}
                              >
                                Rechazar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Aprobar */}
      {showAprobarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Aprobar Árbitro</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Comentarios (opcional)</label>
                <textarea
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Comentarios sobre la aprobación..."
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={confirmarAprobar} disabled={isVerificando} className="flex-1">
                  {isVerificando ? "Aprobando..." : "Confirmar Aprobación"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAprobarModal(false);
                    setComentarios("");
                  }}
                  disabled={isVerificando}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rechazar */}
      {showRechazarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Rechazar Árbitro</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Motivo del rechazo (recomendado)
                </label>
                <textarea
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Explica el motivo del rechazo..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={confirmarRechazar}
                  variant="destructive"
                  disabled={isVerificando}
                  className="flex-1"
                >
                  {isVerificando ? "Rechazando..." : "Confirmar Rechazo"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRechazarModal(false);
                    setComentarios("");
                  }}
                  disabled={isVerificando}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aprobar Documento */}
      {showAprobarDocumentoModal && documentoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Aprobar Documento</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Documento:{" "}
                  <span className="font-medium">
                    {documentoSeleccionado.nombre || documentoSeleccionado.tipo_display}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Comentarios (opcional)</label>
                <textarea
                  value={comentariosDocumento}
                  onChange={(e) => setComentariosDocumento(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Comentarios sobre la aprobación del documento..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={confirmarAprobarDocumento}
                  disabled={isRevisandoDocumento}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isRevisandoDocumento ? "Aprobando..." : "Confirmar Aprobación"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAprobarDocumentoModal(false);
                    setDocumentoSeleccionado(null);
                    setComentariosDocumento("");
                  }}
                  disabled={isRevisandoDocumento}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rechazar Documento */}
      {showRechazarDocumentoModal && documentoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Rechazar Documento</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Documento:{" "}
                  <span className="font-medium">
                    {documentoSeleccionado.nombre || documentoSeleccionado.tipo_display}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">
                  Motivo del rechazo (recomendado)
                </label>
                <textarea
                  value={comentariosDocumento}
                  onChange={(e) => setComentariosDocumento(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder="Explica el motivo del rechazo del documento..."
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={confirmarRechazarDocumento}
                  variant="destructive"
                  disabled={isRevisandoDocumento}
                  className="flex-1"
                >
                  {isRevisandoDocumento ? "Rechazando..." : "Confirmar Rechazo"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRechazarDocumentoModal(false);
                    setDocumentoSeleccionado(null);
                    setComentariosDocumento("");
                  }}
                  disabled={isRevisandoDocumento}
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
