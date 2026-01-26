/**
 * Hook para gestionar categorías (solo admin)
 */

import { useState, useEffect, useCallback } from "react";
import { categoriaService } from "../services/categoria.service";
import type {
  Categoria,
  CategoriaCreateData,
  CategoriaUpdateData,
} from "@/features/arbitro/types/arbitro.types";

interface UseCategoriasAdminReturn {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  listarCategorias: () => Promise<void>;
  crearCategoria: (data: CategoriaCreateData) => Promise<Categoria>;
  actualizarCategoria: (id: number, data: CategoriaUpdateData) => Promise<Categoria>;
  eliminarCategoria: (id: number) => Promise<void>;
  clearError: () => void;
}

export function useCategoriasAdmin(): UseCategoriasAdminReturn {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await categoriaService.listarCategorias();
      setCategorias(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener categorías";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearCategoria = async (data: CategoriaCreateData): Promise<Categoria> => {
    setIsLoading(true);
    setError(null);

    try {
      const nuevaCategoria = await categoriaService.crearCategoria(data);
      await listarCategorias(); // Refrescar lista
      return nuevaCategoria;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear categoría";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarCategoria = async (
    id: number,
    data: CategoriaUpdateData
  ): Promise<Categoria> => {
    setIsLoading(true);
    setError(null);

    try {
      const categoriaActualizada = await categoriaService.actualizarCategoria(id, data);
      await listarCategorias(); // Refrescar lista
      return categoriaActualizada;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar categoría";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarCategoria = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await categoriaService.eliminarCategoria(id);
      await listarCategorias(); // Refrescar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar categoría";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    listarCategorias();
  }, [listarCategorias]);

  return {
    categorias,
    isLoading,
    error,
    listarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    clearError,
  };
}

