/**
 * Constantes globales de la aplicación
 */

export const APP_NAME = "Silbatazo";
export const APP_SLOGAN = "Árbitros de Confianza";

/** Calificación pública fija mientras no hay sistema de reseñas en la app */
export const ARBITRO_CALIFICACION_PUBLICA = 5;

/** Número de WhatsApp para contacto (código país + número sin + ni espacios). Ej: 573001234567 */
export const CONTACT_WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string) || "573159888384";

/** Mensaje inicial único para reservas y contacto por WhatsApp */
export const WHATSAPP_RESERVA_MESSAGE =
  "Hola Silbatazo, quiero reservar un árbitro para mi partido. ¿Me pueden ayudar con la gestión?";

/** Categorías base que se usan en partidos y tarifas */
export const CATEGORIAS_PARTIDO = [
  "Libre",
  "Veteranos",
  "Juvenil",
  "Infantil",
  "Femenino",
] as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

export const MAX_FOTO_PERFIL_MB = 2;
export const COMISION_PLATAFORMA_PARTIDO = 10000;

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  // Rutas específicas por rol
  CLIENTE_DASHBOARD: "/cliente/dashboard",
  CLIENTE_PERFIL: "/cliente/perfil",
  CLIENTE_ARBITROS: "/cliente/arbitros",
  CLIENTE_ARBITRO_DETALLE: "/cliente/arbitros/:id",
  ARBITRO_DASHBOARD: "/arbitro/dashboard",
  ARBITRO_ONBOARDING: "/arbitro/onboarding",
  ARBITRO_PARTIDOS_DISPONIBLES: "/arbitro/partidos-disponibles",
  ARBITRO_PERFIL: "/arbitro/perfil",
  ARBITRO_BILLETERA: "/arbitro/billetera",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_RETIROS: "/admin/retiros",
  ADMIN_VERIFICACION: "/admin/arbitros/verificar",
  ADMIN_VERIFICAR_ARBITRO: "/admin/arbitros/verificar/:id",
  ADMIN_GESTION_ARBITROS: "/admin/arbitros",
  ADMIN_USUARIOS: "/admin/usuarios",
  ADMIN_GESTION_PARTIDOS: "/admin/partidos",
  ADMIN_PARTIDOS_CREAR: "/admin/partidos/crear",
  ADMIN_CATEGORIAS: "/admin/categorias",
  ADMIN_TIPOS_PARTIDO: "/admin/tipos-partido",
  ADMIN_ASIGNACION_PARTIDOS: "/admin/partidos/asignacion",
  ADMIN_PARTIDOS_SOLAPADOS: "/admin/partidos/solapados",
  ADMIN_PAGOS_PENDIENTES: "/admin/pagos/pendientes",
  ADMIN_FINANZAS: "/admin/finanzas",
  ADMIN_EMAILS: "/admin/correos",
  // Marketplace (público)
  ARBITROS: "/arbitros",
  ARBITRO_DETALLE: "/arbitros/:id",
  // Partidos
  PARTIDOS: "/partidos",
  PARTIDOS_CREAR: "/partidos/crear",
  PARTIDO_DETALLE: "/partidos/:id",
  PARTIDO_PAGO: "/partidos/:id/pago",
  HOME: "/",
  // Páginas legales
  RECUPERAR_CONTRASENA: "/recuperar-contrasena",
  RECUPERAR_CONTRASENA_CONFIRM: "/recuperar-contrasena/confirmar",
  VERIFICAR_CORREO: "/verificar-correo",
  VERIFICAR_CORREO_CONFIRM: "/verificar-correo/confirmar",
} as const;

/**
 * Construye la ruta de detalle de árbitro con un ID (público)
 */
export function getArbitroDetailRoute(id: number | string): string {
  return `/arbitros/${id}`;
}

/**
 * Construye la ruta de detalle de árbitro para clientes (con sidebar)
 */
export function getClienteArbitroDetailRoute(id: number | string): string {
  return `/cliente/arbitros/${id}`;
}

/**
 * Construye la ruta de detalle de partido con un ID
 */
export function getPartidoDetailRoute(id: number | string): string {
  return `/partidos/${id}`;
}

/**
 * Construye la ruta de verificación de árbitro con un ID
 */
export function getVerificarArbitroRoute(id: number | string): string {
  return `/admin/arbitros/verificar/${id}`;
}

/**
 * Construye la ruta de pago de partido con un ID
 */
export function getPartidoPagoRoute(id: number | string): string {
  return `/partidos/${id}/pago`;
}

export const USER_ROLES = {
  CLIENTE: "cliente",
  ARBITRO: "arbitro",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
