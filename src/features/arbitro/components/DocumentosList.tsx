/**
 * Componente para listar documentos de árbitro
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDocumentos } from "../hooks/useDocumentos";
import type { EstadoDocumento } from "../types/arbitro.types";

interface DocumentosListProps {
  onDocumentDeleted?: () => void;
  refreshKey?: number; // Para forzar refresco cuando cambia
}

const ESTADO_COLORS: Record<EstadoDocumento, string> = {
  pendiente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  aprobado: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  rechazado: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const ESTADO_LABELS: Record<EstadoDocumento, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

const TIPO_LABELS: Record<string, string> = {
  certificacion: "Certificación",
  identificacion: "Identificación",
  seguro: "Seguro",
  otro: "Otro",
};

export function DocumentosList({ onDocumentDeleted, refreshKey }: DocumentosListProps) {
  const { documentos, listarDocumentos, eliminarDocumento, isLoading, error } = useDocumentos();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    listarDocumentos().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]); // Refrescar cuando cambie refreshKey

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este documento?")) {
      return;
    }

    setDeletingId(id);
    try {
      await eliminarDocumento(id);
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (err) {
      console.error("Error al eliminar documento:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading && documentos.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground text-center">Cargando documentos...</p>
      </div>
    );
  }

  if (error && documentos.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-destructive text-center">{error}</p>
      </div>
    );
  }

  if (documentos.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-muted-foreground text-center">
          No tienes documentos cargados. Sube tu primer documento arriba.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mis Documentos ({documentos.length})</h3>
      </div>

      <div className="space-y-3">
        {documentos.map((documento) => (
          <div
            key={documento.id}
            className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">
                    {documento.nombre || TIPO_LABELS[documento.tipo] || documento.tipo_display}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${
                      ESTADO_COLORS[documento.estado]
                    }`}
                  >
                    {documento.estado_display || ESTADO_LABELS[documento.estado]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {TIPO_LABELS[documento.tipo] || documento.tipo_display}
                  </span>
                </div>

                {documento.comentarios && (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Comentarios:</p>
                    <p className="whitespace-pre-wrap">{documento.comentarios}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Subido: {formatDate(documento.created_at)}</span>
                  {documento.fecha_revision && (
                    <span>Revisado: {formatDate(documento.fecha_revision)}</span>
                  )}
                </div>

                <div className="pt-2">
                  <a
                    href={documento.archivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Ver documento
                  </a>
                </div>
              </div>

              {documento.estado === "pendiente" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(documento.id)}
                  disabled={deletingId === documento.id}
                  className="shrink-0"
                >
                  {deletingId === documento.id ? "Eliminando..." : "Eliminar"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
