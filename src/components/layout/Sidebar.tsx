/**
 * Sidebar de navegación para desktop
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, USER_ROLES, APP_NAME } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoImage from "@/assets/Silbatazo-bordes.png";
import {
  Home,
  Calendar,
  Search,
  User,
  Wallet,
  Shield,
  Users,
  FileText,
  CreditCard,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  roles?: string[];
  badge?: number;
}

const navSections: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      {
        label: "Dashboard",
        icon: Home,
        route: "", // Se reemplazará con el dashboard del usuario
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
        label: "Dashboard",
        icon: Shield,
        route: ROUTES.ADMIN_DASHBOARD,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Árbitros",
        icon: Users,
        route: ROUTES.ADMIN_GESTION_ARBITROS,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Partidos",
        icon: Calendar,
        route: ROUTES.ADMIN_GESTION_PARTIDOS,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Pagos",
        icon: CreditCard,
        route: ROUTES.ADMIN_PAGOS_PENDIENTES,
        roles: [USER_ROLES.ADMIN],
      },
      {
        label: "Categorías",
        icon: FileText,
        route: ROUTES.ADMIN_CATEGORIAS,
        roles: [USER_ROLES.ADMIN],
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const dashboardRoute = getDashboardRoute(user.role);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside
      className={cn(
        "hidden sm:flex sm:flex-col sm:fixed sm:left-0 sm:top-0 sm:h-screen sm:w-64 sm:border-r sm:bg-card/50 sm:backdrop-blur-sm sm:z-40",
        className
      )}
    >
      {/* Header con Logo */}
      <div className="flex h-20 items-center gap-3 border-b px-6 flex-shrink-0">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img src={logoImage} alt="Silbatazo Logo" className="h-10 w-auto object-contain" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground truncate">{APP_NAME}</p>
            <p className="text-sm font-bold truncate">{user.username}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((section, sectionIndex) => {
          // Filtrar items según el rol
          const visibleItems = section.items.filter((item) => {
            if (!item.roles) {
              // Si no tiene roles, es el dashboard genérico
              return true;
            }
            return user.role ? item.roles.includes(user.role) : false;
          });

          if (visibleItems.length === 0) {
            return null;
          }

          return (
            <div key={sectionIndex}>
              {section.title && (
                <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const route = item.route || dashboardRoute;
                  const isActive =
                    location.pathname === route ||
                    (route !== ROUTES.HOME && location.pathname.startsWith(route));

                  return (
                    <li key={item.route || "dashboard"}>
                      <Link
                        to={route}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-ios",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">Tema</span>
          <ThemeToggle size="sm" />
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
