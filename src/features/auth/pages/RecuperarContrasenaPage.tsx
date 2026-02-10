/**
 * Página para solicitar recuperación de contraseña
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { authEndpoints } from "@/api/endpoints";
import { validations } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { AlertCircle, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!validations.required(email)) {
      setError("El correo electrónico es requerido");
      return false;
    }
    if (!validations.email(email)) {
      setError("El formato del correo no es válido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await authEndpoints.requestPasswordReset(email.trim());
      setMessage(response.message || "Si el correo existe, enviaremos instrucciones.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black" />

      <div className="absolute top-4 left-4 right-4 z-50 flex justify-start">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="min-h-10 touch-manipulation bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:text-white"
        >
          <Link to={ROUTES.LOGIN}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a iniciar sesión
          </Link>
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-3xl border border-white/10 shadow-2xl p-6 md:p-10">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
              Recuperar contraseña
            </h1>
            <p className="text-sm md:text-base text-white/90 drop-shadow-md">
              Te enviaremos un enlace para crear una nueva contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white drop-shadow-md">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                    if (message) setMessage(null);
                  }}
                  placeholder="correo@ejemplo.com"
                  disabled={isLoading}
                  autoComplete="email"
                  className="auth-input pl-11 pr-4"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                <p className="text-sm text-emerald-200">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 md:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              size="lg"
            >
              {isLoading ? "Enviando..." : "Enviar enlace"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
