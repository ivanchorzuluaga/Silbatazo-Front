/**
 * Sidebar de navegación para desktop
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import logoImage from "@/assets/Silvato.png";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVisibleNavSections } from "./navConfig";

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
  const navSections = getVisibleNavSections(user.role);

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
        "hidden sm:flex sm:flex-col sm:fixed sm:left-0 sm:top-0 sm:h-screen sm:w-64 sm:border-r sm:border-border/60 sm:bg-card/70 sm:backdrop-blur-xl sm:z-40",
        className
      )}
    >
      {/* Header con Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-border/60 px-6 flex-shrink-0">
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
          if (section.items.length === 0) {
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
                {(() => {
                  const pathname = location.pathname;
                  const routes = section.items.map((item) => item.route || dashboardRoute);
                  const matchingRoute = routes
                    .filter(
                      (r) => pathname === r || (r !== ROUTES.HOME && pathname.startsWith(r + "/"))
                    )
                    .sort((a, b) => b.length - a.length)[0];

                  return section.items.map((item) => {
                    const Icon = item.icon;
                    const route = item.route || dashboardRoute;
                    const isActive = route === matchingRoute;

                    return (
                      <li key={item.route || "dashboard"}>
                        <Link
                          to={route}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-ios",
                            "hover:bg-accent/60 hover:text-accent-foreground",
                            isActive &&
                              "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 hover:bg-primary/15"
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
                  });
                })()}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 flex-shrink-0 space-y-3">
        <WhatsAppButton variant="sidebar" className="w-full" />
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
