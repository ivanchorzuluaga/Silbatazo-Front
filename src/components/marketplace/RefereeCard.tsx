import { Link } from "react-router-dom";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import { getArbitroDetailRoute } from "@/lib/constants";
import { FotoArbitroCard } from "@/components/arbitro/FotoArbitroCard";

interface RefereeCardProps {
  arbitro: Arbitro;
}

export function RefereeCard({ arbitro }: RefereeCardProps) {
  return (
    <Link
      to={getArbitroDetailRoute(arbitro.id)}
      className="block h-full w-[360px] max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ contentVisibility: "auto", containIntrinsicSize: "360px 450px" }}
    >
      <article className="relative h-full min-h-[420px]">
        <div className="absolute -inset-2 rounded-3xl bg-primary/15 blur-2xl opacity-30" />
        <FotoArbitroCard arbitro={arbitro} className="w-full" />
      </article>
    </Link>
  );
}
