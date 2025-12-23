/**
 * Servicio de autenticación
 * Encapsula la lógica de negocio relacionada con autenticación
 */

import { authEndpoints } from "@/api/endpoints";
import type { LoginCredentials, RegisterCredentials } from "@/api/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { ApiException } from "@/api/client";
import { extractErrorMessage } from "@/lib/error-utils";

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
   */
  logout() {
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
};
