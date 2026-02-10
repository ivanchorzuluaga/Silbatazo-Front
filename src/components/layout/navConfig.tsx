/**
 * Configuración única de navegación (desktop y mobile)
 */

import {
  Home,
  Calendar,
  Search,
  User,
  Wallet,
  Users,
  FileText,
  CreditCard,
  UserCheck,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import { ROUTES, USER_ROLES, type UserRole } from "@/lib/constants";

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  roles?: UserRole[];
  badge?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        icon: Home,
        route: "", // Se reemplaza con el dashboard del usuario
      },
    ],
  },
  {
    title: "Principal",
    items: [
      {
        label: "Partidos",
        icon: Calendar,
        route: ROUTES.PARTIDOS,
        roles: [USER_ROLES.CLIENTE, USER_ROLES.ARBITRO],
      },
      {
        label: "Árbitros",
        icon: Search,
        route: ROUTES.CLIENTE_ARBITROS,
        roles: [USER_ROLES.CLIENTE],
      },
      {
        label: "Mi perfil",
        icon: User,
        route: ROUTES.CLIENTE_PERFIL,
        roles: [USER_ROLES.CLIENTE],
      },
    ],
  },
  {
    title: "Árbitro",
    items: [
      {
        label: "Mi Perfil",
        icon: User,
        route: ROUTES.ARBITRO_PERFIL,
        roles: [USER_ROLES.ARBITRO],
      },
      {
        label: "Billetera",
        icon: Wallet,
        route: ROUTES.ARBITRO_BILLETERA,
        roles: [USER_ROLES.ARBITRO],
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        label: "Árbitros",
        icon: Users,
        route: ROUTES.ADMIN_GESTION_ARBITROS,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Verificar Árbitros",
        icon: UserCheck,
        route: ROUTES.ADMIN_VERIFICACION,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Partidos",
        icon: Calendar,
        route: ROUTES.ADMIN_GESTION_PARTIDOS,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Asignación",
        icon: ClipboardList,
        route: ROUTES.ADMIN_ASIGNACION_PARTIDOS,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Partidos solapados",
        icon: AlertTriangle,
        route: ROUTES.ADMIN_PARTIDOS_SOLAPADOS,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Pagos",
        icon: CreditCard,
        route: ROUTES.ADMIN_PAGOS_PENDIENTES,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Tipos de partido",
        icon: FileText,
        route: ROUTES.ADMIN_TIPOS_PARTIDO,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Retiros",
        icon: Wallet,
        route: ROUTES.ADMIN_RETIROS,
        roles: [USER_ROLES.ADMIN],
      },
    ],
  },
];

export function getVisibleNavSections(role?: UserRole) {
  return navSections
    .map((section) => {
      const visibleItems = section.items.filter((item) => {
        if (!item.roles) return true;
        return role ? item.roles.includes(role) : false;
      });
      return { ...section, items: visibleItems };
    })
    .filter((section) => section.items.length > 0);
}

export function getVisibleNavItems(role?: UserRole) {
  return getVisibleNavSections(role).flatMap((section) => section.items);
}
