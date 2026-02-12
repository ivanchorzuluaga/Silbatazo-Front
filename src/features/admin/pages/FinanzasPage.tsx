/**
 * Página de finanzas (admin)
 * Resumen simple de caja, comisión y saldo de árbitros
 */

import { PageLayout } from "@/components/layout";
import { useAdminDashboardStats } from "../hooks/useAdminDashboardStats";
import { ROUTES } from "@/lib/constants";
import { formatCop } from "@/lib/utils";
import { Wallet, TrendingUp, Users, AlertCircle } from "lucide-react";

export function FinanzasPage() {
  const { stats, isLoading, error } = useAdminDashboardStats();

  return (
    <PageLayout
      title="Finanzas"
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      contentClassName="page-surface space-y-8"
    >
      <div className="card-surface-strong p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Finanzas</h1>
            <p className="text-muted-foreground">
              Resumen de caja, comisión fija y saldo de árbitros.
            </p>
          </div>
          <div className="rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold">
            Comisión fija: $10.000 por partido completado
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-destructive" />
            <div>
              <p className="text-sm text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground">
                Reintenta más tarde o verifica la conexión.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Caja total</p>
              <p className="text-2xl font-semibold text-emerald-500">
                {stats?.total_cobrado != null ? formatCop(stats.total_cobrado) : "—"}
              </p>
            </div>
            <Wallet className="size-6 text-emerald-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Total cobrado a clientes.</p>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Comisión plataforma
              </p>
              <p className="text-2xl font-semibold text-primary">
                {stats?.comision_plataforma != null
                  ? formatCop(stats.comision_plataforma)
                  : "—"}
              </p>
            </div>
            <TrendingUp className="size-6 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ingreso fijo por partido completado.
          </p>
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Saldo árbitros
              </p>
              <p className="text-2xl font-semibold text-slate-500">
                {stats?.saldo_arbitros != null ? formatCop(stats.saldo_arbitros) : "—"}
              </p>
            </div>
            <Users className="size-6 text-slate-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Monto total pendiente para árbitros.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Pagos pendientes
          </p>
          <p className="text-xl font-semibold text-foreground">
            {stats?.pagos_pendientes ?? (isLoading ? "…" : "0")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pagos en revisión por validar.
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Partidos buscando árbitro
          </p>
          <p className="text-xl font-semibold text-foreground">
            {stats?.pendientes_busqueda ?? (isLoading ? "…" : "0")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Pendientes de asignación.
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Pendientes</p>
          <p className="text-xl font-semibold text-foreground">
            {stats?.pendientes_confirmacion ?? (isLoading ? "…" : "0")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Partidos pendientes de confirmación.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
