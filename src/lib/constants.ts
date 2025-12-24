/**
 * Constantes globales de la aplicación
 */

export const APP_NAME = "Árbitros de Confianza";

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
  ADMIN_DASHBOARD: "/admin/dashboard",
  HOME: "/",
} as const;

export const USER_ROLES = {
  CLIENTE: "cliente",
  ARBITRO: "arbitro",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
