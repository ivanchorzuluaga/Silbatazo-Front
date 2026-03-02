/**
 * Servicio de árbitros
 * Encapsula la lógica de negocio relacionada con árbitros
 * Incluye caché de corta duración para reducir peticiones duplicadas (varios hooks/pantallas).
 */

import { arbitroEndpoints } from "@/api/endpoints";
import { authService } from "@/features/auth/services/auth.service";
import { ApiException } from "@/api/client";
import { extractErrorMessage } from "@/lib/error-utils";
import { unwrapPaginated } from "@/api/utils/pagination";
import type {
  Arbitro,
  ArbitroCreateData,
  ArbitroUpdateData,
  DocumentoArbitro,
  DocumentoCreateData,
  Municipio,
  Categoria,
  RolArbitro,
  ArbitroVerificacionData,
  DisponibilidadArbitro,
  DisponibilidadCreateData,
  DisponibilidadUpdateData,
} from "../types/arbitro.types";

const CACHE_TTL_MS = 8000;
const CACHE_TTL_MASTER_MS = 60000;

let perfilCache: { data: Arbitro; ts: number } | null = null;
let municipiosCache: { data: Municipio[]; ts: number } | null = null;
let categoriasCache: { data: Categoria[]; ts: number } | null = null;
let rolesCache: { data: RolArbitro[]; ts: number } | null = null;

function isCacheValid<T>(
  entry: { data: T; ts: number } | null,
  ttl: number
): entry is { data: T; ts: number } {
  return entry !== null && Date.now() - entry.ts < ttl;
}

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
    search?: string;
    ordering?: string;
    estado?: string;
    fecha?: string; // Formato YYYY-MM-DD
    hora?: string; // Formato HH:MM
  }): Promise<Arbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      const data = await arbitroEndpoints.listarArbitros(token, params);
      return unwrapPaginated<Arbitro>(data as Arbitro[]);
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
   * Obtener perfil propio (con caché 8s para evitar peticiones duplicadas)
   */
  async obtenerPerfil(): Promise<Arbitro> {
    if (isCacheValid(perfilCache, CACHE_TTL_MS)) {
      return perfilCache.data;
    }
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      const data = await arbitroEndpoints.obtenerPerfil(token);
      perfilCache = { data, ts: Date.now() };
      return data;
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
   * Crear perfil de árbitro (invalida caché de perfil)
   */
  async crearPerfil(data: ArbitroCreateData): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      const result = await arbitroEndpoints.crearPerfil(token, data);
      perfilCache = { data: result, ts: Date.now() };
      return result;
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al crear perfil");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Actualizar perfil de árbitro (invalida caché de perfil)
   */
  async actualizarPerfil(data: ArbitroUpdateData): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    perfilCache = null;
    try {
      const result = await arbitroEndpoints.actualizarPerfil(token, data);
      perfilCache = { data: result, ts: Date.now() };
      return result;
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al actualizar perfil");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Actualizar perfil de árbitro por ID (solo admin)
   */
  async actualizarArbitroAdmin(
    id: number,
    data: ArbitroUpdateData & {
      first_name?: string;
      last_name?: string;
      email?: string;
    }
  ): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.actualizarArbitroAdmin(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al actualizar árbitro");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Subir foto de perfil del árbitro (invalida caché de perfil)
   */
  async subirFotoPerfil(file: File): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    perfilCache = null;
    try {
      const result = await arbitroEndpoints.subirFotoPerfil(token, file);
      perfilCache = { data: result, ts: Date.now() };
      return result;
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al subir la foto");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Subir foto de detalle del árbitro autenticado
   */
  async subirFotoDetallePerfil(file: File): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      const result = await arbitroEndpoints.subirFotoDetallePerfil(token, file);
      perfilCache = { data: result, ts: Date.now() };
      return result;
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al subir la foto");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Subir foto de perfil de árbitro por ID (solo admin)
   */
  async subirFotoArbitroAdmin(id: number, file: File): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.subirFotoArbitroAdmin(token, id, file);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al subir la foto");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Subir foto de detalle de árbitro por ID (solo admin)
   */
  async subirFotoDetalleArbitroAdmin(id: number, file: File): Promise<Arbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.subirFotoDetalleArbitroAdmin(token, id, file);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al subir la foto");
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
   * Listar municipios (caché 60s, datos de referencia)
   */
  async listarMunicipios(): Promise<Municipio[]> {
    if (isCacheValid(municipiosCache, CACHE_TTL_MASTER_MS)) {
      return municipiosCache.data;
    }
    try {
      const data = await arbitroEndpoints.listarMunicipios();
      municipiosCache = { data, ts: Date.now() };
      return data;
    } catch {
      throw new Error("Error al obtener municipios");
    }
  },

  /**
   * Listar categorías (caché 60s, datos de referencia)
   */
  async listarCategorias(): Promise<Categoria[]> {
    if (isCacheValid(categoriasCache, CACHE_TTL_MASTER_MS)) {
      return categoriasCache.data;
    }
    try {
      const data = await arbitroEndpoints.listarCategorias();
      categoriasCache = { data, ts: Date.now() };
      return data;
    } catch {
      throw new Error("Error al obtener categorías");
    }
  },

  /**
   * Listar roles de árbitro (caché 60s, datos de referencia)
   */
  async listarRoles(): Promise<RolArbitro[]> {
    if (isCacheValid(rolesCache, CACHE_TTL_MASTER_MS)) {
      return rolesCache.data;
    }
    try {
      const data = await arbitroEndpoints.listarRoles();
      rolesCache = { data, ts: Date.now() };
      return data;
    } catch {
      throw new Error("Error al obtener roles");
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
    search?: string;
    ordering?: string;
  }): Promise<Arbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      const data = await arbitroEndpoints.listarTodos(token, params);
      return unwrapPaginated<Arbitro>(data as Arbitro[]);
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
      const data = await arbitroEndpoints.listarPendientes(token);
      return unwrapPaginated<Arbitro>(data as Arbitro[]);
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
