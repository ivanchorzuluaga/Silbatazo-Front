/**
 * Página de detalle de árbitro para clientes (con sidebar)
 * Permite ver el perfil completo y solicitar el árbitro
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useArbitroDetail } from "@/features/marketplace/hooks/useArbitroDetail";
import { Sidebar } from "@/components/layout/Sidebar";
import { PartidoFormModal } from "@/features/partidos/components/PartidoFormModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logoImage from "@/assets/Silbatazo-bordes.png";
import { getRefereeImage } from "@/lib/referee-images";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import {
  ArrowLeft,
  Star,
  MapPin,
  Trophy,
  Clock,
  Calendar,
  Phone,
  Mail,
  Award,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function ClienteArbitroDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { arbitro, isLoading, error } = useArbitroDetail(id ? parseInt(id) : 0);
  const [showSolicitudModal, setShowSolicitudModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-72">
          <PageContainer>
            <LoadingState />
          </PageContainer>
        </main>
      </div>
    );
  }

  if (error || !arbitro) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-72">
          <PageContainer>
            <ErrorState
              error={error || "Árbitro no encontrado"}
              onBack={() => navigate(ROUTES.CLIENTE_ARBITROS)}
            />
          </PageContainer>
        </main>
      </div>
    );
  }

  const nombre = arbitro.full_name || arbitro.username;
  const imageUrl = getRefereeImage(
    arbitro.foto_perfil,
    arbitro.id,
    arbitro.experiencia_anos,
    nombre,
  );
  const rating = arbitro.calificacion_promedio || 0;

  // Calcular precio promedio de las categorías
  const precio =
    arbitro.categorias && arbitro.categorias.length > 0 && arbitro.categorias[0].tarifa
      ? parseFloat(String(arbitro.categorias[0].tarifa))
      : parseFloat(arbitro.tarifa || "0");

  const experiencia = arbitro.experiencia_anos || 0;
  const totalCalificaciones = arbitro.total_calificaciones || 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-72">
        <PageContainer>
          {/* Header con botón volver */}
          <header className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.CLIENTE_ARBITROS)}
              className="text-white/60 hover:text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a árbitros
            </Button>
          </header>

          {/* Contenido principal */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Columna izquierda - Foto y acciones */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Imagen */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <div className="aspect-[3/4]">
                    <img src={imageUrl} alt={nombre} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Rating */}
                  {rating > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-white">{rating.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Precio */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/60 text-sm mb-1">Tarifa por partido</p>
                    <p className="text-3xl font-bold text-white">
                      ${precio.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>

                {/* Botón solicitar */}
                <Button
                  onClick={() => setShowSolicitudModal(true)}
                  size="lg"
                  className="w-full py-6 text-lg font-bold"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Solicitar Árbitro
                </Button>
              </div>
            </div>

            {/* Columna derecha - Información */}
            <div className="lg:col-span-2 space-y-6">
              {/* Nombre y datos básicos */}
              <InfoCard>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{nombre}</h1>

                <div className="flex flex-wrap items-center gap-4 text-white/60 mb-4">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {experiencia} años de experiencia
                  </span>
                  {totalCalificaciones > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {totalCalificaciones} calificaciones
                    </span>
                  )}
                </div>

                {arbitro.biografia && (
                  <p className="text-white/70 leading-relaxed">{arbitro.biografia}</p>
                )}
              </InfoCard>

              {/* Categorías */}
              {arbitro.categorias && arbitro.categorias.length > 0 && (
                <InfoCard title="Categorías" icon={Trophy}>
                  <div className="flex flex-wrap gap-2">
                    {arbitro.categorias.map((cat) => (
                      <Badge
                        key={cat.id}
                        className="bg-primary/20 text-primary border-primary/30 px-3 py-1"
                      >
                        {cat.nombre}
                      </Badge>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Municipios */}
              {arbitro.municipios && arbitro.municipios.length > 0 && (
                <InfoCard title="Municipios" icon={MapPin}>
                  <div className="flex flex-wrap gap-2">
                    {arbitro.municipios.map((mun) => (
                      <Badge
                        key={mun.id}
                        variant="outline"
                        className="border-white/20 text-white/70"
                      >
                        {mun.nombre}
                      </Badge>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Disponibilidad */}
              {arbitro.disponibilidades && arbitro.disponibilidades.length > 0 && (
                <InfoCard title="Disponibilidad" icon={Clock}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {arbitro.disponibilidades.map((disp) => (
                      <div
                        key={disp.id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">
                            {disp.dia_semana_display || disp.dia_semana}
                          </p>
                          <p className="text-white/50 text-sm">
                            {disp.hora_inicio?.substring(0, 5)} - {disp.hora_fin?.substring(0, 5)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Contacto */}
              <InfoCard title="Contacto" icon={Phone}>
                <div className="space-y-3">
                  {arbitro.email && (
                    <div className="flex items-center gap-3 text-white/70">
                      <Mail className="w-4 h-4 text-white/40" />
                      <span>{arbitro.email}</span>
                    </div>
                  )}
                  {arbitro.telefono && (
                    <div className="flex items-center gap-3 text-white/70">
                      <Phone className="w-4 h-4 text-white/40" />
                      <span>{arbitro.telefono}</span>
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* Certificaciones */}
              {arbitro.documentos && arbitro.documentos.length > 0 && (
                <InfoCard title="Certificaciones" icon={Award}>
                  <div className="space-y-2">
                    {arbitro.documentos
                      .filter((doc) => doc.tipo === "certificacion" && doc.estado === "aprobado")
                      .map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2 text-white/70">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{doc.nombre || doc.tipo_display}</span>
                        </div>
                      ))}
                  </div>
                </InfoCard>
              )}
            </div>
          </div>

          {/* Botón sticky para móvil */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-950 to-transparent">
            <Button
              onClick={() => setShowSolicitudModal(true)}
              size="lg"
              className="w-full py-6 text-lg font-bold"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Solicitar - ${precio.toLocaleString("es-CO")}
            </Button>
          </div>
        </PageContainer>

        {/* Modal de solicitud */}
        {showSolicitudModal && arbitro && (
          <PartidoFormModal
            arbitro={arbitro}
            open={showSolicitudModal}
            onClose={() => setShowSolicitudModal(false)}
          />
        )}
      </main>
    </div>
  );
}

// =============================================================================
// Componentes auxiliares
// =============================================================================

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative pb-24 lg:pb-8">
      {/* Fondo */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-background" />
      <div className="fixed top-0 right-0 h-96 w-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 h-64 w-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Logo de fondo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img src={logoImage} alt="" className="w-[500px] h-[500px] object-contain opacity-[0.02]" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

interface InfoCardProps {
  title?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}

function InfoCard({ title, icon: Icon, children }: InfoCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && (
            <div className="p-2 bg-primary/20 rounded-lg">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          )}
          <h2 className="font-semibold text-white">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-white font-medium">Cargando perfil...</p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onBack: () => void;
}

function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-500/10 backdrop-blur-md rounded-2xl border border-red-500/20 p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-lg font-medium text-white mb-2">Error</p>
        <p className="text-white/60 mb-6">{error}</p>
        <Button onClick={onBack} variant="outline" className="border-red-500/30">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a árbitros
        </Button>
      </div>
    </div>
  );
}
