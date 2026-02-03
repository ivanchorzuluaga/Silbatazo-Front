/**
 * Formulario para completar o editar perfil del cliente (nombre, email, teléfono, documento)
 */

import { useState, useEffect } from "react";
import { FormField } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { validations } from "@/lib/validations";
import type { User, UserUpdateData } from "@/features/auth/types/auth.types";

interface PerfilClienteFormProps {
  user: User | null;
  onSubmit: (data: UserUpdateData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export function PerfilClienteForm({
  user,
  onSubmit,
  isLoading = false,
  error,
  onClearError,
}: PerfilClienteFormProps) {
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [telefono, setTelefono] = useState(user?.telefono ?? "");
  const [documentoIdentidad, setDocumentoIdentidad] = useState(user?.documento_identidad ?? "");
  const [fieldErrors, setFieldErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    telefono?: string;
    documento_identidad?: string;
  }>({});

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
      setEmail(user.email ?? "");
      setTelefono(user.telefono ?? "");
      setDocumentoIdentidad(user.documento_identidad ?? "");
    }
  }, [
    user?.id,
    user?.first_name,
    user?.last_name,
    user?.email,
    user?.telefono,
    user?.documento_identidad,
  ]);

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};
    if (!firstName?.trim()) {
      errors.first_name = "El nombre es requerido";
    }
    if (!lastName?.trim()) {
      errors.last_name = "El apellido es requerido";
    }
    if (!email?.trim()) {
      errors.email = "El correo electrónico es requerido";
    } else if (!validations.email(email)) {
      errors.email = "El formato del correo no es válido";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError?.();
    if (!validate()) return;
    await onSubmit({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      telefono: telefono.trim() || undefined,
      documento_identidad: documentoIdentidad.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <FormField
        label="Nombre"
        name="first_name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Tu nombre"
        error={fieldErrors.first_name}
        autoComplete="given-name"
      />
      <FormField
        label="Apellido"
        name="last_name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Tu apellido"
        error={fieldErrors.last_name}
        autoComplete="family-name"
      />
      <FormField
        label="Correo electrónico"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="correo@ejemplo.com"
        error={fieldErrors.email}
        autoComplete="email"
      />
      <FormField
        label="Teléfono"
        name="telefono"
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Ej: 300 123 4567"
        error={fieldErrors.telefono}
        autoComplete="tel"
      />
      <FormField
        label="Número de documento"
        name="documento_identidad"
        value={documentoIdentidad}
        onChange={(e) => setDocumentoIdentidad(e.target.value)}
        placeholder="Cédula o documento de identidad"
        error={fieldErrors.documento_identidad}
        autoComplete="off"
      />
      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? "Guardando..." : "Guardar perfil"}
      </Button>
    </form>
  );
}
