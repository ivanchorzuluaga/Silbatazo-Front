/**
 * Página de Términos y Condiciones
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES, APP_NAME } from "@/lib/constants";

export function TerminosCondicionesPage() {
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
        <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground text-lg">
            Última actualización: Enero 2026
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar la plataforma {APP_NAME}, usted acepta estar sujeto a estos 
              Términos y Condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, 
              no podrá acceder al servicio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Descripción del Servicio</h2>
            <p>
              {APP_NAME} es una plataforma que conecta a organizadores de eventos deportivos con 
              árbitros profesionales certificados. Nuestro servicio permite:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A los clientes: buscar, contactar y contratar árbitros para sus eventos deportivos.</li>
              <li>A los árbitros: crear perfiles profesionales, gestionar su disponibilidad y recibir solicitudes de arbitraje.</li>
              <li>Gestionar pagos de forma segura entre las partes.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Registro y Cuenta de Usuario</h2>
            <p>
              Para utilizar ciertos servicios, debe registrarse y crear una cuenta. Usted es responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar información precisa y actualizada.</li>
              <li>Mantener la confidencialidad de su contraseña.</li>
              <li>Todas las actividades que ocurran bajo su cuenta.</li>
              <li>Notificarnos inmediatamente sobre cualquier uso no autorizado.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Obligaciones de los Árbitros</h2>
            <p>Los árbitros registrados en la plataforma se comprometen a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Poseer las certificaciones y credenciales necesarias para ejercer como árbitro.</li>
              <li>Mantener actualizados sus documentos y certificaciones.</li>
              <li>Cumplir con los compromisos adquiridos con los clientes.</li>
              <li>Actuar de manera profesional y ética en todo momento.</li>
              <li>Notificar con anticipación cualquier cancelación o imposibilidad de asistir.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Obligaciones de los Clientes</h2>
            <p>Los clientes que utilizan la plataforma se comprometen a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar información precisa sobre los eventos deportivos.</li>
              <li>Realizar los pagos acordados de manera oportuna.</li>
              <li>Tratar a los árbitros con respeto y profesionalismo.</li>
              <li>Proporcionar las condiciones necesarias para que el árbitro pueda ejercer su función.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Pagos y Comisiones</h2>
            <p>
              {APP_NAME} actúa como intermediario en los pagos. La plataforma cobra una comisión 
              por cada transacción exitosa. Los detalles específicos de las tarifas se encuentran 
              disponibles en la sección de precios.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Cancelaciones</h2>
            <p>
              Las políticas de cancelación específicas se detallan en nuestra{" "}
              <Link to={ROUTES.REEMBOLSO} className="text-primary hover:underline">
                Política de Reembolso
              </Link>
              . Se recomienda revisar estas políticas antes de realizar cualquier reserva.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Propiedad Intelectual</h2>
            <p>
              Todo el contenido de la plataforma, incluyendo textos, gráficos, logos, íconos, 
              imágenes y software, es propiedad de {APP_NAME} y está protegido por las leyes 
              de propiedad intelectual de Colombia.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Limitación de Responsabilidad</h2>
            <p>
              {APP_NAME} no es responsable de los servicios prestados directamente entre 
              árbitros y clientes. Actuamos únicamente como plataforma de conexión y 
              facilitación de pagos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Ley Aplicable</h2>
            <p>
              Estos términos se regirán e interpretarán de acuerdo con las leyes de la 
              República de Colombia, sin tener en cuenta sus conflictos de disposiciones legales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Contacto</h2>
            <p>
              Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:{" "}
              <a href="mailto:contacto@silbatazo.com" className="text-primary hover:underline">
                contacto@silbatazo.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
