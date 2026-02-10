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

const fileMap = new Map([
  ["PartidoCreadoCliente.html", "partido_creado_cliente.html"],
  ["PartidoCreadoArbitro.html", "partido_creado_arbitro.html"],
  ["ArbitroAsignadoCliente.html", "arbitro_asignado_cliente.html"],
  ["ArbitroAsignadoArbitro.html", "arbitro_asignado_arbitro.html"],
  ["ArbitroAceptoCliente.html", "arbitro_acepto_cliente.html"],
  ["ArbitroRechazoCliente.html", "arbitro_rechazo_cliente.html"],
  ["PartidoCanceladoCliente.html", "partido_cancelado_cliente.html"],
  ["PartidoCanceladoArbitro.html", "partido_cancelado_arbitro.html"],
  ["PartidoCanceladoAdmin.html", "partido_cancelado_admin.html"],
  ["PartidoReprogramado.html", "partido_reprogramado.html"],
  ["PagoAprobadoCliente.html", "pago_aprobado_cliente.html"],
  ["PagoAprobadoArbitro.html", "pago_aprobado_arbitro.html"],
  ["PagoRechazadoAdmin.html", "pago_rechazado_admin.html"],
  ["VerifyEmail.html", "verify_email.html"],
  ["PasswordReset.html", "password_reset.html"],
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
