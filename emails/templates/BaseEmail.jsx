import React from "react";
import { Html, Head, Body, Container, Section, Text, Link } from "@react-email/components";

export function BaseEmail({ title, children }) {
  return (
    <Html lang="es">
      <Head />
      <Body style={{ margin: 0, backgroundColor: "#0b1220", color: "#e2e8f0" }}>
        <Container style={{ padding: "24px 0" }}>
          <Section
            style={{
              backgroundColor: "#0f172a",
              border: "1px solid #1f2937",
              borderRadius: "16px",
              overflow: "hidden",
              maxWidth: "600px",
            }}
          >
            <Section
              style={{
                padding: "24px 28px",
                background: "linear-gradient(135deg,#0f766e,#0b1220)",
              }}
            >
              <Text style={{ margin: 0, fontSize: "20px", color: "#e2e8f0" }}>Silbatazo</Text>
              <Text style={{ margin: "6px 0 0", fontSize: "13px", color: "#cbd5f5" }}>
                {title || "Notificación"}
              </Text>
            </Section>
            <Section style={{ padding: "28px" }}>{children}</Section>
            <Section
              style={{
                padding: "20px 28px",
                borderTop: "1px solid #1f2937",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              © 2026 Silbatazo. Todos los derechos reservados.
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
