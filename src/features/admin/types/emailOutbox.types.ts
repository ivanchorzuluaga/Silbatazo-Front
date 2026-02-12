export type EstadoEmailOutbox = "pendiente" | "enviado" | "fallido";

export interface EmailOutbox {
  id: number;
  subject: string;
  template_name?: string;
  body_text?: string;
  recipients: string[];
  estado: EstadoEmailOutbox;
  attempts: number;
  error_text?: string;
  last_attempt_at?: string;
  sent_at?: string;
  created_at: string;
}
