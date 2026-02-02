/**
 * Hook para obtener el detalle de un árbitro
 * Encapsula la lógica de carga de datos del árbitro
 */

import { useState, useEffect } from "react";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";

interface UseArbitroDetailReturn {
  arbitro: Arbitro | null;
  isLoading: boolean;
  error: string | null;
}

export function useArbitroDetail(id: number | null | undefined): UseArbitroDetailReturn {
  const [arbitro, setArbitro] = useState<Arbitro | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarArbitro = async () => {
      if (!id) {
        setError("ID de árbitro no válido");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/api/arbitros/${id}/`, { headers });

        if (!response.ok) {
          if (response.status === 404) throw new Error("Árbitro no encontrado");
          throw new Error("Error al cargar árbitro");
        }

        const data = await response.json();
        setArbitro(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar árbitro");
      } finally {
        setIsLoading(false);
      }
    };

    cargarArbitro();
  }, [id]);

  return {
    arbitro,
    isLoading,
    error,
  };
}
