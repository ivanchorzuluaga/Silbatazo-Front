/**
 * Servicio para gestionar retiros
 */

import { arbitroEndpoints } from "@/api/endpoints/arbitro.endpoints";
import type {
  Retiro,
  RetiroCreateData,
  RetiroProcesarData,
  SaldoDisponible,
} from "../types/arbitro.types";
import { authService } from "@/features/auth/services/auth.service";
import { ApiException } from "@/api/client";
import { extractErrorMessage } from "@/lib/error-utils";

export const retiroService = {
  /**
   * Obtener token de acceso
   */
  getToken(): string | null {
    return authService.getAccessToken();
  },

  /**
   * Listar retiros
   */
  async listarRetiros(params?: { estado?: "pendiente" | "procesado" | "rechazado" }): Promise<Retiro[]> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.listarRetiros(token, params);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al listar retiros");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Crear un retiro
   */
  async crearRetiro(data: RetiroCreateData): Promise<Retiro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.crearRetiro(token, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 400) {
          throw new Error(extractErrorMessage(error.data) || "Error al crear retiro");
        }
        if (error.status === 403) {
          throw new Error("No tienes permisos para crear retiros");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al crear retiro");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Obtener detalle de un retiro
   */
  async obtenerRetiro(id: number): Promise<Retiro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.obtenerRetiro(token, id);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 404) {
          throw new Error("Retiro no encontrado");
        }
        if (error.status === 403) {
          throw new Error("No tienes permisos para ver este retiro");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener retiro");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Procesar o rechazar un retiro (solo admin)
   */
  async procesarRetiro(id: number, data: RetiroProcesarData): Promise<Retiro> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.procesarRetiro(token, id, data);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 400) {
          throw new Error(extractErrorMessage(error.data) || "Error al procesar retiro");
        }
        if (error.status === 403) {
          throw new Error("Solo los administradores pueden procesar retiros");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al procesar retiro");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Obtener saldo disponible
   */
  async obtenerSaldoDisponible(): Promise<SaldoDisponible> {
    const token = this.getToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await arbitroEndpoints.obtenerSaldoDisponible(token);
    } catch (error) {
      if (error instanceof ApiException) {
        if (error.status === 403) {
          throw new Error("Solo los árbitros pueden ver su saldo");
        }
        throw new Error(extractErrorMessage(error.data) || "Error al obtener saldo");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },
};

