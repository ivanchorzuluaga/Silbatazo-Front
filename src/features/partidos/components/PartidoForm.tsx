/**
 * Formulario para crear un partido
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "@/components/forms";
import { TimePicker24h } from "@/components/forms/TimePicker24h";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { usePartido } from "../hooks/usePartido";
import { useMunicipios } from "@/features/arbitro/hooks/useMunicipios";
import { useCategorias } from "@/features/arbitro/hooks/useCategorias";
import { ROUTES } from "@/lib/constants";

interface PartidoFormProps {
  onSuccess?: () => void;
}

export function PartidoForm({ onSuccess }: PartidoFormProps) {
  const navigate = useNavigate();
  const { crearPartido, isLoading, error, clearError } = usePartido();
  const { municipios, isLoading: municipiosLoading } = useMunicipios();
  const { categorias, isLoading: categoriasLoading } = useCategorias();

  // Estados del formulario
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [municipioId, setMunicipioId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [lugar, setLugar] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notasCliente, setNotasCliente] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [partidoCreado, setPartidoCreado] = useState<{ id: number; estado: string } | null>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    // Validaciones básicas
    const errors: Record<string, string> = {};
    if (!fecha) errors.fecha = "La fecha es requerida";
    if (!hora) errors.hora = "La hora es requerida";
    if (!municipioId) errors.municipio_id = "Debes seleccionar un municipio";
    if (!categoriaId) errors.categoria_id = "Debes seleccionar una categoría";
    if (!lugar.trim()) errors.lugar = "El lugar es requerido";

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
      const data = {
        arbitro_id: null, // Siempre crear sin árbitro (buscando árbitro)
        fecha,
        hora: hora.length === 5 ? hora : hora.substring(0, 5), // Asegurar formato HH:MM
        municipio_id: parseInt(municipioId),
        categoria_id: parseInt(categoriaId),
        lugar: lugar.trim(),
        direccion: direccion.trim() || undefined,
        notas_cliente: notasCliente.trim() || undefined,
      };

      const nuevoPartido = await crearPartido(data);

      // Mostrar mensaje de éxito
      setPartidoCreado({
        id: nuevoPartido.id,
        estado: nuevoPartido.estado,
      });
      setShowSuccess(true);

      // Limpiar formulario
      setFecha("");
      setHora("");
      setMunicipioId("");
      setCategoriaId("");
      setLugar("");
      setDireccion("");
      setNotasCliente("");
      setFieldErrors({});
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al crear partido:", err);
      setShowSuccess(false);
      setPartidoCreado(null);
    }
  };

  const handleAceptar = () => {
    setShowSuccess(false);
    setPartidoCreado(null);
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(ROUTES.PARTIDOS);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showSuccess && partidoCreado ? (
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
              El partido #{partidoCreado.id} ha sido creado y está <strong>buscando árbitro</strong>
              . Los árbitros podrán postularse y un administrador asignará el árbitro final.
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
            <p className="text-sm font-medium mb-1">Crear partido sin árbitro asignado</p>
            <p className="text-xs text-muted-foreground">
              El partido quedará disponible para que los árbitros se postulen. Un administrador
              asignará el árbitro final.
            </p>
          </div>

          {/* Fecha y Hora */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Fecha del Partido"
              name="fecha"
              type="date"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                if (fieldErrors.fecha) {
                  setFieldErrors((prev) => ({ ...prev, fecha: undefined }));
                }
              }}
              error={fieldErrors.fecha}
              disabled={isLoading}
              required
            />

            <div className="space-y-2">
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

          {/* Municipio y Categoría */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
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
                <option value="">Selecciona un municipio</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.id}>
                    {municipio.nombre}
                    {municipio.departamento && `, ${municipio.departamento}`}
                  </option>
                ))}
              </Select>
              {fieldErrors.municipio_id && (
                <p className="text-sm text-destructive">{fieldErrors.municipio_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="categoria_id" className="text-sm font-medium">
                Categoría <span className="text-destructive">*</span>
              </label>
              <Select
                id="categoria_id"
                value={categoriaId}
                onChange={(e) => {
                  setCategoriaId(e.target.value);
                  if (fieldErrors.categoria_id) {
                    setFieldErrors((prev) => ({ ...prev, categoria_id: undefined }));
                  }
                }}
                disabled={isLoading || categoriasLoading}
                className={fieldErrors.categoria_id ? "border-destructive" : ""}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Select>
              {fieldErrors.categoria_id && (
                <p className="text-sm text-destructive">{fieldErrors.categoria_id}</p>
              )}
            </div>
          </div>

          {/* Lugar y Dirección */}
          <FormField
            label="Lugar"
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

          <FormField
            label="Dirección (Opcional)"
            name="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            disabled={isLoading}
            placeholder="Calle 123 #45-67"
          />

          {/* Resumen de pago */}
          {categoriaId &&
            (() => {
              const categoriaSeleccionada = categorias.find((c) => c.id === parseInt(categoriaId));
              if (!categoriaSeleccionada) return null;

              const tarifa = parseFloat(categoriaSeleccionada.tarifa);
              return (
                <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resumen de Pago</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Categoría:{" "}
                        <span className="font-medium">{categoriaSeleccionada.nombre}</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tarifa del partido:</span>
                      <span className="text-lg font-semibold text-foreground">
                        ${tarifa.toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t-2 border-primary/30">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">Total a pagar:</span>
                      <span className="text-2xl font-bold text-primary">
                        ${tarifa.toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground pt-2 border-t border-primary/10">
                    El pago se procesará al confirmar la creación del partido
                  </p>
                </div>
              );
            })()}

          {/* Notas */}
          <FormField
            label="Notas Adicionales (Opcional)"
            name="notas_cliente"
            value={notasCliente}
            onChange={(e) => setNotasCliente(e.target.value)}
            disabled={isLoading}
            placeholder="Información adicional sobre el partido..."
            multiline
            rows={4}
          />

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
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
