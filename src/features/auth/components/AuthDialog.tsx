/**
 * Dialog de autenticación (Login/Registro)
 * Permite seleccionar tipo de usuario y autenticarse
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "@/hooks/useAuth";
import { validations } from "@/lib/validations";
import { USER_ROLES, type UserRole } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";
import logoImage from "@/assets/Silbatazo-bordes.png";
import { LogIn, UserPlus, Mail, User, Lock, Users, X, Shield, Star, ArrowRight, CheckCircle } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: UserRole;
}

export function AuthDialog({ open, onOpenChange, defaultRole }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");
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
      let authResponse;

      if (isLogin) {
        // Modo login
        authResponse = await login({ username, password });
        // Actualizar el estado de autenticación con los tokens y datos del usuario del backend
        setAuth(
          authResponse.tokens.access,
          authResponse.tokens.refresh,
          authResponse.user.role,
          authResponse.user.username,
          authResponse.user.email,
          authResponse.user.id
        );
      } else {
        // Modo registro
        // Asegurar que el rol no sea admin (los admins no se registran)
        const registerRole = userRole === USER_ROLES.ADMIN ? USER_ROLES.CLIENTE : userRole;
        authResponse = await register({
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
          authResponse.tokens.access,
          authResponse.tokens.refresh,
          authResponse.user.role,
          authResponse.user.username,
          authResponse.user.email,
          authResponse.user.id
        );
      }

      // Cerrar el dialog
      onOpenChange(false);

      // Redirigir según redirectTo si existe, sino al dashboard según el rol
      setTimeout(() => {
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          const dashboardRoute = getDashboardRoute(authResponse.user.role as UserRole);
          navigate(dashboardRoute);
        }
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
      <SlidePanelContent className="w-full sm:max-w-md">
        <SlidePanelHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-ios shrink-0 p-2">
                <img
                  src={logoImage}
                  alt="Silbatazo Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <SlidePanelTitle className="text-2xl sm:text-3xl font-bold mb-2">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </SlidePanelTitle>
                <SlidePanelDescription className="text-base">
                {isLogin
                  ? "Ingresa tus credenciales para continuar"
                    : "Completa el formulario para comenzar"}
              </SlidePanelDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SlidePanelHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
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
              leftIcon={<Mail className="h-4 w-4" />}
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
            leftIcon={<User className="h-4 w-4" />}
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
            leftIcon={<Lock className="h-4 w-4" />}
          />

          {!isLogin && (
            <>
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
                leftIcon={<Lock className="h-4 w-4" />}
            />
            </>
          )}

{!isLogin && showRoleSelector && (
            <Card variant="outlined" className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  ¿Quién eres?
                </label>
                
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => setUserRole(USER_ROLES.CLIENTE)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                      userRole === USER_ROLES.CLIENTE
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        userRole === USER_ROLES.CLIENTE ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-foreground">Cliente</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Organizo partidos y necesito árbitros
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                      </div>
                      {userRole === USER_ROLES.CLIENTE && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserRole(USER_ROLES.ARBITRO)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                      userRole === USER_ROLES.ARBITRO
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        userRole === USER_ROLES.ARBITRO ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-foreground">Árbitro</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ofrezco mis servicios como árbitro
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Certificado
                          </Badge>
                        </div>
                      </div>
                      {userRole === USER_ROLES.ARBITRO && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {fieldErrors.role && (
                  <div className="flex items-start gap-1.5 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
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
            </Card>
          )}

          {error && (
            <Alert variant="destructive" className="border-2">
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
                  <AlertDescription className="text-sm leading-relaxed font-medium">
                    {error}
                  </AlertDescription>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearLoginError();
                    clearRegisterError();
                  }}
                  className="shrink-0 text-destructive/60 hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10"
                  aria-label="Cerrar alerta"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Alert>
          )}

          <div className="flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-3"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? (
                    <>
                      <LogIn className="h-5 w-5" />
                      Iniciar Sesión
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      Crear Cuenta
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </span>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-muted-foreground font-medium">o continúa con</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={toggleMode}
              disabled={isLoading}
              className="w-full border-2 hover:bg-primary/5 hover:border-primary transition-all duration-200 group"
              size="lg"
            >
              <span className="flex items-center gap-2">
                {isLogin ? (
                  <>
                    <UserPlus className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <span>¿No tienes cuenta? <span className="font-semibold text-primary">Crear una</span></span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <span>¿Ya tienes cuenta? <span className="font-semibold text-primary">Iniciar sesión</span></span>
                  </>
                )}
              </span>
            </Button>

            {/* Benefits section */}
            {!isLogin && (
              <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                <p className="text-xs font-medium text-muted-foreground mb-2">✨ Beneficios de registrarte:</p>
                <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Acceso a árbitros certificados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Reservas instantáneas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Soporte 24/7</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </SlidePanelContent>
    </SlidePanel>
  );
}
