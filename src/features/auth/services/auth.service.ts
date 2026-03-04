/**
 * Servicio de autenticación
 * Encapsula la lógica de negocio relacionada con autenticación
 */

import { authEndpoints } from "@/api/endpoints";
import type { LoginCredentials, RegisterCredentials } from "@/api/types";
import type { User, UserUpdateData } from "../types/auth.types";
import { STORAGE_KEYS } from "@/lib/constants";
import { ApiException } from "@/api/client";
import { extractErrorMessage } from "@/lib/error-utils";
import type { PaginatedResponse } from "@/api/utils/pagination";
import type { AdminUserListItem } from "@/api/endpoints/auth.endpoints";

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials) {
    try {
      const response = await authEndpoints.login(credentials);

      // Guardar tokens en localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refresh);

      return response;
    } catch (error) {
      if (error instanceof ApiException) {
        let errorMessage = "Error al iniciar sesión";

        if (error.status === 401) {
          errorMessage = "Credenciales inválidas. Verifica tu usuario y contraseña.";
        } else if (error.status === 400) {
          // Usar la función de extracción mejorada
          errorMessage = extractErrorMessage(error.data);
        } else if (error.status === 500) {
          errorMessage = "Error del servidor. Por favor, intenta más tarde.";
        } else if (error.status === 0) {
          errorMessage = "Error de conexión. Verifica tu conexión a internet.";
        } else {
          errorMessage = extractErrorMessage(error.data) || error.message || errorMessage;
        }

        throw new Error(errorMessage);
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Registrar nuevo usuario
   */
  async register(credentials: RegisterCredentials) {
    try {
      const response = await authEndpoints.register(credentials);

      // Guardar tokens en localStorage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refresh);

      return response;
    } catch (error) {
      if (error instanceof ApiException) {
        let errorMessage = "Error al registrar usuario";

        if (error.status === 400) {
          // Usar la función de extracción mejorada
          errorMessage = extractErrorMessage(error.data);
        } else if (error.status === 409) {
          errorMessage = "El usuario o email ya existe. Intenta con otros datos.";
        } else if (error.status === 500) {
          errorMessage = "Error del servidor. Por favor, intenta más tarde.";
        } else if (error.status === 0) {
          errorMessage = "Error de conexión. Verifica tu conexión a internet.";
        } else {
          errorMessage = extractErrorMessage(error.data) || error.message || errorMessage;
        }

        throw new Error(errorMessage);
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Cerrar sesión
   * Invalida el refresh token en el servidor y limpia el localStorage
   */
  async logout(): Promise<void> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    // Si hay tokens, intentar invalidarlos en el servidor
    if (accessToken && refreshToken) {
      try {
        await authEndpoints.logout(accessToken, refreshToken);
      } catch (error) {
        // Si falla la llamada al servidor, continuar con la limpieza local
        // Esto asegura que el usuario pueda cerrar sesión incluso si hay problemas de red
        console.warn("Error al invalidar token en el servidor:", error);
      }
    }

    // Limpiar localStorage siempre (incluso si falló la llamada al servidor)
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Cerrar todas las sesiones del usuario
   * Invalida todos los refresh tokens del usuario en el servidor
   */
  async logoutAll(): Promise<void> {
    const accessToken = this.getAccessToken();

    // Si hay token, intentar invalidar todas las sesiones en el servidor
    if (accessToken) {
      try {
        await authEndpoints.logoutAll(accessToken);
      } catch (error) {
        // Si falla la llamada al servidor, continuar con la limpieza local
        console.warn("Error al invalidar todas las sesiones en el servidor:", error);
      }
    }

    // Limpiar localStorage siempre
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Obtener token de acceso almacenado
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Obtener token de refresh almacenado
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Verificar si hay una sesión activa
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<User> {
    const token = this.getAccessToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await authEndpoints.getProfile(token);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener perfil");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Actualizar perfil del usuario autenticado
   */
  async updateProfile(data: UserUpdateData): Promise<User> {
    const token = this.getAccessToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await authEndpoints.updateProfile(token, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al actualizar perfil");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Actualizar perfil de un usuario por ID (solo admin)
   */
  async updateUserById(userId: number, data: UserUpdateData): Promise<User> {
    const token = this.getAccessToken();
    if (!token) throw new Error("No estás autenticado");

    try {
      return await authEndpoints.updateUserById(token, userId, data);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al actualizar usuario");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  async listAdminUsers(params?: {
    page?: number;
    role?: "cliente" | "arbitro" | "admin" | "";
    search?: string;
    con_servicios?: boolean;
  }): Promise<PaginatedResponse<AdminUserListItem>> {
    const token = this.getAccessToken();
    if (!token) throw new Error("No estás autenticado");
    try {
      return await authEndpoints.listAdminUsers(token, params);
    } catch (error) {
      if (error instanceof ApiException) {
        throw new Error(extractErrorMessage(error.data) || "Error al obtener usuarios");
      }
      throw new Error("Error de conexión. Intenta nuevamente.");
    }
  },

  /**
   * Desactivar cuenta (anonimiza datos sensibles)
   */
  async deactivateAccount(): Promise<{ message: string }> {
    const token = this.getAccessToken();
    if (!token) throw new Error("No estás autenticado");
    return authEndpoints.deactivateAccount(token);
  },

  /**
   * Reactivar cuenta con usuario y contraseña
   */
  async reactivateAccount(data: {
    username: string;
    password: string;
  }) {
    return authEndpoints.reactivateAccount(data);
  },
};
