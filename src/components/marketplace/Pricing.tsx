import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { WHATSAPP_RESERVA_MESSAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function formatCopValor(valor: number): string {
  return `$${Math.round(valor).toLocaleString("es-CO")}`;
}

function formatCopRango(min: number, max: number): string {
  if (Math.round(min) === Math.round(max)) return formatCopValor(min);
  return `${formatCopValor(min)} – ${formatCopValor(max)}`;
}

function gastoPorJugador(monto: number, jugadoresMin: number, jugadoresMax?: number): string {
  const max = jugadoresMax ?? jugadoresMin;
  const minPorJugador = monto / Math.max(max, 1);
  const maxPorJugador = monto / Math.max(jugadoresMin, 1);
  return formatCopRango(minPorJugador, maxPorJugador);
}

interface PricingPlan {
  servicio: string;
  subtitulo: string;
  incluye: string;
  valor: number;
  jugadoresMin: number;
  jugadoresMax?: number;
  idealPara: string;
  destacado?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    servicio: "7–8 vs 7–8",
    subtitulo: "Cancha reducida · Partido corto",
    incluye: "Ideal para amistosos y ligas rápidas en cancha reducida.",
    valor: 60000,
    jugadoresMin: 14,
    jugadoresMax: 16,
    idealPara: "Partidos recreativos",
  },
  {
    servicio: "9–10 vs 9–10",
    subtitulo: "Fútbol 9/10 · Muy común en torneos",
    incluye: "Para torneos y ligas: buen equilibrio de ritmo y espacio.",
    valor: 80000,
    jugadoresMin: 18,
    jugadoresMax: 20,
    idealPara: "La opción más solicitada",
    destacado: true,
  },
  {
    servicio: "11 vs 11 (Central)",
    subtitulo: "Fútbol 11 completo",
    incluye: "Partido completo con árbitro central.",
    valor: 90000,
    jugadoresMin: 22,
    idealPara: "Liga tradicional",
  },
  {
    servicio: "11 vs 11 (Central + 2 asistentes)",
    subtitulo: "Mayor cobertura en cancha",
    incluye: "Ideal para partidos más exigentes: central + asistentes.",
    valor: 180000,
    jugadoresMin: 22,
    idealPara: "Competencia de alto nivel",
  },
];

function jugadoresLabel(jugadoresMin: number, jugadoresMax?: number): string {
  if (!jugadoresMax) return `${jugadoresMin} jugadores`;
  return `${jugadoresMin}–${jugadoresMax} jugadores`;
}

interface PricingCardProps {
  plan: PricingPlan;
}

function PricingCard({ plan }: PricingCardProps) {
  const aporte = gastoPorJugador(plan.valor, plan.jugadoresMin, plan.jugadoresMax);

  return (
    <article
      className={cn(
        "relative flex h-full min-h-[22rem] flex-col rounded-2xl border p-5 sm:p-6 transition-shadow",
        plan.destacado
          ? "border-emerald-500/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/25 dark:border-emerald-400/50 dark:bg-emerald-500/[0.08] dark:ring-emerald-400/30"
          : "border-border/60 bg-card/80 hover:border-border hover:shadow-md",
      )}
    >
      {plan.destacado ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex rounded-full border border-emerald-600/50 bg-emerald-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:border-emerald-400/60 dark:bg-emerald-500 dark:text-emerald-950">
          Recomendado
        </span>
      ) : null}

      <header className="min-h-[4.25rem] pt-1">
        <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">{plan.servicio}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{plan.subtitulo}</p>
      </header>

      <div
        className={cn(
          "mt-5 rounded-xl border px-4 py-4 text-center",
          plan.destacado
            ? "border-emerald-500/35 bg-emerald-500/15 dark:border-emerald-400/40 dark:bg-emerald-500/15"
            : "border-border/50 bg-muted/40",
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Valor por partido
        </p>
        <p
          className={cn(
            "mt-1 text-3xl font-bold tabular-nums tracking-tight sm:text-[2rem]",
            plan.destacado
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-foreground",
          )}
        >
          {formatCopValor(plan.valor)}
        </p>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-4">
        <div className="rounded-xl border border-border/50 bg-background/30 px-4 py-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Aporte por jugador
          </p>
          <p className="mt-1.5 text-sm font-semibold tabular-nums text-foreground">≈ {aporte}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {jugadoresLabel(plan.jugadoresMin, plan.jugadoresMax)}
          </p>
        </div>

        <div className="min-h-[4.5rem] flex-1 rounded-xl border border-border/50 bg-background/20 px-4 py-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Incluye
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground/85">{plan.incluye}</p>
        </div>
      </div>

      <p className="mt-4 border-t border-border/40 pt-4 text-center text-xs font-medium text-amber-800 dark:text-amber-300">
        Ideal para: {plan.idealPara}
      </p>
    </article>
  );
}

export function Pricing() {
  return (
    <section
      id="precios"
      className="relative overflow-hidden bg-linear-to-b from-primary to-background py-16 sm:py-24"
    >
      <div className="absolute inset-0 bg-grid-white/10 opacity-20 mask-[linear-gradient(to-bottom,transparent,black,transparent)]" />
      <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-900 dark:text-emerald-400">
            Tarifas orientativas
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Precios de referencia de arbitraje
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
            Valores de guía antes de escribirnos. El precio final lo confirmamos por WhatsApp según
            municipio, horario y tipo de partido.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/90 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-border/50 bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
            <p className="text-sm text-foreground/85">
              Todos los valores son <span className="font-semibold text-foreground">por partido</span>{" "}
              e incluyen gestión y coordinación del equipo Silbatazo.
            </p>
            <WhatsAppButton
              variant="link"
              message={WHATSAPP_RESERVA_MESSAGE}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-3 py-1.5 text-xs font-medium text-emerald-900 no-underline hover:bg-emerald-600/15 hover:text-emerald-950 hover:no-underline dark:border-emerald-500/35 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:text-emerald-100 [&_svg]:text-[#25D366]"
            >
              Confirmación por WhatsApp
            </WhatsAppButton>
          </div>

          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.servicio} plan={plan} />
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-border/50 bg-muted/25 p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                Cómo leer estos precios
              </h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-6">
                {[
                  "El monto destacado es el costo total del arbitraje por partido.",
                  "El aporte por jugador es una estimación para repartir entre el equipo.",
                  "El valor final puede variar según cancha, horario y municipio.",
                ].map((texto, i) => (
                  <li key={i} className="flex gap-3 text-xs leading-relaxed text-foreground/80 sm:text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>{texto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-emerald-600/25 bg-emerald-600/10 px-5 py-5 sm:flex-row sm:px-6 dark:border-emerald-500/25 dark:bg-emerald-500/10">
              <p className="text-center text-sm text-foreground/90 sm:text-left">
                ¿Ya tienes claro el tipo de partido? Escríbenos y te damos el valor exacto.
              </p>
              <WhatsAppButton size="default" message={WHATSAPP_RESERVA_MESSAGE} className="shrink-0">
                Consultar por WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          <div className="border-t border-border/50 bg-muted/20 px-5 py-4 text-center text-[11px] text-muted-foreground sm:px-8 sm:text-xs">
            *Valores referenciales. El precio definitivo se confirma al coordinar tu reserva por
            WhatsApp.
          </div>
        </div>
      </div>
    </section>
  );
}
