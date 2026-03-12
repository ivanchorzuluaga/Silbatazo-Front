/**
 * Página para realizar el pago de un partido
 * Checkout con Wompi y estados de pago automáticos
 */

import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PageLayout } from "@/components/layout";
import { usePagoPartido } from "../hooks/usePagoPartido";
import { ROUTES } from "@/lib/constants";
import logoImage from "@/assets/Logo.png";
import type { WompiCheckoutResponse } from "@/api/endpoints/partido.endpoints";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Copy,
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PagoPartidoPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const vieneDeCheckout = searchParams.get("checkout") === "1";
  const [intentoAbrirWidget, setIntentoAbrirWidget] = useState(false);

  const {
    partido,
    isLoading,
    error,
    yaPagado,
    estadoPago,
    monto,
    referencia,
    esPagoGrupal,
    referenciasGrupo,
    partidosPendientesGrupo,
    checkoutData,
    isCheckoutLoading,
    checkoutError,
    tienePermiso,
    handleCrearCheckout,
    handleCopy,
    formatCurrency,
    navigateToDashboard,
  } = usePagoPartido(id);

  const { widgetReady, widgetError, openWidget } = useWompiWidget();

  const handleIniciarPago = useCallback(async () => {
    setIntentoAbrirWidget(true);
    await handleCrearCheckout();
  }, [handleCrearCheckout]);

  useEffect(() => {
    if (intentoAbrirWidget && checkoutData && widgetReady) {
      try {
        openWidget(checkoutData);
      } finally {
        setIntentoAbrirWidget(false);
      }
    }
  }, [intentoAbrirWidget, checkoutData, widgetReady, openWidget]);

  // Estado de carga
  if (isLoading) {
    return (
      <PageLayout title="Pago del partido">
        <PageContainer>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">
                Cargando información del pago...
              </p>
            </div>
          </div>
        </PageContainer>
      </PageLayout>
    );
  }

  // Estado de error
  if (error || !partido) {
    return (
      <PageLayout title="Pago del partido">
        <PageContainer>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-destructive/10 backdrop-blur-md rounded-2xl border border-destructive/20 p-8 text-center max-w-md">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Error</p>
              <p className="text-muted-foreground mb-6">
                {error || "Partido no encontrado"}
              </p>
              <Button onClick={navigateToDashboard}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </PageContainer>
      </PageLayout>
    );
  }

  // Sin permisos
  if (!tienePermiso) {
    return (
      <PageLayout title="Pago del partido">
        <PageContainer>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-destructive/10 backdrop-blur-md rounded-2xl border border-destructive/20 p-8 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">Acceso Denegado</p>
              <p className="text-muted-foreground mb-6">
                No tienes permiso para ver este pago
              </p>
              <Button onClick={navigateToDashboard}>Volver al Dashboard</Button>
            </div>
          </div>
        </PageContainer>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Pago del partido">
      <PageContainer>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateToDashboard}
            className="text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Pago del Partido</h1>
        <p className="text-muted-foreground">Completa el pago para confirmar tu solicitud</p>
      </header>

      {vieneDeCheckout && (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Pago recibido</p>
              <p className="text-sm text-muted-foreground">
                Estamos confirmando el estado con Wompi. Si no cambia en unos segundos,
                refresca la página.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Info del partido y estado */}
        <div className="lg:col-span-1 space-y-6">
          {/* Info del partido */}
          <InfoCard icon={Trophy} title="Información del Partido">
            <div className="space-y-3">
              <InfoRow
                icon={Calendar}
                label="Fecha"
                value={new Date(partido.fecha).toLocaleDateString("es-CO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              />
              <InfoRow icon={Clock} label="Hora" value={partido.hora.substring(0, 5)} />
              <InfoRow icon={MapPin} label="Municipio" value={partido.municipio.nombre} />
              <InfoRow icon={Trophy} label="Categoría" value={partido.categoria.nombre} />
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Código:</span>
                  <code className="text-primary font-mono text-sm">{referencia}</code>
                </div>
                {esPagoGrupal && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Pago único de {partidosPendientesGrupo} partidos:{" "}
                    {referenciasGrupo.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </InfoCard>

          {/* Estado del pago */}
          {estadoPago !== "pendiente" && (
            <PaymentStatusCard estadoPago={estadoPago} notasPago={partido.notas_pago} />
          )}

          {/* Valor a pagar */}
          <div className="bg-primary/10 backdrop-blur-md rounded-2xl border border-primary/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Banknote className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">Valor a pagar</span>
            </div>
            <p className="text-4xl font-bold text-primary">{formatCurrency(monto)}</p>
            <p className="text-muted-foreground text-sm mt-2">COP - Pesos Colombianos</p>
          </div>
        </div>

        {/* Columna derecha - Pago */}
        <div className="lg:col-span-2">
          {!yaPagado ? (
            <div className="space-y-8">
              {/* Sección de pago con Wompi */}
              <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Pagar con Wompi</h2>
                    <p className="text-muted-foreground text-sm">
                      Tarjeta, PSE, Nequi y Botón Bancolombia
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    El pago se procesa de forma segura con Wompi. Puedes elegir el método que
                    prefieras y volverás automáticamente a esta pantalla al finalizar.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <CopyField
                      label="Valor a pagar"
                      value={formatCurrency(monto)}
                      onCopy={() => handleCopy(formatCurrency(monto))}
                    />
                    <CopyField label="Referencia" value={referencia} onCopy={handleCopy} mono />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {!checkoutData ? (
                    <Button
                      onClick={handleIniciarPago}
                      disabled={isCheckoutLoading}
                      size="lg"
                      className="h-14 px-8 text-lg shadow-lg shadow-primary/25"
                    >
                      {isCheckoutLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Preparando pago...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Continuar con Wompi
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Abre el widget y elige tu método de pago.
                      </p>
                      <Button
                        onClick={() => openWidget(checkoutData)}
                        disabled={!widgetReady}
                        size="lg"
                        className="h-12 px-6"
                      >
                        {widgetReady ? "Abrir widget" : "Cargando widget..."}
                      </Button>
                    </div>
                  )}
                  {(checkoutError || widgetError) && (
                    <p className="text-destructive text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {checkoutError || widgetError}
                    </p>
                  )}
                </div>
              </div>

              {/* Instrucciones */}
              <div className="bg-primary/10 backdrop-blur-md rounded-2xl border border-primary/20 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Qué pasa después del pago
                </h3>
                <ol className="space-y-3">
                  {[
                    "Al finalizar en Wompi, serás redirigido automáticamente a esta página.",
                    "Confirmaremos el pago en segundos con Wompi y actualizaremos el estado.",
                    esPagoGrupal
                      ? `Este pago cubre ${partidosPendientesGrupo} partidos (${referenciasGrupo.join(", ")})`
                      : "Este pago cubre 1 partido",
                    "Si el estado no cambia de inmediato, espera un momento y refresca la página.",
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-foreground text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <PaymentCompletedView estadoPago={estadoPago} />
          )}
        </div>
      </div>

      </PageContainer>
    </PageLayout>
  );
}

// =============================================================================
// Componentes auxiliares
// =============================================================================

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      {/* Fondo con gradiente adaptativo */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10 dark:from-background dark:via-background dark:to-primary/20" />

      {/* Efectos de luz - solo en modo oscuro */}
      <div className="fixed top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none dark:block hidden" />
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none dark:block hidden" />

      {/* Logo de fondo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img src={logoImage} alt="" className="w-[400px] h-[400px] object-contain opacity-[0.02]" />
      </div>

      {/* Contenido */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
  return (
    <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </span>
      <span className="text-foreground font-medium text-sm">{value}</span>
    </div>
  );
}

declare global {
  interface Window {
    WidgetCheckout?: new (config: Record<string, unknown>) => { open: () => void };
  }
}

function useWompiWidget() {
  const [widgetReady, setWidgetReady] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);

  useEffect(() => {
    if (window.WidgetCheckout) {
      setWidgetReady(true);
      return;
    }

    const existing = document.getElementById("wompi-widget-script");
    if (existing) {
      existing.addEventListener("load", () => setWidgetReady(true));
      existing.addEventListener("error", () =>
        setWidgetError("No pudimos cargar el widget de Wompi.")
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "wompi-widget-script";
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    script.onload = () => setWidgetReady(true);
    script.onerror = () => setWidgetError("No pudimos cargar el widget de Wompi.");
    document.body.appendChild(script);
  }, []);

  const openWidget = useCallback((data: WompiCheckoutResponse) => {
    if (!window.WidgetCheckout || typeof window.WidgetCheckout !== "function") {
      setWidgetError("El widget de Wompi aún no está listo.");
      return;
    }

    try {
      const customerData =
        data.customer_email || data.customer_name || data.customer_phone
          ? {
              email: data.customer_email || undefined,
              fullName: data.customer_name || undefined,
              phoneNumber: data.customer_phone || undefined,
              phoneNumberPrefix: "+57",
            }
          : undefined;

      const checkout = new window.WidgetCheckout({
        currency: data.currency,
        amountInCents: data.amount_in_cents,
        reference: data.reference,
        publicKey: data.public_key,
        signature: { integrity: data.signature },
        redirectUrl: data.redirect_url,
        onResponse: () => {
          // Wompi exige un callback; el webhook confirma el estado real.
        },
        ...(customerData ? { customerData } : {}),
      });
      checkout.open();
    } catch (err) {
      setWidgetError(
        err instanceof Error
          ? err.message
          : "No pudimos abrir el widget de Wompi.",
      );
    }
  }, []);

  return { widgetReady, widgetError, openWidget };
}

interface CopyFieldProps {
  label: string;
  value: string;
  onCopy: (value: string) => void;
  sublabel?: string;
  mono?: boolean;
}

function CopyField({ label, value, onCopy, sublabel, mono }: CopyFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-muted-foreground text-sm">{label}</label>
      <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg p-3">
        <span className={cn("flex-1 text-foreground font-medium", mono && "font-mono")}>
          {value}
        </span>
        <button
          onClick={() => onCopy(typeof value === "string" ? value : String(value))}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      {sublabel && <p className="text-muted-foreground text-xs">{sublabel}</p>}
    </div>
  );
}

interface PaymentStatusCardProps {
  estadoPago: string;
  notasPago?: string;
}

function PaymentStatusCard({ estadoPago, notasPago }: PaymentStatusCardProps) {
  const isAprobado = estadoPago === "aprobado";
  const isEnRevision = estadoPago === "en_revision";

  return (
    <div
      className={cn(
        "backdrop-blur-md rounded-2xl border p-6",
        isAprobado && "bg-success/10 border-success/20",
        isEnRevision && "bg-warning/10 border-warning/20",
        !isAprobado && !isEnRevision && "bg-destructive/10 border-destructive/20"
      )}
    >
      <div className="flex items-start gap-4">
        {isAprobado ? (
          <CheckCircle className="w-8 h-8 text-success shrink-0" />
        ) : isEnRevision ? (
          <CheckCircle2 className="w-8 h-8 text-warning shrink-0" />
        ) : (
          <XCircle className="w-8 h-8 text-destructive shrink-0" />
        )}
        <div>
          <p className="font-semibold text-foreground mb-1">
            {isAprobado
              ? "Pago Aprobado"
              : isEnRevision
              ? "Pago enviado correctamente"
              : "Pago Rechazado"}
          </p>
          <p className="text-muted-foreground text-sm">
            {isAprobado
              ? "Tu pago ha sido verificado y aprobado."
              : isEnRevision
              ? "Estamos confirmando el pago con Wompi. No necesitas hacer nada más."
              : notasPago || "El pago fue rechazado. Por favor, intenta nuevamente."}
          </p>
          {isEnRevision && (
            <p className="text-muted-foreground text-xs mt-2">
              La confirmación suele tardar unos segundos. Si no cambia el estado, refresca la página.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface PaymentCompletedViewProps {
  estadoPago: string;
}

function PaymentCompletedView({ estadoPago }: PaymentCompletedViewProps) {
  const isAprobado = estadoPago === "aprobado";
  const isEnRevision = estadoPago === "en_revision";

  return (
    <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-8 text-center">
      <div
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
          isAprobado && "bg-success/20",
          isEnRevision && "bg-warning/20",
          !isAprobado && !isEnRevision && "bg-destructive/20"
        )}
      >
        {isAprobado ? (
          <CheckCircle className="w-10 h-10 text-success" />
        ) : isEnRevision ? (
          <CheckCircle2 className="w-10 h-10 text-warning" />
        ) : (
          <XCircle className="w-10 h-10 text-destructive" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        {isAprobado
          ? "¡Pago Confirmado!"
          : isEnRevision
          ? "¡Pago enviado correctamente!"
          : "Pago Rechazado"}
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {isAprobado
          ? "Tu pago ha sido verificado exitosamente. El árbitro ha sido notificado y tu partido está confirmado."
          : isEnRevision
          ? "Tu pago fue enviado correctamente. Estamos confirmando con Wompi."
          : "Hubo un problema con tu pago. Por favor, intenta nuevamente."}
      </p>
      {isEnRevision && (
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          La confirmación suele tardar unos segundos. Si no cambia el estado, refresca la página.
        </p>
      )}
      {!isAprobado && !isEnRevision && (
        <div className="mb-6">
          <WhatsAppButton
            variant="link"
            message="Hola, tuve un problema con mi pago y necesito soporte."
          />
        </div>
      )}
      <Link to={ROUTES.CLIENTE_DASHBOARD}>
        <Button size="lg" className="px-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al Dashboard
        </Button>
      </Link>
    </div>
  );
}
