import { USER_ROLES, type UserRole } from "@/lib/constants";

const COMISION_FALLBACK_LEGACY = 10000;

export function getGrossAmount(montoTotal?: number | null, tipoMontoTotal?: number | null): number {
  return Math.max(montoTotal ?? tipoMontoTotal ?? 0, 0);
}

export function getCommissionAmount(
  grossAmount: number,
  tipoComisionApp?: number | null
): number {
  if (tipoComisionApp != null) {
    return Math.max(tipoComisionApp, 0);
  }
  return Math.max(Math.min(COMISION_FALLBACK_LEGACY, grossAmount), 0);
}

export function getNetAmount(grossAmount: number, tipoComisionApp?: number | null): number {
  return Math.max(grossAmount - getCommissionAmount(grossAmount, tipoComisionApp), 0);
}

export function getRoleAmounts(
  grossAmount: number,
  tipoComisionApp?: number | null,
  role?: UserRole
): { gross: number; net: number; showNetOnly: boolean; showBoth: boolean } {
  const net = getNetAmount(grossAmount, tipoComisionApp);
  const showNetOnly = role === USER_ROLES.ARBITRO;
  const showBoth = role === USER_ROLES.ADMIN;
  return { gross: grossAmount, net, showNetOnly, showBoth };
}
