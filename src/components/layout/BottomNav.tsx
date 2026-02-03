/**
 * Barra de navegación inferior tipo iOS
 * Solo visible en móvil
 */

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, USER_ROLES } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getWhatsAppUrl, WhatsAppIcon } from "@/components/ui/WhatsAppButton";
import { Home, Calendar, Search, User, Wallet, Shield } from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    label: "Inicio",
    icon: Home,
    route: ROUTES.HOME,
  },
  {
    label: "Partidos",
    icon: Calendar,
    route: ROUTES.PARTIDOS,
    roles: [USER_ROLES.CLIENTE, USER_ROLES.ARBITRO],
  },
  {
    label: "Árbitros",
    icon: Search,
    route: ROUTES.ARBITROS,
    roles: [USER_ROLES.CLIENTE],
  },
  {
    label: "Mi perfil",
    icon: User,
    route: ROUTES.CLIENTE_PERFIL,
    roles: [USER_ROLES.CLIENTE],
  },
  {
    label: "Perfil",
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
  {
    label: "Admin",
    icon: Shield,
    route: ROUTES.ADMIN_DASHBOARD,
    roles: [USER_ROLES.ADMIN],
  },
];

export function BottomNav() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Filtrar items según el rol del usuario
  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user.role ? item.roles.includes(user.role) : false;
  });

  // Si solo hay un item o menos, no mostrar la navegación
  if (visibleItems.length <= 1) {
    return null;
  }

  // Obtener la ruta del dashboard del usuario
  const dashboardRoute = getDashboardRoute(user.role || "cliente");

  // Agregar el dashboard como primer item si no está en la lista
  const allItems = [
    {
      label: "Dashboard",
      icon: Home,
      route: dashboardRoute,
    },
    ...visibleItems.filter((item) => item.route !== dashboardRoute),
  ];

  // Limitar a 4 items + WhatsApp + Tema
  const displayItems = allItems.slice(0, 4);
  const whatsAppHref = getWhatsAppUrl();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md safe-area-bottom sm:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const pathname = location.pathname;
          const isExact = pathname === item.route;
          const isChild = item.route !== ROUTES.HOME && pathname.startsWith(item.route + "/");
          const isActive = isExact || isChild;

          return (
            <Link
              key={item.route}
              to={item.route}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-ios touch-manipulation",
                "active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn("rounded-lg p-2 transition-ios", isActive && "bg-primary/10")}>
                <Icon className="size-5" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-ios",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* WhatsApp */}
        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-ios touch-manipulation active:scale-95 text-muted-foreground hover:text-[#25D366]"
          aria-label="WhatsApp"
        >
          <div className="rounded-lg p-2">
            <WhatsAppIcon className="size-5 text-current" />
          </div>
          <span className="text-[10px] font-medium">WhatsApp</span>
        </a>
        {/* ThemeToggle al final */}
        <div className="flex flex-col items-center justify-center gap-1 flex-1 h-full">
          <div className="rounded-lg p-2">
            <ThemeToggle size="sm" />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">Tema</span>
        </div>
      </div>
    </nav>
  );
}
