/**
 * Página de onboarding para árbitros nuevos.
 * Guía en 3 pasos: completar perfil y foto → configurar disponibilidad → listo.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, User, Calendar, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout";
import { PerfilArbitroForm } from "../components/PerfilArbitroForm";
import { DisponibilidadList } from "../components/DisponibilidadList";
import { useArbitro } from "../hooks/useArbitro";
import { useDisponibilidad } from "../hooks/useDisponibilidad";
import { necesitaOnboardingArbitro } from "../utils/onboarding";
import { ROUTES } from "@/lib/constants";

const PASOS = [
  { id: 1, titulo: "Perfil y foto", icono: User },
  { id: 2, titulo: "Disponibilidad", icono: Calendar },
  { id: 3, titulo: "¡Listo!", icono: Sparkles },
] as const;

export function ArbitroOnboardingPage() {
  const navigate = useNavigate();
  const { arbitro, obtenerPerfil, isLoading: loadingPerfil } = useArbitro();
  const { disponibilidades, listarDisponibilidades } = useDisponibilidad();

  const [pasoActual, setPasoActual] = useState<1 | 2 | 3>(1);
  const [inicializado, setInicializado] = useState(false);
  const cargaInicialHecha = useRef(false);

  const cargarDatos = useCallback(async () => {
    try {
      await obtenerPerfil();
    } catch {
      // Sin perfil aún: quedamos en paso 1
    }
    try {
      await listarDisponibilidades();
    } catch {
      // Sin disponibilidades aún
    }
    setInicializado(true);
  }, [obtenerPerfil, listarDisponibilidades]);

  useEffect(() => {
    if (cargaInicialHecha.current) return;
    cargaInicialHecha.current = true;
    cargarDatos();
  }, [cargarDatos]);

  // Si ya tiene todo completo, redirigir al dashboard
  useEffect(() => {
    if (!inicializado || loadingPerfil) return;
    if (arbitro && !necesitaOnboardingArbitro(arbitro)) {
      navigate(ROUTES.ARBITRO_DASHBOARD, { replace: true });
    }
  }, [inicializado, loadingPerfil, arbitro, navigate]);

  // Calcular paso actual según datos (solo actualizar si cambia para evitar re-renders en bucle)
  useEffect(() => {
    if (!inicializado || loadingPerfil) return;
    const sinPerfil = !arbitro;
    const sinFoto =
      arbitro && (!arbitro.foto_perfil || arbitro.foto_perfil.trim() === "");
    const sinDisponibilidad =
      !disponibilidades || disponibilidades.length === 0;
    const sinDatosPersonales =
      !!arbitro &&
      (!arbitro.email?.trim() ||
        !arbitro.telefono?.trim() ||
        !arbitro.documento_identidad?.trim() ||
        !arbitro.fecha_nacimiento?.trim());

    let siguientePaso: 1 | 2 | 3;
    if (sinPerfil || sinFoto || sinDatosPersonales) {
      siguientePaso = 1;
    } else if (sinDisponibilidad) {
      siguientePaso = 2;
    } else {
      siguientePaso = 3;
    }
    setPasoActual((actual) =>
      actual === siguientePaso ? actual : siguientePaso,
    );
  }, [inicializado, loadingPerfil, arbitro, disponibilidades]);

  const handlePerfilSuccess = useCallback(async () => {
    await obtenerPerfil();
    await listarDisponibilidades();
    // El useEffect actualizará pasoActual según tenga foto y disponibilidades
  }, [obtenerPerfil, listarDisponibilidades]);

  const handleIrAlDashboard = () => {
    navigate(ROUTES.ARBITRO_DASHBOARD, { replace: true });
  };

  const isLoading = !inicializado || (loadingPerfil && !arbitro);

  if (isLoading) {
    return (
      <PageLayout
        title="Bienvenido"
        contentClassName="flex flex-col items-center justify-center min-h-[60vh] p-4"
      >
        <p className="text-muted-foreground">Cargando...</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Completa tu perfil"
      backButton={
        pasoActual === 1
          ? null
          : {
              label: "Atrás",
              onClick: () =>
                setPasoActual((p) => Math.max(1, p - 1) as 1 | 2 | 3),
            }
      }
      contentClassName="page-surface max-w-2xl pb-nav-mobile"
    >
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {PASOS.map((paso, index) => {
            const Icon = paso.icono;
            const activo = pasoActual === paso.id;
            const completado = pasoActual > paso.id;
            return (
              <div key={paso.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      completado
                        ? "bg-primary border-primary text-primary-foreground"
                        : activo
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {completado ? (
                      <Check className="size-5" />
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium hidden sm:block text-center ${
                      activo ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {paso.titulo}
                  </span>
                </div>
                {index < PASOS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 min-w-[20px] ${
                      completado ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido del paso */}
      <div className="space-y-6">
        {pasoActual === 1 && (
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">
              Datos personales y foto
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Completa tu información y sube una foto de perfil para que los
              organizadores te conozcan.
            </p>
            <PerfilArbitroForm
              arbitro={arbitro ?? undefined}
              onSuccess={handlePerfilSuccess}
            />
          </div>
        )}

        {pasoActual === 2 && (
          <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Tu disponibilidad</h2>
            <p className="text-sm text-muted-foreground">
              Indica en qué días y horarios puedes arbitrar. Añade al menos un
              horario para continuar.
            </p>
            <DisponibilidadList
              municipiosPerfil={arbitro?.municipios ?? []}
              onRefresh={listarDisponibilidades}
            />
            {disponibilidades && disponibilidades.length > 0 && (
              <Button
                onClick={() => setPasoActual(3)}
                className="w-full sm:w-auto"
              >
                Siguiente: ver resumen
              </Button>
            )}
          </div>
        )}

        {pasoActual === 3 && (
          <div className="rounded-lg border bg-card p-6 sm:p-8 shadow-sm text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">¡Todo listo!</h2>
              <p className="text-muted-foreground">
                Tu perfil está completo. Cuando un administrador verifique tu
                cuenta, podrás recibir solicitudes de partidos.
              </p>
            </div>
            <Button
              onClick={handleIrAlDashboard}
              size="lg"
              className="w-full sm:w-auto"
            >
              Ir al Dashboard
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
