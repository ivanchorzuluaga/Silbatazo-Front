/**
 * Endpoints relacionados con autenticación
 */

import apiClient, { authenticatedApiClient } from "../client";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthTokens,
  TestResponse,
  AuthResponse,
} from "../types";
import type { User, UserUpdateData } from "@/features/auth/types/auth.types";

export const authEndpoints = {
  /**
   * Iniciar sesión y obtener tokens
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/api/users/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Registrar nuevo usuario y obtener tokens
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/api/users/register/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Renovar token de acceso
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return apiClient<AuthTokens>("/api/users/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });
  },

  /**
   * Endpoint de prueba para verificar autenticación
   */
  async testAuth(accessToken: string): Promise<TestResponse> {
    return authenticatedApiClient<TestResponse>("/api/users/test/", accessToken);
  },

  /**
   * Cerrar sesión (invalida el refresh token)
   */
  async logout(accessToken: string, refreshToken: string): Promise<{ message: string }> {
    return authenticatedApiClient<{ message: string }>("/api/users/logout/", accessToken, {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  /**
   * Cerrar todas las sesiones del usuario
   */
  async logoutAll(accessToken: string): Promise<{ message: string }> {
    return authenticatedApiClient<{ message: string }>("/api/users/logout/all/", accessToken, {
      method: "POST",
    });
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(accessToken: string): Promise<User> {
    return authenticatedApiClient<User>("/api/users/profile/", accessToken);
  },

  /**
   * Actualizar perfil del usuario autenticado
   */
  async updateProfile(accessToken: string, data: UserUpdateData): Promise<User> {
    return authenticatedApiClient<User>("/api/users/profile/", accessToken, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Solicitar recuperación de contraseña
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/api/users/password/reset/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Confirmar nueva contraseña
   */
  async confirmPasswordReset(data: {
    uid: string;
    token: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/api/users/password/reset/confirm/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // TODO: Reactivar cuando se implemente Google OAuth
  // /**
  //  * Autenticación con Google OAuth2
  //  */
  // async googleAuth(
  //   googleToken: string,
  //   role?: string
  // ): Promise<{
  //   user: any;
  //   tokens: AuthTokens;
  //   message: string;
  //   is_new_user?: boolean;
  // }> {
  //   return apiClient<{
  //     user: any;
  //     tokens: AuthTokens;
  //     message: string;
  //     is_new_user?: boolean;
  //   }>("/api/users/google/", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       token: googleToken,
  //       ...(role && { role }),
  //     }),
  //   });
  // },
};
