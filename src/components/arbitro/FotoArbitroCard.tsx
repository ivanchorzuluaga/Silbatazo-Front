const FOTO_ANONIMA = "/arbitro-anonimo.png";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { cn } from "@/lib/utils";

interface FotoArbitroCardProps {
  arbitro: Arbitro;
  className?: string;
  backgroundSrc?: string;
  fotoOverrideSrc?: string;
  /** Si se pasa, se muestra solo este texto en la esquina superior derecha (sin calificación ni estrellas) */
  etiquetaSuperior?: string;
  mostrarCalificacion?: boolean;
  mostrarNombre?: boolean;
  nombreOverride?: string;
  nombreClassName?: string;
  nombreWrapperClassName?: string;
}

function obtenerNombre(arbitro: Arbitro): string {
  return arbitro.nombre_publico || arbitro.full_name || arbitro.username || "arbitro1";
}

function obtenerFoto(arbitro: Arbitro): string {
  if (arbitro.foto_perfil_thumb && arbitro.foto_perfil_thumb.trim() !== "") {
    return arbitro.foto_perfil_thumb;
  }
  if (arbitro.foto_perfil && arbitro.foto_perfil.trim() !== "") {
    return arbitro.foto_perfil;
  }
  return FOTO_ANONIMA;
}

function formatearId(arbitroId: number): string {
  return `#${String(arbitroId).padStart(3, "0")}`;
}

function clampCalificacion(valor: number): number {
  return Math.max(0, Math.min(5, valor));
}

function Estrella({ variante }: { variante: "llena" | "media" | "vacia" }) {
  const baseOpacity = variante === "llena" ? "opacity-100" : "opacity-25";
  return (
    <span className="relative inline-flex h-5 w-5">
      <img src="/Estrella.png" alt="" className={cn("h-5 w-5", baseOpacity)} aria-hidden="true" />
      {variante === "media" && (
        <span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <img src="/Estrella.png" alt="" className="h-5 w-5" aria-hidden />
        </span>
      )}
    </span>
  );
}

export function FotoArbitroCard({
  arbitro,
  className,
  backgroundSrc = "/Fondo.Limpio.png",
  fotoOverrideSrc,
  etiquetaSuperior,
  mostrarCalificacion = true,
  mostrarNombre = true,
  nombreOverride,
  nombreClassName,
  nombreWrapperClassName,
}: FotoArbitroCardProps) {
  const nombre = obtenerNombre(arbitro);
  const nombreMostrar = nombreOverride ?? nombre;
  const foto = fotoOverrideSrc || obtenerFoto(arbitro);
  const calificacion = clampCalificacion(arbitro.calificacion_promedio ?? 0);
  const estrellasLlenas = Math.floor(calificacion);
  const tieneMedia = calificacion - estrellasLlenas >= 0.5;
  const estrellasVacias = 5 - estrellasLlenas - (tieneMedia ? 1 : 0);

  return (
    <article
      className={cn(
        "relative w-full overflow-hidden rounded-3xl",
        "aspect-[1080/1350] shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
        className,
      )}
      aria-label={`Perfil de ${nombre}`}
    >
      <img
        src={backgroundSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover z-0"
        aria-hidden="true"
      />

      <div className="absolute left-6 top-6 z-20 text-white">
        <span className="text-md  tracking-[0.2em]">{formatearId(arbitro.id)}</span>
      </div>

      {(etiquetaSuperior != null || mostrarCalificacion) && (
        <div className="absolute right-4 top-7 z-20 flex items-center gap-2 text-white">
          {etiquetaSuperior != null ? (
            <span className="text-xs uppercase tracking-[0.2em] text-white font-bold">
              {etiquetaSuperior}
            </span>
          ) : (
            <>
              <span className="text-xs uppercase tracking-[0.2em] text-white font-bold">
                Calificación
              </span>
              <div
                className="flex items-center gap-1"
                aria-label={`Calificación ${calificacion} de 5`}
              >
                {Array.from({ length: estrellasLlenas }).map((_, index) => (
                  <Estrella key={`llena-${index}`} variante="llena" />
                ))}
                {tieneMedia && <Estrella variante="media" />}
                {Array.from({ length: estrellasVacias }).map((_, index) => (
                  <Estrella key={`vacia-${index}`} variante="vacia" />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center z-0">
        <img
          src="/Logo.png"
          alt=""
          className="h-56 w-56 opacity-20 blur-in-xs "
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img
          src={foto}
          alt={nombreMostrar}
          className="h-[100%] w-auto object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)] brightness-90"
          loading="lazy"
        />
      </div>

      {mostrarNombre && (
        <div
          className={cn("absolute bottom-10 inset-x-6 z-20 text-center", nombreWrapperClassName)}
        >
          <h2
            className={cn(
              "text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.8)]",
              nombreClassName,
            )}
          >
            {nombreMostrar}
          </h2>
        </div>
      )}
    </article>
  );
}
