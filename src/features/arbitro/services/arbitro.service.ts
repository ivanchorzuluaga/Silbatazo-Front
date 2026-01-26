/**
 * Servicio de árbitros
 * Encapsula la lógica de negocio relacionada con árbitros
 */

import { arbitroEndpoints } from "@/api/endpoints";
import { authService } from "@/features/auth/services/auth.service";
import { ApiException } from "@/api/client";
import { extractErrorMessage } from "@/lib/error-utils";
import type {
  Arbitro,
  ArbitroCreateData,
  ArbitroUpdateData,
  DocumentoArbitro,
  DocumentoCreateData,
  Municipio,
  Categoria,
  ArbitroVerificacionData,
  DisponibilidadArbitro,
  DisponibilidadCreateData,
  DisponibilidadUpdateData,
} from "../types/arbitro.types";

export const arbitroService = {
  /**
   * Obtener token de acceso
   */
  getToken(): string | null {
    return authService.getAccessToken();
  },

  /**
   * Listar árbitros (marketplace)
   */
  async listarArbitros(params?: {
    municipio?: number;
    categoria?: number;
    tarifa_min?: number;
    tarifa_max?: number;
    search?: string;
    ordering?: string;
    estado?: string;
    fecha?: string; // Formato YYYY-MM-DD
    hora?: string; // Formato HH:MM
  }): Promise<Arbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.listarArbitros(token, params);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener árbitros");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Obtener detalle de un árbitro
   * Puede funcionar con o sin token (para acceso público)
   */
  async obtenerArbitro(id: number, token?: string | null): Promise<Arbitro> {
    const accessToken = token || this.getToken();
    if (!accessToken) {
      // Intentar sin token (acceso público)
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const response = await fetch(`${API_URL}/api/arbitros/${id}/`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Árbitro no encontrado");
          }
          throw new Error("Error al obtener árbitro");
        }
        return response.json();
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("Error de conexión. Intenta nuevamente.");
      }
    }

    try {
      return await arbitroEndpoints.obtenerArbitro(accessToken, id);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 404) {
          throw new Error("Árbitro no encontrado");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener árbitro");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Obtener perfil propio
   */
  async obtenerPerfil(): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.obtenerPerfil(token);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 404) {
          throw new Error("No tienes un perfil de árbitro. Crea uno primero.");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener perfil");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Crear perfil de árbitro
   */
  async crearPerfil(data: ArbitroCreateData): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.crearPerfil(token, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al crear perfil");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Actualizar perfil de árbitro
   */
  async actualizarPerfil(data: ArbitroUpdateData): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.actualizarPerfil(token, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al actualizar perfil");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Cargar documento
   */
  async cargarDocumento(data: DocumentoCreateData): Promise<DocumentoArbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.cargarDocumento(token, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al cargar documento");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Listar documentos propios
   */
  async listarDocumentos(): Promise<DocumentoArbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.listarDocumentos(token);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener documentos");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Eliminar documento
   */
  async eliminarDocumento(id: number): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.eliminarDocumento(token, id);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al eliminar documento");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Listar municipios
   */
  async listarMunicipios(): Promise<Municipio[]> {
    try {
      return await arbitroEndpoints.listarMunicipios();
    } catch {
      throw new Error("Error al obtener municipios");
    }
  },

  /**
   * Listar categorías
   */
  async listarCategorias(): Promise<Categoria[]> {
    try {
      return await arbitroEndpoints.listarCategorias();
    } catch {
      throw new Error("Error al obtener categorías");
    }
  },

  // ==================== Disponibilidad ====================

  /**
   * Listar disponibilidades propias
   */
  async listarDisponibilidades(): Promise<DisponibilidadArbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.listarDisponibilidades(token);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener disponibilidades");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Crear disponibilidad
   */
  async crearDisponibilidad(data: DisponibilidadCreateData): Promise<DisponibilidadArbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.crearDisponibilidad(token, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al crear disponibilidad");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Actualizar disponibilidad
   */
  async actualizarDisponibilidad(
    id: number,
    data: DisponibilidadUpdateData
  ): Promise<DisponibilidadArbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.actualizarDisponibilidad(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al actualizar disponibilidad");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Eliminar disponibilidad
   */
  async eliminarDisponibilidad(id: number): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.eliminarDisponibilidad(token, id);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al eliminar disponibilidad");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  // ==================== Métodos para Administradores ====================

  /**
   * Listar todos los árbitros (admin)
   */
  async listarTodos(params?: {
    estado?: string;
    municipio?: number;
    categoria?: number;
    tarifa_min?: number;
    tarifa_max?: number;
    search?: string;
    ordering?: string;
  }): Promise<Arbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.listarTodos(token, params);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener árbitros");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Listar árbitros pendientes (admin)
   */
  async listarPendientes(): Promise<Arbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.listarPendientes(token);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener árbitros pendientes");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Verificar árbitro (admin)
   */
  async verificarArbitro(id: number, data: ArbitroVerificacionData): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.verificarArbitro(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al verificar árbitro");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Listar documentos de un árbitro (admin)
   */
  async listarDocumentosArbitro(arbitroId: number): Promise<DocumentoArbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.listarDocumentosArbitro(token, arbitroId);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener documentos");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Revisar documento (admin)
   */
  async revisarDocumento(
    id: number,
    data: { estado: "aprobado" | "rechazado"; comentarios?: string }
  ): Promise<DocumentoArbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.revisarDocumento(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al revisar documento");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },
};
