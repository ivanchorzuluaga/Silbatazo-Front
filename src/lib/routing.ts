/**
 * Utilidades para enrutamiento y redirección según roles
 */

import { ROUTES, USER_ROLES, type UserRole } from "./constants";

/**
 * Obtiene la ruta del dashboard según el rol del usuario
 * @param role - Rol del usuario (cliente, árbitro, admin)
 * @returns Ruta del dashboard correspondiente al rol
 */
export function getDashboardRoute(role?: UserRole): string {
  switch (role) {
    case USER_ROLES.CLIENTE:
      return ROUTES.CLIENTE_DASHBOARD;
    case USER_ROLES.ARBITRO:
      return ROUTES.ARBITRO_DASHBOARD;
    case USER_ROLES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    default:
      // Si no hay rol o es desconocido, redirigir al dashboard genérico
      return ROUTES.DASHBOARD;
  }
}

/**
 * Verifica si un usuario tiene acceso a una ruta según su rol
 * @param userRole - Rol del usuario
 * @param allowedRoles - Roles permitidos para la ruta
 * @returns true si el usuario tiene acceso, false en caso contrario
 */
export function hasRoleAccess(userRole?: UserRole, allowedRoles?: UserRole[]): boolean {
  if (!userRole || !allowedRoles || allowedRoles.length === 0) {
    return true; // Si no hay restricciones, permitir acceso
  }
  return allowedRoles.includes(userRole);
}
