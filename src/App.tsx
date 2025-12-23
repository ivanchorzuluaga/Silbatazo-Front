/**
 * Componente raíz de la aplicación
 * Configura el router y proveedores globales
 */

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
