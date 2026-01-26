/**
 * Página de Política de Reembolso
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

export function PoliticaReembolsoPage() {
  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to={ROUTES.HOME}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Política de Reembolso</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground text-lg">
            Última actualización: Enero 2026
          </p>

          {/* Resumen Visual */}
          <div className="grid sm:grid-cols-2 gap-4 not-prose">
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">Reembolso Total</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Cancelación 48+ horas antes del evento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Reembolso Parcial (50%)</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Cancelación 24-48 horas antes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">Sin Reembolso</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Cancelación menos de 24 horas antes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Casos Especiales</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Cancelación por el árbitro: 100% reembolso
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Política General</h2>
            <p>
              En {APP_NAME} entendemos que pueden surgir imprevistos. Nuestra política de 
              reembolso está diseñada para ser justa tanto para los clientes como para 
              los árbitros, protegiendo los intereses de ambas partes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Cancelaciones por el Cliente</h2>
            
            <h3 className="text-xl font-medium mt-4">2.1 Más de 48 horas antes del evento</h3>
            <p>
              Si cancela su reserva con más de 48 horas de anticipación al inicio del 
              evento, recibirá un <strong>reembolso del 100%</strong> del monto pagado.
            </p>
            
            <h3 className="text-xl font-medium mt-4">2.2 Entre 24 y 48 horas antes del evento</h3>
            <p>
              Las cancelaciones realizadas entre 24 y 48 horas antes del evento recibirán 
              un <strong>reembolso del 50%</strong> del monto pagado. El 50% restante se 
              destinará al árbitro como compensación por el tiempo reservado.
            </p>
            
            <h3 className="text-xl font-medium mt-4">2.3 Menos de 24 horas antes del evento</h3>
            <p>
              Las cancelaciones realizadas con menos de 24 horas de anticipación 
              <strong> no son elegibles para reembolso</strong>. El monto total se 
              transferirá al árbitro.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Cancelaciones por el Árbitro</h2>
            <p>
              Si el árbitro cancela la reserva por cualquier motivo, el cliente recibirá 
              un <strong>reembolso del 100%</strong>, independientemente del tiempo de anticipación.
            </p>
            <p>
              Además, {APP_NAME} hará todo lo posible por encontrar un árbitro de reemplazo 
              sin costo adicional para el cliente.
            </p>
            <p className="text-muted-foreground">
              <em>
                Nota: Los árbitros que cancelen repetidamente pueden estar sujetos a 
                penalizaciones o suspensión de la plataforma.
              </em>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Circunstancias Excepcionales</h2>
            <p>
              En casos de fuerza mayor (desastres naturales, emergencias médicas documentadas, 
              restricciones gubernamentales), evaluaremos cada caso individualmente para 
              determinar la elegibilidad del reembolso.
            </p>
            <p>
              Para solicitar una excepción, debe proporcionar documentación de respaldo 
              dentro de las 72 horas siguientes al evento programado.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. No Show del Árbitro</h2>
            <p>
              Si un árbitro no se presenta al evento sin aviso previo, el cliente recibirá 
              un <strong>reembolso del 100%</strong>. Adicionalmente:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>El árbitro será penalizado según nuestras políticas internas.</li>
              <li>El cliente podrá recibir un crédito adicional para futuras reservas.</li>
              <li>{APP_NAME} ayudará a encontrar un reemplazo de emergencia si es posible.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Proceso de Reembolso</h2>
            <p>Una vez aprobado el reembolso:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Tarjetas de crédito/débito:</strong> El reembolso se procesará 
                en 5-10 días hábiles, dependiendo de su banco.
              </li>
              <li>
                <strong>Transferencia bancaria:</strong> El reembolso se realizará en 
                3-5 días hábiles.
              </li>
              <li>
                <strong>Crédito en la plataforma:</strong> Disponible inmediatamente 
                para usar en futuras reservas.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Cómo Solicitar un Reembolso</h2>
            <p>Para solicitar un reembolso:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Inicie sesión en su cuenta de {APP_NAME}.</li>
              <li>Vaya a "Mis Partidos" y seleccione el partido a cancelar.</li>
              <li>Haga clic en "Solicitar Cancelación" y siga las instrucciones.</li>
              <li>Recibirá una confirmación por correo electrónico.</li>
            </ol>
            <p>
              También puede contactarnos directamente en{" "}
              <a href="mailto:soporte@silbatazo.com" className="text-primary hover:underline">
                soporte@silbatazo.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Disputas</h2>
            <p>
              Si no está de acuerdo con una decisión de reembolso, puede presentar una 
              disputa dentro de los 30 días siguientes. Nuestro equipo revisará el caso 
              y tomará una decisión final en un plazo de 10 días hábiles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Cambios en la Política</h2>
            <p>
              Nos reservamos el derecho de modificar esta política de reembolso en cualquier 
              momento. Los cambios no afectarán las reservas existentes realizadas antes 
              de la fecha de modificación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Contacto</h2>
            <p>
              Para preguntas sobre reembolsos, contáctenos en:{" "}
              <a href="mailto:soporte@silbatazo.com" className="text-primary hover:underline">
                soporte@silbatazo.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
