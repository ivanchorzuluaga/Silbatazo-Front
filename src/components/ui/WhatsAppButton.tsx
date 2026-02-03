/**
 * Botón/link reutilizable para abrir WhatsApp con un número de contacto.
 * No es flotante: se usa inline donde se necesite (footer, contacto, soporte).
 */

import { cn } from "@/lib/utils";
import { CONTACT_WHATSAPP_NUMBER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const WHATSAPP_BASE = "https://wa.me";

/**
 * Genera la URL de WhatsApp (wa.me) con número y mensaje opcional
 */
export function getWhatsAppUrl(number: string = CONTACT_WHATSAPP_NUMBER, message?: string): string {
  const num = number.replace(/\D/g, "");
  const url = new URL(num, `${WHATSAPP_BASE}/`);
  if (message?.trim()) {
    url.searchParams.set("text", message.trim());
  }
  return url.toString();
}

/** Icono SVG de WhatsApp para usar en navbar, etc. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface WhatsAppButtonProps {
  /** Número en formato 573001234567 (opcional, usa constante por defecto) */
  number?: string;
  /** Mensaje prellenado en el chat */
  message?: string;
  /** Estilo: botón verde, link con icono, solo icono, o ítem de sidebar */
  variant?: "button" | "link" | "icon" | "sidebar";
  /** Tamaño cuando variant="button" */
  size?: "sm" | "default" | "lg";
  /** Texto del botón/link (solo button o link) */
  children?: React.ReactNode;
  className?: string;
}

const defaultLabel = "Escribir por WhatsApp";

export function WhatsAppButton({
  number = CONTACT_WHATSAPP_NUMBER,
  message,
  variant = "button",
  size = "default",
  children,
  className,
}: WhatsAppButtonProps) {
  const href = getWhatsAppUrl(number, message);
  const label = children ?? defaultLabel;

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center justify-center text-foreground/70 hover:text-[#25D366] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 rounded-lg",
          className
        )}
        aria-label={defaultLabel}
      >
        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
    );
  }

  if (variant === "sidebar") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-ios",
          "hover:bg-accent hover:text-accent-foreground text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50",
          className
        )}
      >
        <WhatsAppIcon className="size-4 shrink-0 text-[#25D366]" />
        <span>WhatsApp</span>
      </a>
    );
  }

  if (variant === "link") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 text-sm font-medium text-[#25D366] hover:text-[#20BD5A] underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 rounded",
          className
        )}
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        {label}
      </a>
    );
  }

  return (
    <Button
      size={size}
      className={cn(
        "bg-[#25D366] hover:bg-[#20BD5A] text-white focus-visible:ring-[#25D366]/50",
        className
      )}
      asChild
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        {label}
      </a>
    </Button>
  );
}
