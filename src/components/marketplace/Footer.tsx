import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES, APP_NAME } from "@/lib/constants";

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Función para hacer scroll suave a una sección
  const handleScrollTo = (sectionId: string) => {
    // Si estamos en la página de inicio, solo hacer scroll
    if (location.pathname === "/") {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Si estamos en otra página, navegar al inicio y luego hacer scroll
      navigate("/");
      // Esperar un momento para que la página cargue y luego hacer scroll
      setTimeout(() => {
        const element = document.querySelector(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <footer id="contacto" className="py-16 bg-gradient-to-b from-background via-primary/30 to-primary relative overflow-hidden scroll-mt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.2),transparent)]" />
      <div className="absolute top-0 left-1/3 h-64 w-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <img 
                src="/silbatazo-logo.png" 
                alt={`${APP_NAME} Logo`}
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  // Fallback si la imagen no carga
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center logo-fallback hidden">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:inline">{APP_NAME}</span>
            </Link>
            <p className="text-foreground/80 max-w-sm mb-4">
              La plataforma líder para alquilar árbitros profesionales. Tu partido merece el mejor arbitraje.
            </p>
            <div className="text-sm text-foreground/70">
              <p>contacto@{APP_NAME.toLowerCase()}.com</p>
              <p>+57 300 123-4567</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Navegación</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <button 
                  onClick={() => handleScrollTo("#arbitros-destacados")}
                  className="hover:text-foreground transition-colors text-left cursor-pointer"
                >
                  Árbitros
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollTo("#como-funciona")}
                  className="hover:text-foreground transition-colors text-left cursor-pointer"
                >
                  Cómo Funciona
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleScrollTo("#contacto")}
                  className="hover:text-foreground transition-colors text-left cursor-pointer"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link to={ROUTES.TERMINOS} className="hover:text-foreground transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRIVACIDAD} className="hover:text-foreground transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REEMBOLSO} className="hover:text-foreground transition-colors">
                  Política de Reembolso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/70">© 2025 {APP_NAME}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
              <span className="sr-only">WhatsApp</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
