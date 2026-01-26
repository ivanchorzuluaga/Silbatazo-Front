/**
 * Componente para mostrar disponibilidades de árbitro
 * Formato compacto e inline
 */

import type { DisponibilidadArbitro } from "../types/arbitro.types";

/**
 * Formatea una hora a formato HH:MM (sin segundos)
 */
function formatHora(hora: string): string {
  if (hora && hora.length === 5 && hora.includes(":")) {
    return hora;
  }
  if (hora && hora.includes(":")) {
    return hora.substring(0, 5);
  }
  return hora;
}

interface DisponibilidadDisplayProps {
  disponibilidades: DisponibilidadArbitro[];
}

/**
 * Muestra toda la información en formato texto continuo, muy discreto y compacto
 */
export function DisponibilidadDisplay({ disponibilidades }: DisponibilidadDisplayProps) {
  if (!disponibilidades || disponibilidades.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Sin horarios configurados</p>
      </div>
    );
  }

  const ordenDias: Record<string, number> = {
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
    domingo: 7,
  };

  const abreviacionesDias: Record<string, string> = {
    lunes: "Lun",
    martes: "Mar",
    miercoles: "Mié",
    jueves: "Jue",
    viernes: "Vie",
    sabado: "Sáb",
    domingo: "Dom",
  };

  const porDia: Record<string, DisponibilidadArbitro[]> = {};
  disponibilidades.forEach((disp) => {
    if (!porDia[disp.dia_semana]) {
      porDia[disp.dia_semana] = [];
    }
    porDia[disp.dia_semana].push(disp);
  });

  const diasOrdenados = Object.keys(porDia).sort(
    (a, b) => (ordenDias[a] || 99) - (ordenDias[b] || 99)
  );

  return (
    <div className="text-xs text-muted-foreground leading-relaxed">
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-baseline">
        {diasOrdenados.map((dia, idx) => {
          const disps = porDia[dia];
          return (
            <span key={dia} className="inline-flex items-baseline gap-1">
              {idx > 0 && <span className="text-muted-foreground/40">•</span>}
              <span className="font-medium text-foreground/70">{abreviacionesDias[dia]}</span>
              <span className="flex flex-wrap gap-x-1.5">
                {disps.map((disp, dispIdx) => (
                  <span key={disp.id} className="font-mono">
                    {formatHora(disp.hora_inicio)}-{formatHora(disp.hora_fin)}
                    {dispIdx < disps.length - 1 && <span className="text-muted-foreground/50">,</span>}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
