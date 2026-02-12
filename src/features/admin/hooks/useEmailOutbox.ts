import { useCallback, useState } from "react";
import { authService } from "@/features/auth/services/auth.service";
import { notificacionesEndpoints } from "@/api/endpoints/notificaciones.endpoints";
import type { EmailOutbox } from "../types/emailOutbox.types";

interface UseEmailOutboxReturn {
  emails: EmailOutbox[];
  isLoading: boolean;
  error: string | null;
  listar: (estado?: string) => Promise<void>;
  reenviar: (id: number) => Promise<void>;
}

export function useEmailOutbox(): UseEmailOutboxReturn {
  const [emails, setEmails] = useState<EmailOutbox[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listar = useCallback(
    async (estado?: string) => {
      const token = authService.getAccessToken();
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await notificacionesEndpoints.listOutbox(token, estado);
        setEmails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar correos.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reenviar = useCallback(
    async (id: number) => {
      const token = authService.getAccessToken();
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const updated = await notificacionesEndpoints.resendOutbox(token, id);
        setEmails((prev) => prev.map((item) => (item.id === id ? updated : item)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo reenviar el correo.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { emails, isLoading, error, listar, reenviar };
}
