import { Search, Calendar, CreditCard, Trophy, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Busca y Elige",
      description: "Explora nuestro catálogo de árbitros certificados y filtra por deporte, experiencia y ubicación.",
      icon: Search,
      action: "Explorar árbitros",
      details: ["Más de 50 árbitros", "Filtros avanzados", "Perfiles verificados"]
    },
    {
      number: "02",
      title: "Configura tu Partido",
      description: "Define fecha, hora, lugar y categoría. Revisa disponibilidad en tiempo real.",
      icon: Calendar,
      action: "Ver disponibilidad",
      details: ["Calendario interactivo", "Confirmación instantánea", "Notificaciones automáticas"]
    },
    {
      number: "03",
      title: "Paga Seguro",
      description: "Realiza el pago a través de nuestra plataforma segura con múltiples métodos de pago.",
      icon: CreditCard,
      action: "Métodos de pago",
      details: ["Pago seguro", "Nequi disponible", "Facturación automática"]
    },
    {
      number: "04",
      title: "¡Juega y Califica!",
      description: "El árbitro llegará puntual. Disfruta del partido y califica el servicio.",
      icon: Trophy,
      action: "Ver testimonios",
      details: ["Árbitro puntual", "Calificación post-partido", "Garantía de calidad"]
    },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden scroll-mt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.3))]" />
      <div className="absolute top-0 right-0 h-96 w-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Proceso simple y rápido
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
            ¿Cómo Funciona?
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Reservar un árbitro profesional nunca fue tan fácil. Completa todo el proceso en menos de 5 minutos.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-white/20 -z-10" />
              )}
              
              {/* Step card */}
              <div className="relative h-full p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                {/* Step number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="font-semibold text-lg mb-3 text-white text-center">
                  {step.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4 text-center">
                  {step.description}
                </p>
                
                {/* Details list */}
                <div className="space-y-2 mb-4">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center gap-2 text-xs text-white/70">
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
                
                {/* Action button */}
                <button className="w-full py-2 px-3 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium text-white transition-colors flex items-center justify-center gap-1 group-hover:bg-white/25 cursor-pointer">
                  {step.action}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-semibold text-white mb-1">
                ¿Listo para reservar tu árbitro?
              </h3>
              <p className="text-white/80 text-sm">
                Únete a más de 500 clientes satisfechos
              </p>
            </div>
            <button className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl cursor-pointer">
              Comenzar Ahora
              <ArrowRight className="inline-block w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            Sin costo de registro
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            Soporte 24/7
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            Cancelación gratuita
          </div>
        </div>
      </div>
    </section>
  );
}
