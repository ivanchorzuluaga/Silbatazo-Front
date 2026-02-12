/**
 * Página de gestión completa de partidos (Panel de administrador)
 * Tabs por estado y filtros adicionales
 */

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Input } from "@/components/ui/input";
import { DateField } from "@/components/forms";
import { Select } from "@/components/ui/select";
import { PageLayout } from "@/components/layout";
import { usePartidos } from "@/features/partidos/hooks/usePartidos";
import { PartidoCard } from "@/features/partidos/components/PartidoCard";
import { useMunicipios } from "@/features/arbitro/hooks/useMunicipios";
import { useCategorias } from "@/features/arbitro/hooks/useCategorias";
import { ROUTES } from "@/lib/constants";
import type { PartidosListParams, EstadoPartido } from "@/features/partidos/types/partido.types";

const TABS_ESTADO: { value: "" | EstadoPartido; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "buscando_arbitro", label: "Buscando árbitro" },
  { value: "pendiente", label: "Pendiente" },
  { value: "aceptado", label: "Aceptado" },
  { value: "completado", label: "Completado" },
  { value: "rechazado", label: "Rechazado" },
  { value: "cancelado", label: "Cancelado" },
];

export function GestionPartidosPage() {
  const [searchParams] = useSearchParams();
  const initializedFromQuery = useRef(false);
  const { municipios } = useMunicipios();
  const { categorias } = useCategorias();

  // Filtros: estado por tab, resto en panel
  const [tabEstado, setTabEstado] = useState<"" | EstadoPartido>("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [municipioId, setMunicipioId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [arbitroId, setArbitroId] = useState("");

  const filtros: PartidosListParams = {};
  if (tabEstado) filtros.estado = tabEstado;
  if (fechaDesde) filtros.fecha_desde = fechaDesde;
  if (fechaHasta) filtros.fecha_hasta = fechaHasta;
  if (municipioId) filtros.municipio_id = parseInt(municipioId);
  if (categoriaId) filtros.categoria_id = parseInt(categoriaId);
  if (clienteId) filtros.cliente_id = parseInt(clienteId);
  if (arbitroId) filtros.arbitro_id = parseInt(arbitroId);

  const { partidos, isLoading, error } = usePartidos(filtros);

  useEffect(() => {
    if (initializedFromQuery.current) return;
    const estadoParam = searchParams.get("estado");
    if (!estadoParam) return;
    const valido = TABS_ESTADO.some((tab) => tab.value === estadoParam);
    if (valido) {
      setTabEstado(estadoParam as EstadoPartido);
      initializedFromQuery.current = true;
    }
  }, [searchParams]);

  const handleLimpiarFiltros = () => {
    setTabEstado("");
    setFechaDesde("");
    setFechaHasta("");
    setMunicipioId("");
    setCategoriaId("");
    setClienteId("");
    setArbitroId("");
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Gestión de Partidos"
      contentClassName="page-surface"
    >
      <div className="space-y-6">
        {/* Tabs por estado */}
        <FilterTabs
          label="Estado del partido"
          tabs={TABS_ESTADO}
          value={tabEstado}
          onValueChange={setTabEstado}
        />

        {/* Filtros adicionales */}
        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Filtros adicionales</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Fecha Desde */}
            <DateField
              id="fechaDesde"
              label="Fecha Desde"
              value={fechaDesde}
              onChange={setFechaDesde}
            />

            {/* Fecha Hasta */}
            <DateField
              id="fechaHasta"
              label="Fecha Hasta"
              value={fechaHasta}
              onChange={setFechaHasta}
            />

            {/* Municipio */}
            <div className="space-y-2">
              <label htmlFor="municipio" className="text-sm font-medium">
                Municipio
              </label>
              <Select
                id="municipio"
                value={municipioId}
                onChange={(e) => setMunicipioId(e.target.value)}
              >
                <option value="">Todos los municipios</option>
                {municipios.map((municipio) => (
                  <option key={municipio.id} value={municipio.id}>
                    {municipio.nombre}
                    {municipio.departamento && `, ${municipio.departamento}`}
                  </option>
                ))}
              </Select>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <label htmlFor="categoria" className="text-sm font-medium">
                Categoría
              </label>
              <Select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Select>
            </div>

            {/* Búsqueda Cliente */}
            <div className="space-y-2">
              <label htmlFor="busquedaCliente" className="text-sm font-medium">
                Buscar Cliente (ID)
              </label>
              <Input
                id="busquedaCliente"
                type="number"
                placeholder="ID del cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
              />
            </div>

            {/* Búsqueda Árbitro */}
            <div className="space-y-2">
              <label htmlFor="busquedaArbitro" className="text-sm font-medium">
                Buscar Árbitro (ID)
              </label>
              <Input
                id="busquedaArbitro"
                type="number"
                placeholder="ID del árbitro"
                value={arbitroId}
                onChange={(e) => setArbitroId(e.target.value)}
              />
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex gap-4 mt-4">
            <Button onClick={handleLimpiarFiltros} variant="outline" className="w-full">
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Resultados */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12 rounded-lg border bg-card">
            <p className="text-muted-foreground">Cargando partidos...</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Partidos ({partidos.length})</h2>
            </div>

            {partidos.length === 0 ? (
              <div className="text-center py-12 rounded-lg border bg-card">
                <p className="text-muted-foreground mb-4">
                  No se encontraron partidos con los filtros seleccionados
                </p>
                <Button onClick={handleLimpiarFiltros} variant="outline">
                  Limpiar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {partidos.map((partido) => (
                  <PartidoCard key={partido.id} partido={partido} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
