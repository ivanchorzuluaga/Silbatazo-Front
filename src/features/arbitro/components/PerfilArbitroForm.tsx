/**
 * Formulario para crear/editar perfil de árbitro
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FormField, DateField } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useArbitro } from "../hooks/useArbitro";
import { useMunicipios } from "../hooks/useMunicipios";
import { useCategorias } from "../hooks/useCategorias";
import { useRoles } from "../hooks/useRoles";
import { authService } from "@/features/auth/services/auth.service";
import { validations } from "@/lib/validations";
import {
  ROUTES,
  CATEGORIAS_PARTIDO,
  MAX_FOTO_PERFIL_MB,
} from "@/lib/constants";
import { getRefereeImage } from "@/lib/referee-images";
import { Camera } from "lucide-react";
import type { Arbitro } from "../types/arbitro.types";
import { useAuth } from "@/hooks/useAuth";

interface PerfilArbitroFormProps {
  arbitro?: Arbitro | null;
  onSuccess?: () => void;
  focusSection?: "personal" | "experiencia" | null;
  onGuardarPerfil?: (payload: {
    userData: {
      email?: string;
      first_name?: string;
      last_name?: string;
      telefono?: string;
    };
    perfilData: {
      telefono: string;
      fecha_nacimiento?: string;
      documento_identidad?: string;
      biografia?: string;
      nombre_publico?: string;
      identificador_publico?: number;
      experiencia_anos: number;
      municipios_ids: number[];
      categorias_ids: number[];
      roles_ids: number[];
    };
    fotoFile: File | null;
    fotoDetalleFile: File | null;
  }) => Promise<void>;
  isLoadingOverride?: boolean;
  errorOverride?: string | null;
}

export function PerfilArbitroForm({
  arbitro,
  onSuccess,
  focusSection,
  onGuardarPerfil,
  isLoadingOverride,
  errorOverride,
}: PerfilArbitroFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    crearPerfil,
    actualizarPerfil,
    subirFotoPerfil,
    subirFotoDetallePerfil,
    isLoading,
    error,
    clearError,
  } = useArbitro();
  const { municipios, isLoading: municipiosLoading } = useMunicipios();
  const { categorias, isLoading: categoriasLoading } = useCategorias();
  const categoriasPartido = categorias.filter((c) =>
    (CATEGORIAS_PARTIDO as readonly string[]).includes(c.nombre),
  );
  const { roles, isLoading: rolesLoading } = useRoles();

  const isEditMode = !!arbitro;
  const showPersonal = !focusSection || focusSection === "personal";
  const showExperiencia = !focusSection || focusSection === "experiencia";
  const isAdmin = user?.role === "admin";
  const minFechaNacimiento = useMemo(() => new Date(1900, 0, 1), []);
  const maxFechaNacimiento = useMemo(() => new Date(), []);

  // Estados para datos del usuario (nombre y email)
  const [firstName, setFirstName] = useState(
    arbitro?.first_name || user?.first_name || "",
  );
  const [lastName, setLastName] = useState(
    arbitro?.last_name || user?.last_name || "",
  );
  const [email, setEmail] = useState(arbitro?.email || user?.email || "");
  const [nombrePublico, setNombrePublico] = useState(
    arbitro?.nombre_publico || "",
  );
  const [maxNombrePublico, setMaxNombrePublico] = useState(28);
  const [identificadorPublico, setIdentificadorPublico] = useState(
    arbitro?.identificador_publico?.toString() || "",
  );

  // Inicializar estados desde el árbitro si existe
  const getInitialValues = () => {
    if (!arbitro) {
      return {
        telefono: user?.telefono || "",
        fechaNacimiento: "",
        documentoIdentidad: "",
        biografia: "",
        experienciaAnos: "0",
        municipiosSeleccionados: [] as number[],
        categoriasSeleccionadas: [] as number[],
        rolesSeleccionados: [] as number[],
      };
    }

    return {
      telefono: arbitro.telefono || "",
      fechaNacimiento: arbitro.fecha_nacimiento
        ? arbitro.fecha_nacimiento.split("T")[0]
        : "",
      documentoIdentidad: arbitro.documento_identidad || "",
      biografia: arbitro.biografia || "",
      experienciaAnos: arbitro.experiencia_anos?.toString() || "0",
      municipiosSeleccionados: arbitro.municipios.map((m) => m.id),
      categoriasSeleccionadas: arbitro.categorias.map((c) => c.id),
      rolesSeleccionados: (arbitro.roles ?? []).map((r) => r.id),
    };
  };

  const initialValues = getInitialValues();

  // Estados del formulario
  const [telefono, setTelefono] = useState(initialValues.telefono);
  const [fechaNacimiento, setFechaNacimiento] = useState(
    initialValues.fechaNacimiento,
  );
  const [documentoIdentidad, setDocumentoIdentidad] = useState(
    initialValues.documentoIdentidad,
  );
  const [biografia, setBiografia] = useState(initialValues.biografia);
  const [experienciaAnos, setExperienciaAnos] = useState(
    initialValues.experienciaAnos,
  );
  const [municipiosSeleccionados, setMunicipiosSeleccionados] = useState<
    number[]
  >(initialValues.municipiosSeleccionados);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<
    number[]
  >(initialValues.categoriasSeleccionadas);
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>(
    initialValues.rolesSeleccionados,
  );
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const [fotoDetalleFile, setFotoDetalleFile] = useState<File | null>(null);
  const [previewDetalleUrl, setPreviewDetalleUrl] = useState<string | null>(null);
  const [fotoDetalleError, setFotoDetalleError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileDetalleInputRef = useRef<HTMLInputElement>(null);
  const personalRef = useRef<HTMLDivElement | null>(null);
  const experienciaRef = useRef<HTMLDivElement | null>(null);
  const nombrePublicoRef = useRef<HTMLDivElement | null>(null);

  const [fieldErrors, setFieldErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    nombre_publico?: string;
    identificador_publico?: string;
    telefono?: string;
    fecha_nacimiento?: string;
    documento_identidad?: string;
    biografia?: string;
    experiencia_anos?: string;
    municipios_ids?: string;
    categorias_ids?: string;
    roles_ids?: string;
  }>({});
  const isFormBusy = Boolean(isLoadingOverride ?? isSaving ?? isLoading);

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
      setRolesSeleccionados(values.rolesSeleccionados);
      setFirstName(arbitro.first_name || "");
      setLastName(arbitro.last_name || "");
      setEmail(arbitro.email || "");
      setNombrePublico(arbitro.nombre_publico || "");
      setIdentificadorPublico(arbitro.identificador_publico?.toString() || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arbitro?.id]);

  useEffect(() => {
    if (arbitro) return;
    if (user?.first_name && !firstName) setFirstName(user.first_name);
    if (user?.last_name && !lastName) setLastName(user.last_name);
    if (user?.email && !email) setEmail(user.email);
    if (user?.telefono && !telefono) setTelefono(user.telefono);
  }, [arbitro, user, firstName, lastName, email, telefono]);

  useEffect(() => {
    if (!focusSection) return;
    const target =
      focusSection === "personal"
        ? personalRef.current
        : experienciaRef.current;
    if (!target) return;
    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [focusSection]);

  useEffect(() => {
    const node = nombrePublicoRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width || 0;
      if (!width) return;
      // Estimación simple: ~11px por carácter en mayúsculas + padding del input.
      const maxChars = Math.max(
        12,
        Math.min(36, Math.floor((width - 48) / 11)),
      );
      setMaxNombrePublico(maxChars);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Revocar object URL al desmontar o al cambiar de archivo
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (previewDetalleUrl) {
        URL.revokeObjectURL(previewDetalleUrl);
      }
    };
  }, [previewUrl, previewDetalleUrl]);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    // Validar email
    if (showPersonal && email) {
      if (!validations.email(email)) {
        errors.email = "El formato del correo electrónico no es válido";
      }
    }

    if (
      showPersonal &&
      nombrePublico &&
      nombrePublico.length > maxNombrePublico
    ) {
      errors.nombre_publico = `Máximo ${maxNombrePublico} caracteres`;
    }

    if (showPersonal && !telefono?.trim()) {
      errors.telefono = "El teléfono es requerido";
    }

    if (showPersonal && !documentoIdentidad?.trim()) {
      errors.documento_identidad = "El número de documento es requerido";
    }

    if (isAdmin && identificadorPublico.trim()) {
      const idPublico = parseInt(identificadorPublico, 10);
      if (Number.isNaN(idPublico) || idPublico <= 0) {
        errors.identificador_publico = "Debe ser un número entero mayor a 0";
      }
    }

    if (showExperiencia) {
      // Validar experiencia (requerido)
      const experienciaNum = parseInt(experienciaAnos);
      if (
        !experienciaAnos ||
        isNaN(experienciaNum) ||
        experienciaNum < 0 ||
        experienciaNum > 100
      ) {
        errors.experiencia_anos =
          "La experiencia debe ser un número entre 0 y 100";
      }

      // Validar municipios (al menos uno - requerido)
      if (municipiosSeleccionados.length === 0) {
        errors.municipios_ids = "Debes seleccionar al menos un municipio";
      }

      // Validar categorías (al menos una - requerido)
      if (categoriasSeleccionadas.length === 0) {
        errors.categorias_ids = "Debes seleccionar al menos una categoría";
      }

      // Validar roles (al menos uno - requerido)
      if (rolesSeleccionados.length === 0) {
        errors.roles_ids = "Debes seleccionar al menos un rol";
      }

    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!validateForm()) {
      return;
    }

    try {
      // Actualizar datos del usuario (nombre y email) si cambiaron
      const userData: {
        email?: string;
        first_name?: string;
        last_name?: string;
        telefono?: string;
      } = {};
      if (email !== (arbitro?.email || "")) {
        userData.email = email || undefined;
      }
      if (firstName !== (arbitro?.first_name || "")) {
        userData.first_name = firstName || undefined;
      }
      if (lastName !== (arbitro?.last_name || "")) {
        userData.last_name = lastName || undefined;
      }
      if (telefono?.trim()) {
        userData.telefono = telefono.trim();
      }

      if (!onGuardarPerfil && Object.keys(userData).length > 0) {
        try {
          await authService.updateProfile(userData);
        } catch (err) {
          // Si hay error en la actualización del usuario, capturar y mostrar
          if (err instanceof Error) {
            const errorMessage = err.message.toLowerCase();
            if (
              errorMessage.includes("email") &&
              errorMessage.includes("uso")
            ) {
              setFieldErrors((prev) => ({
                ...prev,
                email: "Este correo electrónico ya está en uso",
              }));
            } else if (
              errorMessage.includes("contacto") ||
              errorMessage.includes("teléfono")
            ) {
              setFieldErrors((prev) => ({
                ...prev,
                telefono: err.message,
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
        telefono: telefono.trim(),
        fecha_nacimiento: fechaNacimiento || undefined,
        documento_identidad: documentoIdentidad.trim() || undefined,
        biografia: biografia || undefined,
        nombre_publico: nombrePublico.trim() || undefined,
        ...(isAdmin && identificadorPublico.trim()
          ? { identificador_publico: parseInt(identificadorPublico, 10) }
          : {}),
        experiencia_anos: parseInt(experienciaAnos),
        municipios_ids: municipiosSeleccionados,
        categorias_ids: categoriasSeleccionadas,
        roles_ids: rolesSeleccionados,
      };

      if (onGuardarPerfil) {
        setIsSaving(true);
        await onGuardarPerfil({
          userData,
          perfilData: data,
          fotoFile,
          fotoDetalleFile,
        });
        setIsSaving(false);
        if (fotoFile) {
          setFotoFile(null);
          setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
        }
        if (fotoDetalleFile) {
          setFotoDetalleFile(null);
          setPreviewDetalleUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
        }
        if (onSuccess) {
          onSuccess();
        }
        return;
      }

      if (isEditMode) {
        if (fotoFile) {
          await subirFotoPerfil(fotoFile);
          setFotoFile(null);
          setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
        }
        if (fotoDetalleFile) {
          await subirFotoDetallePerfil(fotoDetalleFile);
          setFotoDetalleFile(null);
          setPreviewDetalleUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
        }
        await actualizarPerfil(data);
      } else {
        await crearPerfil(data);
        if (fotoFile) {
          await subirFotoPerfil(fotoFile);
          setFotoFile(null);
          setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
        }
        if (fotoDetalleFile) {
          await subirFotoDetallePerfil(fotoDetalleFile);
          setFotoDetalleFile(null);
          setPreviewDetalleUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(ROUTES.ARBITRO_DASHBOARD);
      }
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al guardar perfil:", err);
      if (onGuardarPerfil) {
        setLocalError(err instanceof Error ? err.message : "Error al guardar perfil");
        setIsSaving(false);
      }
    }
  };

  const toggleMunicipio = (id: number) => {
    setMunicipiosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    if (fieldErrors.municipios_ids) {
      setFieldErrors((prev) => ({ ...prev, municipios_ids: undefined }));
    }
  };

  const toggleCategoria = (id: number) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    if (fieldErrors.categorias_ids) {
      setFieldErrors((prev) => ({ ...prev, categorias_ids: undefined }));
    }
  };

  const toggleRol = (id: number) => {
    setRolesSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    if (fieldErrors.roles_ids) {
      setFieldErrors((prev) => ({ ...prev, roles_ids: undefined }));
    }
  };

  const nombreCompleto =
    [firstName, lastName].filter(Boolean).join(" ") ||
    arbitro?.full_name ||
    arbitro?.username ||
    "";
  const imagenPerfil =
    previewUrl ||
    getRefereeImage(
      arbitro?.foto_perfil,
      arbitro?.id ?? 0,
      arbitro?.experiencia_anos,
      nombreCompleto,
      arbitro?.foto_perfil_thumb,
    );
  const imagenDetalle =
    previewDetalleUrl ||
    arbitro?.foto_detalle ||
    arbitro?.foto_perfil ||
    imagenPerfil;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(errorOverride ?? localError ?? error) && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">
            {errorOverride ?? localError ?? error}
          </p>
        </div>
      )}

      {showPersonal && (
        <div ref={personalRef} className="space-y-6">
          {/* Foto de perfil */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">Foto de perfil</h3>
              <p className="text-sm text-muted-foreground">
                Se mostrará en el marketplace y en tu perfil. Formatos: JPG,
                PNG.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="rounded-full overflow-hidden border-2 border-border bg-muted w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                <img
                  src={imagenPerfil}
                  alt="Vista previa de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const maxBytes = MAX_FOTO_PERFIL_MB * 1024 * 1024;
                      if (file.size > maxBytes) {
                        setFotoError(
                          `La imagen supera el tamaño máximo de ${MAX_FOTO_PERFIL_MB} MB.`,
                        );
                        e.currentTarget.value = "";
                        return;
                      }
                      setFotoError(null);
                      setPreviewUrl((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return URL.createObjectURL(file);
                      });
                      setFotoFile(file);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isFormBusy}
                >
                  <Camera className="mr-2 size-4" />
                  {arbitro?.foto_perfil || fotoFile
                    ? "Cambiar foto"
                    : "Subir foto"}
                </Button>
                {(fotoFile || arbitro?.foto_perfil) && (
                  <p className="text-xs text-muted-foreground">
                    {fotoFile
                      ? `Nueva imagen: ${fotoFile.name}. Se guardará al enviar el formulario.`
                      : "Tu foto se muestra en el marketplace."}
                  </p>
                )}
                {fotoError && (
                  <p className="text-xs text-destructive">{fotoError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Foto de detalle */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">Foto para detalle</h3>
              <p className="text-sm text-muted-foreground">
                Se usará en la vista de detalle. Sube una imagen recortada sin fondo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="rounded-2xl overflow-hidden border-2 border-border bg-muted w-24 h-32 sm:w-28 sm:h-36 shrink-0">
                <img
                  src={imagenDetalle}
                  alt="Vista previa de detalle"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileDetalleInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const maxBytes = MAX_FOTO_PERFIL_MB * 1024 * 1024;
                      if (file.size > maxBytes) {
                        setFotoDetalleError(
                          `La imagen supera el tamaño máximo de ${MAX_FOTO_PERFIL_MB} MB.`,
                        );
                        e.currentTarget.value = "";
                        return;
                      }
                      setFotoDetalleError(null);
                      setPreviewDetalleUrl((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return URL.createObjectURL(file);
                      });
                      setFotoDetalleFile(file);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileDetalleInputRef.current?.click()}
                  disabled={isFormBusy}
                >
                  <Camera className="mr-2 size-4" />
                  {arbitro?.foto_detalle || fotoDetalleFile
                    ? "Cambiar foto de detalle"
                    : "Subir foto de detalle"}
                </Button>
                {(fotoDetalleFile || arbitro?.foto_detalle) && (
                  <p className="text-xs text-muted-foreground">
                    {fotoDetalleFile
                      ? `Nueva imagen: ${fotoDetalleFile.name}. Se guardará al enviar el formulario.`
                      : "La foto se muestra en la vista de detalle."}
                  </p>
                )}
                {fotoDetalleError && (
                  <p className="text-xs text-destructive">{fotoDetalleError}</p>
                )}
              </div>
            </div>
          </div>

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
                    setFieldErrors((prev) => ({
                      ...prev,
                      first_name: undefined,
                    }));
                  }
                }}
                error={fieldErrors.first_name}
                disabled={isFormBusy}
                placeholder="Juan"
              />

              <FormField
                label="Apellido"
                name="last_name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (fieldErrors.last_name) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      last_name: undefined,
                    }));
                  }
                }}
                error={fieldErrors.last_name}
                disabled={isFormBusy}
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
              disabled={isFormBusy}
              placeholder="juan.perez@example.com"
              autoComplete="email"
            />

            <div ref={nombrePublicoRef} className="space-y-2">
              <FormField
                label="Nombre público"
                name="nombre_publico"
                value={nombrePublico}
                onChange={(e) => {
                  const next = e.target.value;
                  setNombrePublico(next.slice(0, maxNombrePublico));
                  if (fieldErrors.nombre_publico) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      nombre_publico: undefined,
                    }));
                  }
                }}
                error={fieldErrors.nombre_publico}
                disabled={isFormBusy}
                placeholder="Ej: Árbitro Sibatzo"
                maxLength={maxNombrePublico}
                helperText={`Máximo ${maxNombrePublico} caracteres. Este nombre se mostrará en tu tarjeta pública.`}
              />
            </div>

            {isAdmin && (
              <FormField
                label="Identificador público"
                name="identificador_publico"
                type="number"
                value={identificadorPublico}
                onChange={(e) => {
                  setIdentificadorPublico(e.target.value);
                  if (fieldErrors.identificador_publico) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      identificador_publico: undefined,
                    }));
                  }
                }}
                error={fieldErrors.identificador_publico}
                disabled={isFormBusy}
                min="1"
                placeholder="Ej: 36"
                helperText="Solo administración: número visible en la tarjeta del árbitro."
              />
            )}

          </div>

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
                    setFieldErrors((prev) => ({
                      ...prev,
                      telefono: undefined,
                    }));
                  }
                }}
                error={fieldErrors.telefono}
                disabled={isFormBusy}
                placeholder="+57 300 123 4567"
                required
              />

              <DateField
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                value={fechaNacimiento}
                onChange={(value) => {
                  setFechaNacimiento(value);
                  if (fieldErrors.fecha_nacimiento) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      fecha_nacimiento: undefined,
                    }));
                  }
                }}
                error={fieldErrors.fecha_nacimiento}
                disabled={isFormBusy}
                minDate={minFechaNacimiento}
                maxDate={maxFechaNacimiento}
              />
            </div>

            <FormField
              label="Documento de Identidad"
              name="documento_identidad"
              value={documentoIdentidad}
              onChange={(e) => {
                setDocumentoIdentidad(e.target.value);
                if (fieldErrors.documento_identidad) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    documento_identidad: undefined,
                  }));
                }
              }}
              error={fieldErrors.documento_identidad}
              disabled={isFormBusy}
              placeholder="1234567890"
              required
            />

            <div className="space-y-2">
              <label
                htmlFor="biografia"
                className="text-sm font-medium text-foreground block"
              >
                Biografía
              </label>
              <textarea
                id="biografia"
                name="biografia"
                value={biografia}
                onChange={(e) => {
                  setBiografia(e.target.value);
                  if (fieldErrors.biografia) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      biografia: undefined,
                    }));
                  }
                }}
                disabled={isFormBusy}
                rows={4}
                className="field-textarea"
                placeholder="Describe tu experiencia y formación como árbitro..."
              />
              {fieldErrors.biografia && (
                <p className="text-sm text-destructive">
                  {fieldErrors.biografia}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {showExperiencia && (
        <div ref={experienciaRef} className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold">Información de arbitraje</h3>
            <p className="text-sm text-muted-foreground">
              Datos sobre tu experiencia
            </p>
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
                  setFieldErrors((prev) => ({
                    ...prev,
                    experiencia_anos: undefined,
                  }));
                }
                // Validación en tiempo real
                const numValue = parseInt(value);
                if (
                  value &&
                  (isNaN(numValue) || numValue < 0 || numValue > 100)
                ) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    experiencia_anos:
                      "La experiencia debe ser un número entre 0 y 100",
                  }));
                }
              }}
              error={fieldErrors.experiencia_anos}
              disabled={isFormBusy}
              min="0"
              max="100"
              required
              helperText="Años de experiencia como árbitro"
            />
          </div>

          {/* Ubicación y Especialidades */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold">
                Ubicación y Especialidades
              </h3>
              <p className="text-sm text-muted-foreground">
                Municipios donde trabajas, categorías y roles que manejas
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Municipios <span className="text-destructive">*</span>
              </label>
              <div
                className={`max-h-56 overflow-y-auto rounded-2xl border p-3 ${
                  fieldErrors.municipios_ids
                    ? "border-destructive"
                    : "border-border/80"
                }`}
              >
                {municipiosLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Cargando municipios...
                  </p>
                ) : municipios.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay municipios disponibles
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {municipios.map((municipio) => (
                      <label
                        key={municipio.id}
                        className="group relative flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 text-sm transition-all hover:border-primary/40 hover:bg-accent/40"
                      >
                        <input
                          type="checkbox"
                          checked={municipiosSeleccionados.includes(
                            municipio.id,
                          )}
                          onChange={() => toggleMunicipio(municipio.id)}
                          disabled={isFormBusy}
                          className="peer sr-only"
                        />
                        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-border/80 bg-background text-transparent transition-all peer-checked:border-primary peer-checked:bg-primary/15 peer-checked:text-primary">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="min-w-0 text-foreground">
                          {municipio.nombre}
                          {municipio.departamento &&
                            `, ${municipio.departamento}`}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {fieldErrors.municipios_ids && (
                <p className="text-sm text-destructive">
                  {fieldErrors.municipios_ids}
                </p>
              )}
              {municipiosSeleccionados.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {municipiosSeleccionados.length}{" "}
                  {municipiosSeleccionados.length === 1
                    ? "municipio seleccionado"
                    : "municipios seleccionados"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Categorías <span className="text-destructive">*</span>
              </label>
              <div
                className={`max-h-56 overflow-y-auto rounded-2xl border p-3 ${
                  fieldErrors.categorias_ids
                    ? "border-destructive"
                    : "border-border/80"
                }`}
              >
                {categoriasLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Cargando categorías...
                  </p>
                ) : categoriasPartido.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay categorías disponibles
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {categoriasPartido.map((categoria) => (
                      <label
                        key={categoria.id}
                        className="group relative flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 text-sm transition-all hover:border-primary/40 hover:bg-accent/40"
                      >
                        <input
                          type="checkbox"
                          checked={categoriasSeleccionadas.includes(
                            categoria.id,
                          )}
                          onChange={() => toggleCategoria(categoria.id)}
                          disabled={isFormBusy}
                          className="peer sr-only"
                        />
                        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-border/80 bg-background text-transparent transition-all peer-checked:border-primary peer-checked:bg-primary/15 peer-checked:text-primary">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="min-w-0 text-foreground">
                          {categoria.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {fieldErrors.categorias_ids && (
                <p className="text-sm text-destructive">
                  {fieldErrors.categorias_ids}
                </p>
              )}
              {categoriasSeleccionadas.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {categoriasSeleccionadas.length}{" "}
                  {categoriasSeleccionadas.length === 1
                    ? "categoría seleccionada"
                    : "categorías seleccionadas"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Roles que puedes cumplir{" "}
                <span className="text-destructive">*</span>
              </label>
              <div
                className={`max-h-56 overflow-y-auto rounded-2xl border p-3 ${
                  fieldErrors.roles_ids
                    ? "border-destructive"
                    : "border-border/80"
                }`}
              >
                {rolesLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Cargando roles...
                  </p>
                ) : roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay roles disponibles
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {roles.map((rol) => (
                      <label
                        key={rol.id}
                        className="group relative flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 text-sm transition-all hover:border-primary/40 hover:bg-accent/40"
                      >
                        <input
                          type="checkbox"
                          checked={rolesSeleccionados.includes(rol.id)}
                          onChange={() => toggleRol(rol.id)}
                          disabled={isFormBusy}
                          className="peer sr-only"
                        />
                        <span className="flex h-5 w-5 items-center justify-center rounded-md border border-border/80 bg-background text-transparent transition-all peer-checked:border-primary peer-checked:bg-primary/15 peer-checked:text-primary">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="min-w-0 text-foreground">
                          {rol.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {fieldErrors.roles_ids && (
                <p className="text-sm text-destructive">
                  {fieldErrors.roles_ids}
                </p>
              )}
              {rolesSeleccionados.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {rolesSeleccionados.length}{" "}
                  {rolesSeleccionados.length === 1
                    ? "rol seleccionado"
                    : "roles seleccionados"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={
            isFormBusy || municipiosLoading || categoriasLoading || rolesLoading
          }
          className="flex-1"
        >
          {isFormBusy
            ? "Actualizando..."
            : isEditMode
              ? "Actualizar Perfil"
              : "Crear Perfil"}
        </Button>
        {isEditMode && (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.ARBITRO_DASHBOARD)}
            disabled={isFormBusy}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
