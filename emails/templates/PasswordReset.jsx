import React from "react";
import { Text, Link } from "@react-email/components";
import { BaseEmail } from "./BaseEmail";

export default function PasswordReset() {
  return (
    <BaseEmail title="Recupera tu contraseña">
      <Text style={{ margin: "0 0 16px", fontSize: "14px", color: "#cbd5f5" }}>
        Hola {"{{ cliente_nombre }}"}, recibimos una solicitud para cambiar tu contraseña.
      </Text>
      <Link
        href="{{ reset_link }}"
        style={{
          display: "inline-block",
          backgroundColor: "#10b981",
          color: "#0b1220",
          textDecoration: "none",
          padding: "10px 18px",
          borderRadius: "10px",
          fontWeight: 600,
        }}
      >
        Cambiar contraseña
      </Link>
      <Text style={{ margin: "12px 0 0", fontSize: "12px", color: "#94a3b8" }}>
        Si no fuiste tú, ignora este mensaje.
      </Text>
    </BaseEmail>
  );
}
