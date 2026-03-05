/**
 * Tipos relacionados con autenticación
 */

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email?: string;
  password: string;
  password_confirm: string;
  role: "cliente" | "arbitro";
  first_name?: string;
  last_name?: string;
  telefono: string;
  documento_identidad: string;
  terminos_aceptados: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface TestResponse {
  message: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email?: string;
  email_verificado?: boolean;
  first_name?: string;
  last_name?: string;
  telefono?: string;
  documento_identidad?: string;
  foto_perfil?: string | null;
  role: "cliente" | "arbitro" | "admin";
  date_joined: string;
  is_active: boolean;
  full_name?: string;
  last_login?: string | null;
}

export interface AuthResponse {
  user: UserResponse;
  tokens: AuthTokens;
  message: string;
}
