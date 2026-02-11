import { FAQ_ITEMS } from "./faqData";

export function FaqSection() {
  return (
    <section id="faq" className="py-24 bg-background relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,rgba(255,255,255,0.8),rgba(255,255,255,0.2))]" />
      <div className="absolute -top-24 -right-24 h-80 w-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
            Resolvemos tus dudas rápido
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Todo lo que necesitas saber para reservar tu árbitro sin complicaciones.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
