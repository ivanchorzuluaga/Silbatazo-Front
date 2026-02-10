import { FileText, Shield, Users, CreditCard, Scale, Mail } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function TerminosModalContent() {
  const sections = [
    {
      icon: FileText,
      title: "1. Aceptación de los Términos",
      content: (
        <p>
          Al acceder y utilizar la plataforma {APP_NAME}, usted acepta estar sujeto a estos
          Términos y Condiciones de uso. Si no está de acuerdo con alguna parte de estos términos,
          no podrá acceder al servicio.
        </p>
      ),
    },
    {
      icon: Shield,
      title: "2. Descripción del Servicio",
      content: (
        <>
          <p className="mb-3">
            {APP_NAME} conecta organizadores de eventos deportivos con árbitros certificados.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Clientes: buscan, contactan y contratan árbitros.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Árbitros: gestionan su perfil, disponibilidad y solicitudes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Pagos gestionados de forma segura.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Users,
      title: "3. Registro y Cuenta",
      content: (
        <p>
          El usuario es responsable de la información suministrada y del uso de sus credenciales.
        </p>
      ),
    },
    {
      icon: CreditCard,
      title: "4. Pagos y Comisiones",
      content: (
        <p>
          {APP_NAME} actúa como intermediario de pagos y puede cobrar comisión por transacción.
        </p>
      ),
    },
    {
      icon: Scale,
      title: "5. Cancelaciones",
      content: <p>Las cancelaciones se rigen por la política de reembolso vigente.</p>,
    },
    {
      icon: Mail,
      title: "6. Contacto",
      content: <p>Si tienes dudas, contáctanos a través de los canales oficiales.</p>,
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
