import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PrivacidadModalContent } from "@/features/legal/components/PrivacidadModalContent";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ROUTES, APP_NAME } from "@/lib/constants";

export function LegalPrivacidadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to={ROUTES.HOME}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
          <ThemeToggle size="sm" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Política de Privacidad</h1>
        <p className="text-muted-foreground mb-6">
          Última actualización: febrero 2026 · {APP_NAME}
        </p>
        <PrivacidadModalContent />
      </main>
    </div>
  );
}
