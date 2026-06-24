/**
 * Página de login
 * Diseño moderno con logo de fondo y formulario glassmorphism
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLogin } from "../hooks/useLogin";
import { ROUTES, APP_NAME, USER_ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { validations } from "@/lib/validations";
import logoImage from "@/assets/Logo.png";
import {
  User,
  Lock,
  LogIn,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { authService } from "@/features/auth/services/auth.service";

export function LoginPage() {
  const { isAuthenticated, user, login: setAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { login, isLoading, error, clearError } = useLogin();
  const isDeactivated = Boolean(
    error && error.toLowerCase().includes("desactivada"),
  );

  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === USER_ROLES.ADMIN) {
        const destino =
          redirectTo && redirectTo.startsWith("/admin") ? redirectTo : ROUTES.ADMIN_DASHBOARD;
        navigate(destino, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    }
  }, [isAuthenticated, user, redirectTo, navigate]);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!validations.required(username)) {
      errors.username = "El usuario es requerido";
    } else if (!validations.minLength(username, 3)) {
      errors.username = "El usuario debe tener al menos 3 caracteres";
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

      // Actualizar el estado de autenticación
      setAuth(
        authResponse.tokens.access,
        authResponse.tokens.refresh,
        authResponse.user.role,
        authResponse.user.username,
        authResponse.user.email,
        authResponse.user.id,
        authResponse.user.email_verificado,
      );

      setTimeout(() => {
        if (authResponse.user.role === USER_ROLES.ADMIN) {
          const destino =
            redirectTo && redirectTo.startsWith("/admin") ? redirectTo : ROUTES.ADMIN_DASHBOARD;
          navigate(destino, { replace: true });
        } else {
          navigate(ROUTES.HOME, { replace: true });
        }
      }, 100);
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  const handleReactivate = async () => {
    clearError();
    if (!validateForm()) return;
    setIsReactivating(true);
    try {
      const authResponse = await authService.reactivateAccount({
        username,
        password,
      });
      setAuth(
        authResponse.tokens.access,
        authResponse.tokens.refresh,
        authResponse.user.role,
        authResponse.user.username,
        authResponse.user.email,
        authResponse.user.id,
        authResponse.user.email_verificado,
      );
      if (authResponse.user.role === USER_ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (err) {
      console.error("Error al reactivar cuenta:", err);
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-background text-foreground">
      {/* Fondo con gradiente adaptable al tema */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-950 dark:via-gray-900 dark:to-black" />

      {/* Efectos de luz decorativos */}
      <div className="absolute top-0 left-1/4 h-96 w-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[100px]" />

      {/* Top navigation bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="min-h-10 touch-manipulation bg-white/70 dark:bg-white/10 backdrop-blur-md border border-border/60 text-foreground hover:bg-white/90 dark:hover:bg-white/20"
        >
          <Link to={ROUTES.HOME}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
        <ThemeToggle size="sm" />
      </div>

      {/* Contenedor principal con logo a la izquierda y form a la derecha */}
      <div className="relative z-10 w-full max-w-5xl mx-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {/* Logo a la izquierda - Solo visible en desktop */}
        <div className="hidden md:flex items-center justify-center opacity-40">
          <img
            src={logoImage}
            alt=""
            className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] object-contain"
          />
        </div>

        {/* Formulario */}
        <div className="w-full max-w-md">
          {/* Card glassmorphism */}
          <div className="relative rounded-3xl border border-border/60 bg-card/70 text-card-foreground shadow-2xl p-6 md:p-10 overflow-hidden">
            {/* Logo de fondo dentro de la card - Solo visible en móvil */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none md:hidden">
              <img
                src={logoImage}
                alt=""
                className="w-64 h-64 object-contain opacity-15"
              />
            </div>

            {/* Contenido del formulario */}
            <div className="relative z-10">
              {/* Título */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg mb-1">
                  Bienvenido
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* Usuario */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white drop-shadow-md">
                    Usuario o correo
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (fieldErrors.username) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            username: undefined,
                          }));
                        }
                        clearError();
                      }}
                      placeholder="Usuario o correo"
                      disabled={isLoading}
                      autoComplete="username"
                      className="auth-input pl-11 pr-4"
                    />
                  </div>
                  {fieldErrors.username && (
                    <p className="text-sm text-red-400 font-medium drop-shadow-md">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white drop-shadow-md">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                        clearError();
                      }}
                      placeholder="Tu contraseña"
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="auth-input pl-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm text-red-400 font-medium drop-shadow-md">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Recuperar contraseña */}
                <div className="flex justify-end">
                  <Link
                    to={ROUTES.RECUPERAR_CONTRASENA}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Error */}
                {error && (
                  <div className="space-y-3 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                    {isDeactivated && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReactivate}
                        disabled={isReactivating}
                        className="w-full border-red-400/40 text-red-100 hover:bg-red-500/20"
                      >
                        {isReactivating ? "Reactivando..." : "Reactivar cuenta"}
                      </Button>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 md:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Iniciando sesión...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-5 w-5" />
                      Iniciar Sesión
                    </span>
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Acceso reservado al equipo administrativo. Para reservar un árbitro, usa WhatsApp
                desde la página principal.
              </p>
            </div>
          </div>

          {/* Texto de copyright */}
          <p className="text-center text-muted-foreground text-xs md:text-sm mt-4 md:mt-6 drop-shadow-md">
            © 2026 {APP_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
