/**
 * Constantes globales de la aplicación
 */

export const APP_NAME = "Silbatazo";
export const APP_SLOGAN = "Árbitros de Confianza";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  // Rutas específicas por rol
  CLIENTE_DASHBOARD: "/cliente/dashboard",
  ARBITRO_DASHBOARD: "/arbitro/dashboard",
  ARBITRO_PERFIL: "/arbitro/perfil",
  ARBITRO_BILLETERA: "/arbitro/billetera",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_RETIROS: "/admin/retiros",
  ADMIN_VERIFICACION: "/admin/arbitros/verificar",
  ADMIN_VERIFICAR_ARBITRO: "/admin/arbitros/verificar/:id",
  ADMIN_GESTION_ARBITROS: "/admin/arbitros",
  ADMIN_GESTION_PARTIDOS: "/admin/partidos",
  ADMIN_CATEGORIAS: "/admin/categorias",
  ADMIN_ASIGNACION_PARTIDOS: "/admin/partidos/asignacion",
  ADMIN_PAGOS_PENDIENTES: "/admin/pagos/pendientes",
  // Marketplace
  ARBITROS: "/arbitros",
  ARBITRO_DETALLE: "/arbitros/:id",
  // Partidos
  PARTIDOS: "/partidos",
  PARTIDOS_CREAR: "/partidos/crear",
  PARTIDO_DETALLE: "/partidos/:id",
  PARTIDO_PAGO: "/partidos/:id/pago",
  HOME: "/",
  // Páginas legales
  TERMINOS: "/terminos-condiciones",
  PRIVACIDAD: "/politica-privacidad",
  REEMBOLSO: "/politica-reembolso",
} as const;

/**
 * Construye la ruta de detalle de árbitro con un ID
 */
export function getArbitroDetailRoute(id: number | string): string {
  return `/arbitros/${id}`;
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
