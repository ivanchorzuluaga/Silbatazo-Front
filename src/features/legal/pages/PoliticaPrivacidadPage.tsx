/**
 * Página de Política de Privacidad
 * Diseño moderno con gradientes y glassmorphism
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Eye,
  Database,
  Share2,
  Lock,
  UserCheck,
  Clock,
  Cookie,
  Users,
  FileText,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES, APP_NAME } from "@/lib/constants";
import logoImage from "@/assets/Silbatazo-bordes.png";

export function PoliticaPrivacidadPage() {
  // Scroll al inicio al cargar la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: Shield,
      title: "1. Introducción",
      content: (
        <p>
          En {APP_NAME} nos comprometemos a proteger su privacidad. Esta Política de Privacidad
          explica cómo recopilamos, usamos, divulgamos y protegemos su información personal cuando
          utiliza nuestra plataforma.
        </p>
      ),
    },
    {
      icon: Database,
      title: "2. Información que Recopilamos",
      content: (
        <>
          <p className="mb-4">Recopilamos diferentes tipos de información:</p>

          <h3 className="text-lg font-medium text-white mb-3">
            2.1 Información proporcionada por usted:
          </h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Datos de registro: nombre, correo electrónico, teléfono, contraseña.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                Información de perfil: foto, experiencia, certificaciones (para árbitros).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Información de pago: datos bancarios para procesamiento de pagos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Comunicaciones: mensajes enviados a través de la plataforma.</span>
            </li>
          </ul>

          <h3 className="text-lg font-medium text-white mb-3">
            2.2 Información recopilada automáticamente:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                Datos de uso: páginas visitadas, tiempo de permanencia, acciones realizadas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                Información del dispositivo: tipo de dispositivo, sistema operativo, navegador.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Datos de ubicación: cuando autoriza el acceso a su ubicación.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Cookies y tecnologías similares.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Eye,
      title: "3. Uso de la Información",
      content: (
        <>
          <p className="mb-4">Utilizamos su información para:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Proporcionar y mantener nuestros servicios.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Procesar transacciones y enviar notificaciones relacionadas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Conectar árbitros con clientes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Verificar la identidad y credenciales de los árbitros.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Mejorar y personalizar la experiencia del usuario.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Enviar comunicaciones de marketing (con su consentimiento).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Prevenir fraudes y garantizar la seguridad.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Cumplir con obligaciones legales.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Share2,
      title: "4. Compartir Información",
      content: (
        <>
          <p className="mb-4">Podemos compartir su información con:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Otros usuarios:</strong> Los perfiles de árbitros son
                visibles para clientes que buscan servicios. La información de contacto se comparte
                solo cuando se confirma una reserva.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Proveedores de servicios:</strong> Empresas que nos
                ayudan a operar la plataforma (procesamiento de pagos, almacenamiento en la nube,
                etc.).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Autoridades:</strong> Cuando sea requerido por ley o
                para proteger nuestros derechos legales.
              </span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: Lock,
      title: "5. Seguridad de los Datos",
      content: (
        <>
          <p className="mb-4">
            Implementamos medidas de seguridad técnicas y organizativas para proteger su
            información, incluyendo:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Encriptación de datos en tránsito y en reposo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Acceso restringido a información personal.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Monitoreo regular de sistemas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Copias de seguridad periódicas.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: "6. Sus Derechos",
      content: (
        <>
          <p className="mb-4">
            De acuerdo con la Ley 1581 de 2012 de Colombia, usted tiene derecho a:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Acceso:</strong> Conocer qué datos tenemos sobre
                usted.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Rectificación:</strong> Corregir datos inexactos o
                incompletos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Cancelación:</strong> Solicitar la eliminación de sus
                datos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Oposición:</strong> Oponerse al tratamiento de sus
                datos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>
                <strong className="text-white">Portabilidad:</strong> Recibir sus datos en formato
                estructurado.
              </span>
            </li>
          </ul>
          <p>
            Para ejercer estos derechos, contáctenos en{" "}
            <a
              href="mailto:privacidad@silbatazo.com"
              className="text-primary hover:underline font-medium"
            >
              privacidad@silbatazo.com
            </a>
          </p>
        </>
      ),
    },
    {
      icon: Clock,
      title: "7. Retención de Datos",
      content: (
        <p>
          Conservamos su información personal mientras mantenga una cuenta activa o según sea
          necesario para proporcionar servicios. También podemos retener información para cumplir
          con obligaciones legales, resolver disputas y hacer cumplir nuestros acuerdos.
        </p>
      ),
    },
    {
      icon: Cookie,
      title: "8. Cookies",
      content: (
        <p>
          Utilizamos cookies y tecnologías similares para mejorar su experiencia. Puede configurar
          su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad de la
          plataforma.
        </p>
      ),
    },
    {
      icon: Users,
      title: "9. Menores de Edad",
      content: (
        <p>
          Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos conscientemente
          información de menores. Si descubrimos que hemos recopilado datos de un menor, los
          eliminaremos inmediatamente.
        </p>
      ),
    },
    {
      icon: FileText,
      title: "10. Cambios en esta Política",
      content: (
        <p>
          Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre
          cambios significativos a través de un aviso en nuestra plataforma o por correo
          electrónico.
        </p>
      ),
    },
    {
      icon: Mail,
      title: "11. Contacto",
      content: (
        <>
          <p className="mb-4">
            Si tiene preguntas sobre esta Política de Privacidad, contáctenos en:{" "}
            <a
              href="mailto:privacidad@silbatazo.com"
              className="text-primary hover:underline font-medium"
            >
              privacidad@silbatazo.com
            </a>
          </p>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white font-medium">Responsable del Tratamiento:</p>
            <p>{APP_NAME}</p>
            <p>Colombia</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-background" />

      {/* Efectos de luz decorativos */}
      <div className="fixed top-0 right-1/4 h-96 w-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="fixed bottom-0 left-1/4 h-96 w-96 bg-primary/10 rounded-full blur-[128px]" />
      <div className="fixed top-1/3 left-0 h-64 w-64 bg-emerald-500/10 rounded-full blur-[100px]" />

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
          <Link to={ROUTES.HOME}>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4" />
            Protección de Datos
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Política de Privacidad</h1>
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
