/**
 * Utilidades para el flujo de onboarding de árbitros nuevos
 */

import type { Arbitro } from "../types/arbitro.types";

/**
 * Indica si un árbitro debe completar el onboarding (perfil, foto y disponibilidad).
 * Usado para redirigir usuarios nuevos a la guía paso a paso.
 */
export function necesitaOnboardingArbitro(arbitro: Arbitro | null): boolean {
  if (!arbitro) return true;
  const sinDisponibilidad = !arbitro.disponibilidades || arbitro.disponibilidades.length === 0;
  const sinEmail = !arbitro.email?.trim();
  const sinTelefono = !arbitro.telefono?.trim();
  const sinDocumento = !arbitro.documento_identidad?.trim();
  const sinNacimiento = !arbitro.fecha_nacimiento?.trim();
  return sinDisponibilidad || sinEmail || sinTelefono || sinDocumento || sinNacimiento;
}
