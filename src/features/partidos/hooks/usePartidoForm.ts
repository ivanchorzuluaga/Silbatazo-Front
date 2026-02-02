/**
 * Hook para manejar la lógica del formulario de solicitud de partido
 * Separa la lógica de negocio del componente presentacional
 */

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePartido } from "./usePartido";
import { useMunicipios } from "@/features/arbitro/hooks/useMunicipios";
import { useCategorias } from "@/features/arbitro/hooks/useCategorias";
import { getTodayLocalDate, compareDates } from "@/lib/utils";
import { getPartidoPagoRoute } from "@/lib/constants";
import type { Arbitro } from "@/features/arbitro/types/arbitro.types";
import type { Municipio } from "@/features/arbitro/types/arbitro.types";
import type { Categoria } from "@/features/arbitro/types/arbitro.types";

interface FormState {
  fecha: string;
  hora: string;
  municipioId: string;
  categoriaId: string;
  lugar: string;
  direccion: string;
  notasCliente: string;
}

interface PartidoCreado {
  id: number;
  estado: string;
}

export interface UsePartidoFormReturn {
  // Estados del formulario
  formState: FormState;
  fieldErrors: Record<string, string | undefined>;
  showSuccess: boolean;
  partidoCreado: PartidoCreado | null;

  // Estados de carga y error
  isLoading: boolean;
  error: string | null;
  municipiosLoading: boolean;
  categoriasLoading: boolean;

  // Datos filtrados
  municipiosDisponibles: Municipio[];
  categoriasDisponibles: Categoria[];
  categoriaSeleccionada: Categoria | undefined;
  tarifa: number;

  // Acciones del formulario
  setFecha: (fecha: string) => void;
  setHora: (hora: string) => void;
  setMunicipioId: (id: string) => void;
  setCategoriaId: (id: string) => void;
  setLugar: (lugar: string) => void;
  setDireccion: (direccion: string) => void;
  setNotasCliente: (notas: string) => void;

  // Acciones principales
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleClose: () => void;
  handleAceptar: () => void;
  resetForm: () => void;
}

export function usePartidoForm(
  arbitro: Arbitro,
  open: boolean,
  onClose: () => void,
): UsePartidoFormReturn {
  const navigate = useNavigate();
  const { crearPartido, isLoading, error, clearError } = usePartido();
  const { municipios, isLoading: municipiosLoading } = useMunicipios();
  const { categorias, isLoading: categoriasLoading } = useCategorias();

  // Estados del formulario
  const [formState, setFormState] = useState<FormState>({
    fecha: "",
    hora: "",
    municipioId: "",
    categoriaId: "",
    lugar: "",
    direccion: "",
    notasCliente: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [partidoCreado, setPartidoCreado] = useState<PartidoCreado | null>(null);

  // Filtrar municipios y categorías según el árbitro
  const municipiosDisponibles = municipios.filter((municipio) =>
    arbitro.municipios.some((m) => m.id === municipio.id),
  );

  const categoriasDisponibles = categorias.filter((categoria) =>
    arbitro.categorias.some((c) => c.id === categoria.id),
  );

  // Categoría seleccionada y tarifa
  const categoriaSeleccionada = categoriasDisponibles.find(
    (c) => c.id === parseInt(formState.categoriaId),
  );
  const tarifa = categoriaSeleccionada ? parseFloat(categoriaSeleccionada.tarifa) : 0;

  // Funciones para actualizar campos individuales
  const setFecha = useCallback((fecha: string) => {
    setFormState((prev) => ({ ...prev, fecha }));
    setFieldErrors((prev) => ({ ...prev, fecha: undefined }));
  }, []);

  const setHora = useCallback((hora: string) => {
    setFormState((prev) => ({ ...prev, hora }));
    setFieldErrors((prev) => ({ ...prev, hora: undefined }));
  }, []);

  const setMunicipioId = useCallback((municipioId: string) => {
    setFormState((prev) => ({ ...prev, municipioId }));
    setFieldErrors((prev) => ({ ...prev, municipio_id: undefined }));
  }, []);

  const setCategoriaId = useCallback((categoriaId: string) => {
    setFormState((prev) => ({ ...prev, categoriaId }));
    setFieldErrors((prev) => ({ ...prev, categoria_id: undefined }));
  }, []);

  const setLugar = useCallback((lugar: string) => {
    setFormState((prev) => ({ ...prev, lugar }));
    setFieldErrors((prev) => ({ ...prev, lugar: undefined }));
  }, []);

  const setDireccion = useCallback((direccion: string) => {
    setFormState((prev) => ({ ...prev, direccion }));
  }, []);

  const setNotasCliente = useCallback((notasCliente: string) => {
    setFormState((prev) => ({ ...prev, notasCliente }));
  }, []);

  // Reset del formulario
  const resetForm = useCallback(() => {
    setFormState({
      fecha: "",
      hora: "",
      municipioId: "",
      categoriaId: "",
      lugar: "",
      direccion: "",
      notasCliente: "",
    });
    setFieldErrors({});
  }, []);

  // Validación de disponibilidad
  const validarDisponibilidad = useCallback(
    (fecha: string, hora: string): { fechaError?: string; horaError?: string } => {
      const [ano, mes, dia] = fecha.split("-").map(Number);
      const fechaPartido = new Date(ano, mes - 1, dia);
      const diaNumero = fechaPartido.getDay();
      const diasMap: Record<number, string> = {
        0: "domingo",
        1: "lunes",
        2: "martes",
        3: "miercoles",
        4: "jueves",
        5: "viernes",
        6: "sabado",
      };
      const diaSemana = diasMap[diaNumero];

      const disponibilidades = arbitro.disponibilidades?.filter(
        (disp) => disp.dia_semana === diaSemana && disp.activo,
      );

      if (!disponibilidades || disponibilidades.length === 0) {
        return { fechaError: `No disponible los ${diaSemana}` };
      }

      const horaPartido = hora.trim().substring(0, 5);
      const [horaStr, minutoStr] = horaPartido.split(":");
      const horaNum = parseInt(horaStr, 10);
      const minutoNum = parseInt(minutoStr, 10);

      if (isNaN(horaNum) || isNaN(minutoNum) || horaNum < 0 || horaNum > 23) {
        return { horaError: "Hora inválida" };
      }

      const horaPartidoTime = horaNum * 60 + minutoNum;

      const horaValida = disponibilidades.some((disp) => {
        const horaInicioFormato = disp.hora_inicio.trim().substring(0, 5);
        const horaFinFormato = disp.hora_fin.trim().substring(0, 5);
        const [horaInicioStr, minutoInicioStr] = horaInicioFormato.split(":");
        const [horaFinStr, minutoFinStr] = horaFinFormato.split(":");
        const horaInicio = parseInt(horaInicioStr, 10) * 60 + parseInt(minutoInicioStr, 10);
        const horaFin = parseInt(horaFinStr, 10) * 60 + parseInt(minutoFinStr, 10);
        return horaPartidoTime >= horaInicio && horaPartidoTime <= horaFin;
      });

      if (!horaValida) {
        return { horaError: "Horario no disponible" };
      }

      return {};
    },
    [arbitro.disponibilidades],
  );

  // Submit del formulario
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearError();
      setFieldErrors({});

      const { fecha, hora, municipioId, categoriaId, lugar, direccion, notasCliente } = formState;

      // Validaciones básicas
      const errors: Record<string, string> = {};
      if (!fecha) errors.fecha = "La fecha es requerida";
      if (!hora) errors.hora = "La hora es requerida";
      if (!municipioId) errors.municipio_id = "Selecciona un municipio";
      if (!categoriaId) errors.categoria_id = "Selecciona una categoría";
      if (!lugar.trim()) errors.lugar = "El lugar es requerido";

      // Validar fecha futura
      if (fecha) {
        const hoy = getTodayLocalDate();
        if (compareDates(fecha, hoy) < 0) {
          errors.fecha = "La fecha debe ser futura";
        }
      }

      // Validar municipio disponible
      if (municipioId && !municipiosDisponibles.some((m) => m.id === parseInt(municipioId))) {
        errors.municipio_id = "El árbitro no trabaja en este municipio";
      }

      // Validar categoría disponible
      if (categoriaId && !categoriasDisponibles.some((c) => c.id === parseInt(categoriaId))) {
        errors.categoria_id = "El árbitro no tiene esta categoría";
      }

      // Validar disponibilidad del árbitro
      if (fecha && hora && municipioId && categoriaId) {
        const dispErrors = validarDisponibilidad(fecha, hora);
        if (dispErrors.fechaError) errors.fecha = dispErrors.fechaError;
        if (dispErrors.horaError) errors.hora = dispErrors.horaError;
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      try {
        const data = {
          arbitro_id: arbitro.id,
          fecha,
          hora: hora.length === 5 ? hora : hora.substring(0, 5),
          municipio_id: parseInt(municipioId),
          categoria_id: parseInt(categoriaId),
          lugar: lugar.trim(),
          direccion: direccion.trim() || undefined,
          notas_cliente: notasCliente.trim() || undefined,
        };

        const nuevoPartido = await crearPartido(data);
        setPartidoCreado({ id: nuevoPartido.id, estado: nuevoPartido.estado });
        setShowSuccess(true);
        resetForm();
      } catch (err) {
        // Error manejado por el hook usePartido
      }
    },
    [
      formState,
      clearError,
      municipiosDisponibles,
      categoriasDisponibles,
      validarDisponibilidad,
      arbitro.id,
      crearPartido,
      resetForm,
    ],
  );

  // Cerrar modal
  const handleClose = useCallback(() => {
    if (!isLoading && !showSuccess) {
      resetForm();
      clearError();
      onClose();
    }
  }, [isLoading, showSuccess, resetForm, clearError, onClose]);

  // Aceptar después del éxito - redirige a la página de pago
  const handleAceptar = useCallback(() => {
    const partidoId = partidoCreado?.id;
    setShowSuccess(false);
    setPartidoCreado(null);
    resetForm();
    clearError();
    onClose();
    // Redirigir a la página de pago del partido creado
    if (partidoId) {
      navigate(getPartidoPagoRoute(partidoId));
    }
  }, [partidoCreado?.id, resetForm, clearError, onClose, navigate]);

  // Resetear estado de éxito cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setPartidoCreado(null);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return {
    // Estados del formulario
    formState,
    fieldErrors,
    showSuccess,
    partidoCreado,

    // Estados de carga y error
    isLoading,
    error,
    municipiosLoading,
    categoriasLoading,

    // Datos filtrados
    municipiosDisponibles,
    categoriasDisponibles,
    categoriaSeleccionada,
    tarifa,

    // Acciones del formulario
    setFecha,
    setHora,
    setMunicipioId,
    setCategoriaId,
    setLugar,
    setDireccion,
    setNotasCliente,

    // Acciones principales
    handleSubmit,
    handleClose,
    handleAceptar,
    resetForm,
  };
}
