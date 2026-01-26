/**
 * Tipos específicos del feature de autenticación
 */

export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: "cliente" | "arbitro" | "admin";
}

export interface UserUpdateData {
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
