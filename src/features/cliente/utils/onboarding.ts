/**
 * Utilidades para el flujo de onboarding de clientes nuevos
 */

import type { User } from "@/features/auth/types/auth.types";

/**
 * Indica si un cliente debe completar su perfil (nombre y email).
 * Usado para redirigir usuarios nuevos a completar datos.
 */
export function necesitaOnboardingCliente(user: User | null): boolean {
  if (!user) return true;
  const sinNombre = !user.first_name?.trim() || !user.last_name?.trim();
  const sinEmail = !user.email?.trim();
  const sinTelefono = !user.telefono?.trim();
  const sinDocumento = !user.documento_identidad?.trim();
  const sinNacimiento = !user.fecha_nacimiento?.trim();
  return sinNombre || sinEmail || sinTelefono || sinDocumento || sinNacimiento;
}
