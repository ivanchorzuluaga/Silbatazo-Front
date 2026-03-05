/**
 * Página de árbitros para clientes (con sidebar)
 * Muestra la lista de árbitros dentro del layout del dashboard
 */

import { Link, useSearchParams } from "react-router-dom";
import { useMunicipios } from "@/features/arbitro/hooks/useMunicipios";
import { useCategorias } from "@/features/arbitro/hooks/useCategorias";
import { FiltrosArbitros } from "@/features/marketplace/components/FiltrosArbitros";
import { useArbitrosSearch } from "../hooks/useArbitrosSearch";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { FotoArbitroCard } from "@/components/arbitro/FotoArbitroCard";
import logoImage from "@/assets/Logo.png";
import {
  getClienteArbitroDetailRoute,
  CATEGORIAS_PARTIDO,
} from "@/lib/constants";
import {
  Users,
  RefreshCw,
  SearchX,
  Loader2,
  Trophy,
  ArrowRight,
} from "lucide-react";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export function ClienteArbitrosPage() {
  const [searchParams] = useSearchParams();
  const { municipios } = useMunicipios();
  const { categorias: todasLasCategorias } = useCategorias();
  // Filtrar solo las categorías de partido (las mismas que se usan en el formulario)
  const categorias = todasLasCategorias.filter((c) =>
    (CATEGORIAS_PARTIDO as readonly string[]).includes(c.nombre),
  );
  const fechaParam = searchParams.get("fecha") || undefined;
  const horaParam = searchParams.get("hora") || undefined;
  const {
    arbitros,
    isLoading,
    error,
    filtros,
    setFiltros,
    limpiarFiltros,
    recargar,
  } = useArbitrosSearch({
    fecha: fechaParam,
    hora: horaParam,
  });

  return (
    <PageLayout title="Árbitros">
      <PageContainer>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Buscar Árbitros
              </h1>
              <p className="text-sm text-muted-foreground">
                Encuentra el árbitro perfecto para tu partido
              </p>
            </div>
          </div>
        </header>

        {/* Filtros */}
        <section className="mb-8">
          <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-4 sm:p-6 overflow-visible">
            <FiltrosArbitros
              municipios={municipios}
              categorias={categorias}
              filtros={filtros}
              onFiltrosChange={setFiltros}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Resultados */}
        <section>
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={recargar} />
          ) : arbitros.length === 0 ? (
            <EmptyState onClearFilters={limpiarFiltros} />
          ) : (
            <ArbitrosList arbitros={arbitros} />
          )}
        </section>
      </PageContainer>
    </PageLayout>
  );
}

// =============================================================================
// Componentes auxiliares
// =============================================================================

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Fondo con gradiente adaptativo */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10 dark:from-background dark:via-background dark:to-primary/20" />
      {/* Efectos de luz solo en oscuro */}
      <div className="fixed top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none dark:block hidden" />
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none dark:block hidden" />

      {/* Logo de fondo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={logoImage}
          alt=""
          className="w-[500px] h-[500px] object-contain opacity-[0.02]"
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground mb-2">
          Cargando árbitros...
        </p>
        <p className="text-sm text-muted-foreground">
          Buscando los mejores árbitros
        </p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-destructive/10 backdrop-blur-md rounded-2xl border border-destructive/20 p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-lg font-medium text-foreground mb-2">
          Error al cargar
        </p>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-destructive/30 hover:bg-destructive/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  onClearFilters: () => void;
}

function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8 text-primary" />
        </div>
        <p className="text-lg font-medium text-foreground mb-2">
          No se encontraron árbitros
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Intenta ajustar los filtros de búsqueda
        </p>
        <Button onClick={onClearFilters} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}

interface ArbitrosListProps {
  arbitros: Arbitro[];
}

function ArbitrosList({ arbitros }: ArbitrosListProps) {
  return (
    <>
      {/* Contador */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {arbitros.length}
          </span>{" "}
          {arbitros.length === 1
            ? "árbitro encontrado"
            : "árbitros encontrados"}
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 justify-items-center sm:grid-cols-2 lg:grid-cols-3">
        {arbitros.map((arbitro) => (
          <ArbitroCard key={arbitro.id} arbitro={arbitro} />
        ))}
      </div>
    </>
  );
}

interface ArbitroCardProps {
  arbitro: Arbitro;
}

function ArbitroCard({ arbitro }: ArbitroCardProps) {
  return (
    <Link
      to={getClienteArbitroDetailRoute(arbitro.id)}
      className="block h-full w-[360px] max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ contentVisibility: "auto", containIntrinsicSize: "360px 450px" }}
    >
      <article className="relative h-full min-h-[360px]">
        <div className="absolute -inset-2 rounded-3xl bg-primary/15 blur-2xl opacity-30" />

        {/* Imagen */}
        <div className="relative">
          <FotoArbitroCard arbitro={arbitro} className="w-full" />
        </div>

        {/* Contenido */}
        <div className="px-1 pt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Trophy className="w-4 h-4" />
              <span>{arbitro.categorias?.length || 0} categorías</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Disponibilidad */}
            {arbitro.disponibilidades &&
              arbitro.disponibilidades.length > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-xs text-success">Disponible</span>
                </div>
              )}

            <span className="text-xs text-muted-foreground group-hover:text-primary flex items-center gap-1 transition-colors">
              Ver perfil <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
