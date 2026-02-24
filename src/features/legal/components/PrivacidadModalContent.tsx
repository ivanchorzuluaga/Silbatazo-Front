import {
  Database,
  Eye,
  Lock,
  Mail,
  Shield,
  Share2,
  Users,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function PrivacidadModalContent() {
  const sections = [
    {
      icon: Shield,
      title: "1. Marco Legal",
      content: (
        <p>
          En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, {APP_NAME} adopta esta
          Política de Privacidad para el tratamiento de datos personales.
        </p>
      ),
    },
    {
      icon: Database,
      title: "2. Información que recopilamos",
      content: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Nombre y documento de identidad.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Teléfono y correo electrónico.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Información del evento.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Datos de uso de la plataforma.</span>
          </li>
        </ul>
      ),
    },
    {
      icon: Eye,
      title: "3. Finalidad del Tratamiento",
      content: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Gestión y confirmación de reservas de servicios deportivos.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Asignación y coordinación de árbitros.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>
              Procesamiento de pagos y gestión administrativa derivada del servicio.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>
              Envío de comunicaciones operativas relacionadas con la prestación del servicio.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Cumplimiento de obligaciones legales y regulatorias aplicables.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>
              Envío de información comercial, promocional y publicitaria sobre servicios,
              novedades, eventos, beneficios, actualizaciones de la plataforma y ofertas
              relacionadas con la actividad deportiva y arbitral, a través de medios físicos o
              digitales, previa autorización del titular.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>
              Análisis estadístico y mejora de la experiencia del usuario, calidad del servicio y
              desarrollo de nuevas funcionalidades o servicios.
            </span>
          </li>
        </ul>
      ),
    },
    {
      icon: Share2,
      title: "4. Compartición de Información",
      content: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Árbitros y clientes involucrados en un servicio confirmado.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Proveedores tecnológicos.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Autoridades cuando la ley lo exija.</span>
          </li>
        </ul>
      ),
    },
    {
      icon: Lock,
      title: "5. Derechos del Titular",
      content: (
        <p>
          El usuario podrá conocer, actualizar, rectificar o solicitar la eliminación de sus datos
          personales.
        </p>
      ),
    },
    {
      icon: Lock,
      title: "6. Seguridad de la Información",
      content: (
        <p>
          {APP_NAME} implementa medidas técnicas y administrativas razonables para proteger la
          información.
        </p>
      ),
    },
    {
      icon: Users,
      title: "7. Menores de Edad",
      content: <p>La plataforma no está dirigida a menores de 18 años.</p>,
    },
    {
      icon: Mail,
      title: "8. Contacto",
      content: <p>Para ejercer sus derechos puede escribir a: soporte@silbatazo.com</p>,
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
