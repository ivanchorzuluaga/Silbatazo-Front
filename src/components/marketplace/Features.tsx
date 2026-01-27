import { Shield, Clock, Users, Award, CheckCircle, Star, Zap, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Árbitros Certificados",
    description:
      "Todos nuestros árbitros cuentan con certificación oficial y amplia experiencia en diferentes categorías.",
    highlight: "100% verificados",
    color: "text-blue-500"
  },
  {
    icon: Zap,
    title: "Reserva Inmediata",
    description: "Confirma tu árbitro en minutos. Sistema de reservas rápido y sin complicaciones.",
    highlight: "En 5 minutos",
    color: "text-yellow-500"
  },
  {
    icon: Users,
    title: "Para Todo Evento",
    description: "Partidos amistosos, torneos, ligas amateur o eventos corporativos. Cubrimos todas tus necesidades.",
    highlight: "Todos los deportes",
    color: "text-green-500"
  },
  {
    icon: Award,
    title: "Garantía de Calidad",
    description: "Si no estás satisfecho con el servicio, te devolvemos el dinero. Sin preguntas.",
    highlight: "Satisfacción 100%",
    color: "text-purple-500"
  },
];

const stats = [
  {
    value: "98%",
    label: "Clientes satisfechos",
    icon: CheckCircle,
    color: "text-green-500"
  },
  {
    value: "24h",
    label: "Tiempo respuesta",
    icon: Clock,
    color: "text-blue-500"
  },
  {
    value: "4.9",
    label: "Calificación promedio",
    icon: Star,
    color: "text-yellow-500"
  },
  {
    value: "+500",
    label: "Partidos mensuales",
    icon: TrendingUp,
    color: "text-purple-500"
  }
];

export function Features() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.3))]" />
      <div className="absolute top-0 left-0 h-96 w-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
            <Star className="h-4 w-4" />
            Características principales
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            ¿Por qué elegir <span className="text-primary">Silbatazo</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Somos la plataforma líder en servicios de arbitraje deportivo. Calidad, profesionalismo y puntualidad
            garantizada en cada partido.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 bg-background rounded-xl border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Icon container */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>
              
              {/* Highlight badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-medium text-primary">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Números que hablan por sí solos</h3>
            <p className="text-muted-foreground">La confianza de nuestros clientes en cifras</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className={`p-3 bg-background rounded-xl border border-border/50`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 p-6 bg-card border border-border/50 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full border-2 border-background" />
                <div className="w-8 h-8 bg-secondary/20 rounded-full border-2 border-background" />
                <div className="w-8 h-8 bg-accent/20 rounded-full border-2 border-background" />
              </div>
              <span className="text-sm font-medium text-foreground">+50 árbitros activos</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-foreground">Garantía de calidad</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-foreground">Respuesta rápida</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
