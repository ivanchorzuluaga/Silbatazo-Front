/**
 * App Shell - Contenedor principal de la aplicación con navegación
 * Gestiona el layout general y las transiciones entre páginas
 */

import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AppShellProps {
  className?: string;
}

export function AppShell({ className }: AppShellProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className={cn("flex min-h-screen bg-background", className)}>
      {/* Sidebar para desktop */}
      {isAuthenticated && <Sidebar />}

      {/* Contenido principal */}
      <div className={cn("flex flex-1 flex-col min-h-screen", isAuthenticated && "sm:ml-64")}>
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-ios",
            isAuthenticated && "pb-nav-mobile sm:pb-0"
          )}
        >
          <Outlet />
        </main>
      </div>

      {/* BottomNav para móvil */}
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
