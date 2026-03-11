import fs from "node:fs";
import path from "node:path";

const outputDir = path.resolve("out");
const targetDir = path.resolve("../../backend/templates/emails");

if (!fs.existsSync(outputDir)) {
  console.error(`No se encontró output en ${outputDir}.`);
  process.exit(1);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Nota: estos nombres deben existir en el build de React Email.
const fileMap = new Map([
  ["BienvenidaClienteActivacion.html", "bienvenida_cliente_activacion.html"],
  ["BienvenidaArbitroActivacion.html", "bienvenida_arbitro_activacion.html"],
  ["PartidoCreadoConArbitroCliente.html", "partido_creado_con_arbitro_cliente.html"],
  ["PartidoAsignadoArbitro.html", "partido_asignado_arbitro.html"],
  ["PartidoCreadoAdmin.html", "partido_creado_admin.html"],
  ["PartidoDisponibleArbitro.html", "partido_disponible_arbitro.html"],
  ["PartidoTomadoAdmin.html", "partido_tomado_admin.html"],
  ["ArbitroAsignadoCliente.html", "arbitro_asignado_cliente.html"],
  ["ArbitroReasignadoCliente.html", "arbitro_reasignado_cliente.html"],
  ["ArbitroAceptoCliente.html", "arbitro_acepto_cliente.html"],
  ["PartidoCanceladoCliente.html", "partido_cancelado_cliente.html"],
  ["PartidoCanceladoPorClienteArbitro.html", "partido_cancelado_por_cliente_arbitro.html"],
  ["PartidoCanceladoPorArbitroAdmin.html", "partido_cancelado_por_arbitro_admin.html"],
  ["PartidoCanceladoPorArbitroArbitro.html", "partido_cancelado_por_arbitro_arbitro.html"],
  ["RecordatorioPrePartidoCliente.html", "recordatorio_pre_partido_cliente.html"],
  ["RecordatorioPrePartidoArbitro.html", "recordatorio_pre_partido_arbitro.html"],
  ["RecordatorioPrePartidoAdmin.html", "recordatorio_pre_partido_admin.html"],
  ["RecordatorioPostPartidoCliente.html", "recordatorio_post_partido_cliente.html"],
  ["RecordatorioPostPartidoArbitro.html", "recordatorio_post_partido_arbitro.html"],
  ["RetiroSolicitadoAdmin.html", "retiro_solicitado_admin.html"],
  ["RetiroAprobadoArbitro.html", "retiro_aprobado_arbitro.html"],
  ["RetiroRechazadoArbitro.html", "retiro_rechazado_arbitro.html"],
  ["PasswordReset.html", "password_reset.html"],
  ["LegalInfo.html", "legal_info.html"],
]);

for (const [src, dest] of fileMap.entries()) {
  const fromPath = path.join(outputDir, src);
  const toPath = path.join(targetDir, dest);
  if (!fs.existsSync(fromPath)) {
    console.warn(`No se encontró ${src} en ${outputDir}`);
    continue;
  }
  fs.copyFileSync(fromPath, toPath);
}

console.log(`Emails copiados a ${targetDir}`);
