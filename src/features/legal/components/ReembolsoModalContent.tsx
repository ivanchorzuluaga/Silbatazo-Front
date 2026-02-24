import { BadgeCheck, Calendar, CreditCard, Shield, Users } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function ReembolsoModalContent() {
  const sections = [
    {
      icon: BadgeCheck,
      title: "1. Condiciones Generales",
      content: (
        <p>Los reembolsos se rigen exclusivamente por esta política.</p>
      ),
    },
    {
      icon: Calendar,
      title: "2. Cancelaciones del Cliente",
      content: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Cancelación con 24 horas o más: reembolso del 100%.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Cancelación con menos de 12 horas: reembolso del 50%.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>
              Cancelaciones entre 12 y 24 horas serán evaluadas caso a caso y las decisiones serán
              comunicadas a cada cliente, con respuesta de menos de 4 horas.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Partidos que se cancelen antes de 3 horas no tendrán reembolso.</span>
          </li>
        </ul>
      ),
    },
    {
      icon: Users,
      title: "3. Cancelaciones del Árbitro",
      content: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>
              Si el árbitro cancela con mínimo 4 horas de anticipación, se intentará asignar un
              reemplazo.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>
              Si no es posible, se realizará reembolso total y se dará descuento de $10.000 pesos
              en el próximo partido.
            </span>
          </li>
        </ul>
      ),
    },
    {
      icon: CreditCard,
      title: "4. Exclusiones de Reembolso",
      content: (
        <>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>El servicio ya haya iniciado.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>
                Existan agresiones, disturbios o conductas violentas atribuibles a los
                participantes.
              </span>
            </li>
          </ul>
          <p className="mt-3">
            Si el cliente está insatisfecho con el servicio prestado por parte del árbitro, se
            evaluarán los motivos y se obsequiará un 50% de descuento en el próximo servicio del
            usuario, pero no se devolverá dinero.
          </p>
        </>
      ),
    },
    {
      icon: Shield,
      title: "5. Plazo de Devolución",
      content: (
        <p>
          Los reembolsos se realizarán al medio de pago original dentro de un plazo máximo de 5
          días hábiles.
        </p>
      ),
    },
    {
      icon: Shield,
      title: "6. Contacto",
      content: (
        <p>Para solicitudes de reembolso: soporte@silbatazo.com</p>
      ),
    },
  ];

  return (
    <div className="space-y-4 text-foreground">
      <div>
        <p className="text-sm text-muted-foreground">Última actualización: febrero 2026</p>
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
