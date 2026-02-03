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
  const sinFoto = !arbitro.foto_perfil || arbitro.foto_perfil.trim() === "";
  const sinDisponibilidad = !arbitro.disponibilidades || arbitro.disponibilidades.length === 0;
  return sinFoto || sinDisponibilidad;
}
