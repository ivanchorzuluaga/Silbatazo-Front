/**
 * Página de login
 * Diseño moderno con logo de fondo y formulario glassmorphism
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLogin } from "../hooks/useLogin";
import { ROUTES, APP_NAME, USER_ROLES } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";
import { Button } from "@/components/ui/button";
import { validations } from "@/lib/validations";
import { AuthDialog } from "../components/AuthDialog";
import logoImage from "@/assets/Silbatazo-bordes.png";
import { User, Lock, LogIn, ArrowLeft, AlertCircle } from "lucide-react";

export function LoginPage() {
  const { isAuthenticated, user, login: setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const roleParam = searchParams.get("role");
  const isRegisterPage = location.pathname === ROUTES.REGISTER;
  const defaultRoleRegister = roleParam === "arbitro" ? USER_ROLES.ARBITRO : USER_ROLES.CLIENTE;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { login, isLoading, error, clearError } = useLogin();

  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir
    if (isAuthenticated && user?.role) {
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else {
        const dashboardRoute = getDashboardRoute(user.role);
        navigate(dashboardRoute, { replace: true });
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
        authResponse.user.email_verificado
      );

      // Redirigir
      setTimeout(() => {
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          const dashboardRoute = getDashboardRoute(authResponse.user.role);
          navigate(dashboardRoute);
        }
      }, 100);
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Panel de registro: se muestra cuando la ruta es /register */}
      {isRegisterPage && (
        <AuthDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) navigate(ROUTES.LOGIN);
          }}
          initialMode="register"
          defaultRole={defaultRoleRegister}
        />
      )}

      {/* Fondo con gradiente oscuro */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />

      {/* Efectos de luz decorativos */}
      <div className="absolute top-0 left-1/4 h-96 w-96 bg-primary/30 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-emerald-500/10 rounded-full blur-[100px]" />

      {/* Top navigation bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-start">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="min-h-10 touch-manipulation bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:text-white"
        >
          <Link to={ROUTES.HOME}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
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
          <div className="relative rounded-3xl border border-white/10 shadow-2xl p-6 md:p-10 overflow-hidden">
            {/* Logo de fondo dentro de la card - Solo visible en móvil */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none md:hidden">
              <img src={logoImage} alt="" className="w-64 h-64 object-contain opacity-15" />
            </div>

            {/* Contenido del formulario */}
            <div className="relative z-10">
              {/* Título */}
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-1">
                  Bienvenido
                </h1>
                <p className="text-sm md:text-base text-white/90 drop-shadow-md">
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
                          setFieldErrors((prev) => ({ ...prev, username: undefined }));
                        }
                        clearError();
                      }}
                      placeholder="Usuario o correo"
                      disabled={isLoading}
                      autoComplete="username"
                      className="w-full h-11 md:h-12 pl-11 pr-4 bg-black/40 border-2 border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 disabled:opacity-50"
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
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          setFieldErrors((prev) => ({ ...prev, password: undefined }));
                        }
                        clearError();
                      }}
                      placeholder="Tu contraseña"
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="w-full h-11 md:h-12 pl-11 pr-4 bg-black/40 border-2 border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 disabled:opacity-50"
                    />
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
                  <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
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

              {/* Divider */}
              <div className="relative my-4 md:my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-gray-900/80 px-3 text-white/80 font-medium rounded">
                    ¿No tienes cuenta?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.REGISTER)}
                className="w-full h-11 md:h-12 bg-black/40 border-2 border-white/30 text-white font-semibold hover:bg-white/20 hover:border-white/50 rounded-xl transition-all duration-200"
                size="lg"
              >
                Crear una cuenta nueva
              </Button>
            </div>
          </div>

          {/* Texto de copyright */}
          <p className="text-center text-white/70 text-xs md:text-sm mt-4 md:mt-6 drop-shadow-md">
            © 2026 {APP_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
