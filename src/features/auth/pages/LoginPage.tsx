/**
 * Página de login
 * Componente de página centrado con formulario moderno
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLogin } from "../hooks/useLogin";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validations } from "@/lib/validations";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoImage from "@/assets/Silbatazo-bordes.png";
import { User, Lock, LogIn, ArrowLeft, Shield, AlertCircle } from "lucide-react";

export function LoginPage() {
  const { isAuthenticated, user, login: setAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const {
    login,
    isLoading,
    error,
    clearError,
  } = useLogin();

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
        authResponse.user.id
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
    <div className="min-h-screen bg-background flex">
      {/* Top navigation bar */}
      <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="bg-background/80 backdrop-blur-sm">
          <Link to={ROUTES.HOME}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
        <ThemeToggle className="bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Left side - Logo (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden items-center justify-center p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-primary/10 rounded-full blur-3xl" />
        
        {/* Logo container */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300" />
            <img
              src={logoImage}
              alt={`${APP_NAME} Logo`}
              className="relative h-64 w-64 object-contain drop-shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="relative h-64 w-64 flex items-center justify-center logo-fallback hidden">
              <Shield className="w-48 h-48 text-white drop-shadow-2xl" />
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {APP_NAME}
            </h1>
            <p className="text-xl text-white/90 max-w-md">
              Tus Arbitros de Confianza.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12 bg-gradient-to-br from-background via-background to-primary/5 relative">
        {/* Background decoration for mobile */}
        <div className="absolute inset-0 bg-grid-white/5 lg:hidden" />
        <div className="absolute top-0 right-0 h-96 w-96 bg-primary/10 rounded-full blur-3xl lg:hidden" />
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-secondary/20 rounded-full blur-3xl lg:hidden" />
        
        <Card className="relative w-full max-w-md shadow-2xl border-2 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-6 pt-8">
            {/* Logo for mobile */}
            <div className="flex justify-center lg:hidden">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <img
                  src={logoImage}
                  alt={`${APP_NAME} Logo`}
                  className="relative h-32 w-32 object-contain drop-shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.logo-fallback-mobile') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="relative h-32 w-32 flex items-center justify-center logo-fallback-mobile hidden">
                  <Shield className="w-24 h-24 text-primary drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
              <CardDescription className="text-base">
                Ingresa tus credenciales para continuar
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Usuario */}
            <FormField
              label="Usuario"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username) {
                  setFieldErrors((prev) => ({ ...prev, username: undefined }));
                }
                clearError();
              }}
              error={fieldErrors.username}
              disabled={isLoading}
              autoComplete="username"
              required
              leftIcon={<User className="h-4 w-4" />}
              placeholder="Tu nombre de usuario"
            />

            {/* Contraseña */}
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
                clearError();
              }}
              error={fieldErrors.password}
              disabled={isLoading}
              autoComplete="current-password"
              required
              leftIcon={<Lock className="h-4 w-4" />}
              placeholder="Tu contraseña"
            />

            {/* Recuperar contraseña */}
            <div className="flex justify-end">
              <Link
                to="/recuperar-contrasena"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6"
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
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground font-medium">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full border-2 hover:bg-primary/5 hover:border-primary transition-all duration-200"
            size="lg"
          >
            <span className="font-semibold text-primary">
              Crear una cuenta nueva
            </span>
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

