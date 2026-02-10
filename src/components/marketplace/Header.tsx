import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { prefetchRoute } from "@/router/prefetch";
import { Menu, Users, Clock, Mail, Shield, User, ArrowRight, X } from "lucide-react";

export function Header() {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Users, label: "Árbitros", href: "#arbitros-destacados", isScroll: true },
    { icon: Clock, label: "Cómo Funciona", href: "#como-funciona", isScroll: true },
    { icon: Mail, label: "Contacto", href: "#contacto", isScroll: true },
  ];

  const handleScrollTo = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 nav-surface border-b shadow-ios pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 sm:min-h-20 md:min-h-24">
          {/* Logo completo (imagen con texto incluido) - cambia según tema */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center hover:opacity-90 transition-all duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={isDark ? "/Logo-completo.png" : "/Logo-completo-Negro.png"}
              alt={`${APP_NAME} - Árbitro de confianza`}
              className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-opacity duration-200"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleScrollTo(item.href)}
                className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-all duration-200 hover:text-primary cursor-pointer select-none"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle - Siempre visible */}
            <ThemeToggle />

            {/* Auth Button - Siempre visible */}
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                  <Link to={ROUTES.DASHBOARD}>
                    <User className="w-4 h-4 mr-2" />
                    Mi Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                  <Link
                    to={ROUTES.LOGIN}
                    onMouseEnter={() => prefetchRoute(ROUTES.LOGIN)}
                    onFocus={() => prefetchRoute(ROUTES.LOGIN)}
                  >
                    Iniciar Sesión
                  </Link>
                </Button>
              </>
            )}

            {/* Reservar - Solo desktop */}
            <Button
              size="sm"
              className="hidden sm:flex shadow-md hover:shadow-lg transition-all duration-300"
              asChild
            >
              <Link
                to={ROUTES.ARBITROS}
                onMouseEnter={() => prefetchRoute(ROUTES.ARBITROS)}
                onFocus={() => prefetchRoute(ROUTES.ARBITROS)}
              >
                <Users className="w-4 h-4 mr-2" />
                Reservar Árbitro
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>

            {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop oscuro */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel del menú */}
          <div className="absolute top-0 left-0 right-0 nav-surface border-b shadow-2xl animate-in slide-in-from-top duration-300 pt-[env(safe-area-inset-top)] rounded-b-3xl overflow-hidden">
            {/* Header del menú */}
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
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

            <div className="max-h-[75vh] overflow-y-auto">
              {/* Acciones de cuenta */}
              <div className="p-4 pb-2">
                {isAuthenticated ? (
                  <Link
                    to={ROUTES.DASHBOARD}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-muted/30 hover:bg-primary/10 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Mi Dashboard</p>
                      <p className="text-xs text-muted-foreground">Accede a tu panel</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ) : (
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-muted/30 hover:bg-primary/10 transition-colors"
                  >
                    <div className="p-2 rounded-xl bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Iniciar Sesión</p>
                      <p className="text-xs text-muted-foreground">Accede a tu cuenta</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                )}
              </div>

              {/* Navigation Items - Solo scroll links */}
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleScrollTo(item.href)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all duration-200 group"
                  >
                    <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.label === "Árbitros" && "Ver árbitros destacados"}
                        {item.label === "Cómo Funciona" && "Aprende el proceso"}
                        {item.label === "Contacto" && "Habla con nosotros"}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer con CTA */}
            <div className="p-4 pt-2 border-t border-border/60">
              <Button className="w-full h-12 text-base shadow-lg" asChild>
                <Link
                  to={ROUTES.ARBITROS}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={() => prefetchRoute(ROUTES.ARBITROS)}
                  onFocus={() => prefetchRoute(ROUTES.ARBITROS)}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Reservar Árbitro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
