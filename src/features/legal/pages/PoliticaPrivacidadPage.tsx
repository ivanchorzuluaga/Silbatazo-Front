/**
 * Página de Política de Privacidad
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES, APP_NAME } from "@/lib/constants";

export function PoliticaPrivacidadPage() {
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
        <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <p className="text-muted-foreground text-lg">
            Última actualización: Enero 2026
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introducción</h2>
            <p>
              En {APP_NAME} nos comprometemos a proteger su privacidad. Esta Política de 
              Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su 
              información personal cuando utiliza nuestra plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Información que Recopilamos</h2>
            <p>Recopilamos diferentes tipos de información:</p>
            
            <h3 className="text-xl font-medium mt-4">2.1 Información proporcionada por usted:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Datos de registro: nombre, correo electrónico, teléfono, contraseña.</li>
              <li>Información de perfil: foto, experiencia, certificaciones (para árbitros).</li>
              <li>Información de pago: datos bancarios para procesamiento de pagos.</li>
              <li>Comunicaciones: mensajes enviados a través de la plataforma.</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">2.2 Información recopilada automáticamente:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Datos de uso: páginas visitadas, tiempo de permanencia, acciones realizadas.</li>
              <li>Información del dispositivo: tipo de dispositivo, sistema operativo, navegador.</li>
              <li>Datos de ubicación: cuando autoriza el acceso a su ubicación.</li>
              <li>Cookies y tecnologías similares.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Uso de la Información</h2>
            <p>Utilizamos su información para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar y mantener nuestros servicios.</li>
              <li>Procesar transacciones y enviar notificaciones relacionadas.</li>
              <li>Conectar árbitros con clientes.</li>
              <li>Verificar la identidad y credenciales de los árbitros.</li>
              <li>Mejorar y personalizar la experiencia del usuario.</li>
              <li>Enviar comunicaciones de marketing (con su consentimiento).</li>
              <li>Prevenir fraudes y garantizar la seguridad.</li>
              <li>Cumplir con obligaciones legales.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Compartir Información</h2>
            <p>Podemos compartir su información con:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Otros usuarios:</strong> Los perfiles de árbitros son visibles para 
                clientes que buscan servicios. La información de contacto se comparte solo 
                cuando se confirma una reserva.
              </li>
              <li>
                <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar 
                la plataforma (procesamiento de pagos, almacenamiento en la nube, etc.).
              </li>
              <li>
                <strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger 
                nuestros derechos legales.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger 
              su información, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encriptación de datos en tránsito y en reposo.</li>
              <li>Acceso restringido a información personal.</li>
              <li>Monitoreo regular de sistemas.</li>
              <li>Copias de seguridad periódicas.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Sus Derechos</h2>
            <p>De acuerdo con la Ley 1581 de 2012 de Colombia, usted tiene derecho a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acceso:</strong> Conocer qué datos tenemos sobre usted.</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
              <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos.</li>
              <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos.</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado.</li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctenos en{" "}
              <a href="mailto:privacidad@silbatazo.com" className="text-primary hover:underline">
                privacidad@silbatazo.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Retención de Datos</h2>
            <p>
              Conservamos su información personal mientras mantenga una cuenta activa o 
              según sea necesario para proporcionar servicios. También podemos retener 
              información para cumplir con obligaciones legales, resolver disputas y 
              hacer cumplir nuestros acuerdos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Cookies</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar su experiencia. 
              Puede configurar su navegador para rechazar cookies, aunque esto puede 
              afectar la funcionalidad de la plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Menores de Edad</h2>
            <p>
              Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos 
              conscientemente información de menores. Si descubrimos que hemos recopilado 
              datos de un menor, los eliminaremos inmediatamente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Cambios en esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos 
              sobre cambios significativos a través de un aviso en nuestra plataforma o 
              por correo electrónico.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contacto</h2>
            <p>
              Si tiene preguntas sobre esta Política de Privacidad, contáctenos en:{" "}
              <a href="mailto:privacidad@silbatazo.com" className="text-primary hover:underline">
                privacidad@silbatazo.com
              </a>
            </p>
            <p className="mt-4">
              <strong>Responsable del Tratamiento:</strong><br />
              {APP_NAME}<br />
              Colombia
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
