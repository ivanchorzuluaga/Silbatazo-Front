/**
 * Landing Page - Página principal de la aplicación
 * Muestra el mismo contenido para todos los usuarios
 * El Header se encarga de mostrar el botón apropiado según autenticación
 */

import { lazy, Suspense, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/marketplace/Header";
import { Hero } from "@/components/marketplace/Hero";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { fetchArbitrosCached } from "@/api/utils/arbitros-cache";

const Features = lazy(() =>
  import("@/components/marketplace/Features").then((m) => ({ default: m.Features }))
);
const HowItWorks = lazy(() =>
  import("@/components/marketplace/HowItWorks").then((m) => ({ default: m.HowItWorks }))
);
const RefereesPreview = lazy(() =>
  import("@/components/marketplace/RefereesPreview").then((m) => ({
    default: m.RefereesPreview,
  }))
);
const Footer = lazy(() =>
  import("@/components/marketplace/Footer").then((m) => ({ default: m.Footer }))
);

export function HomePage() {
  const [arbitrosDestacados, setArbitrosDestacados] = useState<Arbitro[]>([]);
  const [isLoadingArbitros, setIsLoadingArbitros] = useState(false);
  const location = useLocation();

  // Manejar scroll: si hay hash ir a esa sección, si no ir al inicio
  useEffect(() => {
    if (location.hash) {
      // Esperar un momento para que la página cargue completamente
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  // Cargar árbitros destacados
  useEffect(() => {
    const cargarArbitrosDestacados = async () => {
      setIsLoadingArbitros(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("ordering", "-created_at");

        const arbitros = await fetchArbitrosCached({
          query: queryParams.toString(),
        });
        setArbitrosDestacados(arbitros.slice(0, 4));
      } catch (err) {
        console.error("Error al cargar árbitros destacados:", err);
      } finally {
        setIsLoadingArbitros(false);
      }
    };

    cargarArbitrosDestacados();
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        {!isLoadingArbitros && arbitrosDestacados.length > 0 && (
          <RefereesPreview arbitros={arbitrosDestacados} />
        )}
      </Suspense>
      <Suspense fallback={<div className="min-h-[300px]" />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<div className="min-h-[300px]" />}>
        <Features />
      </Suspense>
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
