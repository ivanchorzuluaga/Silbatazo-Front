/**
 * Página de lista de árbitros (Marketplace)
 * Accesible sin autenticación
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMunicipios } from "@/features/arbitro/hooks/useMunicipios";
import { useCategorias } from "@/features/arbitro/hooks/useCategorias";
import { RefereeCard } from "@/components/marketplace/RefereeCard";
import { FiltrosArbitros, type FiltrosArbitrosType } from "../components/FiltrosArbitros";
import { Header, Footer } from "@/components/marketplace";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export function ArbitrosListPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { municipios } = useMunicipios();
  const { categorias } = useCategorias();

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
    if (isInitialMount.current) return; // Evitar ejecutar en el mount inicial
    cargarArbitros(false); // No mostrar loading para cambios de filtros
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filtros.municipio,
    filtros.categoria,
    filtros.ordering,
    filtros.fecha,
    filtros.hora,
  ]);

  // Efecto separado para search con debounce más corto
  useEffect(() => {
    if (isInitialMount.current) return; // Evitar ejecutar en el mount inicial

    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Si search está vacío, cargar inmediatamente sin loading
    if (!filtros.search || filtros.search.trim() === "") {
      cargarArbitros(false);
      return;
    }

    // Si hay búsqueda, esperar 300ms antes de buscar (debounce más corto)
    searchTimeoutRef.current = setTimeout(() => {
      cargarArbitros(false);
    }, 300);

    // Cleanup
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

      // Intentar con token si está disponible, sino sin token
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
    <main className="min-h-screen">
      <Header />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Nuestros Árbitros</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Encuentra el árbitro perfecto para tu partido. Todos nuestros profesionales están certificados y listos
              para garantizar un juego limpio.
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-8">
            <FiltrosArbitros
              municipios={municipios}
              categorias={categorias}
              filtros={filtros}
              onFiltrosChange={setFiltros}
              isLoading={isLoading}
            />
          </div>

          {/* Lista de árbitros */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando árbitros...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <button
                onClick={() => cargarArbitros(true)}
                className="mt-4 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : arbitros.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-2">No se encontraron árbitros</p>
              <p className="text-sm text-muted-foreground">
                Intenta ajustar los filtros de búsqueda
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {arbitros.length}{" "}
                  {arbitros.length === 1 ? "árbitro encontrado" : "árbitros encontrados"}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {arbitros.map((arbitro) => (
                  <RefereeCard key={arbitro.id} arbitro={arbitro} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

