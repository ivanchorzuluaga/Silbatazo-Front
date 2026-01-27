import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SlidePanel, SlidePanelContent, SlidePanelHeader, SlidePanelTitle } from "@/components/ui/slide-panel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { Menu, Users, Clock, Mail, Shield, User, ArrowRight, LogOut } from "lucide-react";

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to={ROUTES.HOME} 
            className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
              <img 
                src="/silbatazo-logo.png" 
                alt={`${APP_NAME} Logo`}
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center logo-fallback hidden shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                {APP_NAME}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">Tu arbitro de confianza</span>
            </div>
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
            {/* Theme Toggle - Desktop */}
            <ThemeToggle className="hidden sm:flex" />

            {isAuthenticated ? (
              <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                <Link to={ROUTES.DASHBOARD}>
                  <User className="w-4 h-4 mr-2" />
                  Mi Dashboard
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                <Link to={ROUTES.LOGIN}>Iniciar Sesión</Link>
              </Button>
            )}
            
            <Button size="sm" className="shadow-md hover:shadow-lg transition-all duration-300" asChild>
              <Link to={ROUTES.ARBITROS}>
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Reservar Árbitro</span>
                <span className="sm:hidden">Reservar</span>
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

            <SlidePanel open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SlidePanelContent className="w-80 sm:w-96">
                <SlidePanelHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <SlidePanelTitle className="text-lg">{APP_NAME}</SlidePanelTitle>
                      <p className="text-sm text-muted-foreground">Tu arbitro de confianza</p>
                    </div>
                  </div>
                </SlidePanelHeader>
                
                <div className="space-y-6">
                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleScrollTo(item.href)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.label === "Árbitros" && "Explora árbitros disponibles"}
                            {item.label === "Cómo Funciona" && "Aprende el proceso"}
                            {item.label === "Contacto" && "Habla con nosotros"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Theme Toggle - Mobile */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">Modo oscuro</span>
                      <ThemeToggle size="sm" />
                    </div>
                  </div>

                  {/* Auth Section */}
                  <div className="border-t pt-6 space-y-3">
                    {isAuthenticated ? (
                      <>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link to={ROUTES.DASHBOARD} onClick={() => setMobileMenuOpen(false)}>
                            <User className="w-4 h-4 mr-3" />
                            Mi Dashboard
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Cerrar Sesión
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                          <User className="w-4 h-4 mr-3" />
                          Iniciar Sesión
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
                    <h3 className="font-semibold mb-2">¿Necesitas un árbitro ya?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reserva en minutos con árbitros certificados
                    </p>
                    <Button className="w-full" asChild>
                      <Link to={ROUTES.ARBITROS} onClick={() => setMobileMenuOpen(false)}>
                        <Users className="w-4 h-4 mr-2" />
                        Reservar Ahora
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </SlidePanelContent>
            </SlidePanel>
          </div>
        </div>
      </div>
    </header>
  );
}
