/**
 * Servicio para gestionar tipos de partido (solo admin)
 */

import { partidoEndpoints } from "@/api/endpoints/partido.endpoints";
import type {
  TipoPartidoAdmin,
  TipoPartidoCreateData,
  TipoPartidoUpdateData,
} from "@/features/partidos/types/partido.types";

class TipoPartidoService {
  private getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  async listarTiposPartido(): Promise<TipoPartidoAdmin[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.listarTiposPartidoAdmin(token);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error al obtener los tipos de partido"
      );
    }
  }

  async crearTipoPartido(data: TipoPartidoCreateData): Promise<TipoPartidoAdmin> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.crearTipoPartido(token, data);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Error al crear el tipo de partido");
    }
  }

  async actualizarTipoPartido(id: number, data: TipoPartidoUpdateData): Promise<TipoPartidoAdmin> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await partidoEndpoints.actualizarTipoPartido(token, id, data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error al actualizar el tipo de partido"
      );
    }
  }

  async eliminarTipoPartido(id: number): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      await partidoEndpoints.eliminarTipoPartido(token, id);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error al eliminar el tipo de partido"
      );
    }
  }
}

export const tipoPartidoService = new TipoPartidoService();
