/**
 * Landing Page - Página principal de la aplicación
 * Muestra el mismo contenido para todos los usuarios
 * El Header se encarga de mostrar el botón apropiado según autenticación
 */

import { useState, useEffect } from "react";
import { Header, Hero, Features, HowItWorks, Footer, RefereesPreview } from "@/components/marketplace";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

export function HomePage() {
  const [arbitrosDestacados, setArbitrosDestacados] = useState<Arbitro[]>([]);
  const [isLoadingArbitros, setIsLoadingArbitros] = useState(false);

  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cargar árbitros destacados
  useEffect(() => {
    const cargarArbitrosDestacados = async () => {
      setIsLoadingArbitros(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("ordering", "-created_at");

        const response = await fetch(
          `${API_URL}/api/arbitros/?${queryParams.toString()}`,
          { headers }
        );

        if (response.ok) {
          const data = await response.json();
          const arbitros = Array.isArray(data) ? data.slice(0, 4) : [];
          setArbitrosDestacados(arbitros);
        }
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
      <Features />
      {!isLoadingArbitros && arbitrosDestacados.length > 0 && (
        <RefereesPreview arbitros={arbitrosDestacados} />
      )}
      <HowItWorks />
      <Footer />
    </main>
  );
}
