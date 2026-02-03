/**
 * Página de lista de árbitros (Marketplace)
 * Diseño moderno con gradientes y glassmorphism
 */

import { useState, useEffect, useRef } from "react";
import { useMunicipios } from "@/features/arbitro/hooks/useMunicipios";
import { useCategorias } from "@/features/arbitro/hooks/useCategorias";
import { RefereeCard } from "@/components/marketplace/RefereeCard";
import { FiltrosArbitros, type FiltrosArbitrosType } from "../components/FiltrosArbitros";
import { Header, Footer } from "@/components/marketplace";
import { Button } from "@/components/ui/button";
import { CATEGORIAS_PARTIDO } from "@/lib/constants";
import logoImage from "@/assets/Silbatazo-bordes.png";
import { Users, RefreshCw, SearchX, Loader2 } from "lucide-react";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export function ArbitrosListPage() {
  const { municipios } = useMunicipios();
  const { categorias: todasLasCategorias } = useCategorias();
  // Filtrar solo las categorías de partido (las mismas que se usan en el formulario)
  const categorias = todasLasCategorias.filter((c) =>
    (CATEGORIAS_PARTIDO as readonly string[]).includes(c.nombre)
  );

  const [arbitros, setArbitros] = useState<Arbitro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosArbitrosType>({
    ordering: "-created_at",
  });
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Carga inicial
  useEffect(() => {
    cargarArbitros(true);
    isInitialMount.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para cargar árbitros cuando cambian los filtros (excepto search)
  useEffect(() => {
    if (isInitialMount.current) return;
    cargarArbitros(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.municipio, filtros.categoria, filtros.ordering, filtros.fecha, filtros.hora]);

  // Efecto separado para search con debounce
  useEffect(() => {
    if (isInitialMount.current) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!filtros.search || filtros.search.trim() === "") {
      cargarArbitros(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      cargarArbitros(false);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.search]);

  const cargarArbitros = async (showLoading = false) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const queryParams = new URLSearchParams();

      if (filtros.municipio) queryParams.append("municipio", filtros.municipio.toString());
      if (filtros.categoria) queryParams.append("categoria", filtros.categoria.toString());
      if (filtros.search) queryParams.append("search", filtros.search);
      if (filtros.ordering) queryParams.append("ordering", filtros.ordering);
      if (filtros.fecha) queryParams.append("fecha", filtros.fecha);
      if (filtros.hora) queryParams.append("hora", filtros.hora);

      const token = localStorage.getItem("access_token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/api/arbitros/${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error("Error al cargar árbitros");
      }

      const data = await response.json();
      setArbitros(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar árbitros");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section con gradiente */}
      <section className="relative bg-gradient-to-b from-background via-background to-primary/20 py-12 sm:py-16 pb-32">
        {/* Efectos de luz decorativos */}
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo de fondo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={logoImage}
            alt=""
            className="w-[400px] h-[400px] object-contain opacity-[0.03]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary backdrop-blur-sm">
              <Users className="w-4 h-4" />
              <span className="font-semibold tabular-nums">
                {landingStats?.arbitros_total ?? "—"}
              </span>{" "}
              árbitros certificados
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
              Nuestros Árbitros
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Encuentra el árbitro perfecto para tu partido. Todos nuestros árbitros están
              certificados, son de calidad y listos para garantizar un juego limpio.
            </p>
          </div>

          {/* Filtros con glassmorphism */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-6 overflow-visible">
            <FiltrosArbitros
              municipios={municipios}
              categorias={categorias}
              filtros={filtros}
              onFiltrosChange={setFiltros}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>

      {/* Lista de árbitros */}
      <section className="py-12 bg-gradient-to-b from-primary/20 to-background relative">
        {/* Efectos de luz */}
        <div className="absolute top-1/2 right-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-48 w-48 bg-emerald-500/5 rounded-full blur-[80px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            // Estado de carga
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">Cargando árbitros...</p>
                <p className="text-sm text-muted-foreground">
                  Buscando los mejores árbitros para ti
                </p>
              </div>
            </div>
          ) : error ? (
            // Estado de error
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-red-500/10 backdrop-blur-md rounded-2xl border border-red-500/20 p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchX className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">Error al cargar</p>
                <p className="text-sm text-muted-foreground mb-6">{error}</p>
                <Button
                  onClick={() => cargarArbitros(true)}
                  variant="outline"
                  className="border-red-500/30 hover:bg-red-500/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            </div>
          ) : arbitros.length === 0 ? (
            // Estado vacío
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center max-w-md">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchX className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  No se encontraron árbitros
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Intenta ajustar los filtros de búsqueda para encontrar más resultados
                </p>
                <Button onClick={() => setFiltros({ ordering: "-created_at" })} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Contador de resultados */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{arbitros.length}</span>{" "}
                    {arbitros.length === 1 ? "árbitro encontrado" : "árbitros encontrados"}
                  </p>
                </div>
              </div>

              {/* Grid de árbitros */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {arbitros.map((arbitro) => (
                  <RefereeCard key={arbitro.id} arbitro={arbitro} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
