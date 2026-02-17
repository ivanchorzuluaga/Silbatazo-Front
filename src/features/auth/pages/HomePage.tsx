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
import { FAQ_ITEMS } from "@/components/marketplace/faqData";

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
const FaqSection = lazy(() =>
  import("@/components/marketplace/FaqSection").then((m) => ({ default: m.FaqSection }))
);
const Footer = lazy(() =>
  import("@/components/marketplace/Footer").then((m) => ({ default: m.Footer }))
);

export function HomePage() {
  const [arbitrosDestacados, setArbitrosDestacados] = useState<Arbitro[]>([]);
  const [isLoadingArbitros, setIsLoadingArbitros] = useState(false);
  const location = useLocation();
  const baseUrl = (import.meta.env.VITE_APP_URL || "https://silbatazo.com").replace(/\/+$/, "");
  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: "Silbatazo",
        url: `${baseUrl}/`,
        telephone: "+57 315 988 8384",
        areaServed: [
          "Medellín",
          "Itagüí",
          "Bello",
          "Envigado",
          "Sabaneta",
          "Valle de Aburrá",
        ],
      },
      {
        "@type": "Organization",
        name: "Silbatazo",
        url: `${baseUrl}/`,
        logo: `${baseUrl}/Logo.png`,
        areaServed: [
          {
            "@type": "Place",
            name: "Área Metropolitana del Valle de Aburrá",
          },
          {
            "@type": "City",
            name: "Medellín",
          },
        ],
      },
      {
        "@type": "WebSite",
        name: "Silbatazo",
        url: `${baseUrl}/`,
        areaServed: "Área Metropolitana del Valle de Aburrá",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  });

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <Header />
      <Hero />
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
      <Suspense fallback={<div className="min-h-[260px]" />}>
        <FaqSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Footer />
      </Suspense>
    </main>
  );
}
