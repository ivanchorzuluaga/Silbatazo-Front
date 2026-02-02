/**
 * Hook para gestionar la verificación de un árbitro específico
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { arbitroService } from "@/features/arbitro/services/arbitro.service";
import { ROUTES } from "@/lib/constants";
import type {
  Arbitro,
  DocumentoArbitro,
  ArbitroVerificacionData,
} from "@/features/arbitro/types/arbitro.types";

interface UseVerificarArbitroReturn {
  // Datos
  arbitro: Arbitro | null;
  documentos: DocumentoArbitro[];
  isLoading: boolean;
  error: string | null;
  
  // Estados de verificación
  isVerificando: boolean;
  comentarios: string;
  setComentarios: (comentarios: string) => void;
  
  // Modales de árbitro
  showAprobarModal: boolean;
  showRechazarModal: boolean;
  handleAprobar: () => void;
  handleRechazar: () => void;
  confirmarAprobar: () => void;
  confirmarRechazar: () => void;
  cerrarModalArbitro: () => void;
  
  // Estados de documentos
  documentoSeleccionado: DocumentoArbitro | null;
  comentariosDocumento: string;
  setComentariosDocumento: (comentarios: string) => void;
  showAprobarDocumentoModal: boolean;
  showRechazarDocumentoModal: boolean;
  isRevisandoDocumento: boolean;
  handleAprobarDocumento: (doc: DocumentoArbitro) => void;
  handleRechazarDocumento: (doc: DocumentoArbitro) => void;
  confirmarAprobarDocumento: () => Promise<void>;
  confirmarRechazarDocumento: () => Promise<void>;
  cerrarModalDocumento: () => void;
  
  // Helpers
  clearError: () => void;
}

export function useVerificarArbitro(id: string | undefined): UseVerificarArbitroReturn {
  const navigate = useNavigate();
  
  // Estados de datos
  const [arbitro, setArbitro] = useState<Arbitro | null>(null);
  const [documentos, setDocumentos] = useState<DocumentoArbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de verificación de árbitro
  const [isVerificando, setIsVerificando] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  
  // Estados de documentos
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<DocumentoArbitro | null>(null);
  const [comentariosDocumento, setComentariosDocumento] = useState("");
  const [showAprobarDocumentoModal, setShowAprobarDocumentoModal] = useState(false);
  const [showRechazarDocumentoModal, setShowRechazarDocumentoModal] = useState(false);
  const [isRevisandoDocumento, setIsRevisandoDocumento] = useState(false);

  // Cargar datos
  const cargarDatos = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Verificar árbitro
  const handleVerificar = useCallback(async (estado: "aprobado" | "rechazado") => {
    if (!arbitro || !id) return;

    setIsVerificando(true);
    setError(null);

    try {
      const data: ArbitroVerificacionData = {
        estado,
        comentarios: comentarios.trim() || undefined,
      };

      await arbitroService.verificarArbitro(parseInt(id), data);
      navigate(ROUTES.ADMIN_VERIFICACION);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al verificar árbitro");
      setIsVerificando(false);
    }
  }, [arbitro, id, comentarios, navigate]);

  // Handlers de modales de árbitro
  const handleAprobar = useCallback(() => {
    setShowAprobarModal(true);
  }, []);

  const handleRechazar = useCallback(() => {
    setShowRechazarModal(true);
  }, []);

  const confirmarAprobar = useCallback(() => {
    handleVerificar("aprobado");
    setShowAprobarModal(false);
  }, [handleVerificar]);

  const confirmarRechazar = useCallback(() => {
    handleVerificar("rechazado");
    setShowRechazarModal(false);
  }, [handleVerificar]);

  const cerrarModalArbitro = useCallback(() => {
    setShowAprobarModal(false);
    setShowRechazarModal(false);
    setComentarios("");
  }, []);

  // Handlers de documentos
  const handleAprobarDocumento = useCallback((doc: DocumentoArbitro) => {
    setDocumentoSeleccionado(doc);
    setComentariosDocumento("");
    setShowAprobarDocumentoModal(true);
  }, []);

  const handleRechazarDocumento = useCallback((doc: DocumentoArbitro) => {
    setDocumentoSeleccionado(doc);
    setComentariosDocumento("");
    setShowRechazarDocumentoModal(true);
  }, []);

  const cerrarModalDocumento = useCallback(() => {
    setShowAprobarDocumentoModal(false);
    setShowRechazarDocumentoModal(false);
    setDocumentoSeleccionado(null);
    setComentariosDocumento("");
  }, []);

  const confirmarAprobarDocumento = useCallback(async () => {
    if (!documentoSeleccionado) return;

    setIsRevisandoDocumento(true);
    setError(null);

    try {
      await arbitroService.revisarDocumento(documentoSeleccionado.id, {
        estado: "aprobado",
        comentarios: comentariosDocumento.trim() || undefined,
      });

      await cargarDatos();
      cerrarModalDocumento();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al aprobar documento");
    } finally {
      setIsRevisandoDocumento(false);
    }
  }, [documentoSeleccionado, comentariosDocumento, cargarDatos, cerrarModalDocumento]);

  const confirmarRechazarDocumento = useCallback(async () => {
    if (!documentoSeleccionado) return;

    setIsRevisandoDocumento(true);
    setError(null);

    try {
      await arbitroService.revisarDocumento(documentoSeleccionado.id, {
        estado: "rechazado",
        comentarios: comentariosDocumento.trim() || undefined,
      });

      await cargarDatos();
      cerrarModalDocumento();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al rechazar documento");
    } finally {
      setIsRevisandoDocumento(false);
    }
  }, [documentoSeleccionado, comentariosDocumento, cargarDatos, cerrarModalDocumento]);

  const clearError = useCallback(() => setError(null), []);

  return {
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
    
    clearError,
  };
}
