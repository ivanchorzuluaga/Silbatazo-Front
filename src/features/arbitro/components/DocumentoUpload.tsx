/**
 * Componente para cargar documentos de árbitro
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useDocumentos } from "../hooks/useDocumentos";
import type { TipoDocumento } from "../types/arbitro.types";

interface DocumentoUploadProps {
  onSuccess?: () => void;
}

const TIPO_DOCUMENTO_OPTIONS: { value: TipoDocumento; label: string }[] = [
  { value: "certificacion", label: "Certificación" },
  { value: "identificacion", label: "Identificación" },
  { value: "seguro", label: "Seguro" },
  { value: "otro", label: "Otro" },
];

export function DocumentoUpload({ onSuccess }: DocumentoUploadProps) {
  const { cargarDocumento, isLoading, error, clearError } = useDocumentos();
  const [tipo, setTipo] = useState<TipoDocumento>("certificacion");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombre, setNombre] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (10MB máximo)
      const maxSize = 10 * 1024 * 1024; // 10MB en bytes
      if (file.size > maxSize) {
        alert("El archivo es demasiado grande. El tamaño máximo es 10MB.");
        e.target.value = ""; // Limpiar el input
        return;
      }

      // Validar tipo de archivo (PDF, JPG, PNG)
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Tipo de archivo no permitido. Solo se permiten PDF, JPG o PNG.");
        e.target.value = ""; // Limpiar el input
        return;
      }

      setArchivo(file);
      if (!nombre) {
        // Si no hay nombre, usar el nombre del archivo sin extensión
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setNombre(fileNameWithoutExt);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!archivo) {
      alert("Por favor selecciona un archivo");
      return;
    }

    setIsSubmitting(true);
    try {
      await cargarDocumento({
        tipo,
        archivo,
        nombre: nombre || undefined,
      });

      // Limpiar formulario
      setArchivo(null);
      setNombre("");
      setTipo("certificacion");
      // Limpiar input file
      const fileInput = document.getElementById("documento-archivo") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error al cargar documento:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-4 sm:p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Cargar Nuevo Documento</h3>
        <p className="text-sm text-muted-foreground">
          Sube documentos que certifiquen tu experiencia y formación como árbitro
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="documento-tipo" className="text-sm font-medium text-foreground block">
            Tipo de Documento <span className="text-destructive">*</span>
          </label>
          <Select
            id="documento-tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoDocumento)}
            disabled={isLoading || isSubmitting}
            required
          >
            {TIPO_DOCUMENTO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="documento-archivo" className="text-sm font-medium text-foreground block">
            Archivo <span className="text-destructive">*</span>
          </label>
          <input
            id="documento-archivo"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={handleFileChange}
            disabled={isLoading || isSubmitting}
            className="field-base file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
            required
          />
          <p className="text-xs text-muted-foreground">
            Formatos permitidos: PDF, JPG, PNG. Tamaño máximo: 10MB
          </p>
          {archivo && (
            <div className="mt-2 p-2 rounded-md bg-muted">
              <p className="text-sm font-medium">{archivo.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(archivo.size)}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="documento-nombre" className="text-sm font-medium text-foreground block">
            Nombre (Opcional)
          </label>
          <input
            id="documento-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={isLoading || isSubmitting}
            placeholder="Ej: Certificación FIFA 2023"
            className="field-base"
          />
        </div>

        <Button type="submit" disabled={isLoading || isSubmitting || !archivo} className="w-full">
          {isSubmitting ? "Subiendo..." : "Subir Documento"}
        </Button>
      </div>
    </form>
  );
}
