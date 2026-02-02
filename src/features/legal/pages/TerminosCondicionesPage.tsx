/**
 * Página de Términos y Condiciones
 * Diseño moderno con gradientes y glassmorphism
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield, Users, CreditCard, Scale, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES, APP_NAME } from "@/lib/constants";
import logoImage from "@/assets/Silbatazo-bordes.png";

export function TerminosCondicionesPage() {
  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: FileText,
      title: "1. Aceptación de los Términos",
      content: (
        <p>
          Al acceder y utilizar la plataforma {APP_NAME}, usted acepta estar sujeto a estos Términos
          y Condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no podrá
          acceder al servicio.
        </p>
      ),
    },
    {
      icon: Shield,
      title: "2. Descripción del Servicio",
      content: (
        <>
          <p className="mb-4">
            {APP_NAME} es una plataforma que conecta a organizadores de eventos deportivos con
            árbitros profesionales certificados. Nuestro servicio permite:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                A los clientes: buscar, contactar y contratar árbitros para sus eventos deportivos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                A los árbitros: crear perfiles profesionales, gestionar su disponibilidad y recibir
                solicitudes de arbitraje.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Gestionar pagos de forma segura entre las partes.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Users,
      title: "3. Registro y Cuenta de Usuario",
      content: (
        <>
          <p className="mb-4">
            Para utilizar ciertos servicios, debe registrarse y crear una cuenta. Usted es
            responsable de:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Proporcionar información precisa y actualizada.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Mantener la confidencialidad de su contraseña.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Todas las actividades que ocurran bajo su cuenta.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Notificarnos inmediatamente sobre cualquier uso no autorizado.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Shield,
      title: "4. Obligaciones de los Árbitros",
      content: (
        <>
          <p className="mb-4">Los árbitros registrados en la plataforma se comprometen a:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                Poseer las certificaciones y credenciales necesarias para ejercer como árbitro.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Mantener actualizados sus documentos y certificaciones.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Cumplir con los compromisos adquiridos con los clientes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Actuar de manera profesional y ética en todo momento.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                Notificar con anticipación cualquier cancelación o imposibilidad de asistir.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Users,
      title: "5. Obligaciones de los Clientes",
      content: (
        <>
          <p className="mb-4">Los clientes que utilizan la plataforma se comprometen a:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Proporcionar información precisa sobre los eventos deportivos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Realizar los pagos acordados de manera oportuna.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Tratar a los árbitros con respeto y profesionalismo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                Proporcionar las condiciones necesarias para que el árbitro pueda ejercer su
                función.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: CreditCard,
      title: "6. Pagos y Comisiones",
      content: (
        <p>
          {APP_NAME} actúa como intermediario en los pagos. La plataforma cobra una comisión por
          cada transacción exitosa. Los detalles específicos de las tarifas se encuentran
          disponibles en la sección de precios.
        </p>
      ),
    },
    {
      icon: Scale,
      title: "7. Cancelaciones",
      content: (
        <p>
          Las políticas de cancelación específicas se detallan en nuestra{" "}
          <Link to={ROUTES.REEMBOLSO} className="text-primary hover:underline font-medium">
            Política de Reembolso
          </Link>
          . Se recomienda revisar estas políticas antes de realizar cualquier reserva.
        </p>
      ),
    },
    {
      icon: Shield,
      title: "8. Propiedad Intelectual",
      content: (
        <p>
          Todo el contenido de la plataforma, incluyendo textos, gráficos, logos, íconos, imágenes y
          software, es propiedad de {APP_NAME} y está protegido por las leyes de propiedad
          intelectual de Colombia.
        </p>
      ),
    },
    {
      icon: Scale,
      title: "9. Limitación de Responsabilidad",
      content: (
        <p>
          {APP_NAME} no es responsable de los servicios prestados directamente entre árbitros y
          clientes. Actuamos únicamente como plataforma de conexión y facilitación de pagos.
        </p>
      ),
    },
    {
      icon: FileText,
      title: "10. Modificaciones",
      content: (
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
          entrarán en vigor inmediatamente después de su publicación en la plataforma.
        </p>
      ),
    },
    {
      icon: Scale,
      title: "11. Ley Aplicable",
      content: (
        <p>
          Estos términos se regirán e interpretarán de acuerdo con las leyes de la República de
          Colombia, sin tener en cuenta sus conflictos de disposiciones legales.
        </p>
      ),
    },
    {
      icon: Mail,
      title: "12. Contacto",
      content: (
        <p>
          Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos en:{" "}
          <a
            href="mailto:contacto@silbatazo.com"
            className="text-primary hover:underline font-medium"
          >
            contacto@silbatazo.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-background" />

      {/* Efectos de luz decorativos */}
      <div className="fixed top-0 left-1/4 h-96 w-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="fixed bottom-0 right-1/4 h-96 w-96 bg-primary/10 rounded-full blur-[128px]" />
      <div className="fixed top-1/2 right-0 h-64 w-64 bg-emerald-500/10 rounded-full blur-[100px]" />

      {/* Logo de fondo estático */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={logoImage}
          alt=""
          className="w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] object-contain opacity-[0.03]"
        />
      </div>

      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/#contacto">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary backdrop-blur-sm mb-6">
            <FileText className="w-4 h-4" />
            Documento Legal
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Términos y Condiciones</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Última actualización: Enero 2026
          </p>
        </div>

        {/* Secciones */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl flex-shrink-0">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
                  <div className="text-white/70 leading-relaxed">{section.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">© 2026 {APP_NAME}. Todos los derechos reservados.</p>
        </div>
      </main>
    </div>
  );
}
