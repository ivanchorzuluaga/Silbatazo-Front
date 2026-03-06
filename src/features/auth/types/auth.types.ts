/**
 * Tipos específicos del feature de autenticación
 */

export interface User {
  id: number;
  username: string;
  email?: string;
  email_verificado?: boolean;
  first_name?: string;
  last_name?: string;
  telefono?: string;
  documento_identidad?: string;
   fecha_nacimiento?: string | null;
  foto_perfil?: string | null;
  full_name?: string;
  role?: "cliente" | "arbitro" | "admin";
}

export interface UserUpdateData {
  email?: string;
  first_name?: string;
  last_name?: string;
  telefono?: string;
  documento_identidad?: string;
  fecha_nacimiento?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
