import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ROUTES, APP_NAME, WHATSAPP_RESERVA_MESSAGE, USER_ROLES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { prefetchRoute } from "@/router/prefetch";
import { Menu, Users, Clock, Mail, ArrowRight, X, DollarSign } from "lucide-react";

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = isAuthenticated && user?.role === USER_ROLES.ADMIN;
  const isHome = location.pathname === ROUTES.HOME || location.pathname === "/";

  const navigationItems = [
    { icon: Users, label: "Árbitros", href: "#arbitros-destacados" },
    { icon: Clock, label: "Cómo Funciona", href: "#como-funciona" },
    { icon: DollarSign, label: "Precios", href: "#precios" },
    { icon: Mail, label: "Contacto", href: "#contacto" },
  ];

  const handleScrollTo = (sectionId: string) => {
    setMobileMenuOpen(false);

    if (isHome) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    navigate(`${ROUTES.HOME}${sectionId}`);
  };

  return (
    <header className="sticky top-0 z-50 nav-surface border-b shadow-ios pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-16 sm:min-h-20 md:min-h-24">
          <Link
            to={ROUTES.HOME}
            className="flex shrink-0 items-center hover:opacity-90 transition-all duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* Móvil: marca compacta legible */}
            <img
              src="/Silvato.png"
              alt={APP_NAME}
              className="h-12 w-auto object-contain sm:hidden"
              loading="eager"
              decoding="async"
              width={120}
              height={120}
            />
            {/* Tablet/desktop: logo completo */}
            <img
              src={isDark ? "/Logo-completo-480.png" : "/Logo-completo-Negro-480.png"}
              alt={`${APP_NAME} - Árbitro de confianza`}
              className="hidden sm:block h-14 md:h-16 w-auto max-w-[min(100%,14rem)] md:max-w-none object-contain object-left transition-opacity duration-200"
              loading="eager"
              decoding="async"
              width={480}
              height={120}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleScrollTo(item.href)}
                className="flex items-center gap-1.5 text-[13px] xl:text-sm font-medium text-foreground/70 hover:text-primary transition-all duration-200 cursor-pointer select-none"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <ThemeToggle size="sm" className="sm:hidden" />
            <ThemeToggle className="hidden sm:block" />

            {isAdmin ? (
              <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                <Link to={ROUTES.ADMIN_DASHBOARD}>Panel admin</Link>
              </Button>
            ) : null}

            <WhatsAppButton
              size="sm"
              className="hidden sm:flex shadow-md"
              message={WHATSAPP_RESERVA_MESSAGE}
            >
              Reservar por WhatsApp
            </WhatsAppButton>

            <Button
              size="sm"
              variant="outline"
              className="hidden md:flex"
              asChild
            >
              <Link
                to={ROUTES.ARBITROS}
                onMouseEnter={() => prefetchRoute(ROUTES.ARBITROS)}
                onFocus={() => prefetchRoute(ROUTES.ARBITROS)}
              >
                <Users className="w-4 h-4 mr-2" />
                Ver árbitros
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute top-0 left-0 right-0 nav-surface border-b shadow-2xl animate-in slide-in-from-top duration-300 pt-[env(safe-area-inset-top)] rounded-b-3xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <img
                  src="/Silvato.png"
                  alt=""
                  className="h-11 w-11 object-contain rounded-lg"
                  aria-hidden
                />
                <div>
                  <p className="font-bold text-lg">{APP_NAME}</p>
                  <p className="text-xs text-muted-foreground">Navegación</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleScrollTo(item.href)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 border border-transparent transition-all"
                >
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-foreground">{item.label}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}

              <Link
                to={ROUTES.ARBITROS}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 border border-transparent transition-all"
              >
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-foreground">Ver todos los árbitros</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              {isAdmin ? (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-muted/30"
                >
                  <p className="font-semibold text-foreground">Panel administrativo</p>
                </Link>
              ) : null}
            </div>

            <div className="p-4 pt-2 border-t border-border/60 space-y-2">
              <WhatsAppButton className="w-full h-12 text-base" message={WHATSAPP_RESERVA_MESSAGE}>
                Reservar por WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
