/**
 * Página de Política de Reembolso
 * Diseño moderno con gradientes y glassmorphism
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  CreditCard,
  HelpCircle,
  FileText,
  Mail,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import logoImage from "@/assets/Logo.png";

export function PoliticaReembolsoPage() {
  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const refundCards = [
    {
      icon: CheckCircle,
      title: "Reembolso Total",
      subtitle: "100%",
      description: "Cancelación 48+ horas antes del evento",
      color: "from-green-500/20 to-green-600/10",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
    },
    {
      icon: Clock,
      title: "Reembolso Parcial",
      subtitle: "50%",
      description: "Cancelación 24-48 horas antes",
      color: "from-yellow-500/20 to-yellow-600/10",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-400",
    },
    {
      icon: XCircle,
      title: "Sin Reembolso",
      subtitle: "0%",
      description: "Cancelación menos de 24 horas antes",
      color: "from-red-500/20 to-red-600/10",
      borderColor: "border-red-500/30",
      iconColor: "text-red-400",
    },
    {
      icon: AlertCircle,
      title: "Casos Especiales",
      subtitle: "100%",
      description: "Cancelación por el árbitro",
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
  ];

  const sections = [
    {
      icon: RefreshCw,
      title: "1. Política General",
      content: (
        <p>
          En {APP_NAME} entendemos que pueden surgir imprevistos. Nuestra política de reembolso está
          diseñada para ser justa tanto para los clientes como para los árbitros, protegiendo los
          intereses de ambas partes.
        </p>
      ),
    },
    {
      icon: Scale,
      title: "2. Cancelaciones por el Cliente",
      content: (
        <>
          <div className="space-y-6">
            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h3 className="text-lg font-medium text-green-400 mb-2">
                2.1 Más de 48 horas antes del evento
              </h3>
              <p>
                Si cancela su reserva con más de 48 horas de anticipación al inicio del evento,
                recibirá un <strong className="text-white">reembolso del 100%</strong> del monto
                pagado.
              </p>
            </div>

            <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <h3 className="text-lg font-medium text-yellow-400 mb-2">
                2.2 Entre 24 y 48 horas antes del evento
              </h3>
              <p>
                Las cancelaciones realizadas entre 24 y 48 horas antes del evento recibirán un{" "}
                <strong className="text-white">reembolso del 50%</strong> del monto pagado. El 50%
                restante se destinará al árbitro como compensación por el tiempo reservado.
              </p>
            </div>

            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <h3 className="text-lg font-medium text-red-400 mb-2">
                2.3 Menos de 24 horas antes del evento
              </h3>
              <p>
                Las cancelaciones realizadas con menos de 24 horas de anticipación
                <strong className="text-white"> no son elegibles para reembolso</strong>. El monto
                total se transferirá al árbitro.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: AlertCircle,
      title: "3. Cancelaciones por el Árbitro",
      content: (
        <>
          <p className="mb-4">
            Si el árbitro cancela la reserva por cualquier motivo, el cliente recibirá un{" "}
            <strong className="text-white">reembolso del 100%</strong>, independientemente del
            tiempo de anticipación.
          </p>
          <p className="mb-4">
            Además, {APP_NAME} hará todo lo posible por encontrar un árbitro de reemplazo sin costo
            adicional para el cliente.
          </p>
          <p className="text-white/50 italic">
            Nota: Los árbitros que cancelen repetidamente pueden estar sujetos a penalizaciones o
            suspensión de la plataforma.
          </p>
        </>
      ),
    },
    {
      icon: HelpCircle,
      title: "4. Circunstancias Excepcionales",
      content: (
        <>
          <p className="mb-4">
            En casos de fuerza mayor (desastres naturales, emergencias médicas documentadas,
            restricciones gubernamentales), evaluaremos cada caso individualmente para determinar la
            elegibilidad del reembolso.
          </p>
          <p>
            Para solicitar una excepción, debe proporcionar documentación de respaldo dentro de las
            72 horas siguientes al evento programado.
          </p>
        </>
      ),
    },
    {
      icon: XCircle,
      title: "5. No Show del Árbitro",
      content: (
        <>
          <p className="mb-4">
            Si un árbitro no se presenta al evento sin aviso previo, el cliente recibirá un{" "}
            <strong className="text-white">reembolso del 100%</strong>. Adicionalmente:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>El árbitro será penalizado según nuestras políticas internas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>El cliente podrá recibir un crédito adicional para futuras reservas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>{APP_NAME} ayudará a encontrar un reemplazo de emergencia si es posible.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: CreditCard,
      title: "6. Proceso de Reembolso",
      content: (
        <>
          <p className="mb-4">Una vez aprobado el reembolso:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Tarjetas de crédito/débito:</strong> El reembolso se
                procesará en 5-10 días hábiles, dependiendo de su banco.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Transferencia bancaria:</strong> El reembolso se
                realizará en 3-5 días hábiles.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Crédito en la plataforma:</strong> Disponible
                inmediatamente para usar en futuras reservas.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: FileText,
      title: "7. Cómo Solicitar un Reembolso",
      content: (
        <>
          <p className="mb-4">Para solicitar un reembolso:</p>
          <ol className="space-y-2 mb-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                1
              </span>
              <span>Inicie sesión en su cuenta de {APP_NAME}.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                2
              </span>
              <span>Vaya a "Mis Partidos" y seleccione el partido a cancelar.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                3
              </span>
              <span>Haga clic en "Solicitar Cancelación" y siga las instrucciones.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                4
              </span>
              <span>Recibirá una confirmación por correo electrónico.</span>
            </li>
          </ol>
          <p>
            También puede contactarnos directamente en{" "}
            <a
              href="mailto:soporte@silbatazo.com"
              className="text-primary hover:underline font-medium"
            >
              soporte@silbatazo.com
            </a>
          </p>
        </>
      ),
    },
    {
      icon: Scale,
      title: "8. Disputas",
      content: (
        <p>
          Si no está de acuerdo con una decisión de reembolso, puede presentar una disputa dentro de
          los 30 días siguientes. Nuestro equipo revisará el caso y tomará una decisión final en un
          plazo de 10 días hábiles.
        </p>
      ),
    },
    {
      icon: FileText,
      title: "9. Cambios en la Política",
      content: (
        <p>
          Nos reservamos el derecho de modificar esta política de reembolso en cualquier momento.
          Los cambios no afectarán las reservas existentes realizadas antes de la fecha de
          modificación.
        </p>
      ),
    },
    {
      icon: Mail,
      title: "10. Contacto",
      content: (
        <p>
          Para preguntas sobre reembolsos, contáctenos en:{" "}
          <a
            href="mailto:soporte@silbatazo.com"
            className="text-primary hover:underline font-medium"
          >
            soporte@silbatazo.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-background" />

      {/* Efectos de luz decorativos */}
      <div className="fixed top-0 left-1/3 h-96 w-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="fixed bottom-0 right-1/3 h-96 w-96 bg-primary/10 rounded-full blur-[128px]" />
      <div className="fixed top-1/2 right-0 h-64 w-64 bg-emerald-500/10 rounded-full blur-[100px]" />

      {/* Logo de fondo estático */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={logoImage}
          alt=""
          className="w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] object-contain opacity-[0.03]"
        />
      </div>

      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/#contacto">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary backdrop-blur-sm mb-6">
            <RefreshCw className="w-4 h-4" />
            Política de Devoluciones
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Política de Reembolso</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Última actualización: Enero 2026
          </p>
        </div>

        {/* Resumen Visual de Reembolsos */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {refundCards.map((card, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${card.color} backdrop-blur-md rounded-2xl border ${card.borderColor} p-5 hover:scale-105 transition-all duration-300`}
            >
              <card.icon className={`w-8 h-8 ${card.iconColor} mb-3`} />
              <h3 className="font-semibold text-white text-lg">{card.title}</h3>
              <p className={`text-2xl font-bold ${card.iconColor} mb-1`}>{card.subtitle}</p>
              <p className="text-white/60 text-sm">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Secciones */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl flex-shrink-0">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
                  <div className="text-white/70 leading-relaxed">{section.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">© 2026 {APP_NAME}. Todos los derechos reservados.</p>
        </div>
      </main>
    </div>
  );
}
