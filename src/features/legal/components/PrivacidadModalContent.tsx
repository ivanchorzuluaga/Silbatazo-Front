import {
  Shield,
  Database,
  Eye,
  Lock,
  Share2,
  Cookie,
  Users,
  Mail,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function PrivacidadModalContent() {
  const sections = [
    {
      icon: Shield,
      title: "1. Introducción",
      content: (
        <p>
          En {APP_NAME} protegemos tu información. Esta política explica qué recolectamos y cómo
          la usamos.
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
            <span>Datos de registro y perfil.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Información de pagos necesaria para el servicio.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Datos de uso y cookies para mejorar la experiencia.</span>
          </li>
        </ul>
      ),
    },
    {
      icon: Eye,
      title: "3. Uso de la información",
      content: <p>Usamos los datos para operar la plataforma y mejorar el servicio.</p>,
    },
    {
      icon: Share2,
      title: "4. Compartición",
      content: <p>Solo compartimos datos cuando es necesario para prestar el servicio.</p>,
    },
    {
      icon: Lock,
      title: "5. Seguridad",
      content: <p>Aplicamos medidas de seguridad técnicas y organizativas.</p>,
    },
    {
      icon: Cookie,
      title: "6. Cookies",
      content: <p>Usamos cookies para autenticación y analítica básica.</p>,
    },
    {
      icon: Users,
      title: "7. Tus derechos",
      content: <p>Puedes solicitar acceso, corrección o eliminación de datos.</p>,
    },
    {
      icon: Mail,
      title: "8. Contacto",
      content: <p>Escríbenos si tienes preguntas sobre esta política.</p>,
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
