import { COMISION_PLATAFORMA_PARTIDO, USER_ROLES, type UserRole } from "@/lib/constants";

export function getGrossAmount(montoTotal?: number | null, tipoMonto?: number | null): number {
  return Math.max(montoTotal ?? tipoMonto ?? 0, 0);
}

export function getNetAmount(grossAmount: number): number {
  return Math.max(grossAmount - COMISION_PLATAFORMA_PARTIDO, 0);
}

export function getRoleAmounts(
  grossAmount: number,
  role?: UserRole
): { gross: number; net: number; showNetOnly: boolean; showBoth: boolean } {
  const net = getNetAmount(grossAmount);
  const showNetOnly = role === USER_ROLES.ARBITRO;
  const showBoth = role === USER_ROLES.ADMIN;
  return { gross: grossAmount, net, showNetOnly, showBoth };
}
