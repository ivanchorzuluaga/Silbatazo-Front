/**
 * Hook para gestionar documentos de árbitro
 */

import { useState } from "react";
import { arbitroService } from "../services/arbitro.service";
import type { DocumentoArbitro, DocumentoCreateData } from "../types/arbitro.types";

interface UseDocumentosReturn {
  documentos: DocumentoArbitro[];
  isLoading: boolean;
  error: string | null;
  listarDocumentos: () => Promise<void>;
  cargarDocumento: (data: DocumentoCreateData) => Promise<void>;
  eliminarDocumento: (id: number) => Promise<void>;
  clearError: () => void;
}

export function useDocumentos(): UseDocumentosReturn {
  const [documentos, setDocumentos] = useState<DocumentoArbitro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarDocumentos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await arbitroService.listarDocumentos();
      setDocumentos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener documentos";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cargarDocumento = async (data: DocumentoCreateData) => {
    setIsLoading(true);
    setError(null);

    try {
      const nuevoDocumento = await arbitroService.cargarDocumento(data);
      setDocumentos((prev) => [...prev, nuevoDocumento]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar documento";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarDocumento = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await arbitroService.eliminarDocumento(id);
      setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar documento";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    documentos,
    isLoading,
    error,
    listarDocumentos,
    cargarDocumento,
    eliminarDocumento,
    clearError,
  };
}
