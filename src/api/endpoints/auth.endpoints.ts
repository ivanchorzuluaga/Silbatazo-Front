/**
 * Endpoints relacionados con autenticación
 */

import apiClient, { authenticatedApiClient } from "../client";
import type { PaginatedResponse } from "../utils/pagination";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthTokens,
  TestResponse,
  AuthResponse,
} from "../types";
import type { User, UserUpdateData } from "@/features/auth/types/auth.types";

export interface AdminUserListItem extends User {
  total_partidos_solicitados: number;
  servicios_completados: number;
  estado_verificacion_arbitro?: string | null;
}

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
   * Subir foto de perfil del usuario (cliente o árbitro).
   * multipart/form-data con campo 'foto_perfil'.
   */
  async uploadProfilePhoto(accessToken: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append("foto_perfil", file);
    return authenticatedApiClient<User>("/api/users/profile/foto/", accessToken, {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Actualizar perfil de un usuario por ID (solo admin)
   */
  async updateUserById(
    accessToken: string,
    userId: number,
    data: UserUpdateData
  ): Promise<User> {
    return authenticatedApiClient<User>(`/api/users/me/${userId}/`, accessToken, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Listado administrativo de usuarios con métricas
   */
  async listAdminUsers(
    accessToken: string,
    params?: {
      page?: number;
      role?: "cliente" | "arbitro" | "admin" | "";
      search?: string;
      con_servicios?: boolean;
    }
  ): Promise<PaginatedResponse<AdminUserListItem>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.role) queryParams.append("role", params.role);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.con_servicios) queryParams.append("con_servicios", "1");

    const query = queryParams.toString();
    const endpoint = `/api/users/admin/list/${query ? `?${query}` : ""}`;
    return authenticatedApiClient<PaginatedResponse<AdminUserListItem>>(endpoint, accessToken);
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

  /**
   * Reenviar verificación de correo
   */
  async requestEmailVerification(email: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/api/users/email/verify/", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Confirmar verificación de correo
   */
  async confirmEmailVerification(data: {
    token: string;
  }): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/api/users/email/verify/confirm/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Desactivar cuenta (anonimiza datos sensibles)
   */
  async deactivateAccount(accessToken: string): Promise<{ message: string }> {
    return authenticatedApiClient<{ message: string }>("/api/users/deactivate/", accessToken, {
      method: "POST",
    });
  },

  /**
   * Reactivar cuenta con usuario y contraseña
   */
  async reactivateAccount(data: {
    username: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/api/users/reactivate/", {
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
