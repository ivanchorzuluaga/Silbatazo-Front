/**
 * Formulario para crear un partido
 * El usuario selecciona un tipo de partido (con precio fijo) según sus necesidades.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FormField, DateField } from "@/components/forms";
import { TimePicker24h } from "@/components/forms/TimePicker24h";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { usePartido } from "../hooks/usePartido";
import { useMunicipios } from "@/features/arbitro/hooks/useMunicipios";
import { useCategorias } from "@/features/arbitro/hooks/useCategorias";
import { partidoService } from "../services/partido.service";
import { ROUTES, CATEGORIAS_PARTIDO, getPartidoPagoRoute } from "@/lib/constants";
import { getTodayLocalDate, compareDates } from "@/lib/utils";
import { TipoPartidoCardGrid } from "./TipoPartidoCardGrid";
import type { PartidoCreateData, TipoPartido } from "../types/partido.types";

interface PartidoFormProps {
  onSuccess?: () => void;
  modoAdmin?: boolean;
  onCreate?: (data: PartidoCreateData) => Promise<void | { id: number; estado: string }>;
}

export function PartidoForm({ onSuccess, modoAdmin = false, onCreate }: PartidoFormProps) {
  const navigate = useNavigate();
  const { crearPartido, isLoading, error, clearError } = usePartido();
  const { municipios, isLoading: municipiosLoading } = useMunicipios();
  const { categorias } = useCategorias();
  const categoriasPartido = categorias.filter((c) =>
    (CATEGORIAS_PARTIDO as readonly string[]).includes(c.nombre)
  );

  // Estados del formulario
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [municipioId, setMunicipioId] = useState("");
  const [lugar, setLugar] = useState("");
  const [barrio, setBarrio] = useState("");
  const [ubicacionMapsUrl, setUbicacionMapsUrl] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notasCliente, setNotasCliente] = useState("");
  const [usarValoresPersonalizados, setUsarValoresPersonalizados] = useState(false);
  const [servicioArbitro, setServicioArbitro] = useState("");
  const [comisionApp, setComisionApp] = useState("");
  const [cantidadPartidos, setCantidadPartidos] = useState("1");
  const [partidosIguales, setPartidosIguales] = useState(true);
  const [tiposPorPartido, setTiposPorPartido] = useState<string[]>([""]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [partidosCreados, setPartidosCreados] = useState<Array<{ id: number; estado: string }>>(
    []
  );

  // Tipo de partido (selector único con precio fijo)
  const [tiposPartido, setTiposPartido] = useState<TipoPartido[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [tipoPartidoId, setTipoPartidoId] = useState("");
  const [errorTipos, setErrorTipos] = useState<string | null>(null);

  const selectedTipo = tiposPartido.find((t) => t.id === parseInt(tipoPartidoId));
  const montoTotal = selectedTipo ? selectedTipo.monto_total : null;

  const defaultCategoriaId = categoriasPartido[0]?.id;
  const faltanCategorias = categoriasPartido.length === 0;
  const faltanTipos = !loadingTipos && (tiposPartido.length === 0 || errorTipos != null);
  const puedeEnviar =
    !faltanCategorias &&
    defaultCategoriaId != null &&
    (usarValoresPersonalizados ? modoAdmin : !faltanTipos);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  // Refs para hacer scroll al primer error
  const fechaRef = useRef<HTMLDivElement | null>(null);
  const horaRef = useRef<HTMLDivElement | null>(null);
  const cantidadRef = useRef<HTMLDivElement | null>(null);
  const municipioRef = useRef<HTMLDivElement | null>(null);
  const tipoRef = useRef<HTMLDivElement | null>(null);
  const lugarRef = useRef<HTMLDivElement | null>(null);
  const barrioRef = useRef<HTMLDivElement | null>(null);
  const direccionRef = useRef<HTMLDivElement | null>(null);
  const mapsRef = useRef<HTMLDivElement | null>(null);
  const servicioRef = useRef<HTMLDivElement | null>(null);
  const comisionRef = useRef<HTMLDivElement | null>(null);

  // Cargar tipos de partido al montar (loadingTipos ya es true por defecto)
  useEffect(() => {
    partidoService
      .listarTiposPartido()
      .then(setTiposPartido)
      .catch((err) => {
        setTiposPartido([]);
        setErrorTipos(err instanceof Error ? err.message : "Error al cargar tipos de partido");
      })
      .finally(() => setLoadingTipos(false));
  }, []);

  useEffect(() => {
    const total = parseInt(cantidadPartidos, 10) || 1;
    setTiposPorPartido((prev) => Array.from({ length: total }, (_, i) => prev[i] ?? ""));
  }, [cantidadPartidos]);

  // Cuando haya errores de validación, hacer scroll al primero
  useEffect(() => {
    if (!fieldErrors || Object.keys(fieldErrors).length === 0) return;

    const order = [
      "fecha",
      "hora",
      "cantidad_partidos",
      "municipio_id",
      "tipo_partido_id",
      "servicio_arbitro",
      "comision_app",
      "categoria_id",
      "lugar",
      "barrio",
      "direccion",
      "ubicacion_maps_url",
    ];

    const firstKey = order.find((key) => fieldErrors[key]);
    if (!firstKey) return;

    const refsMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      fecha: fechaRef,
      hora: horaRef,
      cantidad_partidos: cantidadRef,
      municipio_id: municipioRef,
      tipo_partido_id: tipoRef,
      categoria_id: tipoRef,
      servicio_arbitro: servicioRef,
      comision_app: comisionRef,
      lugar: lugarRef,
      barrio: barrioRef,
      direccion: direccionRef,
      ubicacion_maps_url: mapsRef,
    };

    const targetRef = refsMap[firstKey];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      const focusable = targetRef.current.querySelector<HTMLElement>(
        "input, select, textarea, button",
      );
      if (focusable) {
        focusable.focus();
      }
    }
  }, [fieldErrors]);

  const generarCodigoGrupoPago = (): string => {
    // Código corto para referencia de pago grupal (ej: GP-8F2KQ7)
    const base = Date.now().toString(36).slice(-4).toUpperCase();
    const rnd = Math.random().toString(36).slice(2, 4).toUpperCase();
    return `GP-${base}${rnd}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    // Validaciones básicas
    const errors: Record<string, string> = {};
    const totalPartidos = parseInt(cantidadPartidos, 10) || 1;
    if (!fecha) errors.fecha = "La fecha es requerida";
    if (!hora) errors.hora = "La hora es requerida";
    if (!municipioId) errors.municipio_id = "Debes seleccionar un municipio";
    if (!usarValoresPersonalizados && (partidosIguales || totalPartidos === 1) && !tipoPartidoId)
      errors.tipo_partido_id = "Selecciona el tipo de partido que se acomoda a tu partido";
    if (!lugar.trim()) errors.lugar = "El nombre de la cancha es requerido";
    if (!barrio.trim()) errors.barrio = "El barrio es requerido";
    if (!direccion.trim()) errors.direccion = "La dirección es requerida";
    if (!partidosIguales && !usarValoresPersonalizados) {
      for (let i = 0; i < totalPartidos; i += 1) {
        if (!tiposPorPartido[i]) {
          errors[`tipo_partido_${i}`] = `Selecciona el tipo del partido ${i + 1}`;
        }
      }
    }
    if (modoAdmin && usarValoresPersonalizados) {
      const servicio = Number(servicioArbitro);
      const comision = Number(comisionApp);
      if (!servicioArbitro.trim() || Number.isNaN(servicio) || servicio < 0) {
        errors.servicio_arbitro = "Ingresa un valor válido para servicio árbitro";
      }
      if (!comisionApp.trim() || Number.isNaN(comision) || comision < 0) {
        errors.comision_app = "Ingresa un valor válido para comisión app";
      }
    }
    if (!defaultCategoriaId)
      errors.categoria_id = "No hay categoría disponible. Intenta más tarde.";

    // Validar fecha futura (comparar strings YYYY-MM-DD para evitar problemas de zona horaria)
    if (fecha) {
      const hoy = getTodayLocalDate();
      if (compareDates(fecha, hoy) < 0) {
        errors.fecha = "La fecha debe ser futura";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const timeToMinutes = (hhmm: string): number => {
        const [h, m] = hhmm.split(":").map(Number);
        return h * 60 + m;
      };
      const minutesToTime = (mins: number): string =>
        `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
      const horaBase = hora.length === 5 ? hora : hora.substring(0, 5);
      const inicioMinutos = timeToMinutes(horaBase);
      const tiposSeleccionados = Array.from({ length: totalPartidos }, (_, i) => {
        if (usarValoresPersonalizados) return undefined;
        const tipoId = partidosIguales ? tipoPartidoId : tiposPorPartido[i];
        return tiposPartido.find((t) => t.id === parseInt(tipoId || "0"));
      });
      const duraciones = tiposSeleccionados.map((tipo) => tipo?.duracion_servicio_minutos ?? 90);
      const totalMinutos = duraciones.reduce((acc, cur) => acc + cur, 0);
      const finUltimo = inicioMinutos + Math.max(totalMinutos - (duraciones[duraciones.length - 1] ?? 90), 0);
      if (finUltimo >= 24 * 60) {
        setFieldErrors({
          hora: "Con la cantidad de partidos seleccionada, el horario supera las 23:59.",
        });
        return;
      }

      const grupoPagoCodigo = totalPartidos > 1 ? generarCodigoGrupoPago() : undefined;

      const dataBase = {
        arbitro_id: null,
        fecha,
        municipio_id: parseInt(municipioId),
        categoria_id: defaultCategoriaId ?? 0,
        lugar: lugar.trim(),
        cancha_nombre: lugar.trim(),
        barrio: barrio.trim(),
        ubicacion_maps_url: ubicacionMapsUrl.trim() || undefined,
        direccion: direccion.trim() || undefined,
        grupo_pago_codigo: grupoPagoCodigo,
        servicio_arbitro:
          modoAdmin && usarValoresPersonalizados ? Number(servicioArbitro || 0) : undefined,
        comision_app: modoAdmin && usarValoresPersonalizados ? Number(comisionApp || 0) : undefined,
        notas_cliente: notasCliente.trim() || undefined,
      };

      const creados: Array<{ id: number; estado: string }> = [];
      let horaActual = inicioMinutos;
      for (let i = 0; i < totalPartidos; i += 1) {
        const tipoActual = tiposSeleccionados[i];
        const tipoPartidoIdActual = tipoActual?.id;
        const montoActual = tipoActual?.monto_total ?? montoTotal ?? undefined;
        const payload = {
          ...dataBase,
          hora: minutesToTime(horaActual),
          tipo_partido_id: usarValoresPersonalizados ? undefined : tipoPartidoIdActual,
          monto_total:
            modoAdmin && usarValoresPersonalizados
              ? Number(servicioArbitro || 0) + Number(comisionApp || 0)
              : montoActual,
        };
        const nuevoPartido = onCreate
          ? ((await onCreate(payload)) as { id: number; estado: string })
          : await crearPartido(payload);
        creados.push({ id: nuevoPartido.id, estado: nuevoPartido.estado });
        horaActual += duraciones[i] ?? 90;
      }

      // Para clientes: redirigir inmediatamente al flujo de pago del primer partido creado.
      if (!modoAdmin && creados.length > 0) {
        const primerId = creados[0].id;
        const rutaPago = getPartidoPagoRoute(primerId);
        setPartidosCreados(creados);
        setShowSuccess(false);
        setTipoPartidoId("");
        setFieldErrors({});
        navigate(rutaPago);
        return;
      }

      // Para admin mantenemos el flujo con mensaje de éxito
      setPartidosCreados(creados);
      setShowSuccess(true);
      setTipoPartidoId("");

      // Limpiar formulario
      setFecha("");
      setHora("");
      setMunicipioId("");
      setLugar("");
      setBarrio("");
      setUbicacionMapsUrl("");
      setDireccion("");
      setUsarValoresPersonalizados(false);
      setServicioArbitro("");
      setComisionApp("");
      setCantidadPartidos("1");
      setPartidosIguales(true);
      setTiposPorPartido([""]);
      setNotasCliente("");
      setFieldErrors({});
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al crear partido:", err);
      setShowSuccess(false);
      setPartidosCreados([]);
    }
  };

  const handleAceptar = () => {
    setShowSuccess(false);
    setPartidosCreados([]);
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(ROUTES.PARTIDOS);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showSuccess && partidosCreados.length > 0 ? (
        <>
          {/* Mensaje de éxito - Solo se muestra cuando hay éxito */}
          <Alert variant="success" className="mb-4">
            <AlertTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              ¡Partido creado exitosamente!
            </AlertTitle>
            <AlertDescription className="mt-2">
              {modoAdmin ? (
                <>
                  {partidosCreados.length === 1
                    ? `El partido #${partidosCreados[0].id} ha sido creado y está `
                    : `Se crearon ${partidosCreados.length} partidos (${partidosCreados
                        .map((p) => `#${p.id}`)
                        .join(", ")}) y están `}
                  <strong>disponibles para árbitros</strong>.
                </>
              ) : (
                <>
                  {partidosCreados.length === 1
                    ? `El partido #${partidosCreados[0].id} ha sido creado y está `
                    : `Se crearon ${partidosCreados.length} partidos (${partidosCreados
                        .map((p) => `#${p.id}`)
                        .join(", ")}) y están `}
                  <strong>buscando árbitro</strong>. Los árbitros podrán postularse y un
                  administrador asignará el árbitro final.
                </>
              )}
            </AlertDescription>
          </Alert>
          {/* Botón Aceptar */}
          <div className="flex gap-4 pt-4">
            <Button type="button" onClick={handleAceptar} className="flex-1" disabled={isLoading}>
              Aceptar
            </Button>
          </div>
        </>
      ) : (
        <>
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Información */}
          <div className="p-3 rounded-md bg-muted/50 border">
            <p className="text-sm font-medium mb-1">
              {modoAdmin ? "Crear partido abierto" : "Crear partido sin árbitro asignado"}
            </p>
            <p className="text-xs text-muted-foreground">
              {modoAdmin
                ? "El partido quedará publicado para que un árbitro lo tome directamente."
                : "El partido quedará disponible para que los árbitros se postulen. Un administrador asignará el árbitro final."}
            </p>
          </div>

          {/* Aviso cuando faltan datos del sistema */}
          {(faltanCategorias || (!usarValoresPersonalizados && faltanTipos)) && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>No se puede crear el partido en este momento</AlertTitle>
              <AlertDescription>
                {faltanCategorias && "Faltan categorías de partido en el sistema. "}
                {faltanTipos &&
                  (errorTipos
                    ? `Error al cargar tipos de partido: ${errorTipos} `
                    : "No hay tipos de partido disponibles. ")}
                Contacta al administrador o intenta más tarde.
              </AlertDescription>
            </Alert>
          )}

          {/* Fecha y Hora */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div ref={fechaRef}>
              <DateField
                label="Fecha del Partido"
                name="fecha"
                value={fecha}
                onChange={(value) => {
                  setFecha(value);
                  if (fieldErrors.fecha) {
                    setFieldErrors((prev) => ({ ...prev, fecha: undefined }));
                  }
                }}
                error={fieldErrors.fecha}
                disabled={isLoading}
                required
              />
            </div>

            <div ref={horaRef} className="space-y-2">
              <label htmlFor="hora" className="text-sm font-medium">
                Hora del Partido (24 horas) <span className="text-destructive">*</span>
              </label>
              <TimePicker24h
                id="hora"
                name="hora"
                value={hora}
                onChange={(value) => {
                  setHora(value);
                  if (fieldErrors.hora) {
                    setFieldErrors((prev) => ({ ...prev, hora: undefined }));
                  }
                }}
                error={fieldErrors.hora}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div ref={cantidadRef} className="space-y-2">
            <label htmlFor="cantidad_partidos" className="text-sm font-medium">
              Cantidad de partidos seguidos <span className="text-destructive">*</span>
            </label>
            <Select
              id="cantidad_partidos"
              value={cantidadPartidos}
              onChange={(e) => setCantidadPartidos(e.target.value)}
              disabled={isLoading}
            >
              <option value="1">1 partido</option>
              <option value="2">2 partidos</option>
              <option value="3">3 partidos</option>
            </Select>
            <p className="text-xs text-muted-foreground">
              Si eliges 2 o 3, se crearán consecutivos usando la duración del tipo de partido.
            </p>
            {parseInt(cantidadPartidos, 10) > 1 && (
              <label className="flex items-center gap-2 text-sm font-medium pt-1">
                <input
                  type="checkbox"
                  checked={partidosIguales}
                  onChange={(e) => {
                    setPartidosIguales(e.target.checked);
                    setFieldErrors((prev) => ({ ...prev, tipo_partido_id: undefined }));
                  }}
                  disabled={isLoading || usarValoresPersonalizados}
                  className="h-4 w-4"
                />
                Todos los partidos son del mismo tipo
              </label>
            )}
          </div>

          {/* Municipio */}
          <div ref={municipioRef} className="space-y-2">
            <label htmlFor="municipio_id" className="text-sm font-medium">
              Municipio <span className="text-destructive">*</span>
            </label>
            <Select
              id="municipio_id"
              value={municipioId}
              onChange={(e) => {
                setMunicipioId(e.target.value);
                if (fieldErrors.municipio_id) {
                  setFieldErrors((prev) => ({ ...prev, municipio_id: undefined }));
                }
              }}
              disabled={isLoading || municipiosLoading}
              className={fieldErrors.municipio_id ? "border-destructive" : ""}
            >
              <option value="">Selecciona el municipio del partido</option>
              {municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                  {municipio.departamento && `, ${municipio.departamento}`}
                </option>
              ))}
            </Select>
            <p className="text-xs text-muted-foreground">
              Debes elegir el municipio del partido para validar cobertura del servicio.
            </p>
            {fieldErrors.municipio_id && (
              <p className="text-sm text-destructive">{fieldErrors.municipio_id}</p>
            )}
          </div>

          {/* Tipo de partido: cards seleccionables */}
          <div ref={tipoRef} className="space-y-3">
            {modoAdmin && (
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={usarValoresPersonalizados}
                  onChange={(e) => {
                    const activo = e.target.checked;
                    setUsarValoresPersonalizados(activo);
                    setFieldErrors((prev) => ({
                      ...prev,
                      tipo_partido_id: undefined,
                      servicio_arbitro: undefined,
                      comision_app: undefined,
                    }));
                    if (activo) {
                      setTipoPartidoId("");
                    } else {
                      setServicioArbitro("");
                      setComisionApp("");
                    }
                  }}
                  disabled={isLoading}
                  className="h-4 w-4"
                />
                Crear partido personalizado (solo admin)
              </label>
            )}

              {!usarValoresPersonalizados ? (
              <>
                {partidosIguales || parseInt(cantidadPartidos, 10) === 1 ? (
                  <>
                    <h3 className="text-sm font-semibold">¿Qué tipo de partido vas a jugar?</h3>
                    <p className="text-xs text-muted-foreground">
                      Selecciona la opción que se acomoda a tu partido. El precio está incluido.
                    </p>
                    <TipoPartidoCardGrid
                      tipos={tiposPartido}
                      selectedId={tipoPartidoId}
                      onSelect={(id) => {
                        setTipoPartidoId(id);
                        if (fieldErrors.tipo_partido_id) {
                          setFieldErrors((prev) => ({ ...prev, tipo_partido_id: undefined }));
                        }
                      }}
                      disabled={isLoading}
                      variant="default"
                      loading={loadingTipos}
                      error={errorTipos}
                    />
                    {fieldErrors.tipo_partido_id && (
                      <p className="text-sm text-destructive">{fieldErrors.tipo_partido_id}</p>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Tipos por partido</h3>
                    <p className="text-xs text-muted-foreground">
                      Elige el tipo para cada partido (ej: Fútbol 10, 11, 8).
                    </p>
                    {Array.from({ length: parseInt(cantidadPartidos, 10) || 1 }).map((_, idx) => (
                      <div key={idx} className="space-y-1">
                        <label className="text-sm font-medium">Partido {idx + 1}</label>
                        <Select
                          value={tiposPorPartido[idx] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setTiposPorPartido((prev) => {
                              const next = [...prev];
                              next[idx] = value;
                              return next;
                            });
                            if (fieldErrors[`tipo_partido_${idx}`]) {
                              setFieldErrors((prev) => ({ ...prev, [`tipo_partido_${idx}`]: undefined }));
                            }
                          }}
                          disabled={isLoading || loadingTipos}
                        >
                          <option value="">Selecciona tipo</option>
                          {tiposPartido.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.nombre}
                            </option>
                          ))}
                        </Select>
                        {fieldErrors[`tipo_partido_${idx}`] && (
                          <p className="text-sm text-destructive">{fieldErrors[`tipo_partido_${idx}`]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div ref={servicioRef}>
                  <FormField
                    label="Valor del servicio árbitro"
                    name="servicio_arbitro"
                    type="number"
                    min={0}
                    step={1000}
                    value={servicioArbitro}
                    onChange={(e) => {
                      setServicioArbitro(e.target.value);
                      if (fieldErrors.servicio_arbitro) {
                        setFieldErrors((prev) => ({ ...prev, servicio_arbitro: undefined }));
                      }
                    }}
                    error={fieldErrors.servicio_arbitro}
                    disabled={isLoading}
                    placeholder="Ej: 90000"
                    required
                  />
                </div>
                <div ref={comisionRef}>
                  <FormField
                    label="Comisión app"
                    name="comision_app"
                    type="number"
                    min={0}
                    step={1000}
                    value={comisionApp}
                    onChange={(e) => {
                      setComisionApp(e.target.value);
                      if (fieldErrors.comision_app) {
                        setFieldErrors((prev) => ({ ...prev, comision_app: undefined }));
                      }
                    }}
                    error={fieldErrors.comision_app}
                    disabled={isLoading}
                    placeholder="Ej: 15000"
                    required
                  />
                </div>
              </div>
            )}
            {fieldErrors.categoria_id && (
              <p className="text-sm text-destructive">{fieldErrors.categoria_id}</p>
            )}
          </div>

          {/* Cancha, barrio y dirección */}
          <div ref={lugarRef}>
            <FormField
              label="Nombre de la cancha"
              name="lugar"
              value={lugar}
              onChange={(e) => {
                setLugar(e.target.value);
                if (fieldErrors.lugar) {
                  setFieldErrors((prev) => ({ ...prev, lugar: undefined }));
                }
              }}
              error={fieldErrors.lugar}
              disabled={isLoading}
              placeholder="Ej: Cancha Los Olivos"
              required
            />
          </div>

          <div ref={barrioRef}>
            <FormField
              label="Barrio"
              name="barrio"
              value={barrio}
              onChange={(e) => {
                setBarrio(e.target.value);
                if (fieldErrors.barrio) {
                  setFieldErrors((prev) => ({ ...prev, barrio: undefined }));
                }
              }}
              error={fieldErrors.barrio}
              disabled={isLoading}
              placeholder="Ej: Belén Rosales"
              required
            />
          </div>

          <div ref={direccionRef}>
            <FormField
              label="Dirección"
              name="direccion"
              value={direccion}
              onChange={(e) => {
                setDireccion(e.target.value);
                if (fieldErrors.direccion) {
                  setFieldErrors((prev) => ({ ...prev, direccion: undefined }));
                }
              }}
              error={fieldErrors.direccion}
              disabled={isLoading}
              placeholder="Calle 123 #45-67"
              required
            />
          </div>

          <div ref={mapsRef}>
            <FormField
              label="Enlace Google Maps (Opcional)"
              name="ubicacion_maps_url"
              value={ubicacionMapsUrl}
              onChange={(e) => {
                setUbicacionMapsUrl(e.target.value);
                if (fieldErrors.ubicacion_maps_url) {
                  setFieldErrors((prev) => ({ ...prev, ubicacion_maps_url: undefined }));
                }
              }}
              error={fieldErrors.ubicacion_maps_url}
              disabled={isLoading}
              placeholder="Pega aquí el enlace de Google Maps"
            />
          </div>

          {/* Notas */}
          <FormField
            label="Detalles del partido (Opcional)"
            name="notas_cliente"
            value={notasCliente}
            onChange={(e) => setNotasCliente(e.target.value)}
            disabled={isLoading}
            placeholder="Detalles detallados del partido: duración de los tiempos, categoría, horario..."
            multiline
            rows={4}
          />

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading || !puedeEnviar} className="flex-1">
              {isLoading ? "Creando..." : "Crear Partido"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
