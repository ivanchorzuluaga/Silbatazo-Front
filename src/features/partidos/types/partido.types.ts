/**
 * Tipos específicos del feature de partidos
 */

import type { Municipio, Categoria } from "@/features/arbitro/types/arbitro.types";

export type EstadoPartido =
  | "buscando_arbitro"
  | "pendiente"
  | "aceptado"
  | "rechazado"
  | "completado"
  | "cancelado";

export type EstadoPago = "pendiente" | "en_revision" | "aprobado" | "rechazado";

export interface ArbitroInfo {
  id: number;
  username: string;
  full_name: string;
}

export interface Partido {
  id: number;
  codigo: string;
  cliente: number;
  cliente_username: string;
  cliente_email: string;
  cliente_full_name: string;
  arbitro: number | null;
  arbitro_info: ArbitroInfo | null;
  fecha: string; // YYYY-MM-DD
  fecha_str: string;
  hora: string; // HH:MM:SS
  hora_str: string; // HH:MM
  municipio: Municipio;
  categoria: Categoria;
  lugar: string;
  direccion?: string;
  tipo_partido?: TipoPartido | null;
  monto_total?: number | null;
  estado: EstadoPartido;
  estado_display: string;
  estado_pago: EstadoPago;
  estado_pago_display: string;
  fecha_pago?: string;
  notas_pago?: string;
  notas_cliente?: string;
  notas_arbitro?: string;
  motivo_rechazo?: string;
  motivo_cancelacion?: string;
  fecha_aceptacion?: string;
  fecha_rechazo?: string;
  fecha_completado?: string;
  fecha_cancelacion?: string;
  created_at: string;
  updated_at: string;
}

export interface PartidoDetail extends Partido {
  esta_pendiente: boolean;
  esta_aceptado: boolean;
  esta_rechazado: boolean;
  esta_completado: boolean;
  esta_cancelado: boolean;
  esta_buscando_arbitro: boolean;
  tiene_arbitro_asignado: boolean;
  puede_ser_aceptado: boolean;
  puede_ser_rechazado: boolean;
  puede_ser_cancelado: boolean;
  puede_ser_completado: boolean;
  postulaciones?: PostulacionArbitro[];
}

/** Tipo de partido con precio fijo (selector único) */
export interface TipoPartido {
  id: number;
  slug: string;
  nombre: string;
  duracion_referencial: string;
  monto: number;
}

export interface PartidoCreateData {
  arbitro_id?: number | null; // Opcional: si es null, busca árbitro
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  municipio_id: number;
  categoria_id: number;
  lugar: string;
  direccion?: string;
  tipo_partido_id?: number | null;
  monto_total?: number | null;
  notas_cliente?: string;
}

export interface PartidoUpdateData {
  fecha?: string; // YYYY-MM-DD
  hora?: string; // HH:MM
  lugar?: string;
  direccion?: string;
  notas_cliente?: string;
}

export interface PartidoAceptarData {
  notas_arbitro?: string;
}

export interface PartidoRechazarData {
  motivo_rechazo: string;
}

export interface PartidoCancelarData {
  motivo_cancelacion: string;
}

export interface PartidoCompletarData {
  notas_arbitro?: string;
}

export interface PartidosListParams {
  estado?: EstadoPartido;
  fecha_desde?: string; // YYYY-MM-DD
  fecha_hasta?: string; // YYYY-MM-DD
  cliente_id?: number; // Solo admin o árbitro
  arbitro_id?: number; // Solo admin o cliente
  municipio_id?: number; // Para partidos disponibles
  categoria_id?: number; // Para partidos disponibles
}

// Postulaciones
export type EstadoPostulacion = "pendiente" | "aceptada" | "rechazada";

export interface PostulacionArbitro {
  id: number;
  partido: number;
  arbitro: number;
  arbitro_info: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    experiencia_anos: number;
  };
  mensaje?: string;
  estado: EstadoPostulacion;
  estado_display: string;
  esta_pendiente: boolean;
  esta_aceptada: boolean;
  esta_rechazada: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostulacionCreateData {
  mensaje?: string;
}

export interface PartidoAsignarData {
  arbitro_id: number;
}

// ==================== CALIFICACIONES ====================

export interface Calificacion {
  id: number;
  partido: number;
  partido_id: number;
  calificador: number;
  calificador_username: string;
  calificador_full_name: string;
  calificado: number;
  calificado_username: string;
  calificado_full_name: string;
  es_cliente_calificando: boolean;
  puntuacion: number; // 1-5
  comentario?: string;
  created_at: string;
  updated_at: string;
}

export interface CalificacionCreateData {
  puntuacion: number; // 1-5
  comentario?: string;
}

export interface PromedioArbitro {
  arbitro_id: number;
  promedio: number | null;
  total_calificaciones: number;
}

// Tipos para eventos (agrupación de partidos)
export interface Evento {
  id: number;
  cliente: number;
  estado?: string;
  estado_pago?: string;
  partidos?: Partido[];
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface EventoDetail extends Evento {
  partidos: Partido[];
}

export interface EventoCreateData {
  partidos: PartidoCreateData[];
  [key: string]: unknown;
}

export interface EventoUpdateData {
  [key: string]: unknown;
}

export interface EventosListParams {
  estado?: string;
  estado_pago?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
