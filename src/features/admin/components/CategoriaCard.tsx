/**
 * Tarjeta para mostrar una categoría
 */

import { Button } from "@/components/ui/button";
import type { Categoria } from "@/features/arbitro/types/arbitro.types";

interface CategoriaCardProps {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function CategoriaCard({ categoria, onEdit, onDelete, isLoading }: CategoriaCardProps) {
  const handleDelete = () => {
    if (
      confirm(
        `¿Estás seguro de que quieres ${
          categoria.activo ? "desactivar" : "activar"
        } la categoría "${categoria.nombre}"?`
      )
    ) {
      onDelete(categoria.id);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{categoria.nombre}</h3>
            {categoria.activo ? (
              <span className="inline-flex items-center rounded-md bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 px-2 py-0.5 text-xs font-medium">
                Activa
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20 px-2 py-0.5 text-xs font-medium">
                Inactiva
              </span>
            )}
          </div>

          {categoria.descripcion && (
            <p className="text-sm text-muted-foreground mb-2">{categoria.descripcion}</p>
          )}

          <div className="space-y-1 text-sm">
            {categoria.nivel && (
              <p className="text-muted-foreground">
                <span className="font-medium">Nivel:</span> {categoria.nivel}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(categoria)}
            disabled={isLoading}
          >
            Editar
          </Button>
          <Button
            variant={categoria.activo ? "destructive" : "outline"}
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {categoria.activo ? "Desactivar" : "Activar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
