/**
 * Cliente HTTP configurado para todas las llamadas API
 * Maneja interceptores, headers base y errores comunes
 */

import { ROUTES, STORAGE_KEYS } from "@/lib/constants";

const API_URL = import.meta.env.VITE_API_URL || "https://arbi-app-backend.onrender.com";


export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export interface BackendErrorData {
  detail?: string;
  message?: string;
  [key: string]: string | string[] | undefined;
}

/**
 * Clase de error personalizada para errores de API
 */
export class ApiException extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.data = data;
  }
}

/**
 * Cliente HTTP base con manejo de errores
 */
async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  // Con FormData no se debe setear Content-Type; el navegador pone multipart/form-data y boundary

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: BackendErrorData = {};
      try {
        errorData = await response.json();
      } catch {
        // Si no es JSON, usar el texto de la respuesta
        const text = await response.text().catch(() => "");
        errorData = { message: text || "Error en la solicitud" };
      }

      // Construir mensaje de error más descriptivo
      let errorMessage = "Error en la solicitud";

      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === "object") {
        // Si hay errores de campo, construir mensaje
        const fieldMessages: string[] = [];
        Object.keys(errorData).forEach((key) => {
          if (key !== "detail" && key !== "message") {
            const value = errorData[key];
            if (Array.isArray(value) && value.length > 0) {
              fieldMessages.push(`${key}: ${String(value[0])}`);
            } else if (typeof value === "string") {
              fieldMessages.push(value);
            }
          }
        });
        if (fieldMessages.length > 0) {
          errorMessage = fieldMessages.join(". ");
        }
      }

      throw new ApiException(errorMessage, response.status, errorData);
    }

    // Si la respuesta está vacía, retornar null
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }

    return null as T;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    // Error de red u otro error
    throw new ApiException(error instanceof Error ? error.message : "Error de conexión", 0);
  }
}

/**
 * Cliente HTTP con autenticación Bearer token
 */
export async function authenticatedApiClient<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    return await apiClient<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error instanceof ApiException && error.status === 401) {
      const nuevoToken = await refreshAccessToken();
      if (nuevoToken) {
        return apiClient<T>(endpoint, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${nuevoToken}`,
          },
        });
      }
      redirectToLogin();
      // No mostrar mensaje de token inválido al usuario
      throw new ApiException("", 401);
    }
    throw error;
  }
}

export default apiClient;

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  if (!refreshToken) return null;

  refreshPromise = (async () => {
    try {
      const data = await apiClient<{ access: string }>("/api/users/token/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (data?.access) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);
        return data.access;
      }
      return null;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      redirectToLogin();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== ROUTES.LOGIN) {
    window.location.href = ROUTES.LOGIN;
  }
}
