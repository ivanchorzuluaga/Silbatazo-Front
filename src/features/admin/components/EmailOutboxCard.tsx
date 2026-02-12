import { Button } from "@/components/ui/button";
import type { EmailOutbox } from "../types/emailOutbox.types";

interface EmailOutboxCardProps {
  email: EmailOutbox;
  onReenviar: (id: number) => Promise<void>;
  isLoading?: boolean;
}

const estadoStyles: Record<string, string> = {
  pendiente: "text-yellow-400",
  fallido: "text-red-400",
  enviado: "text-green-400",
};

export function EmailOutboxCard({ email, onReenviar, isLoading }: EmailOutboxCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{email.subject}</h3>
          <p className="text-xs text-muted-foreground">
            {new Date(email.created_at).toLocaleString("es-CO")}
          </p>
        </div>
        <span className={`text-xs font-semibold ${estadoStyles[email.estado] || ""}`}>
          {email.estado}
        </span>
      </div>

      <div className="text-xs text-muted-foreground">
        Destinatarios: {email.recipients.join(", ")}
      </div>

      {email.error_text && (
        <div className="text-xs text-destructive">
          Error: {email.error_text}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-muted-foreground">
          Intentos: {email.attempts}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReenviar(email.id)}
          disabled={isLoading}
        >
          Reenviar
        </Button>
      </div>
    </div>
  );
}
