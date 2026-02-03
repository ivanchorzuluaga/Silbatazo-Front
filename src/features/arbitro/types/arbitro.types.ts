/**
 * Tipos específicos del feature de árbitros
 */

export interface Municipio {
  id: number;
  nombre: string;
  codigo?: string;
  departamento?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  nivel?: string;
  activo: boolean;
}

export interface RolArbitro {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface CategoriaCreateData {
  nombre: string;
  descripcion?: string;
  nivel?: string;
  activo?: boolean;
}

export interface CategoriaUpdateData {
  nombre?: string;
  descripcion?: string;
  nivel?: string;
  activo?: boolean;
}

export type EstadoVerificacion =
  | "pendiente"
  | "en_revision"
  | "aprobado"
  | "rechazado"
  | "suspendido";

export type TipoDocumento = "certificacion" | "identificacion" | "seguro" | "otro";
export type EstadoDocumento = "pendiente" | "aprobado" | "rechazado";

export interface DocumentoArbitro {
  id: number;
  tipo: TipoDocumento;
  tipo_display: string;
  archivo: string;
  archivo_url: string;
  nombre?: string;
  estado: EstadoDocumento;
  estado_display: string;
  comentarios?: string;
  revisado_por?: number;
  fecha_revision?: string;
  created_at: string;
  updated_at: string;
}

export interface Arbitro {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  telefono?: string;
  fecha_nacimiento?: string;
  documento_identidad?: string;
  biografia?: string;
  experiencia_anos: number;
  municipios: Municipio[];
  categorias: Categoria[];
  roles: RolArbitro[];
  estado_verificacion: EstadoVerificacion;
  estado_verificacion_display: string;
  esta_aprobado: boolean;
  documentos?: DocumentoArbitro[];
  disponibilidades?: DisponibilidadArbitro[];
  comentarios_verificacion?: string;
  fecha_verificacion?: string;
  verificado_por?: number;
  verificado_por_username?: string;
  created_at: string;
  updated_at: string;
  // Propiedades opcionales del marketplace
  calificacion_promedio?: number;
  total_calificaciones?: number;
  total_partidos?: number;
  foto_perfil?: string;
}

export interface ArbitroCreateData {
  telefono?: string;
  fecha_nacimiento?: string;
  documento_identidad?: string;
  biografia?: string;
  experiencia_anos: number;
  municipios_ids: number[];
  categorias_ids: number[];
  roles_ids: number[];
}

export type ArbitroUpdateData = Partial<ArbitroCreateData>;

export interface DocumentoCreateData {
  tipo: TipoDocumento;
  archivo: File;
  nombre?: string;
}

export interface ArbitroVerificacionData {
  estado: "aprobado" | "rechazado" | "suspendido";
  comentarios?: string;
}

export type DiaSemana =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

export interface DisponibilidadArbitro {
  id: number;
  dia_semana: DiaSemana;
  dia_semana_display: string;
  hora_inicio: string; // Formato HH:MM
  hora_fin: string; // Formato HH:MM
  municipios: Municipio[];
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface DisponibilidadCreateData {
  dia_semana: DiaSemana;
  hora_inicio: string; // Formato HH:MM
  hora_fin: string; // Formato HH:MM
  municipios_ids?: number[]; // Opcional, si está vacío aplica a todos
  activo?: boolean;
}

export type DisponibilidadUpdateData = Partial<DisponibilidadCreateData>;

// ==================== RETIROS ====================

export type EstadoRetiro = "pendiente" | "procesado" | "rechazado";

export type TipoCuenta = "ahorros" | "corriente" | "nequi" | "daviplata" | "otro";

export interface Retiro {
  id: number;
  arbitro: number;
  arbitro_username: string;
  arbitro_full_name: string;
  monto: string;
  estado: EstadoRetiro;
  estado_display: string;
  numero_cuenta?: string;
  tipo_cuenta?: TipoCuenta;
  banco?: string;
  motivo_rechazo?: string;
  comentarios_admin?: string;
  procesado_por?: number;
  procesado_por_username?: string;
  fecha_procesamiento?: string;
  esta_pendiente: boolean;
  esta_procesado: boolean;
  esta_rechazado: boolean;
  created_at: string;
  updated_at: string;
}

export interface RetiroCreateData {
  monto: number;
  numero_cuenta?: string;
  tipo_cuenta?: TipoCuenta;
  banco?: string;
}

export interface RetiroProcesarData {
  estado: "procesado" | "rechazado";
  motivo_rechazo?: string;
  comentarios_admin?: string;
}

export interface SaldoDisponible {
  saldo_disponible: number;
  saldo_pendiente: number;
  saldo_real_disponible: number;
  total_ingresos: number;
  total_retirado: number;
  partidos_completados: number;
}
