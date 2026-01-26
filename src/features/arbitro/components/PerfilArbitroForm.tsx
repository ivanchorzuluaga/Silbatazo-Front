/**
 * Formulario para crear/editar perfil de árbitro
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "@/components/forms";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useArbitro } from "../hooks/useArbitro";
import { useMunicipios } from "../hooks/useMunicipios";
import { useCategorias } from "../hooks/useCategorias";
import { authService } from "@/features/auth/services/auth.service";
import { validations } from "@/lib/validations";
import { ROUTES } from "@/lib/constants";
import type { Arbitro } from "../types/arbitro.types";

interface PerfilArbitroFormProps {
  arbitro?: Arbitro | null;
  onSuccess?: () => void;
}

export function PerfilArbitroForm({ arbitro, onSuccess }: PerfilArbitroFormProps) {
  const navigate = useNavigate();
  const { crearPerfil, actualizarPerfil, isLoading, error, clearError } = useArbitro();
  const { municipios, isLoading: municipiosLoading } = useMunicipios();
  const { categorias, isLoading: categoriasLoading } = useCategorias();

  const isEditMode = !!arbitro;

  // Estados para datos del usuario (nombre y email)
  const [firstName, setFirstName] = useState(arbitro?.first_name || "");
  const [lastName, setLastName] = useState(arbitro?.last_name || "");
  const [email, setEmail] = useState(arbitro?.email || "");

  // Inicializar estados desde el árbitro si existe
  const getInitialValues = () => {
    if (!arbitro) {
      return {
        telefono: "",
        fechaNacimiento: "",
        documentoIdentidad: "",
        biografia: "",
        experienciaAnos: "0",
        municipiosSeleccionados: [] as number[],
        categoriasSeleccionadas: [] as number[],
      };
    }

    return {
      telefono: arbitro.telefono || "",
      fechaNacimiento: arbitro.fecha_nacimiento ? arbitro.fecha_nacimiento.split("T")[0] : "",
      documentoIdentidad: arbitro.documento_identidad || "",
      biografia: arbitro.biografia || "",
      experienciaAnos: arbitro.experiencia_anos?.toString() || "0",
      municipiosSeleccionados: arbitro.municipios.map((m) => m.id),
      categoriasSeleccionadas: arbitro.categorias.map((c) => c.id),
    };
  };

  const initialValues = getInitialValues();

  // Estados del formulario
  const [telefono, setTelefono] = useState(initialValues.telefono);
  const [fechaNacimiento, setFechaNacimiento] = useState(initialValues.fechaNacimiento);
  const [documentoIdentidad, setDocumentoIdentidad] = useState(initialValues.documentoIdentidad);
  const [biografia, setBiografia] = useState(initialValues.biografia);
  const [experienciaAnos, setExperienciaAnos] = useState(initialValues.experienciaAnos);
  const [municipiosSeleccionados, setMunicipiosSeleccionados] = useState<number[]>(
    initialValues.municipiosSeleccionados
  );
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>(
    initialValues.categoriasSeleccionadas
  );

  const [fieldErrors, setFieldErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    telefono?: string;
    fecha_nacimiento?: string;
    documento_identidad?: string;
    biografia?: string;
    experiencia_anos?: string;
    municipios_ids?: string;
    categorias_ids?: string;
  }>({});

  // Sincronizar cuando cambia la prop arbitro
  useEffect(() => {
    if (arbitro) {
      const values = getInitialValues();
      setTelefono(values.telefono);
      setFechaNacimiento(values.fechaNacimiento);
      setDocumentoIdentidad(values.documentoIdentidad);
      setBiografia(values.biografia);
      setExperienciaAnos(values.experienciaAnos);
      setMunicipiosSeleccionados(values.municipiosSeleccionados);
      setCategoriasSeleccionadas(values.categoriasSeleccionadas);
      setFirstName(arbitro.first_name || "");
      setLastName(arbitro.last_name || "");
      setEmail(arbitro.email || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arbitro?.id]);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    // Validar email
    if (email) {
      if (!validations.email(email)) {
        errors.email = "El formato del correo electrónico no es válido";
      }
    }

    // Validar experiencia (requerido)
    const experienciaNum = parseInt(experienciaAnos);
    if (!experienciaAnos || isNaN(experienciaNum) || experienciaNum < 0 || experienciaNum > 100) {
      errors.experiencia_anos = "La experiencia debe ser un número entre 0 y 100";
    }

    // Validar municipios (al menos uno - requerido)
    if (municipiosSeleccionados.length === 0) {
      errors.municipios_ids = "Debes seleccionar al menos un municipio";
    }

    // Validar categorías (al menos una - requerido)
    if (categoriasSeleccionadas.length === 0) {
      errors.categorias_ids = "Debes seleccionar al menos una categoría";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      // Actualizar datos del usuario (nombre y email) si cambiaron
      const userData: { email?: string; first_name?: string; last_name?: string } = {};
      if (email !== (arbitro?.email || "")) {
        userData.email = email || undefined;
      }
      if (firstName !== (arbitro?.first_name || "")) {
        userData.first_name = firstName || undefined;
      }
      if (lastName !== (arbitro?.last_name || "")) {
        userData.last_name = lastName || undefined;
      }

      if (Object.keys(userData).length > 0) {
        try {
          await authService.updateProfile(userData);
        } catch (err) {
          // Si hay error en la actualización del usuario, capturar y mostrar
          if (err instanceof Error) {
            const errorMessage = err.message.toLowerCase();
            if (errorMessage.includes("email") && errorMessage.includes("uso")) {
              setFieldErrors((prev) => ({
                ...prev,
                email: "Este correo electrónico ya está en uso",
              }));
            } else {
              setFieldErrors((prev) => ({
                ...prev,
                email: err.message,
              }));
            }
            throw err; // Re-lanzar para que se muestre el error general también
          }
          throw err;
        }
      }

      // Actualizar datos del perfil de árbitro
      const data = {
        telefono: telefono || undefined,
        fecha_nacimiento: fechaNacimiento || undefined,
        documento_identidad: documentoIdentidad || undefined,
        biografia: biografia || undefined,
        experiencia_anos: parseInt(experienciaAnos),
        municipios_ids: municipiosSeleccionados,
        categorias_ids: categoriasSeleccionadas,
      };

      if (isEditMode) {
        await actualizarPerfil(data);
      } else {
        await crearPerfil(data);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(ROUTES.ARBITRO_DASHBOARD);
      }
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al guardar perfil:", err);
    }
  };

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setMunicipiosSeleccionados(selectedOptions);
    if (fieldErrors.municipios_ids) {
      setFieldErrors((prev) => ({ ...prev, municipios_ids: undefined }));
    }
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setCategoriasSeleccionadas(selectedOptions);
    if (fieldErrors.categorias_ids) {
      setFieldErrors((prev) => ({ ...prev, categorias_ids: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Información de Usuario */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Información de Usuario</h3>
          <p className="text-sm text-muted-foreground">
            Datos de tu cuenta (nombre y correo electrónico)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Nombre"
            name="first_name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (fieldErrors.first_name) {
                setFieldErrors((prev) => ({ ...prev, first_name: undefined }));
              }
            }}
            error={fieldErrors.first_name}
            disabled={isLoading}
            placeholder="Juan"
          />

          <FormField
            label="Apellido"
            name="last_name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (fieldErrors.last_name) {
                setFieldErrors((prev) => ({ ...prev, last_name: undefined }));
              }
            }}
            error={fieldErrors.last_name}
            disabled={isLoading}
            placeholder="Pérez"
          />
        </div>

        <FormField
          label="Correo Electrónico"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }
            // Validación en tiempo real del formato
            if (e.target.value && !validations.email(e.target.value)) {
              setFieldErrors((prev) => ({
                ...prev,
                email: "El formato del correo electrónico no es válido",
              }));
            }
          }}
          error={fieldErrors.email}
          disabled={isLoading}
          placeholder="juan.perez@example.com"
          autoComplete="email"
        />
      </div>

      {/* Información Personal */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Información Personal</h3>
          <p className="text-sm text-muted-foreground">
            Datos básicos de contacto e identificación
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Teléfono"
            name="telefono"
            type="tel"
            value={telefono}
            onChange={(e) => {
              setTelefono(e.target.value);
              if (fieldErrors.telefono) {
                setFieldErrors((prev) => ({ ...prev, telefono: undefined }));
              }
            }}
            error={fieldErrors.telefono}
            disabled={isLoading}
            placeholder="+57 300 123 4567"
          />

          <FormField
            label="Fecha de Nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => {
              setFechaNacimiento(e.target.value);
              if (fieldErrors.fecha_nacimiento) {
                setFieldErrors((prev) => ({ ...prev, fecha_nacimiento: undefined }));
              }
            }}
            error={fieldErrors.fecha_nacimiento}
            disabled={isLoading}
          />
        </div>

        <FormField
          label="Documento de Identidad"
          name="documento_identidad"
          value={documentoIdentidad}
          onChange={(e) => {
            setDocumentoIdentidad(e.target.value);
            if (fieldErrors.documento_identidad) {
              setFieldErrors((prev) => ({ ...prev, documento_identidad: undefined }));
            }
          }}
          error={fieldErrors.documento_identidad}
          disabled={isLoading}
          placeholder="1234567890"
        />

        <div className="space-y-2">
          <label htmlFor="biografia" className="text-sm font-medium text-foreground block">
            Biografía
          </label>
          <textarea
            id="biografia"
            name="biografia"
            value={biografia}
            onChange={(e) => {
              setBiografia(e.target.value);
              if (fieldErrors.biografia) {
                setFieldErrors((prev) => ({ ...prev, biografia: undefined }));
              }
            }}
            disabled={isLoading}
            rows={4}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe tu experiencia y formación como árbitro..."
          />
          {fieldErrors.biografia && (
            <p className="text-sm text-destructive">{fieldErrors.biografia}</p>
          )}
        </div>
      </div>

      {/* Información Profesional */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Información Profesional</h3>
          <p className="text-sm text-muted-foreground">Datos sobre tu experiencia</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Años de Experiencia"
            name="experiencia_anos"
            type="number"
            value={experienciaAnos}
            onChange={(e) => {
              const value = e.target.value;
              setExperienciaAnos(value);
              if (fieldErrors.experiencia_anos) {
                setFieldErrors((prev) => ({ ...prev, experiencia_anos: undefined }));
              }
              // Validación en tiempo real
              const numValue = parseInt(value);
              if (value && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
                setFieldErrors((prev) => ({
                  ...prev,
                  experiencia_anos: "La experiencia debe ser un número entre 0 y 100",
                }));
              }
            }}
            error={fieldErrors.experiencia_anos}
            disabled={isLoading}
            min="0"
            max="100"
            required
            helperText="Años de experiencia como árbitro"
          />
        </div>
      </div>

      {/* Ubicación y Especialidades */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold">Ubicación y Especialidades</h3>
          <p className="text-sm text-muted-foreground">
            Municipios donde trabajas y categorías que manejas
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="municipios" className="text-sm font-medium text-foreground block">
            Municipios <span className="text-destructive">*</span>
          </label>
          <Select
            id="municipios"
            name="municipios"
            multiple
            value={municipiosSeleccionados.map(String)}
            onChange={handleMunicipioChange}
            disabled={isLoading || municipiosLoading}
            className={
              fieldErrors.municipios_ids ? "border-destructive min-h-[120px]" : "min-h-[120px]"
            }
            size={5}
          >
            {municipios.map((municipio) => (
              <option key={municipio.id} value={municipio.id}>
                {municipio.nombre}
                {municipio.departamento && `, ${municipio.departamento}`}
              </option>
            ))}
          </Select>
          {fieldErrors.municipios_ids && (
            <p className="text-sm text-destructive">{fieldErrors.municipios_ids}</p>
          )}
          {municipiosSeleccionados.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {municipiosSeleccionados.length}{" "}
              {municipiosSeleccionados.length === 1
                ? "municipio seleccionado"
                : "municipios seleccionados"}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="categorias" className="text-sm font-medium text-foreground block">
            Categorías <span className="text-destructive">*</span>
          </label>
          <Select
            id="categorias"
            name="categorias"
            multiple
            value={categoriasSeleccionadas.map(String)}
            onChange={handleCategoriaChange}
            disabled={isLoading || categoriasLoading}
            className={
              fieldErrors.categorias_ids ? "border-destructive min-h-[120px]" : "min-h-[120px]"
            }
            size={5}
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Select>
          {fieldErrors.categorias_ids && (
            <p className="text-sm text-destructive">{fieldErrors.categorias_ids}</p>
          )}
          {categoriasSeleccionadas.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {categoriasSeleccionadas.length}{" "}
              {categoriasSeleccionadas.length === 1
                ? "categoría seleccionada"
                : "categorías seleccionadas"}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading || municipiosLoading || categoriasLoading}
          className="flex-1"
        >
          {isLoading ? "Guardando..." : isEditMode ? "Actualizar Perfil" : "Crear Perfil"}
        </Button>
        {isEditMode && (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.ARBITRO_DASHBOARD)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
