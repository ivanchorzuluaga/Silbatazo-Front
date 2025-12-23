/**
 * Tipos específicos del feature de autenticación
 */

export interface User {
  id: number;
  username: string;
  email?: string;
  role?: "cliente" | "arbitro" | "admin";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

