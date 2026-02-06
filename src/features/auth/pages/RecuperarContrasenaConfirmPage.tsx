/**
 * Página para confirmar recuperación de contraseña
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authEndpoints } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { AlertCircle, ArrowLeft, CheckCircle2, Lock } from "lucide-react";

export function RecuperarContrasenaConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const hasParams = useMemo(() => !!uid && !!token, [uid, token]);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!shouldRedirect) return;
    const timeout = setTimeout(() => {
      navigate(ROUTES.LOGIN, { replace: true });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [shouldRedirect, navigate]);

  const validateForm = (): boolean => {
    if (!newPassword || !newPasswordConfirm) {
      setError("Debes completar ambas contraseñas.");
      return false;
    }
    if (newPassword !== newPasswordConfirm) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!hasParams) {
      setError("El enlace no es válido. Solicita una nueva recuperación.");
      return;
    }
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await authEndpoints.confirmPasswordReset({
        uid,
        token,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      });
      setMessage(response.message || "Contraseña actualizada exitosamente.");
      setShouldRedirect(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar contraseña.");
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
              Nueva contraseña
            </h1>
            <p className="text-sm md:text-base text-white/90 drop-shadow-md">
              Ingresa tu nueva contraseña para completar el proceso.
            </p>
          </div>

          {!hasParams && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl mb-4">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300">
                El enlace no es válido. Solicita una nueva recuperación.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white drop-shadow-md">
                Nueva contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="new_password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError(null);
                    if (message) setMessage(null);
                  }}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="w-full h-11 md:h-12 pl-11 pr-4 bg-black/40 border-2 border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white drop-shadow-md">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="new_password_confirm"
                  value={newPasswordConfirm}
                  onChange={(e) => {
                    setNewPasswordConfirm(e.target.value);
                    if (error) setError(null);
                    if (message) setMessage(null);
                  }}
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="w-full h-11 md:h-12 pl-11 pr-4 bg-black/40 border-2 border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 disabled:opacity-50"
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

            {message && (
              <p className="text-xs text-white/70 text-center">
                Serás redirigido a iniciar sesión en unos segundos.
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !hasParams || !!message}
              className="w-full h-11 md:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              size="lg"
            >
              {isLoading ? "Actualizando..." : "Guardar contraseña"}
            </Button>
          </form>

          {message && (
            <div className="mt-4 text-center">
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Ir a iniciar sesión ahora
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
