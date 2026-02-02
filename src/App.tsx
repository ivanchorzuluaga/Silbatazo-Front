/**
 * Componente raíz de la aplicación
 * Configura el router y proveedores globales
 */

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  try {
    return (
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    );
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-destructive">Error al cargar la aplicación</h2>
          <pre className="text-sm text-muted-foreground bg-muted p-4 rounded overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }
}

export default App;
