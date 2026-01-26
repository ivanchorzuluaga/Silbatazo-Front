/**
 * Componente reutilizable para el header de navegación de las páginas
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";

interface BackButtonProps {
  label?: string;
  to?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  /** Botón de volver atrás */
  backButton?: BackButtonProps | null;
  /** Mostrar botón de dashboard */
  showDashboard?: boolean;
  /** Título de la página (opcional) */
  title?: string;
  /** Botones adicionales en el lado derecho */
  rightActions?: React.ReactNode;
  /** Clase CSS adicional para el contenedor */
  className?: string;
  /** Si el header debe ser sticky */
  sticky?: boolean;
}

export function PageHeader({
  backButton,
  showDashboard = false,
  title,
  rightActions,
  className = "",
  sticky = true,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleBackClick = () => {
    if (backButton?.onClick) {
      backButton.onClick();
    } else if (backButton?.to) {
      navigate(backButton.to);
    } else {
      navigate(-1);
    }
  };

  const dashboardRoute = user?.role ? getDashboardRoute(user.role) : ROUTES.DASHBOARD;

  const headerClasses = sticky
    ? "sticky top-0 z-10 border-b glass shadow-ios safe-area-top"
    : "border-b bg-card";

  return (
    <div className={headerClasses}>
      <div className={`container mx-auto px-4 py-4 max-w-7xl ${className}`}>
        <div className="flex items-center justify-between">
          {/* Lado izquierdo: Botón volver y título */}
          <div className="flex items-center gap-3">
            {backButton !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {backButton?.label || "Volver"}
              </Button>
            )}
            {title && <h1 className="text-lg font-semibold">{title}</h1>}
          </div>

          {/* Lado derecho: Dashboard, acciones adicionales y ThemeToggle */}
          <div className="flex items-center gap-3">
            {showDashboard && isAuthenticated && (
              <Button variant="outline" size="sm" onClick={() => navigate(dashboardRoute)}>
                Dashboard
              </Button>
            )}
            {rightActions}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
