/**
 * Página para confirmar verificación de correo
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authEndpoints } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";

export function VerificarCorreoConfirmPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const hasParams = useMemo(() => !!uid && !!token, [uid, token]);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const confirm = async () => {
      if (!hasParams || isLoading || message || error) return;
      try {
        setIsLoading(true);
        const response = await authEndpoints.confirmEmailVerification({ uid, token });
        setMessage(response.message || "Correo verificado exitosamente.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al verificar correo.");
      } finally {
        setIsLoading(false);
      }
    };
    confirm();
  }, [hasParams, uid, token, isLoading, message, error]);

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
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Mail className="h-6 w-6 text-emerald-300" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-2">
              Verificación de correo
            </h1>
            <p className="text-sm md:text-base text-white/90 drop-shadow-md">
              Estamos confirmando tu correo electrónico.
            </p>
          </div>

          {!hasParams && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl mb-4">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">El enlace no es válido.</p>
            </div>
          )}

          {isLoading && (
            <p className="text-sm text-white/70 text-center">Verificando...</p>
          )}

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

          <div className="mt-6 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
