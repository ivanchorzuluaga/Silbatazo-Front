/**
 * Servicio para gestionar categorías (solo admin)
 */

import { arbitroEndpoints } from "@/api/endpoints/arbitro.endpoints";
import type {
  Categoria,
  CategoriaCreateData,
  CategoriaUpdateData,
} from "@/features/arbitro/types/arbitro.types";

class CategoriaService {
  private getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  async listarCategorias(): Promise<Categoria[]> {
    try {
      return await arbitroEndpoints.listarCategorias();
    } catch (error) {
      console.error("Error al listar categorías:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al obtener las categorías"
      );
    }
  }

  async crearCategoria(data: CategoriaCreateData): Promise<Categoria> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.crearCategoria(token, data);
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al crear la categoría"
      );
    }
  }

  async obtenerCategoria(id: number): Promise<Categoria> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.obtenerCategoria(token, id);
    } catch (error) {
      console.error("Error al obtener categoría:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al obtener la categoría"
      );
    }
  }

  async actualizarCategoria(id: number, data: CategoriaUpdateData): Promise<Categoria> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.actualizarCategoria(token, id, data);
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al actualizar la categoría"
      );
    }
  }

  async eliminarCategoria(id: number): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.eliminarCategoria(token, id);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al eliminar la categoría"
      );
    }
  }
}

export const categoriaService = new CategoriaService();

