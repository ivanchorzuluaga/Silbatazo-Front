import { authenticatedApiClient } from "../client";
import type { EmailOutbox } from "@/features/admin/types/emailOutbox.types";

export const notificacionesEndpoints = {
  listOutbox: (token: string, estado?: string) => {
    const params = estado ? `?estado=${estado}` : "";
    return authenticatedApiClient<EmailOutbox[]>(`/api/notificaciones/outbox/${params}`, token);
  },
  resendOutbox: (token: string, id: number) => {
    return authenticatedApiClient<EmailOutbox>(`/api/notificaciones/outbox/${id}/reenviar/`, token, {
      method: "POST",
    });
  },
} as const;
