/**
 * Página para realizar el pago de un partido
 * Diseño moderno con glassmorphism y subida de comprobante
 */

import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PageLayout } from "@/components/layout";
import { usePagoPartido } from "../hooks/usePagoPartido";
import { ROUTES } from "@/lib/constants";
import logoImage from "@/assets/Logo.png";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  CreditCard,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Banknote,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PagoPartidoPage() {
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    partido,
    isLoading,
    error,
    isMarkingAsPaid,
    yaPagado,
    estadoPago,
    comprobante,
    comprobantePreview,
    comprobanteError,
    monto,
    referencia,
    nequiConfig,
    tienePermiso,
    handleMarcarComoPagado,
    handleComprobanteChange,
    handleCopy,
    formatCurrency,
    navigateToDashboard,
  } = usePagoPartido(id);

  // Manejar click en el área de subida
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Manejar archivo seleccionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleComprobanteChange(file);
  };

  // Eliminar comprobante
  const handleRemoveComprobante = () => {
    handleComprobanteChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
              </div>
            </div>
          </InfoCard>

          {/* Estado del pago */}
          {yaPagado && <PaymentStatusCard estadoPago={estadoPago} notasPago={partido.notas_pago} />}

          {/* Monto a pagar */}
          <div className="bg-primary/10 backdrop-blur-md rounded-2xl border border-primary/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Banknote className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">Total a Pagar</span>
            </div>
            <p className="text-4xl font-bold text-primary">{formatCurrency(monto)}</p>
            <p className="text-muted-foreground text-sm mt-2">COP - Pesos Colombianos</p>
          </div>
        </div>

        {/* Columna derecha - Pago */}
        <div className="lg:col-span-2">
          {!yaPagado ? (
            <div className="space-y-6">
              {/* Sección de pago con Nequi */}
              <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#E61D73]/20 rounded-lg">
                    <Smartphone className="w-5 h-5 text-[#E61D73]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Pagar con Nequi</h2>
                    <p className="text-muted-foreground text-sm">Transferencia rápida y segura</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl border-2 border-[#E61D73]/30 shadow-lg mb-4">
                      <img
                        src={nequiConfig.qrUrl}
                        alt="QR Code Nequi"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <p className="text-muted-foreground text-sm text-center">
                      Escanea el código QR con la app de Nequi
                    </p>
                  </div>

                  {/* Datos de transferencia */}
                  <div className="space-y-4">
                    <CopyField
                      label="Número Nequi"
                      value={nequiConfig.phone}
                      onCopy={handleCopy}
                      sublabel={`Nombre: ${nequiConfig.name}`}
                    />
                    <CopyField
                      label="Monto"
                      value={formatCurrency(monto)}
                      onCopy={() => handleCopy(formatCurrency(monto))}
                    />
                    <CopyField label="Referencia" value={referencia} onCopy={handleCopy} mono />
                  </div>
                </div>
              </div>

              {/* Instrucciones */}
              <div className="bg-primary/10 backdrop-blur-md rounded-2xl border border-primary/20 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Instrucciones para pagar
                </h3>
                <ol className="space-y-3">
                  {[
                    "Abre la app de Nequi en tu celular",
                    'Ve a "Enviar" o "Transferir"',
                    `Ingresa el número: ${nequiConfig.phone}`,
                    `Ingresa el monto: ${formatCurrency(monto)}`,
                    `En la referencia, escribe: ${referencia}`,
                    "Confirma y realiza la transferencia",
                    "Toma una captura de pantalla del comprobante",
                    "Sube la captura y confirma tu pago",
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

              {/* Subir comprobante */}
              <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Subir Comprobante de Pago</h3>
                    <p className="text-muted-foreground text-sm">
                      Sube una captura de pantalla de la transferencia
                    </p>
                  </div>
                </div>

                {/* Input oculto */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Área de subida o preview */}
                {comprobantePreview ? (
                  <div className="relative">
                    <div className="relative rounded-xl overflow-hidden border-2 border-primary/30">
                      <img
                        src={comprobantePreview}
                        alt="Comprobante"
                        className="w-full max-h-80 object-contain bg-black/20"
                      />
                      <button
                        onClick={handleRemoveComprobante}
                        className="absolute top-2 right-2 p-2 bg-destructive hover:bg-destructive/90 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-destructive-foreground" />
                      </button>
                    </div>
                    <p className="text-center text-muted-foreground text-sm mt-3">
                      <CheckCircle className="w-4 h-4 inline-block mr-1 text-success" />
                      Comprobante cargado: {comprobante?.name}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleUploadClick}
                    className={cn(
                      "w-full p-8 border-2 border-dashed rounded-xl transition-all",
                      "hover:border-primary/50 hover:bg-primary/5",
                      comprobanteError
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border bg-muted/50"
                    )}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-muted rounded-full">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-foreground font-medium">
                          Haz clic para seleccionar la captura
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          JPG, PNG, WebP o GIF (máx. 5MB)
                        </p>
                      </div>
                    </div>
                  </button>
                )}

                {/* Error del comprobante */}
                {comprobanteError && (
                  <p className="text-destructive text-sm mt-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {comprobanteError}
                  </p>
                )}
              </div>

              {/* Botón de confirmación */}
              <div className="bg-card backdrop-blur-md rounded-2xl border border-border p-6 text-center">
                <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                  Una vez que hayas subido el comprobante, confirma tu pago para que podamos
                  verificarlo.
                </p>
                <Button
                  onClick={handleMarcarComoPagado}
                  disabled={isMarkingAsPaid || !comprobante}
                  size="lg"
                  className={cn(
                    "h-14 px-8 text-lg shadow-lg shadow-primary/25",
                    !comprobante && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isMarkingAsPaid ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Confirmar Pago
                    </>
                  )}
                </Button>
                {!comprobante && (
                  <p className="text-warning text-xs mt-3">
                    Debes subir el comprobante para confirmar
                  </p>
                )}
              </div>
            </div>
          ) : (
            <PaymentCompletedView estadoPago={estadoPago} />
          )}
        </div>
      </div>

      {/* Link a Nequi */}
      <div className="text-center mt-8">
        <a
          href="https://www.nequi.com.co"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          ¿No tienes Nequi? Descárgalo aquí
          <ExternalLink className="w-4 h-4" />
        </a>
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
          <Loader2 className="w-8 h-8 text-warning animate-spin shrink-0" />
        ) : (
          <XCircle className="w-8 h-8 text-destructive shrink-0" />
        )}
        <div>
          <p className="font-semibold text-foreground mb-1">
            {isAprobado ? "Pago Aprobado" : isEnRevision ? "Pago en Revisión" : "Pago Rechazado"}
          </p>
          <p className="text-muted-foreground text-sm">
            {isAprobado
              ? "Tu pago ha sido verificado y aprobado."
              : isEnRevision
              ? "Tu pago está siendo revisado por el administrador. Puedes continuar usando la app mientras tanto."
              : notasPago || "El pago fue rechazado. Por favor, verifica la información."}
          </p>
          {isEnRevision && (
            <p className="text-muted-foreground text-xs mt-2">
              La revisión es manual y puede tardar entre 15 y 30 minutos. Te avisaremos por correo
              electrónico.
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
          <Loader2 className="w-10 h-10 text-warning animate-spin" />
        ) : (
          <XCircle className="w-10 h-10 text-destructive" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        {isAprobado ? "¡Pago Confirmado!" : isEnRevision ? "Pago en Revisión" : "Pago Rechazado"}
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {isAprobado
          ? "Tu pago ha sido verificado exitosamente. El árbitro ha sido notificado y tu partido está confirmado."
          : isEnRevision
          ? "Tu pago está siendo revisado por nuestro equipo. Puedes continuar usando la app mientras tanto."
          : "Hubo un problema con tu pago. Por favor, contacta a soporte o intenta nuevamente."}
      </p>
      {isEnRevision && (
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          La revisión es manual y puede tardar entre 15 y 30 minutos. Te avisaremos por correo
          electrónico.
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
