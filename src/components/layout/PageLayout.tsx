/**
 * Componente de layout para páginas con header y contenido
 * Integra navegación (Sidebar/BottomNav) y mejoras visuales
 */

import { PageHeader } from "./PageHeader";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import type { PageHeaderProps } from "./PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";

interface PageLayoutProps extends Omit<PageHeaderProps, "className"> {
  children: React.ReactNode;
  /** Clase CSS adicional para el contenedor de contenido */
  contentClassName?: string;
  /** Si el contenido debe tener scroll */
  scrollable?: boolean;
  /** Si debe mostrar la navegación */
  showNavigation?: boolean;
}

export function PageLayout({
  children,
  contentClassName = "",
  scrollable = true,
  showNavigation = true,
  ...headerProps
}: PageLayoutProps) {
  const { isAuthenticated } = useAuth();
  const shouldShowNav = showNavigation && isAuthenticated;

  return (
    <div className="flex min-h-screen bg-background safe-area-inset">
      {/* Sidebar para desktop */}
      {shouldShowNav && <Sidebar />}

      {/* Contenido principal */}
      <div className={cn("flex flex-1 flex-col min-h-screen", shouldShowNav && "sm:ml-64")}>
        <PageHeader {...headerProps} />
        <EmailVerificationBanner />
        <div
          className={cn(
            scrollable ? "flex-1 overflow-y-auto" : "flex-1",
            shouldShowNav && "pb-nav-mobile sm:pb-0"
          )}
        >
          <div className={contentClassName}>{children}</div>
        </div>
      </div>

      {/* BottomNav para móvil */}
      {shouldShowNav && <BottomNav />}
    </div>
  );
}
