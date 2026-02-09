import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES, APP_NAME } from "@/lib/constants";
import logoImage from "@/assets/Logo.png";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Mail, Phone } from "lucide-react";

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
    <footer
      id="contacto"
      className="py-12 sm:py-16 pb-[max(3rem,env(safe-area-inset-bottom))] sm:pb-16 bg-gradient-to-b from-background via-primary/30 to-primary relative overflow-hidden scroll-mt-20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.2),transparent)]" />
      <div className="absolute top-0 left-1/3 h-64 w-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-white/5 rounded-full blur-3xl" />

      {/* Logo de fondo - visible en todas las pantallas */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={logoImage}
          alt=""
          className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain opacity-15 sm:opacity-10"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Versión móvil - Centrada y compacta */}
        <div className="sm:hidden text-center space-y-8">
          {/* Contacto */}
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-foreground">Contacto</h4>
            <div className="flex flex-col items-center gap-2 text-sm text-foreground/80">
              <a
                href={`mailto:contacto@${APP_NAME.toLowerCase()}.com`}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                contacto@{APP_NAME.toLowerCase()}.com
              </a>
              <a
                href="tel:+573001234567"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                +57 300 123-4567
              </a>
              <WhatsAppButton variant="button" size="sm" className="mt-2">
                WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          {/* Navegación */}
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-foreground">Navegación</h4>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground/80">
              <button
                onClick={() => handleScrollTo("#arbitros-destacados")}
                className="hover:text-foreground transition-colors"
              >
                Árbitros
              </button>
              <button
                onClick={() => handleScrollTo("#como-funciona")}
                className="hover:text-foreground transition-colors"
              >
                Cómo Funciona
              </button>
              <button
                onClick={() => handleScrollTo("#contacto")}
                className="hover:text-foreground transition-colors"
              >
                Contacto
              </button>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-lg text-foreground">Legal</h4>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground/80">
              <Link to={ROUTES.TERMINOS} className="hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link to={ROUTES.PRIVACIDAD} className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link to={ROUTES.REEMBOLSO} className="hover:text-foreground transition-colors">
                Reembolso
              </Link>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="flex justify-center gap-6">
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors p-2">
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <WhatsAppButton variant="icon" />
          </div>

          {/* Derechos */}
          <div className="pt-6 border-t border-foreground/20">
            <p className="text-xs text-foreground/60">
              © 2026 {APP_NAME}. Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Versión desktop - Grid original */}
        <div className="hidden sm:block">
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            {/* Contacto */}
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contacto</h4>
              <div className="text-sm text-foreground/70 space-y-2">
                <a
                  href={`mailto:contacto@${APP_NAME.toLowerCase()}.com`}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  contacto@{APP_NAME.toLowerCase()}.com
                </a>
                <a
                  href="tel:+573001234567"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +57 300 123-4567
                </a>
                <WhatsAppButton variant="link" className="mt-1">
                  Escribir por WhatsApp
                </WhatsAppButton>
              </div>
            </div>

            {/* Navegación */}
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

            {/* Legal */}
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

          {/* Footer bottom - Desktop */}
          <div className="pt-8 border-t border-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/70">
              © 2026 {APP_NAME}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <WhatsAppButton variant="icon" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
