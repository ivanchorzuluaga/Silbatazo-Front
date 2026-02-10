/**
 * Página de gestión de categorías (solo admin)
 */

import { useState } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useCategoriasAdmin } from "../hooks/useCategoriasAdmin";
import { CategoriaCard } from "../components/CategoriaCard";
import { CategoriaForm } from "../components/CategoriaForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type {
  Categoria,
  CategoriaCreateData,
  CategoriaUpdateData,
} from "@/features/arbitro/types/arbitro.types";

export function CategoriasPage() {
  const {
    categorias,
    isLoading,
    error,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    clearError,
  } = useCategoriasAdmin();

  const [showForm, setShowForm] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

  const handleCreate = () => {
    setCategoriaEditando(null);
    setShowForm(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCategoriaEditando(null);
  };

  const handleSubmit = async (data: CategoriaCreateData | CategoriaUpdateData) => {
    try {
      if (categoriaEditando) {
        await actualizarCategoria(categoriaEditando.id, data as CategoriaUpdateData);
      } else {
        await crearCategoria(data as CategoriaCreateData);
      }
      handleCloseForm();
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al guardar categoría:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarCategoria(id);
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al eliminar categoría:", err);
    }
  };

  return (
    <PageLayout
      backButton={{ label: "Dashboard", to: ROUTES.ADMIN_DASHBOARD }}
      title="Gestión de Categorías"
      contentClassName="page-surface"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Categorías</h1>
            <p className="text-muted-foreground mt-1">Gestiona las categorías de arbitraje</p>
          </div>
          <Button onClick={handleCreate} disabled={isLoading}>
            Crear Categoría
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Cerrar
              </Button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && categorias.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando categorías...</p>
          </div>
        )}

        {/* Lista de categorías */}
        {!isLoading && categorias.length === 0 && (
          <div className="text-center py-12 rounded-lg border bg-card">
            <p className="text-muted-foreground mb-4">No hay categorías disponibles</p>
            <Button onClick={handleCreate}>Crear Primera Categoría</Button>
          </div>
        )}

        {categorias.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => (
              <CategoriaCard
                key={categoria.id}
                categoria={categoria}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}

        {/* Modal de formulario */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {categoriaEditando ? "Editar Categoría" : "Crear Categoría"}
              </DialogTitle>
            </DialogHeader>
            <CategoriaForm
              categoria={categoriaEditando || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
