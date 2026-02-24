import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { getArbitroDetailRoute } from "@/lib/constants";
import { getRefereeImage } from "@/lib/referee-images";

interface RefereeCardProps {
  arbitro: Arbitro;
}

function calcularEdad(fechaNacimiento?: string): number | null {
  if (!fechaNacimiento) return null;
  const [year, month, day] = fechaNacimiento.split("-").map(Number);
  if (!year || !month || !day) return null;

  const hoy = new Date();
  let edad = hoy.getFullYear() - year;
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();

  if (mesActual < month || (mesActual === month && diaActual < day)) {
    edad -= 1;
  }

  return edad >= 0 ? edad : null;
}

export function RefereeCard({ arbitro }: RefereeCardProps) {
  const rating = Math.max(0, Math.min(5, arbitro.calificacion_promedio || 0));
  const nombre =
    arbitro.nombre_publico || arbitro.full_name || arbitro.username;
  const experiencia = `${arbitro.experiencia_anos || 0} años exp.`;
  const edad = arbitro.edad ?? calcularEdad(arbitro.fecha_nacimiento);
  const estrellasLlenas = Math.round(rating);
  const imagen = getRefereeImage(
    arbitro.foto_perfil,
    arbitro.id,
    arbitro.experiencia_anos,
    nombre,
    arbitro.foto_perfil_thumb,
  );

  return (
    <Link
      to={getArbitroDetailRoute(arbitro.id)}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ contentVisibility: "auto", containIntrinsicSize: "300px 430px" }}
    >
      <article className="relative h-full min-h-[420px]">
        <div className="absolute -inset-2 rounded-3xl bg-primary/15 blur-2xl opacity-30" />

        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/15">
          <div className="absolute -inset-8 bg-gradient-to-br from-emerald-400/20 via-transparent to-indigo-500/20 blur-3xl" />
          <div className="grain-overlay" />

          <img
            src={imagen}
            alt={nombre}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallbackImages = [
                "/professional-soccer-referee-in-black-uniform-blowi.jpg",
                "/male-referee-in-black-uniform-portrait.jpg",
                "/placeholder.jpg",
              ];
              const currentSrc = target.src.split("/").pop() || "";
              const nextImage =
                fallbackImages.find(
                  (img) => !currentSrc.includes(img.split("/").pop() || ""),
                ) || "/placeholder.jpg";
              target.src = nextImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

          <div className="absolute inset-x-0 top-2 flex justify-center">
            <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1 backdrop-blur">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <Star
                  key={estrella}
                  className={`h-4 w-4 ${
                    estrella <= estrellasLlenas
                      ? "h-5 w-5 fill-amber-300 text-amber-300 drop-shadow-[0_0_14px_rgba(251,191,36,0.95)]"
                      : "text-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-3 flex flex-col gap-2">
            <div className="relative glow-shimmer mx-auto w-full overflow-hidden rounded-xl">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/90 via-emerald-400/90 to-emerald-600/90 shadow-[0_10px_30px_rgba(16,185,129,0.35)]" />
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25),transparent_60%)] opacity-70" />
              <h3 className="relative truncate rounded-xl px-3 py-1.5 text-center font-sans text-sm font-black uppercase tracking-[0.2em] text-black drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)] sm:text-base">
                {nombre}
              </h3>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/25 bg-black/60 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] backdrop-blur sm:text-sm">
              <span className="font-sans text-white/95 drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
                {edad ? `${edad} años` : "Edad no disponible"}
              </span>
              <span className="mx-2 h-4 w-px bg-white/45" />
              <span className="font-sans text-amber-200 drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
                {experiencia}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
