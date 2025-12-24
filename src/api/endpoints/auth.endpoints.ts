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
