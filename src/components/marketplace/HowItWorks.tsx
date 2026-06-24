import { Link } from "react-router-dom";
import { Search, Handshake, ArrowRight } from "lucide-react";
import { ROUTES, WHATSAPP_RESERVA_MESSAGE } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";
import { useLandingStats } from "@/features/marketplace/hooks/useLandingStats";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function HowItWorks() {
  const { stats } = useLandingStats();
  const arbitrosLabel =
    stats && stats.arbitros_total > 0
      ? `${stats.arbitros_total} árbitros garantizados`
      : "Árbitros garantizados";

  const steps = [
    {
      number: "01",
      title: "Explora árbitros",
      description:
        "Revisa perfiles, experiencia y zonas de cobertura. Elige el que más se ajuste a tu partido.",
      icon: Search,
      action: "Ver árbitros",
      to: ROUTES.ARBITROS,
      details: [arbitrosLabel, "Perfiles verificados", "Filtros por municipio"],
    },
    {
      number: "02",
      title: "Escríbenos por WhatsApp",
      description:
        "Cuéntanos fecha, hora, municipio y tipo de partido. Nosotros coordinamos disponibilidad y confirmamos contigo.",
      action: "Abrir WhatsApp",
      whatsapp: true,
      details: [
        "Mismo número para todas las reservas",
        "Sin registro en la web",
        "Respuesta del equipo Silbatazo",
      ],
    },
    {
      number: "03",
      title: "Nosotros gestionamos todo",
      description:
        "Asignamos el árbitro ideal, acordamos el valor y te indicamos cómo pagar. Tú te enfocas en jugar.",
      icon: Handshake,
      action: "Coordinación humana",
      disabled: true,
      details: [
        "Confirmación por WhatsApp",
        "Pago acordado con el equipo",
        "Acompañamiento hasta el partido",
      ],
    },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-primary relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-grid-white/5 mask-[linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.3))]" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-black/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/10 backdrop-blur-sm rounded-full text-sm font-medium text-black mb-6">
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Reserva asistida por nuestro equipo
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-black">¿Cómo Funciona?</h2>
          <p className="text-black/70 text-lg max-w-3xl mx-auto">
            Sin cuentas ni pagos en la web. Miras los árbitros, nos escribes por WhatsApp y nosotros
            hacemos el resto.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-black/20 -z-10" />
              )}

              <div className="relative h-full p-6 bg-white/30 backdrop-blur-md rounded-xl border border-white/40 shadow-lg hover:bg-white/40 hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.number}
                </div>

                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#25D366] rounded-lg shadow-sm group-hover:bg-[#20BD5A] transition-colors">
                    {step.whatsapp ? (
                      <WhatsAppIcon className="w-8 h-8 text-white" />
                    ) : (
                      step.icon && <step.icon className="w-6 h-6 text-black" />
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-3 text-black text-center">{step.title}</h3>
                <p className="text-black/70 text-sm leading-relaxed mb-4 text-center">
                  {step.description}
                </p>

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

                {step.whatsapp ? (
                  <WhatsAppButton
                    size="sm"
                    className="w-full justify-center"
                    message={WHATSAPP_RESERVA_MESSAGE}
                  >
                    {step.action}
                  </WhatsAppButton>
                ) : step.to && !step.disabled ? (
                  <Link
                    to={step.to}
                    className="w-full py-2 px-3 bg-black/10 hover:bg-black/20 rounded-lg text-xs font-medium text-black transition-colors flex items-center justify-center gap-1"
                  >
                    {step.action}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <div className="w-full py-2 px-3 bg-black/5 rounded-lg text-[11px] font-medium text-black/55 flex items-center justify-center">
                    {step.action}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-6 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-black mb-1">¿Listo para tu partido?</h3>
              <p className="text-black/70 text-sm">
                Escríbenos y te ayudamos a conseguir el árbitro ideal
              </p>
            </div>
            <WhatsAppButton size="lg" message={WHATSAPP_RESERVA_MESSAGE}>
              Reservar por WhatsApp
            </WhatsAppButton>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-black/70 text-sm">
            <div className="w-2 h-2 bg-gray-500 rounded-full" />
            Sin registro obligatorio
          </div>
          <div className="flex items-center gap-2 text-black/70 text-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
            Coordinación por WhatsApp
          </div>
          <div className="flex items-center gap-2 text-black/70 text-sm">
            <div className="w-2 h-2 bg-amber-600 rounded-full" />
            Pagos acordados con el equipo
          </div>
        </div>
      </div>
    </section>
  );
}
