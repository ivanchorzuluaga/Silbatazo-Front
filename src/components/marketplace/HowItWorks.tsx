import { Link } from "react-router-dom";
import { Search, Calendar, CreditCard, Trophy, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useLandingStats } from "@/features/marketplace/hooks/useLandingStats";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function HowItWorks() {
  const { stats } = useLandingStats();
  const arbitrosLabel =
    stats && stats.arbitros_total > 0
      ? `${stats.arbitros_total} árbitros certificados`
      : "Árbitros certificados";

  const steps = [
    {
      number: "01",
      title: "Busca y Elige",
      description:
        "Explora nuestro catálogo de árbitros certificados y filtra por deporte, experiencia y ubicación.",
      icon: Search,
      action: "Explorar árbitros",
      to: ROUTES.ARBITROS,
      details: [arbitrosLabel, "Filtros avanzados", "Perfiles verificados"],
    },
    {
      number: "02",
      title: "Configura tu Partido",
      description:
        "Desde tu cuenta de cliente puedes crear partidos, definir fecha, hora, lugar y categoría.",
      icon: Calendar,
      action: "Iniciar sesión o registrarse",
      to: ROUTES.LOGIN,
      details: [
        "Requiere iniciar sesión",
        "Creación de partidos desde tu panel",
        "Confirmación y notificaciones",
      ],
    },
    {
      number: "03",
      title: "Paga Seguro",
      description:
        "Realiza el pago a través de nuestra plataforma segura con múltiples métodos de pago.",
      icon: CreditCard,
      action: "Métodos de pago",
      to: "/#metodos-de-pago",
      details: ["Bancolombia", "Otros bancos", "Nequi + QR"],
    },
    {
      number: "04",
      title: "¡Juega y Califica!",
      description:
        "Después del partido, desde tu cuenta podrás calificar al árbitro y ver tus calificaciones.",
      icon: Trophy,
      action: "Disponible después del partido",
      disabled: true,
      details: ["Árbitro puntual", "Calificación post-partido", "Garantía de calidad"],
    },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-primary relative overflow-hidden scroll-mt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.3))]" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-black/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/10 backdrop-blur-sm rounded-full text-sm font-medium text-black mb-6">
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Proceso simple y rápido
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-black">
            ¿Cómo Funciona?
          </h2>
          <p className="text-black/70 text-lg max-w-3xl mx-auto">
            Reservar un árbitro de calidad nunca fue tan fácil. Completa todo el proceso en menos de
            5 minutos.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-black/20 -z-10" />
              )}

              {/* Step card */}
              <div className="relative h-full p-6 bg-white/30 backdrop-blur-md rounded-xl border border-white/40 shadow-lg hover:bg-white/40 hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-black/10 rounded-lg group-hover:bg-black/20 transition-colors">
                    <step.icon className="w-6 h-6 text-black" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg mb-3 text-black text-center">{step.title}</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-4 text-center">
                  {step.description}
                </p>

                {/* Details list */}
                <div className="space-y-2 mb-4">
                  {step.details.map((detail, detailIndex) => (
                    <div
                      key={detailIndex}
                      className="flex items-center gap-2 text-xs text-black/60"
                    >
                      <div className="w-1.5 h-1.5 bg-black/50 rounded-full" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Action button / hint */}
                {step.to && !step.disabled ? (
                  <Link
                    to={step.to}
                    className="w-full py-2 px-3 bg-black/10 hover:bg-black/20 rounded-lg text-xs font-medium text-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {step.action}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <div className="w-full py-2 px-3 bg-black/5 rounded-lg text-[11px] font-medium text-black/55 flex items-center justify-center gap-1 cursor-default">
                    {step.action}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Métodos de pago */}
        <div
          id="metodos-de-pago"
          className="scroll-mt-24 rounded-3xl border border-white/35 bg-white/25 backdrop-blur-md p-6 sm:p-8 shadow-lg mb-10 sm:mb-14"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-black">Métodos de pago</h3>
              <p className="text-black/70">
                Elige el método que más te sirva. Si no ves el tuyo, pregúntanos.
              </p>
            </div>
            <WhatsAppButton
              size="sm"
              className="w-full sm:w-auto justify-center"
              message="Hola, ¿qué métodos de pago tienen disponibles para reservar un árbitro?"
            >
              Preguntar por WhatsApp
            </WhatsAppButton>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/35 bg-white/25 backdrop-blur-md px-4 py-4">
              <p className="text-sm font-semibold text-black">Transferencias Bancolombia</p>
              <p className="text-xs text-black/70 mt-1">Cuenta y referencia del partido</p>
            </div>
            <div className="rounded-2xl border border-white/35 bg-white/25 backdrop-blur-md px-4 py-4">
              <p className="text-sm font-semibold text-black">Otros bancos</p>
              <p className="text-xs text-black/70 mt-1">Transferencia interbancaria</p>
            </div>
            <div className="rounded-2xl border border-white/35 bg-white/25 backdrop-blur-md px-4 py-4">
              <p className="text-sm font-semibold text-black">Nequi</p>
              <p className="text-xs text-black/70 mt-1">Pago rápido y verificación</p>
            </div>
            <div className="rounded-2xl border border-white/35 bg-white/25 backdrop-blur-md px-4 py-4">
              <p className="text-sm font-semibold text-black">QR</p>
              <p className="text-xs text-black/70 mt-1">Escanea y paga en segundos</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-6 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-black mb-1">
                ¿Listo para reservar tu árbitro?
              </h3>
              <p className="text-black/70 text-sm">Únete a más de 500 clientes satisfechos</p>
            </div>
            <Link
              to={ROUTES.ARBITROS}
              className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition-colors shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center"
            >
              Comenzar Ahora
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-black/70 text-sm">
            <div className="w-2 h-2 bg-green-600 rounded-full" />
            Sin costo de registro
          </div>
          <div className="flex items-center gap-2 text-black/70 text-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            Soporte 24/7
          </div>
          <div className="flex items-center gap-2 text-black/70 text-sm">
            <div className="w-2 h-2 bg-amber-600 rounded-full" />
            Cancelación gratuita
          </div>
        </div>
      </div>
    </section>
  );
}
