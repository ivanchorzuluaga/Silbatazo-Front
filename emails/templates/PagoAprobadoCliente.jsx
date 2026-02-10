import React from "react";
import { Text, Section } from "@react-email/components";
import { BaseEmail } from "./BaseEmail";

export default function PagoAprobadoCliente() {
  return (
    <BaseEmail title="Pago confirmado">
      <Text style={{ margin: "0 0 8px", fontSize: "18px", color: "#e2e8f0" }}>
        {"{{ mensaje }}"}
      </Text>
      <Section
        style={{
          backgroundColor: "#111827",
          border: "1px solid #1f2937",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <Text style={{ margin: 0, fontSize: "14px", color: "#e2e8f0" }}>
          Partido #{"{{ partido_id }}"}
        </Text>
        <Text style={{ margin: "6px 0 0", fontSize: "13px", color: "#94a3b8" }}>
          {"{{ fecha_hora }} · {{ municipio }}"}
        </Text>
        <Text style={{ margin: "6px 0 0", fontSize: "13px", color: "#94a3b8" }}>
          {"{{ lugar }}"}
        </Text>
      </Section>
    </BaseEmail>
  );
}
