/**
 * Dialog de autenticación (Login/Registro)
 * Permite seleccionar tipo de usuario y autenticarse
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SlidePanel,
  SlidePanelContent,
  SlidePanelHeader,
  SlidePanelTitle,
  SlidePanelDescription,
} from "@/components/ui/slide-panel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "@/hooks/useAuth";
import { validations } from "@/lib/validations";
import { USER_ROLES, ROUTES, type UserRole } from "@/lib/constants";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: UserRole;
}

export function AuthDialog({ open, onOpenChange, defaultRole }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState<UserRole>(defaultRole || USER_ROLES.CLIENTE);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
    password_confirm?: string;
    email?: string;
    role?: string;
  }>({});

  const {
    login,
    isLoading: isLoginLoading,
    error: loginError,
    clearError: clearLoginError,
  } = useLogin();
  const {
    register,
    isLoading: isRegisterLoading,
    error: registerError,
    clearError: clearRegisterError,
  } = useRegister();
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const isLoading = isLoginLoading || isRegisterLoading;
  const error = loginError || registerError;

  const showRoleSelector = true;

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    // Validar username
    if (!validations.required(username)) {
      errors.username = "El usuario es requerido";
    } else if (!validations.username(username)) {
      errors.username = "El usuario solo puede contener letras, números, guiones y guiones bajos";
    } else if (!validations.minLength(username, 3)) {
      errors.username = "El usuario debe tener al menos 3 caracteres";
    } else if (!validations.maxLength(username, 150)) {
      errors.username = "El usuario no puede tener más de 150 caracteres";
    }

    // Validar password
    if (!validations.required(password)) {
      errors.password = "La contraseña es requerida";
    } else if (!isLogin && !validations.passwordStrength(password)) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    // Validar email (solo en registro)
    if (!isLogin) {
      if (!validations.required(email)) {
        errors.email = "El email es requerido";
      } else if (!validations.email(email)) {
        errors.email = "El email no tiene un formato válido";
      }
    }

    // Validar confirmación de contraseña (solo en registro)
    if (!isLogin) {
      if (!validations.required(passwordConfirm)) {
        errors.password_confirm = "Debes confirmar tu contraseña";
      } else if (password && passwordConfirm && password !== passwordConfirm) {
        errors.password_confirm = "Las contraseñas no coinciden";
      }
    }

    // Validar rol (solo en registro)
    if (!isLogin && !showRoleSelector && !userRole) {
      errors.role = "Debes seleccionar un tipo de usuario";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearLoginError();
    clearRegisterError();

    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        // Modo login
        const response = await login({ username, password });
        // Actualizar el estado de autenticación con los tokens y datos del usuario del backend
        setAuth(
          response.tokens.access,
          response.tokens.refresh,
          response.user.role,
          response.user.username,
          response.user.email
        );
      } else {
        // Modo registro
        // Asegurar que el rol no sea admin (los admins no se registran)
        const registerRole = userRole === USER_ROLES.ADMIN ? USER_ROLES.CLIENTE : userRole;
        const response = await register({
          username,
          email: email || undefined,
          password,
          password_confirm: passwordConfirm,
          role: registerRole as "cliente" | "arbitro",
          first_name: undefined,
          last_name: undefined,
        });
        // Actualizar el estado de autenticación con los tokens y datos del usuario
        setAuth(
          response.tokens.access,
          response.tokens.refresh,
          response.user.role,
          response.user.username,
          response.user.email
        );
      }

      // Cerrar el dialog
      onOpenChange(false);

      // Redirigir al dashboard después de un pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 100);
    } catch (err) {
      console.error("Error en autenticación:", err);
      // El error ya está manejado por los hooks
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setPasswordConfirm("");
    setEmail("");
    setFieldErrors({});
    clearLoginError();
    clearRegisterError();
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <SlidePanel open={open} onOpenChange={onOpenChange}>
      <SlidePanelContent>
        <SlidePanelHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SlidePanelTitle className="text-2xl font-semibold mb-1.5">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </SlidePanelTitle>
              <SlidePanelDescription className="text-sm text-muted-foreground">
                {isLogin
                  ? "Ingresa tus credenciales para continuar"
                  : "Completa el formulario para crear tu cuenta"}
              </SlidePanelDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </SlidePanelHeader>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {!isLogin && (
            <FormField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              error={fieldErrors.email}
              disabled={isLoading}
              autoComplete="email"
              required
            />
          )}

          <FormField
            label="Usuario"
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
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            error={fieldErrors.password}
            disabled={isLoading}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />

          {!isLogin && (
            <FormField
              label="Confirmar Contraseña"
              name="password_confirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                if (fieldErrors.password_confirm) {
                  setFieldErrors((prev) => ({ ...prev, password_confirm: undefined }));
                }
              }}
              error={fieldErrors.password_confirm}
              disabled={isLoading}
              autoComplete="new-password"
              required
            />
          )}

          {!isLogin && showRoleSelector && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo de Usuario</label>
              <Select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value as UserRole);
                  if (fieldErrors.role) {
                    setFieldErrors((prev) => ({ ...prev, role: undefined }));
                  }
                }}
                disabled={isLoading}
                required
              >
                <option value={USER_ROLES.CLIENTE}>Cliente</option>
                <option value={USER_ROLES.ARBITRO}>Árbitro</option>
              </Select>
              {fieldErrors.role && (
                <div className="flex items-start gap-1.5 text-sm text-destructive">
                  <svg
                    className="h-4 w-4 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{fieldErrors.role}</span>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-2">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <AlertDescription className="text-sm leading-relaxed font-normal">
                    {error}
                  </AlertDescription>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearLoginError();
                    clearRegisterError();
                  }}
                  className="shrink-0 text-destructive/60 hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10 -mt-1 -mr-1"
                  aria-label="Cerrar alerta"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </Alert>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading
                ? isLogin
                  ? "Iniciando sesión..."
                  : "Creando cuenta..."
                : isLogin
                ? "Iniciar Sesión"
                : "Crear Cuenta"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={toggleMode}
              disabled={isLoading}
              className="w-full"
            >
              {isLogin ? "¿No tienes cuenta? Crear una" : "¿Ya tienes cuenta? Iniciar sesión"}
            </Button>
          </div>
        </form>
      </SlidePanelContent>
    </SlidePanel>
  );
}
