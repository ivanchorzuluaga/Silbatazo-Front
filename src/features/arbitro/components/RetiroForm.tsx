/**
 * Formulario para crear un retiro
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms";
import { Select } from "@/components/ui/select";
import { formatCop } from "@/lib/utils";
import { useRetiros } from "../hooks/useRetiros";
import type { RetiroCreateData, TipoCuenta, SaldoDisponible } from "../types/arbitro.types";

interface RetiroFormProps {
  saldo: SaldoDisponible | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TIPOS_CUENTA: { value: TipoCuenta; label: string }[] = [
  { value: "ahorros", label: "Ahorros" },
  { value: "corriente", label: "Corriente" },
  { value: "nequi", label: "Nequi" },
  { value: "daviplata", label: "Daviplata" },
  { value: "otro", label: "Otro" },
];

export function RetiroForm({ saldo, onSuccess, onCancel }: RetiroFormProps) {
  const { crearRetiro, isLoading, error, clearError } = useRetiros();

  const [monto, setMonto] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta | "">("");
  const [banco, setBanco] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    // Validaciones
    const errors: Record<string, string> = {};
    const montoNum = parseFloat(monto);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      errors.monto = "El monto debe ser mayor a cero";
    } else if (saldo) {
      if (montoNum < 10000) {
        errors.monto = `El monto mínimo de retiro es ${formatCop(10000)}`;
      } else if (montoNum > saldo.saldo_real_disponible) {
        errors.monto = `El monto excede el saldo disponible (${formatCop(
          saldo.saldo_real_disponible
        )})`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const data: RetiroCreateData = {
        monto: montoNum,
        numero_cuenta: numeroCuenta.trim() || undefined,
        tipo_cuenta: tipoCuenta || undefined,
        banco: banco.trim() || undefined,
      };

      await crearRetiro(data);
      // Limpiar formulario
      setMonto("");
      setNumeroCuenta("");
      setTipoCuenta("");
      setBanco("");
      onSuccess?.();
    } catch (err) {
      // El error ya está manejado por el hook
      console.error("Error al crear retiro:", err);
    }
  };

  const saldoDisponible = saldo?.saldo_real_disponible || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Información de saldo */}
      {saldo && (
        <div className="rounded-lg border bg-card p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Saldo disponible</p>
          <p className="text-2xl font-bold text-primary">{formatCop(saldoDisponible)}</p>
          {saldo.saldo_pendiente > 0 && (
            <p className="text-xs text-muted-foreground">
              {formatCop(saldo.saldo_pendiente)} pendientes de retiro
            </p>
          )}
        </div>
      )}

      {/* Monto */}
      <FormField
        label="Monto a Retirar (COP)"
        name="monto"
        type="number"
        value={monto}
        onChange={(e) => {
          setMonto(e.target.value);
          if (fieldErrors.monto) {
            setFieldErrors((prev) => ({ ...prev, monto: undefined }));
          }
        }}
        error={fieldErrors.monto}
        disabled={isLoading}
        required
        min="10000"
        step="1000"
        placeholder="Ej: 50000"
      />

      {/* Información bancaria (opcional) */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Información Bancaria (Opcional)</h3>

        <FormField
          label="Número de Cuenta"
          name="numero_cuenta"
          value={numeroCuenta}
          onChange={(e) => setNumeroCuenta(e.target.value)}
          disabled={isLoading}
          placeholder="Ej: 1234567890"
        />

        <div className="space-y-2">
          <label htmlFor="tipo_cuenta" className="text-sm font-medium">
            Tipo de Cuenta
          </label>
          <Select
            id="tipo_cuenta"
            value={tipoCuenta}
            onChange={(e) => setTipoCuenta(e.target.value as TipoCuenta)}
            disabled={isLoading}
          >
            <option value="">Selecciona un tipo</option>
            {TIPOS_CUENTA.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </Select>
        </div>

        <FormField
          label="Banco"
          name="banco"
          value={banco}
          onChange={(e) => setBanco(e.target.value)}
          disabled={isLoading}
          placeholder="Ej: Bancolombia"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading || saldoDisponible <= 0} className="flex-1">
          {isLoading ? "Solicitando..." : "Solicitar Retiro"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
