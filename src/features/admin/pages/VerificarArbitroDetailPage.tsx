/**
 * Página de detalle para verificar un árbitro
 * Permite ver documentos, información y aprobar/rechazar
 */

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useVerificarArbitro } from "../hooks/useVerificarArbitro";
import { ROUTES } from "@/lib/constants";
import type { DocumentoArbitro } from "@/features/arbitro/types/arbitro.types";

// Utilidad para colores de estado
function getEstadoBadgeColor(estado: string): string {
  const colores: Record<string, string> = {
    pendiente: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    en_revision: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    aprobado: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    rechazado: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  };
  return colores[estado] || "bg-muted text-muted-foreground";
}

// Componente de información del árbitro
interface ArbitroInfoProps {
  arbitro: {
    full_name: string;
    username: string;
    email?: string;
    telefono?: string;
    estado_verificacion: string;
    estado_verificacion_display: string;
    experiencia_anos: number;
    biografia?: string;
    municipios: Array<{ id: number; nombre: string; departamento?: string }>;
    categorias: Array<{ id: number; nombre: string }>;
  };
  isVerificando: boolean;
  onAprobar: () => void;
  onRechazar: () => void;
}

function ArbitroInfo({ arbitro, isVerificando, onAprobar, onRechazar }: ArbitroInfoProps) {
  const puedeVerificar = arbitro.estado_verificacion === "pendiente" || 
                         arbitro.estado_verificacion === "en_revision";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
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
      {puedeVerificar && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={onAprobar} disabled={isVerificando} className="flex-1">
            Aprobar Árbitro
          </Button>
          <Button
            onClick={onRechazar}
            variant="destructive"
            disabled={isVerificando}
            className="flex-1"
          >
            Rechazar Árbitro
          </Button>
        </div>
      )}

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
    </div>
  );
}

// Componente de documento
interface DocumentoItemProps {
  documento: DocumentoArbitro;
  onAprobar: () => void;
  onRechazar: () => void;
  isRevisando: boolean;
}

function DocumentoItem({ documento, onAprobar, onRechazar, isRevisando }: DocumentoItemProps) {
  return (
    <div className="rounded-md border p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium">{documento.nombre || documento.tipo_display}</p>
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getEstadoBadgeColor(
                documento.estado
              )}`}
            >
              {documento.estado_display}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{documento.tipo_display}</p>
          {documento.comentarios && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              💬 {documento.comentarios}
            </p>
          )}
          {documento.fecha_revision && (
            <p className="text-xs text-muted-foreground mt-1">
              Revisado el {new Date(documento.fecha_revision).toLocaleDateString("es-ES")}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {documento.archivo_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(documento.archivo_url, "_blank")}
            >
              Ver Documento
            </Button>
          )}
          {documento.estado === "pendiente" && (
            <>
              <Button
                size="sm"
                onClick={onAprobar}
                disabled={isRevisando}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Aprobar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onRechazar}
                disabled={isRevisando}
              >
                Rechazar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Modal de confirmación reutilizable
interface ConfirmacionModalProps {
  open: boolean;
  titulo: string;
  descripcion?: string;
  comentarios: string;
  onComentariosChange: (value: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  isProcesando: boolean;
  tipo: "aprobar" | "rechazar";
  labelComentarios?: string;
}

function ConfirmacionModal({
  open,
  titulo,
  descripcion,
  comentarios,
  onComentariosChange,
  onConfirmar,
  onCancelar,
  isProcesando,
  tipo,
  labelComentarios = "Comentarios (opcional)",
}: ConfirmacionModalProps) {
  const esRechazar = tipo === "rechazar";

  return (
    <Dialog open={open} onOpenChange={onCancelar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {descripcion && (
            <p className="text-sm text-muted-foreground">{descripcion}</p>
          )}
          <div>
            <label className="text-sm font-medium block mb-2">{labelComentarios}</label>
            <textarea
              value={comentarios}
              onChange={(e) => onComentariosChange(e.target.value)}
              className="field-textarea min-h-[100px]"
              placeholder={esRechazar ? "Explica el motivo del rechazo..." : "Comentarios sobre la aprobación..."}
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
            variant={esRechazar ? "destructive" : "default"}
            className={!esRechazar ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isProcesando
              ? esRechazar ? "Rechazando..." : "Aprobando..."
              : esRechazar ? "Confirmar Rechazo" : "Confirmar Aprobación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente principal
export function VerificarArbitroDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    arbitro,
    documentos,
    isLoading,
    error,
    isVerificando,
    comentarios,
    setComentarios,
    showAprobarModal,
    showRechazarModal,
    handleAprobar,
    handleRechazar,
    confirmarAprobar,
    confirmarRechazar,
    cerrarModalArbitro,
    documentoSeleccionado,
    comentariosDocumento,
    setComentariosDocumento,
    showAprobarDocumentoModal,
    showRechazarDocumentoModal,
    isRevisandoDocumento,
    handleAprobarDocumento,
    handleRechazarDocumento,
    confirmarAprobarDocumento,
    confirmarRechazarDocumento,
    cerrarModalDocumento,
  } = useVerificarArbitro(id);

  // Loading state
  if (isLoading) {
    return (
      <PageLayout
        backButton={{ label: "Volver", to: ROUTES.ADMIN_VERIFICACION }}
        contentClassName="page-surface max-w-4xl"
      >
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando árbitro...</p>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (error && !arbitro) {
    return (
      <PageLayout
        backButton={{ label: "Volver", to: ROUTES.ADMIN_VERIFICACION }}
        contentClassName="page-surface max-w-4xl"
      >
        <div className="text-center py-12 space-y-4">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => navigate(ROUTES.ADMIN_VERIFICACION)}>
            Volver
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (!arbitro) {
    return null;
  }

  return (
    <PageLayout
      backButton={{ label: "Volver", to: ROUTES.ADMIN_VERIFICACION }}
      title="Verificar Árbitro"
      contentClassName="page-surface max-w-4xl"
    >
      {/* Error inline */}
      {error && (
        <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Información del árbitro */}
      <ArbitroInfo
        arbitro={arbitro}
        isVerificando={isVerificando}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />

      {/* Documentos */}
      <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm mt-6">
        <h2 className="text-lg font-semibold mb-4">Documentos</h2>
        {documentos.length === 0 ? (
          <p className="text-muted-foreground">No hay documentos cargados</p>
        ) : (
          <div className="space-y-4">
            {documentos.map((doc) => (
              <DocumentoItem
                key={doc.id}
                documento={doc}
                onAprobar={() => handleAprobarDocumento(doc)}
                onRechazar={() => handleRechazarDocumento(doc)}
                isRevisando={isRevisandoDocumento}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Aprobar Árbitro */}
      <ConfirmacionModal
        open={showAprobarModal}
        titulo="Aprobar Árbitro"
        comentarios={comentarios}
        onComentariosChange={setComentarios}
        onConfirmar={confirmarAprobar}
        onCancelar={cerrarModalArbitro}
        isProcesando={isVerificando}
        tipo="aprobar"
      />

      {/* Modal Rechazar Árbitro */}
      <ConfirmacionModal
        open={showRechazarModal}
        titulo="Rechazar Árbitro"
        comentarios={comentarios}
        onComentariosChange={setComentarios}
        onConfirmar={confirmarRechazar}
        onCancelar={cerrarModalArbitro}
        isProcesando={isVerificando}
        tipo="rechazar"
        labelComentarios="Motivo del rechazo (recomendado)"
      />

      {/* Modal Aprobar Documento */}
      <ConfirmacionModal
        open={showAprobarDocumentoModal}
        titulo="Aprobar Documento"
        descripcion={documentoSeleccionado ? `Documento: ${documentoSeleccionado.nombre || documentoSeleccionado.tipo_display}` : undefined}
        comentarios={comentariosDocumento}
        onComentariosChange={setComentariosDocumento}
        onConfirmar={confirmarAprobarDocumento}
        onCancelar={cerrarModalDocumento}
        isProcesando={isRevisandoDocumento}
        tipo="aprobar"
      />

      {/* Modal Rechazar Documento */}
      <ConfirmacionModal
        open={showRechazarDocumentoModal}
        titulo="Rechazar Documento"
        descripcion={documentoSeleccionado ? `Documento: ${documentoSeleccionado.nombre || documentoSeleccionado.tipo_display}` : undefined}
        comentarios={comentariosDocumento}
        onComentariosChange={setComentariosDocumento}
        onConfirmar={confirmarRechazarDocumento}
        onCancelar={cerrarModalDocumento}
        isProcesando={isRevisandoDocumento}
        tipo="rechazar"
        labelComentarios="Motivo del rechazo (recomendado)"
      />
    </PageLayout>
  );
}
