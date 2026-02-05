/**
 * Endpoints relacionados con partidos
 */

import apiClient, { authenticatedApiClient } from "../client";
import type {
  Partido,
  PartidoDetail,
  PartidoCreateData,
  PartidoUpdateData,
  PartidoAceptarData,
  PartidoRechazarData,
  PartidoCancelarData,
  PartidoCompletarData,
  PartidosListParams,
  GrupoPartidosSolapados,
  PostulacionArbitro,
  PostulacionCreateData,
  PartidoAsignarData,
  Calificacion,
  CalificacionCreateData,
  PromedioArbitro,
  TipoPartido,
  TipoPartidoAdmin,
  TipoPartidoCreateData,
  TipoPartidoUpdateData,
  // Eventos
  Evento,
  EventoDetail,
  EventoCreateData,
  EventoUpdateData,
  EventosListParams,
} from "@/features/partidos/types/partido.types";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export const partidoEndpoints = {
  /**
   * Lista de partidos
   * Filtros: estado, fecha_desde, fecha_hasta, cliente_id, arbitro_id
   */
  async listarPartidos(token: string, params?: PartidosListParams): Promise<Partido[]> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append("estado", params.estado);
    if (params?.estado_pago) queryParams.append("estado_pago", params.estado_pago);
    if (params?.fecha_desde) queryParams.append("fecha_desde", params.fecha_desde);
    if (params?.fecha_hasta) queryParams.append("fecha_hasta", params.fecha_hasta);
    if (params?.cliente_id) queryParams.append("cliente_id", params.cliente_id.toString());
    if (params?.arbitro_id) queryParams.append("arbitro_id", params.arbitro_id.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/api/partidos/?${query}` : "/api/partidos/";

    const data = await authenticatedApiClient<Partido[] | { results: Partido[] }>(endpoint, token);
    if (Array.isArray(data)) return data;
    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as { results: Partido[] }).results)
    ) {
      return (data as { results: Partido[] }).results;
    }
    return [];
  },

  /**
   * Obtener detalle de un partido
   */
  async obtenerPartido(token: string, id: number): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/`, token);
  },

  /**
   * Crear un nuevo partido (solo cliente)
   * El backend devuelve PartidoDetail directamente
   */
  async crearPartido(token: string, data: PartidoCreateData): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>("/api/partidos/crear/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Lista de tipos de partido con precio fijo (selector único)
   */
  async listarTiposPartido(token: string): Promise<TipoPartido[]> {
    return authenticatedApiClient<TipoPartido[]>("/api/partidos/tipos-partido/", token);
  },

  /**
   * Admin: lista todos los tipos de partido (activos e inactivos)
   */
  async listarTiposPartidoAdmin(token: string): Promise<TipoPartidoAdmin[]> {
    return authenticatedApiClient<TipoPartidoAdmin[]>("/api/partidos/tipos-partido-admin/", token);
  },

  /**
   * Admin: crear tipo de partido
   */
  async crearTipoPartido(token: string, data: TipoPartidoCreateData): Promise<TipoPartidoAdmin> {
    return authenticatedApiClient<TipoPartidoAdmin>("/api/partidos/tipos-partido-admin/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Admin: actualizar tipo de partido
   */
  async actualizarTipoPartido(
    token: string,
    id: number,
    data: TipoPartidoUpdateData
  ): Promise<TipoPartidoAdmin> {
    return authenticatedApiClient<TipoPartidoAdmin>(
      `/api/partidos/tipos-partido-admin/${id}/`,
      token,
      { method: "PATCH", body: JSON.stringify(data) }
    );
  },

  /**
   * Admin: eliminar tipo de partido (solo si no tiene partidos asociados)
   */
  async eliminarTipoPartido(token: string, id: number): Promise<void> {
    await authenticatedApiClient(`/api/partidos/tipos-partido-admin/${id}/eliminar/`, token, {
      method: "DELETE",
    });
  },

  /**
   * Actualizar un partido (solo cliente, solo buscando árbitro o pendientes)
   */
  async actualizarPartido(
    token: string,
    id: number,
    data: PartidoUpdateData
  ): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/actualizar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Aceptar un partido (solo árbitro)
   */
  async aceptarPartido(
    token: string,
    id: number,
    data?: PartidoAceptarData
  ): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/aceptar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data || {}),
    });
  },

  /**
   * Rechazar un partido (solo árbitro)
   */
  async rechazarPartido(
    token: string,
    id: number,
    data: PartidoRechazarData
  ): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/rechazar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Cancelar un partido (cliente o árbitro)
   */
  async cancelarPartido(
    token: string,
    id: number,
    data: PartidoCancelarData
  ): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/cancelar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Completar un partido (solo árbitro, solo aceptados)
   */
  async completarPartido(
    token: string,
    id: number,
    data?: PartidoCompletarData
  ): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/completar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data || {}),
    });
  },

  /**
   * Lista de partidos disponibles para postularse (solo árbitros)
   */
  async listarPartidosDisponibles(token: string, params?: PartidosListParams): Promise<Partido[]> {
    const queryParams = new URLSearchParams();
    if (params?.fecha_desde) queryParams.append("fecha_desde", params.fecha_desde);
    if (params?.fecha_hasta) queryParams.append("fecha_hasta", params.fecha_hasta);
    if (params?.municipio_id) queryParams.append("municipio_id", params.municipio_id.toString());
    if (params?.categoria_id) queryParams.append("categoria_id", params.categoria_id.toString());

    const query = queryParams.toString();
    const endpoint = `/api/partidos/disponibles/${query ? `?${query}` : ""}`;

    return authenticatedApiClient<Partido[]>(endpoint, token);
  },

  /**
   * Postularse a un partido (solo árbitros)
   */
  async postularseAPartido(
    token: string,
    id: number,
    data?: PostulacionCreateData
  ): Promise<PostulacionArbitro> {
    return authenticatedApiClient<PostulacionArbitro>(`/api/partidos/${id}/postular/`, token, {
      method: "POST",
      body: JSON.stringify(data || {}),
    });
  },

  /**
   * Ver postulaciones de un partido (solo admin)
   */
  async obtenerPostulaciones(token: string, id: number): Promise<PostulacionArbitro[]> {
    return authenticatedApiClient<PostulacionArbitro[]>(
      `/api/partidos/${id}/postulaciones/`,
      token
    );
  },

  /**
   * Asignar árbitro a un partido (solo admin)
   */
  async asignarArbitro(
    token: string,
    id: number,
    data: PartidoAsignarData
  ): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/asignar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Lista de partidos que necesitan asignación (solo admin)
   */
  async listarPartidosNecesitanAsignacion(token: string): Promise<PartidoDetail[]> {
    return authenticatedApiClient<PartidoDetail[]>("/api/partidos/necesitan-asignacion/", token);
  },

  /**
   * Lista de partidos solapados: mismo árbitro, mismo día, horarios en conflicto (solo admin)
   */
  async listarPartidosSolapados(token: string): Promise<GrupoPartidosSolapados[]> {
    return authenticatedApiClient<GrupoPartidosSolapados[]>("/api/partidos/solapados/", token);
  },

  /**
   * Lista de árbitros disponibles para un partido específico (solo admin)
   */
  async listarArbitrosDisponibles(token: string, partidoId: number): Promise<Arbitro[]> {
    return authenticatedApiClient<Arbitro[]>(
      `/api/partidos/${partidoId}/arbitros-disponibles/`,
      token
    );
  },

  /**
   * Calificaciones
   */

  /**
   * Lista de calificaciones de un partido
   */
  async listarCalificacionesPartido(token: string, partidoId: number): Promise<Calificacion[]> {
    return authenticatedApiClient<Calificacion[]>(
      `/api/partidos/${partidoId}/calificaciones/`,
      token
    );
  },

  /**
   * Crear una calificación para un partido
   */
  async crearCalificacion(
    token: string,
    partidoId: number,
    data: CalificacionCreateData
  ): Promise<Calificacion> {
    return authenticatedApiClient<Calificacion>(`/api/partidos/${partidoId}/calificar/`, token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Lista de calificaciones recibidas por un árbitro
   * Soporta token opcional (endpoint público para ver perfiles de árbitros)
   */
  async listarCalificacionesArbitro(
    arbitroId: number,
    token?: string | null
  ): Promise<Calificacion[]> {
    if (token) {
      return authenticatedApiClient<Calificacion[]>(
        `/api/partidos/arbitros/${arbitroId}/calificaciones/`,
        token
      );
    }
    return apiClient<Calificacion[]>(`/api/partidos/arbitros/${arbitroId}/calificaciones/`);
  },

  /**
   * Obtener el promedio de calificaciones de un árbitro
   * Soporta token opcional (endpoint público para ver perfiles de árbitros)
   */
  async obtenerPromedioArbitro(arbitroId: number, token?: string | null): Promise<PromedioArbitro> {
    if (token) {
      return authenticatedApiClient<PromedioArbitro>(
        `/api/partidos/arbitros/${arbitroId}/promedio/`,
        token
      );
    }
    return apiClient<PromedioArbitro>(`/api/partidos/arbitros/${arbitroId}/promedio/`);
  },

  /**
   * Pagos
   */

  /**
   * Marcar un partido como pagado (solo cliente)
   * Opcionalmente acepta un comprobante de pago (imagen)
   */
  async marcarPartidoPagado(token: string, id: number, comprobante?: File): Promise<PartidoDetail> {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const formData = new FormData();
    if (comprobante) {
      formData.append("comprobante_pago", comprobante);
    }

    const response = await fetch(`${API_URL}/api/partidos/${id}/marcar-pagado/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || "Error al marcar como pagado");
    }

    return response.json();
  },

  /**
   * Aprobar un pago (solo admin)
   */
  async aprobarPago(
    token: string,
    id: number,
    data?: { notas_pago?: string }
  ): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/aprobar-pago/`, token, {
      method: "PATCH",
      body: JSON.stringify(data || {}),
    });
  },

  /**
   * Rechazar un pago (solo admin)
   */
  async rechazarPago(token: string, id: number, motivo: string): Promise<PartidoDetail> {
    return authenticatedApiClient<PartidoDetail>(`/api/partidos/${id}/rechazar-pago/`, token, {
      method: "PATCH",
      body: JSON.stringify({ motivo }),
    });
  },

  /**
   * Lista de pagos pendientes de revisión (solo admin)
   */
  async listarPagosPendientes(token: string, params?: PartidosListParams): Promise<Partido[]> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append("estado", params.estado);
    if (params?.fecha_desde) queryParams.append("fecha_desde", params.fecha_desde);
    if (params?.fecha_hasta) queryParams.append("fecha_hasta", params.fecha_hasta);
    if (params?.cliente_id) queryParams.append("cliente_id", params.cliente_id.toString());

    const query = queryParams.toString();
    const baseEndpoint = "/api/partidos/pagos-pendientes/";
    const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;

    return authenticatedApiClient<Partido[]>(endpoint, token);
  },

  /**
   * Estadísticas del dashboard de administración (solo admin)
   */
  async getAdminDashboardStats(token: string): Promise<AdminDashboardStats> {
    return authenticatedApiClient<AdminDashboardStats>(
      "/api/partidos/admin-dashboard-stats/",
      token
    );
  },

  /**
   * Estadísticas públicas para la landing (sin autenticación)
   */
  async getLandingStats(): Promise<LandingStats> {
    return apiClient<LandingStats>("/api/partidos/landing-stats/");
  },
};

export interface AdminDashboardStats {
  arbitros_activos: number;
  partidos_hoy: number;
  pendientes: number;
  verificaciones: number;
}

export interface LandingStats {
  partidos_pitados: number;
  calificacion_promedio: number | null;
  arbitros_disponibles_hoy: number;
  primera_hora_hoy: string | null;
  arbitros_total: number;
}

// ==================== EVENTOS ====================

export const eventoEndpoints = {
  /**
   * Lista de eventos
   * - Clientes: solo sus eventos
   * - Admins: todos los eventos
   */
  async listarEventos(token: string, params?: EventosListParams): Promise<Evento[]> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append("estado", params.estado);
    if (params?.estado_pago) queryParams.append("estado_pago", params.estado_pago);
    if (params?.fecha_desde) queryParams.append("fecha_desde", params.fecha_desde);
    if (params?.fecha_hasta) queryParams.append("fecha_hasta", params.fecha_hasta);

    const query = queryParams.toString();
    const endpoint = `/api/partidos/eventos/${query ? `?${query}` : ""}`;

    return authenticatedApiClient<Evento[]>(endpoint, token);
  },

  /**
   * Obtener detalle de un evento con todos sus partidos
   */
  async obtenerEvento(token: string, id: number): Promise<EventoDetail> {
    return authenticatedApiClient<EventoDetail>(`/api/partidos/eventos/${id}/`, token);
  },

  /**
   * Crear un nuevo evento con múltiples partidos (solo cliente)
   */
  async crearEvento(token: string, data: EventoCreateData): Promise<EventoDetail> {
    return authenticatedApiClient<EventoDetail>("/api/partidos/eventos/crear/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Actualizar un evento (solo campos básicos)
   */
  async actualizarEvento(token: string, id: number, data: EventoUpdateData): Promise<EventoDetail> {
    return authenticatedApiClient<EventoDetail>(`/api/partidos/eventos/${id}/actualizar/`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Cancelar un evento y todos sus partidos
   */
  async cancelarEvento(token: string, id: number, motivo?: string): Promise<EventoDetail> {
    return authenticatedApiClient<EventoDetail>(`/api/partidos/eventos/${id}/cancelar/`, token, {
      method: "PATCH",
      body: JSON.stringify({ motivo_cancelacion: motivo || "Cancelado por el cliente" }),
    });
  },

  /**
   * Marcar un evento como pagado (solo cliente)
   * Opcionalmente acepta un comprobante de pago (imagen)
   */
  async marcarEventoPagado(token: string, id: number, comprobante?: File): Promise<EventoDetail> {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const formData = new FormData();
    if (comprobante) {
      formData.append("comprobante_pago", comprobante);
    }

    const response = await fetch(`${API_URL}/api/partidos/eventos/${id}/marcar-pagado/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || "Error al marcar como pagado");
    }

    return response.json();
  },

  /**
   * Aprobar pago de un evento (solo admin)
   */
  async aprobarPagoEvento(token: string, id: number): Promise<EventoDetail> {
    return authenticatedApiClient<EventoDetail>(
      `/api/partidos/eventos/${id}/aprobar-pago/`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({}),
      }
    );
  },

  /**
   * Rechazar pago de un evento (solo admin)
   */
  async rechazarPagoEvento(token: string, id: number, notas?: string): Promise<EventoDetail> {
    return authenticatedApiClient<EventoDetail>(
      `/api/partidos/eventos/${id}/rechazar-pago/`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify({ notas_pago: notas || "Pago rechazado" }),
      }
    );
  },

  /**
   * Lista de eventos con pagos pendientes de revisión (solo admin)
   */
  async listarEventosPagosPendientes(token: string): Promise<Evento[]> {
    return authenticatedApiClient<Evento[]>("/api/partidos/eventos/pagos-pendientes/", token);
  },
};
