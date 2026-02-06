/**
 * Página para pedir verificación de correo
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { authEndpoints } from "@/api/endpoints";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";

export function VerificarCorreoPage() {
  const { user } = useAuth();
  const email = user?.email?.trim() || "";
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async () => {
    setIsSending(true);
    setMessage(null);
    setError(null);
    try {
      const response = await authEndpoints.requestEmailVerification(email);
      setMessage(response.message || "Te enviamos un correo de verificación.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos enviar el correo.");
    } finally {
      setIsSending(false);
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
          <Link to={ROUTES.DASHBOARD}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="rounded-3xl border border-white/10 shadow-2xl p-6 md:p-10">
          <div className="text-center mb-6 md:mb-8">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-amber-500/15 flex items-center justify-center">
              <Mail className="h-6 w-6 text-amber-300" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
              Verifica tu correo
            </h1>
            <p className="text-sm md:text-base text-white/90 drop-shadow-md">
              Para usar todas las funciones, debes verificar tu correo electrónico.
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/80">
            <p>
              Te enviamos un enlace de verificación a:
              <span className="block font-semibold text-white mt-1">{email || "Sin correo"}</span>
            </p>
            <p>
              Revisa también la carpeta de spam o promociones.
            </p>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={handleResend}
              disabled={isSending || !email}
              className="w-full h-11 md:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              size="lg"
            >
              {isSending ? "Enviando..." : "Reenviar verificación"}
            </Button>
          </div>

          {message && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
              <p className="text-sm text-emerald-200">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
