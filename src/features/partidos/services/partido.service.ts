/**
 * Servicio de partidos
 * Encapsula la lógica de negocio relacionada con partidos
 */

import { partidoEndpoints } from "@/api/endpoints";
import { authService } from "@/features/auth/services/auth.service";
import { ApiException } from "@/api/client";
import { extractErrorMessage } from "@/lib/error-utils";
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
  PostulacionArbitro,
  PostulacionCreateData,
  PartidoAsignarData,
  Calificacion,
  CalificacionCreateData,
  PromedioArbitro,
} from "../types/partido.types";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export const partidoService = {
  /**
   * Obtener token de acceso
   */
  getToken(): string | null {
    return authService.getAccessToken();
  },

  /**
   * Listar partidos
   * - Clientes: solo sus partidos
   * - Árbitros: solo sus partidos asignados
   * - Admins: todos los partidos
   */
  async listarPartidos(params?: PartidosListParams): Promise<Partido[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.listarPartidos(token, params);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener partidos");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Obtener detalle de un partido
   */
  async obtenerPartido(id: number): Promise<PartidoDetail> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.obtenerPartido(token, id);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 404) {
          throw new Error("Partido no encontrado");
        }
        if (error.status === 403) {
          throw new Error("No tienes permisos para ver este partido");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener partido");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Crear un nuevo partido (solo cliente)
   * El backend ahora devuelve PartidoDetail directamente
   */
  async crearPartido(data: PartidoCreateData): Promise<PartidoDetail> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return (await partidoEndpoints.crearPartido(token, data)) as PartidoDetail;
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo los clientes pueden crear partidos");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al crear partido");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Actualizar un partido (solo cliente, solo buscando árbitro o pendientes)
   */
  async actualizarPartido(id: number, data: PartidoUpdateData): Promise<PartidoDetail> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.actualizarPartido(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("No tienes permisos para actualizar este partido");
        }
        if (error.status === 400) {
          throw new Error(extractErrorMessage(error.data) || "No se puede actualizar este partido");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al actualizar partido");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Aceptar un partido (solo árbitro)
   */
  async aceptarPartido(id: number, data?: PartidoAceptarData): Promise<PartidoDetail> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.aceptarPartido(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo el árbitro asignado puede aceptar el partido");
        }
        if (error.status === 400) {
          throw new Error(extractErrorMessage(error.data) || "Este partido no puede ser aceptado");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al aceptar partido");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Rechazar un partido (solo árbitro)
   */
  async rechazarPartido(id: number, data: PartidoRechazarData): Promise<PartidoDetail> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.rechazarPartido(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo el árbitro asignado puede rechazar el partido");
        }
        if (error.status === 400) {
          throw new Error(extractErrorMessage(error.data) || "Este partido no puede ser rechazado");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al rechazar partido");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Cancelar un partido (cliente o árbitro)
   */
  async cancelarPartido(id: number, data: PartidoCancelarData): Promise<PartidoDetail> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.cancelarPartido(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("No tienes permisos para cancelar este partido");
        }
        if (error.status === 400) {
          throw new Error(extractErrorMessage(error.data) || "Este partido no puede ser cancelado");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al cancelar partido");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Completar un partido (solo árbitro, solo aceptados)
   */
  async completarPartido(id: number, data?: PartidoCompletarData): Promise<PartidoDetail> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.completarPartido(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo el árbitro asignado puede completar el partido");
        }
        if (error.status === 400) {
          throw new Error(
            extractErrorMessage(error.data) || "Este partido no puede ser completado"
          );
        }
        throw new Error(extractErrorMessage(error.data) || "Error al completar partido");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Lista de partidos disponibles para postularse (solo árbitros)
   */
  async listarPartidosDisponibles(params?: PartidosListParams): Promise<Partido[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.listarPartidosDisponibles(token, params);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo los árbitros pueden ver partidos disponibles");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener partidos disponibles");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Postularse a un partido (solo árbitros)
   */
  async postularseAPartido(id: number, data?: PostulacionCreateData): Promise<PostulacionArbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.postularseAPartido(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo los árbitros pueden postularse");
        }
        if (error.status === 400) {
          throw new Error(extractErrorMessage(error.data) || "Ya te has postulado a este partido");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al postularse");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Ver postulaciones de un partido (solo admin)
   */
  async obtenerPostulaciones(id: number): Promise<PostulacionArbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.obtenerPostulaciones(token, id);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo los administradores pueden ver postulaciones");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener postulaciones");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Asignar árbitro a un partido (solo admin)
   */
  async asignarArbitro(id: number, data: PartidoAsignarData): Promise<PartidoDetail> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.asignarArbitro(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo los administradores pueden asignar árbitros");
        }
        if (error.status === 400) {
          throw new Error(
            extractErrorMessage(error.data) ||
              "No se puede asignar un árbitro con menos de 6 horas de anticipación"
          );
        }
        throw new Error(extractErrorMessage(error.data) || "Error al asignar árbitro");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Listar partidos que necesitan asignación (solo admin)
   */
  async listarPartidosNecesitanAsignacion(): Promise<PartidoDetail[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.listarPartidosNecesitanAsignacion(token);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo los administradores pueden ver esta información");
        }
        throw new Error(
          extractErrorMessage(error.data) || "Error al obtener partidos que necesitan asignación"
        );
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Listar árbitros disponibles para un partido (solo admin)
   */
  async listarArbitrosDisponibles(partidoId: number): Promise<Arbitro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.listarArbitrosDisponibles(token, partidoId);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo los administradores pueden ver esta información");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener árbitros disponibles");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Calificaciones
   */

  /**
   * Listar calificaciones de un partido
   */
  async listarCalificacionesPartido(partidoId: number): Promise<Calificacion[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.listarCalificacionesPartido(token, partidoId);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("No tienes permisos para ver las calificaciones de este partido");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener calificaciones");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Crear una calificación para un partido
   */
  async crearCalificacion(partidoId: number, data: CalificacionCreateData): Promise<Calificacion> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.crearCalificacion(token, partidoId, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 400) {
          throw new Error(extractErrorMessage(error.data) || "Error al crear calificación");
        }
        if (error.status === 403) {
          throw new Error("No tienes permisos para calificar este partido");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al crear calificación");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Listar calificaciones recibidas por un árbitro
   */
  async listarCalificacionesArbitro(arbitroId: number): Promise<Calificacion[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.listarCalificacionesArbitro(token, arbitroId);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener calificaciones");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Obtener el promedio de calificaciones de un árbitro
   */
  async obtenerPromedioArbitro(arbitroId: number): Promise<PromedioArbitro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.obtenerPromedioArbitro(token, arbitroId);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener promedio");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },
};
