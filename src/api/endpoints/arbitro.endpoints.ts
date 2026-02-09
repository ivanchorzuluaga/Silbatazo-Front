/**
 * Endpoints relacionados con árbitros
 */

import { authenticatedApiClient } from "../client";
import { unwrapPaginated, type PaginatedResponse } from "../utils/pagination";
import type {
  Arbitro,
  ArbitroCreateData,
  ArbitroUpdateData,
  DocumentoArbitro,
  DocumentoCreateData,
  ArbitroVerificacionData,
  Municipio,
  Categoria,
  RolArbitro,
  CategoriaCreateData,
  CategoriaUpdateData,
  DisponibilidadArbitro,
  DisponibilidadCreateData,
  DisponibilidadUpdateData,
  Retiro,
  RetiroCreateData,
  RetiroProcesarData,
  SaldoDisponible,
} from "@/features/arbitro/types/arbitro.types";

export const arbitroEndpoints = {
  /**
   * Lista de árbitros (marketplace)
   * Filtros: municipio, categoria, search, ordering
   */
  async listarArbitros(
    token: string,
    params?: {
      municipio?: number;
      categoria?: number;
      search?: string;
      ordering?: string;
      estado?: string; // Solo para admins
      fecha?: string; // Formato YYYY-MM-DD
      hora?: string; // Formato HH:MM
    }
  ): Promise<Arbitro[]> {
    const queryParams = new URLSearchParams();
    if (params?.municipio) queryParams.append("municipio", params.municipio.toString());
    if (params?.categoria) queryParams.append("categoria", params.categoria.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.ordering) queryParams.append("ordering", params.ordering);
    if (params?.estado) queryParams.append("estado", params.estado);
    if (params?.fecha) queryParams.append("fecha", params.fecha);
    if (params?.hora) queryParams.append("hora", params.hora);

    const query = queryParams.toString();
    const endpoint = `/api/arbitros/${query ? `?${query}` : ""}`;

    const data = await authenticatedApiClient<PaginatedResponse<Arbitro> | Arbitro[]>(
      endpoint,
      token
    );
    return unwrapPaginated(data);
  },

  /**
   * Obtener detalle de un árbitro
   */
  async obtenerArbitro(token: string, id: number): Promise<Arbitro> {
    return authenticatedApiClient<Arbitro>(`/api/arbitros/${id}/`, token);
  },

  /**
   * Obtener perfil propio (árbitro)
   */
  async obtenerPerfil(token: string): Promise<Arbitro> {
    return authenticatedApiClient<Arbitro>("/api/arbitros/perfil/", token);
  },

  /**
   * Crear perfil de árbitro
   */
  async crearPerfil(token: string, data: ArbitroCreateData): Promise<Arbitro> {
    return authenticatedApiClient<Arbitro>("/api/arbitros/perfil/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualizar perfil de árbitro
   */
  async actualizarPerfil(token: string, data: ArbitroUpdateData): Promise<Arbitro> {
    return authenticatedApiClient<Arbitro>("/api/arbitros/perfil/", token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Subir foto de perfil del árbitro (multipart/form-data con campo 'foto_perfil')
   */
  async subirFotoPerfil(token: string, file: File): Promise<Arbitro> {
    const formData = new FormData();
    formData.append("foto_perfil", file);
    return authenticatedApiClient<Arbitro>("/api/arbitros/perfil/foto/", token, {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Lista de todos los árbitros (solo admin, con filtros avanzados)
   */
  async listarTodos(
    token: string,
    params?: {
      estado?: string;
      municipio?: number;
      categoria?: number;
      search?: string;
      ordering?: string;
    }
  ): Promise<Arbitro[]> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append("estado", params.estado);
    if (params?.municipio) queryParams.append("municipio", params.municipio.toString());
    if (params?.categoria) queryParams.append("categoria", params.categoria.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.ordering) queryParams.append("ordering", params.ordering);

    const query = queryParams.toString();
    const endpoint = `/api/arbitros/todos/${query ? `?${query}` : ""}`;

    return authenticatedApiClient<Arbitro[]>(endpoint, token);
  },

  /**
   * Lista de árbitros pendientes (solo admin)
   */
  async listarPendientes(token: string): Promise<Arbitro[]> {
    return authenticatedApiClient<Arbitro[]>("/api/arbitros/pendientes/", token);
  },

  /**
   * Verificar árbitro (aprobar/rechazar) - solo admin
   */
  async verificarArbitro(
    token: string,
    id: number,
    data: ArbitroVerificacionData
  ): Promise<Arbitro> {
    return authenticatedApiClient<Arbitro>(`/api/arbitros/${id}/verificar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Cargar documento
   */
  async cargarDocumento(token: string, data: DocumentoCreateData): Promise<DocumentoArbitro> {
    const formData = new FormData();
    formData.append("tipo", data.tipo);
    formData.append("archivo", data.archivo);
    if (data.nombre) formData.append("nombre", data.nombre);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const response = await fetch(`${API_URL}/api/arbitros/documentos/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new Error("Error al cargar documento");
      }
      throw new Error(errorData.detail || errorData.message || "Error al cargar documento");
    }

    return response.json();
  },

  /**
   * Listar documentos propios
   */
  async listarDocumentos(token: string): Promise<DocumentoArbitro[]> {
    return authenticatedApiClient<DocumentoArbitro[]>("/api/arbitros/documentos/list/", token);
  },

  /**
   * Listar documentos de un árbitro (solo admin)
   */
  async listarDocumentosArbitro(token: string, arbitroId: number): Promise<DocumentoArbitro[]> {
    return authenticatedApiClient<DocumentoArbitro[]>(
      `/api/arbitros/documentos/list/${arbitroId}/`,
      token
    );
  },

  /**
   * Obtener documento
   */
  async obtenerDocumento(token: string, id: number): Promise<DocumentoArbitro> {
    return authenticatedApiClient<DocumentoArbitro>(`/api/arbitros/documentos/${id}/`, token);
  },

  /**
   * Eliminar documento
   */
  async eliminarDocumento(token: string, id: number): Promise<void> {
    return authenticatedApiClient<void>(`/api/arbitros/documentos/${id}/`, token, {
      method: "DELETE",
    });
  },

  /**
   * Revisar documento (aprobar/rechazar) - solo admin
   */
  async revisarDocumento(
    token: string,
    id: number,
    data: { estado: "aprobado" | "rechazado"; comentarios?: string }
  ): Promise<DocumentoArbitro> {
    return authenticatedApiClient<DocumentoArbitro>(
      `/api/arbitros/documentos/${id}/revisar/`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Lista de municipios
   */
  async listarMunicipios(): Promise<Municipio[]> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/arbitros/municipios/`
    );
    if (!response.ok) throw new Error("Error al obtener municipios");
    return response.json();
  },

  /**
   * Lista de categorías
   */
  async listarCategorias(): Promise<Categoria[]> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/arbitros/categorias/`
    );
    if (!response.ok) throw new Error("Error al obtener categorías");
    return response.json();
  },

  /**
   * Lista de roles de árbitro
   */
  async listarRoles(): Promise<RolArbitro[]> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/arbitros/roles/`
    );
    if (!response.ok) throw new Error("Error al obtener roles");
    return response.json();
  },

  /**
   * Crear categoría - solo admin
   */
  async crearCategoria(token: string, data: CategoriaCreateData): Promise<Categoria> {
    return authenticatedApiClient<Categoria>("/api/arbitros/categorias/crear/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener categoría por ID - solo admin
   */
  async obtenerCategoria(token: string, id: number): Promise<Categoria> {
    return authenticatedApiClient<Categoria>(`/api/arbitros/categorias/${id}/`, token);
  },

  /**
   * Actualizar categoría - solo admin
   */
  async actualizarCategoria(
    token: string,
    id: number,
    data: CategoriaUpdateData
  ): Promise<Categoria> {
    return authenticatedApiClient<Categoria>(`/api/arbitros/categorias/${id}/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Eliminar categoría (desactivar) - solo admin
   */
  async eliminarCategoria(token: string, id: number): Promise<void> {
    return authenticatedApiClient<void>(`/api/arbitros/categorias/${id}/`, token, {
      method: "DELETE",
    });
  },

  /**
   * Lista de disponibilidades del árbitro autenticado
   */
  async listarDisponibilidades(token: string): Promise<DisponibilidadArbitro[]> {
    return authenticatedApiClient<DisponibilidadArbitro[]>("/api/arbitros/disponibilidad/", token);
  },

  /**
   * Crear disponibilidad
   */
  async crearDisponibilidad(
    token: string,
    data: DisponibilidadCreateData
  ): Promise<DisponibilidadArbitro> {
    return authenticatedApiClient<DisponibilidadArbitro>("/api/arbitros/disponibilidad/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener disponibilidad por ID
   */
  async obtenerDisponibilidad(token: string, id: number): Promise<DisponibilidadArbitro> {
    return authenticatedApiClient<DisponibilidadArbitro>(
      `/api/arbitros/disponibilidad/${id}/`,
      token
    );
  },

  /**
   * Actualizar disponibilidad
   */
  async actualizarDisponibilidad(
    token: string,
    id: number,
    data: DisponibilidadUpdateData
  ): Promise<DisponibilidadArbitro> {
    return authenticatedApiClient<DisponibilidadArbitro>(
      `/api/arbitros/disponibilidad/${id}/`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Eliminar disponibilidad
   */
  async eliminarDisponibilidad(token: string, id: number): Promise<void> {
    return authenticatedApiClient<void>(`/api/arbitros/disponibilidad/${id}/`, token, {
      method: "DELETE",
    });
  },

  /**
   * Retiros
   */

  /**
   * Lista de retiros
   * Árbitro: solo sus retiros
   * Admin: todos los retiros (puede filtrar por estado)
   */
  async listarRetiros(
    token: string,
    params?: {
      estado?: "pendiente" | "procesado" | "rechazado";
    }
  ): Promise<Retiro[]> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append("estado", params.estado);

    const query = queryParams.toString();
    const url = `/api/arbitros/retiros/${query ? `?${query}` : ""}`;

    return authenticatedApiClient<Retiro[]>(url, token);
  },

  /**
   * Crear un retiro (solo árbitro)
   */
  async crearRetiro(token: string, data: RetiroCreateData): Promise<Retiro> {
    return authenticatedApiClient<Retiro>("/api/arbitros/retiros/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener detalle de un retiro
   */
  async obtenerRetiro(token: string, id: number): Promise<Retiro> {
    return authenticatedApiClient<Retiro>(`/api/arbitros/retiros/${id}/`, token);
  },

  /**
   * Procesar o rechazar un retiro (solo admin)
   */
  async procesarRetiro(token: string, id: number, data: RetiroProcesarData): Promise<Retiro> {
    return authenticatedApiClient<Retiro>(`/api/arbitros/retiros/${id}/procesar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener saldo disponible del árbitro autenticado
   */
  async obtenerSaldoDisponible(token: string): Promise<SaldoDisponible> {
    return authenticatedApiClient<SaldoDisponible>("/api/arbitros/retiros/saldo/", token);
  },
};
