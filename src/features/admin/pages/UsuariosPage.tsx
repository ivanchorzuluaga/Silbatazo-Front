import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/constants";
import { authService } from "@/features/auth/services/auth.service";
import type { AdminUserListItem } from "@/api/endpoints/auth.endpoints";

const PAGE_SIZE = 10;

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<AdminUserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [role, setRole] = useState<"" | "cliente" | "arbitro" | "admin">("");
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");
  const [conServicios, setConServicios] = useState(false);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const cargarUsuarios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.listAdminUsers({
        page,
        role,
        search: search || undefined,
        con_servicios: conServicios,
      });
      setUsuarios(response.results ?? []);
      setCount(response.count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, role, search, conServicios]);

  const aplicarBusqueda = () => {
    if (page !== 1) {
      setPage(1);
    }
    setSearch(searchDraft.trim());
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Usuarios"
      contentClassName="page-surface"
    >
      <div className="mb-6 space-y-3">
        <p className="text-muted-foreground">
          Lista de usuarios registrados con métricas de partidos y servicios.
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          <Input
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && aplicarBusqueda()}
            placeholder="Buscar por nombre, usuario o email"
            className="sm:col-span-2"
          />
          <select
            className="field-select"
            value={role}
            onChange={(e) => {
              setPage(1);
              setRole(e.target.value as "" | "cliente" | "arbitro" | "admin");
            }}
          >
            <option value="">Todos los roles</option>
            <option value="cliente">Clientes</option>
            <option value="arbitro">Árbitros</option>
            <option value="admin">Admins</option>
          </select>
          <Button onClick={aplicarBusqueda}>Buscar</Button>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={conServicios}
            onChange={(e) => {
              setPage(1);
              setConServicios(e.target.checked);
            }}
          />
          Mostrar solo usuarios con partidos solicitados
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading && <p className="py-10 text-center text-muted-foreground">Cargando usuarios...</p>}

      {!isLoading && !error && usuarios.length === 0 && (
        <p className="py-10 text-center text-muted-foreground">No se encontraron usuarios</p>
      )}

      {!isLoading && !error && usuarios.length > 0 && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Mostrando {usuarios.length} de {count} usuarios
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {usuarios.map((usuario) => (
              <article key={usuario.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-sm">{usuario.full_name || usuario.username}</h3>
                    <p className="text-xs text-muted-foreground">@{usuario.username}</p>
                  </div>
                  <span className="text-xs rounded-md border px-2 py-1">{usuario.role}</span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {usuario.email && <p>{usuario.email}</p>}
                  <p>Solicitados: {usuario.total_partidos_solicitados ?? 0}</p>
                  <p>Completados: {usuario.servicios_completados ?? 0}</p>
                  {usuario.role === "arbitro" && usuario.estado_verificacion_arbitro && (
                    <p>Estado árbitro: {usuario.estado_verificacion_arbitro}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between rounded-lg border bg-card p-3">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
