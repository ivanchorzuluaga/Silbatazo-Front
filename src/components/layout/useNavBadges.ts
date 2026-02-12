/**
 * Hook para calcular badges de navegación según pendientes
 */

import { useEffect, useState } from "react";
import { ROUTES, USER_ROLES } from "@/lib/constants";
import { partidoService } from "@/features/partidos/services/partido.service";
import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import { authService } from "@/features/auth/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

export type NavBadgeMap = Record<string, number>;

export function useNavBadges(): NavBadgeMap {
  const { user, isAuthenticated } = useAuth();
  const [badges, setBadges] = useState<NavBadgeMap>({});

  useEffect(() => {
    let cancelled = false;

    const loadBadges = async () => {
      if (!isAuthenticated || !user?.role) {
        setBadges({});
        return;
      }

      try {
        if (user.role === USER_ROLES.ADMIN) {
          const token = authService.getAccessToken();
          if (!token) {
            setBadges({});
            return;
          }
          const stats = await partidoEndpoints.getAdminDashboardStats(token);
          if (cancelled) return;

          const nextBadges: NavBadgeMap = {};
          if (stats.verificaciones > 0) {
            nextBadges[ROUTES.ADMIN_VERIFICACION] = stats.verificaciones;
          }
          if ((stats.pagos_pendientes ?? 0) > 0) {
            nextBadges[ROUTES.ADMIN_PAGOS_PENDIENTES] = stats.pagos_pendientes ?? 0;
          }
          setBadges(nextBadges);
          return;
        }

        const partidos = await partidoService.listarPartidos();
        if (cancelled) return;

        const pendientes = partidos.filter(
          (p) => p.estado === "pendiente" || p.estado === "buscando_arbitro"
        ).length;
        const nextBadges: NavBadgeMap = {};
        if (pendientes > 0) {
          nextBadges[ROUTES.PARTIDOS] = pendientes;
        }
        setBadges(nextBadges);
      } catch {
        if (!cancelled) setBadges({});
      }
    };

    loadBadges();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.role]);

  return badges;
}
