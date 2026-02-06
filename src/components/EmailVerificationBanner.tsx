/**
 * Banner para recordar verificación de correo
 */

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authEndpoints } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export function EmailVerificationBanner() {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const email = user?.email?.trim() || "";
  const isVerified = !!user?.email_verificado;

  if (!email || isVerified) return null;

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
    <div className="border-b bg-amber-500/10">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-amber-200">
            <Mail className="h-4 w-4 shrink-0" />
            <span>
              Tu correo no está verificado. Verifícalo para recibir notificaciones
              importantes.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={isSending}
              className="border-amber-400/40 text-amber-200 hover:bg-amber-500/10"
            >
              {isSending ? "Enviando..." : "Reenviar verificación"}
            </Button>
          </div>
        </div>
        {message && (
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
