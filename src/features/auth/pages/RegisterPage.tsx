/**
 * Página de registro
 * Diseño consistente con la página de login
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormField } from "@/components/forms";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useRegister } from "../hooks/useRegister";
import { validations } from "@/lib/validations";
import { ROUTES, USER_ROLES, type UserRole } from "@/lib/constants";
import { getDashboardRoute } from "@/lib/routing";
import { TerminosModalContent } from "@/features/legal/components/TerminosModalContent";
import { PrivacidadModalContent } from "@/features/legal/components/PrivacidadModalContent";
import logoImage from "@/assets/Logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: setAuth } = useAuth();
  const roleParam = searchParams.get("role");
  const defaultRole =
    roleParam === "arbitro" ? USER_ROLES.ARBITRO : USER_ROLES.CLIENTE;

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [documentoIdentidad, setDocumentoIdentidad] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [showTerminos, setShowTerminos] = useState(false);
  const [showPrivacidad, setShowPrivacidad] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(defaultRole);

  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    telefono?: string;
    documento_identidad?: string;
    password?: string;
    password_confirm?: string;
    role?: string;
    terminos_aceptados?: string;
  }>({});

  const { register, isLoading, error, clearError } = useRegister();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!validations.required(username)) {
      errors.username = "El usuario es requerido";
    } else if (!validations.minLength(username, 3)) {
      errors.username = "El usuario debe tener al menos 3 caracteres";
    } else if (!validations.username(username)) {
      errors.username = "Solo letras, números, guiones y guiones bajos";
    }

    if (!validations.required(firstName)) {
      errors.first_name = "El nombre es requerido";
    }

    if (!validations.required(lastName)) {
      errors.last_name = "El apellido es requerido";
    }

    if (!validations.required(email)) {
      errors.email = "El correo es requerido";
    } else if (!validations.email(email)) {
      errors.email = "Ingresa un correo válido";
    }

    if (!validations.required(telefono)) {
      errors.telefono = "El teléfono es requerido";
    }

    if (!validations.required(documentoIdentidad)) {
      errors.documento_identidad = "El número de documento es requerido";
    }

    if (!validations.required(password)) {
      errors.password = "La contraseña es requerida";
    } else if (!validations.passwordStrength(password)) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!validations.required(passwordConfirm)) {
      errors.password_confirm = "Confirma tu contraseña";
    } else if (passwordConfirm !== password) {
      errors.password_confirm = "Las contraseñas no coinciden";
    }

    if (!userRole) {
      errors.role = "Debes seleccionar un tipo de usuario";
    }

    if (!terminosAceptados) {
      errors.terminos_aceptados = "Debes aceptar los términos y condiciones";
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
      const authResponse = await register({
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        telefono,
        documento_identidad: documentoIdentidad.trim(),
        password,
        password_confirm: passwordConfirm,
        role: userRole as "cliente" | "arbitro",
        terminos_aceptados: terminosAceptados,
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

      const dashboardRoute = getDashboardRoute(
        authResponse.user.role as UserRole,
      );
      navigate(dashboardRoute, { replace: true });
    } catch (err) {
      console.error("Error en registro:", err);
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

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-6xl mx-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10">
        {/* Logo a la izquierda - Solo visible en desktop */}
        <div className="hidden md:flex items-center justify-center opacity-40">
          <img
            src={logoImage}
            alt=""
            className="w-[280px] h-[280px] lg:w-[320px] lg:h-[320px] object-contain"
          />
        </div>

        {/* Formulario */}
        <div className="w-full max-w-2xl">
          <div className="relative rounded-3xl border border-border/60 bg-card/70 text-card-foreground shadow-2xl p-6 md:p-8 overflow-hidden">
            {/* Logo de fondo dentro de la card - Solo visible en móvil */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none md:hidden">
              <img
                src={logoImage}
                alt=""
                className="w-56 h-56 object-contain opacity-10"
              />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg mb-1">
                  Crea tu cuenta
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Regístrate para empezar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Usuario"
                    name="username"
                    placeholder="Tu nombre de usuario"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (fieldErrors.username) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          username: undefined,
                        }));
                      }
                    }}
                    error={fieldErrors.username}
                    disabled={isLoading}
                    autoComplete="username"
                    required
                    leftIcon={<User className="h-4 w-4" />}
                  />

                  <FormField
                    label="Nombre"
                    name="first_name"
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (fieldErrors.first_name) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          first_name: undefined,
                        }));
                      }
                    }}
                    error={fieldErrors.first_name}
                    disabled={isLoading}
                    autoComplete="given-name"
                    required
                    leftIcon={<User className="h-4 w-4" />}
                  />

                  <FormField
                    label="Apellido"
                    name="last_name"
                    placeholder="Tu apellido"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (fieldErrors.last_name) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          last_name: undefined,
                        }));
                      }
                    }}
                    error={fieldErrors.last_name}
                    disabled={isLoading}
                    autoComplete="family-name"
                    required
                    leftIcon={<User className="h-4 w-4" />}
                  />

                  <FormField
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    error={fieldErrors.email}
                    disabled={isLoading}
                    autoComplete="email"
                    required
                    leftIcon={<Mail className="h-4 w-4" />}
                  />

                  <FormField
                    label="Teléfono"
                    name="telefono"
                    type="tel"
                    placeholder="Ej: 300 123 4567"
                    value={telefono}
                    onChange={(e) => {
                      setTelefono(e.target.value);
                      if (fieldErrors.telefono) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          telefono: undefined,
                        }));
                      }
                    }}
                    error={fieldErrors.telefono}
                    disabled={isLoading}
                    autoComplete="tel"
                    required
                    leftIcon={<Phone className="h-4 w-4" />}
                  />

                  <FormField
                    label="Número de documento"
                    name="documento_identidad"
                    value={documentoIdentidad}
                    onChange={(e) => {
                      setDocumentoIdentidad(e.target.value);
                      if (fieldErrors.documento_identidad) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          documento_identidad: undefined,
                        }));
                      }
                    }}
                    error={fieldErrors.documento_identidad}
                    disabled={isLoading}
                    placeholder="Cédula o documento de identidad"
                    autoComplete="off"
                    required
                    leftIcon={<CreditCard className="h-4 w-4" />}
                  />

                  <FormField
                    label="Contraseña"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          password: undefined,
                        }));
                      }
                    }}
                    error={fieldErrors.password}
                    disabled={isLoading}
                    autoComplete="new-password"
                    required
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />

                  <FormField
                    label="Confirmar contraseña"
                    name="password_confirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      if (fieldErrors.password_confirm) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          password_confirm: undefined,
                        }));
                      }
                    }}
                    error={fieldErrors.password_confirm}
                    disabled={isLoading}
                    autoComplete="new-password"
                    required
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm((prev) => !prev)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPasswordConfirm
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showPasswordConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                </div>

                <Card
                  variant="outlined"
                  className="mt-4 sm:mt-5 md:mt-3 p-3 sm:p-4 md:p-3 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10"
                >
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary shrink-0" />
                      ¿Quién eres?
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setUserRole(USER_ROLES.CLIENTE)}
                        className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 touch-manipulation ${
                          userRole === USER_ROLES.CLIENTE
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              userRole === USER_ROLES.CLIENTE
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">
                              Cliente
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
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
                        className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 touch-manipulation ${
                          userRole === USER_ROLES.ARBITRO
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              userRole === USER_ROLES.ARBITRO
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">
                              Árbitro
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
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

                <div>
                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-border"
                      checked={terminosAceptados}
                      onChange={(e) => {
                        setTerminosAceptados(e.target.checked);
                        if (fieldErrors.terminos_aceptados) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            terminos_aceptados: undefined,
                          }));
                        }
                      }}
                    />
                    <span>
                      Acepto los{" "}
                      <button
                        type="button"
                        onClick={() => setShowTerminos(true)}
                        className="text-primary hover:underline"
                      >
                        términos y condiciones
                      </button>{" "}
                      y la{" "}
                      <button
                        type="button"
                        onClick={() => setShowPrivacidad(true)}
                        className="text-primary hover:underline"
                      >
                        política de privacidad
                      </button>
                      .
                    </span>
                  </label>
                  {fieldErrors.terminos_aceptados && (
                    <p className="mt-2 text-xs text-destructive">
                      {fieldErrors.terminos_aceptados}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>

                {error && (
                  <Alert variant="destructive" className="border-2">
                    <AlertDescription className="text-sm font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    to={ROUTES.LOGIN}
                    className="text-primary font-semibold hover:underline"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showTerminos} onOpenChange={setShowTerminos}>
        <DialogContent className="max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="!flex-row items-center justify-between gap-4">
            <DialogTitle>Términos y Condiciones</DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowTerminos(false)}
              aria-label="Cerrar"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="pt-2">
            <TerminosModalContent />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTerminos(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacidad} onOpenChange={setShowPrivacidad}>
        <DialogContent className="max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="!flex-row items-center justify-between gap-4">
            <DialogTitle>Política de Privacidad</DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPrivacidad(false)}
              aria-label="Cerrar"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="pt-2">
            <PrivacidadModalContent />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPrivacidad(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
