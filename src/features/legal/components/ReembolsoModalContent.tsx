import { BadgeCheck, Calendar, CreditCard, Shield, Users } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function ReembolsoModalContent() {
  const sections = [
    {
      icon: BadgeCheck,
      title: "1. Política general",
      content: (
        <p>
          En {APP_NAME} buscamos transparencia. Los reembolsos aplican según el estado del partido
          y las condiciones de cancelación acordadas.
        </p>
      ),
    },
    {
      icon: Calendar,
      title: "2. Cancelación por el cliente",
      content: (
        <p>
          Si el cliente cancela con suficiente antelación, puede aplicar un reembolso total o
          parcial según el caso.
        </p>
      ),
    },
    {
      icon: Users,
      title: "3. Cancelación por el árbitro",
      content: (
        <p>
          Cuando el árbitro cancela, el cliente puede optar por reprogramar o solicitar reembolso.
        </p>
      ),
    },
    {
      icon: CreditCard,
      title: "4. Procesamiento de pagos",
      content: (
        <p>
          Los reembolsos se procesan por el mismo medio de pago. Los tiempos dependen del proveedor
          financiero.
        </p>
      ),
    },
    {
      icon: Shield,
      title: "5. Contacto",
      content: (
        <p>Si tienes dudas, contáctanos por los canales oficiales del soporte.</p>
      ),
    },
  ];

  return (
    <div className="space-y-4 text-foreground">
      <div>
        <p className="text-sm text-muted-foreground">Última actualización: Enero 2026</p>
      </div>
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div key={idx} className="rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <section.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{section.title}</h3>
                <div className="mt-2 text-sm text-muted-foreground">{section.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
