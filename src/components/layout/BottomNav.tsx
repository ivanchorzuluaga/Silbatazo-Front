/**
 * Barra de navegación inferior tipo iOS
 * Solo visible en móvil
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu } from "lucide-react";
import { SlidePanel, SlidePanelContent, SlidePanelHeader, SlidePanelTitle } from "@/components/ui/slide-panel";
import { getVisibleNavSections, getVisibleNavItems } from "./navConfig";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const dashboardRoute = getDashboardRoute(user.role || "cliente");
  const allItems = getVisibleNavItems(user.role).map((item) => ({
    ...item,
    route: item.route || dashboardRoute,
  }));
  const displayItems = allItems.slice(0, 4);
  const sections = getVisibleNavSections(user.role);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/85 backdrop-blur-xl safe-area-bottom sm:hidden">
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
                <div
                  className={cn(
                    "rounded-xl p-2 transition-ios",
                    isActive && "bg-primary/10 ring-1 ring-primary/20"
                  )}
                >
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
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-ios touch-manipulation",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="rounded-xl p-2">
              <Menu className="size-5" />
            </div>
            <span className="text-[10px] font-medium">Más</span>
          </button>
        </div>
      </nav>

      <SlidePanel open={isOpen} onOpenChange={setIsOpen}>
        <SlidePanelContent className="max-w-xl rounded-b-2xl bg-card/95 backdrop-blur-xl">
          <SlidePanelHeader>
            <SlidePanelTitle>Menú</SlidePanelTitle>
          </SlidePanelHeader>
          <div className="p-4 space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h3 className="mb-2 px-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const route = item.route || dashboardRoute;
                    return (
                      <Link
                        key={route}
                        to={route}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm hover:bg-accent/60"
                      >
                        <Icon className="size-4" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2">
              <WhatsAppButton className="flex-1" />
              <div className="flex items-center justify-center rounded-lg border border-border/60 px-3 py-2">
                <ThemeToggle size="sm" />
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </SlidePanelContent>
      </SlidePanel>
    </>
  );
}
