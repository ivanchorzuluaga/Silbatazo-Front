import { CheckCircle } from "lucide-react";

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
  return `≈ ${formatCopRango(minPorJugador, maxPorJugador)}`;
}

export function Pricing() {
  return (
    <section
      id="precios"
      className="relative py-16 sm:py-20 bg-linear-to-b from-primary to-background overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white/10 opacity-20 mask-[linear-gradient(to-bottom,transparent,black,transparent)]" />
      <div className="absolute -top-24 right-0 h-56 w-56 bg-emerald-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 left-0 h-64 w-64 bg-amber-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
            Precios de referencia de arbitraje
          </h2>
          <p className="mt-3 text-sm sm:text-base text-black/70">
            Valores orientativos para que tengas claridad antes de solicitar un árbitro. Pueden
            variar según duración, nivel de competencia, horario y municipio.
          </p>
        </div>

        <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-3 border-b border-white/60 bg-white/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-left">
              <p className="text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                Servicios de arbitraje
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Incluye comisión y gestión por la app.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-200">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-800">
                Pagos 100% seguros con Silbatazo
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-white/80 text-slate-600">
                  <th className="px-4 sm:px-6 py-3 font-semibold">Tipo de servicio</th>
                  <th className="px-4 sm:px-6 py-3 font-semibold hidden sm:table-cell">Incluye</th>
                  <th className="px-4 sm:px-6 py-3 font-semibold text-right whitespace-nowrap">
                    Valor aprox
                  </th>
                  <th className="px-4 sm:px-6 py-3 font-semibold text-right whitespace-nowrap">
                    Gasto aprox / jugador
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 sm:px-6 py-4 align-top">
                    <p className="font-semibold text-slate-900">7–8 vs 7–8</p>
                    <p className="mt-1 text-xs text-slate-500 sm:hidden">
                      Cancha reducida · Partido corto
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top hidden sm:table-cell">
                    <p className="text-xs text-slate-600">
                      Ideal para amistosos y ligas rápidas en cancha reducida.
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatCopValor(60000)}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-700 font-semibold">
                      Por partido
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {gastoPorJugador(60000, 14, 16)}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                      14–16 jugadores
                    </p>
                  </td>
                </tr>

                <tr className="bg-slate-50/60">
                  <td className="px-4 sm:px-6 py-4 align-top">
                    <p className="font-semibold text-slate-900">9–10 vs 9–10</p>
                    <p className="mt-1 text-xs text-slate-500 sm:hidden">
                      Fútbol 9/10 · Muy común en torneos
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top hidden sm:table-cell">
                    <p className="text-xs text-slate-600">
                      Para torneos y ligas: buen equilibrio de ritmo y espacio.
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatCopValor(80000)}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-700 font-semibold">
                      Por partido
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {gastoPorJugador(80000, 18, 20)}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                      18–20 jugadores
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="px-4 sm:px-6 py-4 align-top">
                    <p className="font-semibold text-slate-900">11 vs 11 (Central)</p>
                    <p className="mt-1 text-xs text-slate-500 sm:hidden">Fútbol 11 completo</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top hidden sm:table-cell">
                    <p className="text-xs text-slate-600">
                      Partido completo con árbitro central.
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatCopValor(90000)}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-700 font-semibold">
                      Por partido
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {gastoPorJugador(90000, 22)}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                      22 jugadores
                    </p>
                  </td>
                </tr>

                <tr className="bg-slate-50/60">
                  <td className="px-4 sm:px-6 py-4 align-top">
                    <p className="font-semibold text-slate-900">
                      11 vs 11 (Central + 2 asistentes)
                    </p>
                    <p className="mt-1 text-xs text-slate-500 sm:hidden">
                      Mayor cobertura en cancha
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top hidden sm:table-cell">
                    <p className="text-xs text-slate-600">
                      Ideal para partidos más exigentes: central + asistentes.
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatCopValor(180000)}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-700 font-semibold">
                      Por partido
                    </p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {gastoPorJugador(180000, 22)}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
                      22 jugadores
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-3 bg-white/70 border-t border-white/60 text-[11px] sm:text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
            <p>
              *Valores referenciales. Pueden cambiar según municipio, tipo de cancha, horario
              (diurno/nocturno) y nivel del torneo.
            </p>
            <p className="font-medium">El precio exacto se confirma al crear tu partido en la app.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

