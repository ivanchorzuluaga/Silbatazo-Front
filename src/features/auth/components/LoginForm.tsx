/**
 * Formulario de login
 * Componente presentacional que usa hooks para la lógica
 */

import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "@/hooks/useAuth";
import { FormField } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { validations } from "@/lib/validations";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { login, isLoading, error, clearError } = useLogin();
  const { login: setAuth } = useAuth();

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!validations.required(username)) {
      errors.username = "El usuario es requerido";
    }

    if (!validations.required(password)) {
      errors.password = "La contraseña es requerida";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      const authResponse = await login({ username, password });
      // Actualizar el estado de autenticación con los tokens y datos del usuario del backend
      setAuth(
        authResponse.tokens.access,
        authResponse.tokens.refresh,
        authResponse.user.role,
        authResponse.user.username,
        authResponse.user.email,
        authResponse.user.id,
        authResponse.user.email_verificado
      );
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error en login:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        <p className="text-sm text-muted-foreground">Ingresa tus credenciales para continuar</p>
      </div>

      <FormField
        label="Usuario o correo"
        name="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          if (fieldErrors.username) {
            setFieldErrors((prev) => ({ ...prev, username: undefined }));
          }
        }}
        error={fieldErrors.username}
        disabled={isLoading}
        autoComplete="username"
        required
      />

      <FormField
        label="Contraseña"
        name="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }
        }}
        error={fieldErrors.password}
        disabled={isLoading}
        autoComplete="current-password"
        required
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  );
}
