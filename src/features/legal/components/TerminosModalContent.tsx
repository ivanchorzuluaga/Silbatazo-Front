import {
  AlertTriangle,
  BookOpen,
  Briefcase,
  FileText,
  Gavel,
  RefreshCcw,
  Scale,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function TerminosModalContent() {
  const sections = [
    {
      icon: FileText,
      title: "1. Identificación de la Plataforma",
      content: (
        <p>
          {APP_NAME} es una plataforma tecnológica que conecta árbitros independientes con personas
          naturales o jurídicas que requieren servicios de arbitraje para partidos de fútbol
          recreativos, amateurs, empresariales o similares, principalmente en Medellín y su área
          metropolitana. {APP_NAME} actúa exclusivamente como intermediario digital y no es
          empleador, organizador del evento ni responsable directo del desarrollo del partido.
        </p>
      ),
    },
    {
      icon: Shield,
      title: "2. Aceptación de los Términos",
      content: (
        <p>
          Al registrarse y utilizar la plataforma, el usuario acepta de manera expresa estos
          Términos y Condiciones. Si no está de acuerdo, deberá abstenerse de usar el servicio.
        </p>
      ),
    },
    {
      icon: Users,
      title: "3. Registro y Uso de la Cuenta",
      content: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Proporcionar información veraz y actualizada.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Mantener la confidencialidad de sus credenciales.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Asumir responsabilidad por toda actividad realizada desde su cuenta.</span>
          </li>
        </ul>
      ),
    },
    {
      icon: UserCheck,
      title: "4. Términos para Clientes",
      content: (
        <>
          <p className="mb-3 font-medium text-foreground">4.1 Obligaciones del Cliente</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Proporcionar información correcta del evento.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Garantizar condiciones mínimas de seguridad del escenario deportivo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>
                Velar por el comportamiento de jugadores y asistentes y asumir las
                responsabilidades y consecuencias ante cualquier agresión por la prestación del
                servicio.
              </span>
            </li>
          </ul>
          <p className="mt-3 font-medium text-foreground">4.2 Responsabilidad por Agresiones</p>
          <p>
            El cliente registrado responsable del servicio será el único responsable por cualquier
            agresión física o verbal contra el árbitro o terceros durante el evento.
          </p>
        </>
      ),
    },
    {
      icon: Briefcase,
      title: "5. Términos para Árbitros Afiliados",
      content: (
        <>
          <p className="mb-3 font-medium text-foreground">5.1 Naturaleza de la Relación</p>
          <p>
            El árbitro actúa como trabajador independiente, sin vínculo laboral con {APP_NAME},
            conforme al Código Sustantivo del Trabajo colombiano.
          </p>
          <p className="mt-3 font-medium text-foreground">5.2 Cancelaciones del Árbitro</p>
          <p>
            El árbitro deberá cancelar con mínimo 3 horas de anticipación y justificar la causa. Si
            el partido es asignado con 3 horas de anticipación ya no podrá ser cancelado y es
            responsabilidad asistir o tener reemplazo justificado e informado a {APP_NAME}.
          </p>
          <p className="mt-3 font-medium text-foreground">Sanciones</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Primera vez: suspensión 1 semana.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Segunda vez: suspensión 15 días.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Tercera vez: eliminación permanente de la plataforma.</span>
            </li>
          </ul>
          <p className="mt-3">
            Si un árbitro no se presenta a un compromiso con {APP_NAME} sin justa causa, será
            eliminado de la plataforma y no se contará más con dicha persona, dando espacio a
            nuevas personas que se beneficien de esta oportunidad.
          </p>
        </>
      ),
    },
    {
      icon: RefreshCcw,
      title: "6. Reasignación de Árbitro",
      content: (
        <p>
          Cuando un árbitro cancele con la antelación debida, {APP_NAME} intentará asignar un
          reemplazo disponible. Si no es posible, aplicará la Política de Reembolso con el cliente.
        </p>
      ),
    },
    {
      icon: BookOpen,
      title: "7. Propiedad Intelectual",
      content: (
        <p>
          Todo el contenido de la plataforma, incluyendo marca, logotipo, textos, imágenes y
          software, es propiedad de {APP_NAME} y está protegido por la legislación colombiana
          vigente.
        </p>
      ),
    },
    {
      icon: AlertTriangle,
      title: "8. Limitación de Responsabilidad",
      content: (
        <p>
          {APP_NAME} no responde por lesiones, accidentes, riñas, daños a terceros ni situaciones
          derivadas del desarrollo del partido.
        </p>
      ),
    },
    {
      icon: Scale,
      title: "9. Modificaciones",
      content: (
        <p>
          {APP_NAME} podrá modificar estos términos en cualquier momento. Las modificaciones serán
          publicadas en la plataforma.
        </p>
      ),
    },
    {
      icon: Gavel,
      title: "10. Ley Aplicable y Jurisdicción",
      content: (
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia
          será resuelta ante los jueces competentes de Medellín.
        </p>
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
