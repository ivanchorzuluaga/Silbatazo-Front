/**
 * Utilidades para limpiar y formatear mensajes de error del backend
 */

/**
 * Diccionario de traducciones de mensajes de error comunes de Django
 * Las claves están en minúsculas para comparación case-insensitive
 */
const ERROR_TRANSLATIONS: Record<string, string> = {
  // Errores de unicidad - username
  "user with this username already exists": "Ya existe un usuario con este nombre de usuario.",
  "user with this username already exists.": "Ya existe un usuario con este nombre de usuario.",
  "a user with that username already exists": "Ya existe un usuario con este nombre de usuario.",
  "a user with that username already exists.": "Ya existe un usuario con este nombre de usuario.",
  "username already exists": "Ya existe un usuario con este nombre de usuario.",
  "this username is already taken": "Este nombre de usuario ya está en uso.",
  "username is already taken": "Este nombre de usuario ya está en uso.",

  // Errores de unicidad - email
  "user with this email already exists": "Ya existe un usuario con este correo electrónico.",
  "user with this email already exists.": "Ya existe un usuario con este correo electrónico.",
  "a user with that email already exists": "Ya existe un usuario con este correo electrónico.",
  "a user with that email already exists.": "Ya existe un usuario con este correo electrónico.",
  "email already exists": "Ya existe un usuario con este correo electrónico.",
  "this email is already taken": "Este correo electrónico ya está en uso.",
  "email is already taken": "Este correo electrónico ya está en uso.",

  // Errores de validación de campos
  "this field is required.": "Este campo es requerido.",
  "this field is required": "Este campo es requerido.",
  "this field may not be blank.": "Este campo no puede estar vacío.",
  "this field may not be blank": "Este campo no puede estar vacío.",
  "this field may not be null.": "Este campo no puede ser nulo.",
  "this field may not be null": "Este campo no puede ser nulo.",

  // Errores de contraseña
  "password fields didn't match.": "Las contraseñas no coinciden.",
  "password fields didn't match": "Las contraseñas no coinciden.",
  "this password is too short.": "Esta contraseña es demasiado corta.",
  "this password is too short": "Esta contraseña es demasiado corta.",
  "this password is too common.": "Esta contraseña es demasiado común.",
  "this password is too common": "Esta contraseña es demasiado común.",
  "this password is entirely numeric.": "Esta contraseña es completamente numérica.",
  "this password is entirely numeric": "Esta contraseña es completamente numérica.",

  // Errores de formato
  "enter a valid email address.": "Ingresa un correo electrónico válido.",
  "enter a valid email address": "Ingresa un correo electrónico válido.",
  "enter a valid value.": "Ingresa un valor válido.",
  "enter a valid value": "Ingresa un valor válido.",

  // Errores de autenticación
  "invalid credentials.": "Credenciales inválidas.",
  "invalid credentials": "Credenciales inválidas.",
  "unable to log in with provided credentials.":
    "No se puede iniciar sesión con las credenciales proporcionadas.",
  "unable to log in with provided credentials":
    "No se puede iniciar sesión con las credenciales proporcionadas.",

  // Errores genéricos
  "invalid input.": "Entrada inválida.",
  "invalid input": "Entrada inválida.",
};

/**
 * Traduce un mensaje de error del inglés al español si existe en el diccionario
 */
function translateErrorMessage(message: string): string {
  if (!message) return message;

  // Normalizar el mensaje: convertir a minúsculas y limpiar espacios
  const normalized = message.toLowerCase().trim();

  // Buscar traducción exacta
  if (ERROR_TRANSLATIONS[normalized]) {
    return ERROR_TRANSLATIONS[normalized];
  }

  // Buscar traducción parcial (para casos con prefijos o variaciones)
  // Ordenar por longitud descendente para priorizar coincidencias más largas
  const sortedEntries = Object.entries(ERROR_TRANSLATIONS).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [english, spanish] of sortedEntries) {
    // Buscar si el mensaje contiene la clave (case-insensitive)
    if (normalized.includes(english)) {
      return spanish;
    }
  }

  // Si no se encuentra traducción, buscar patrones comunes con regex
  // Patrón: "User with this [field] already exists" o variaciones
  const usernamePatterns = [
    /user.*with.*this.*username.*already.*exists/i,
    /username.*already.*exists/i,
    /username.*is.*already.*taken/i,
    /this.*username.*is.*already.*taken/i,
  ];

  const emailPatterns = [
    /user.*with.*this.*email.*already.*exists/i,
    /email.*already.*exists/i,
    /email.*is.*already.*taken/i,
    /this.*email.*is.*already.*taken/i,
  ];

  for (const pattern of usernamePatterns) {
    if (pattern.test(normalized)) {
      return "Ya existe un usuario con este nombre de usuario.";
    }
  }

  for (const pattern of emailPatterns) {
    if (pattern.test(normalized)) {
      return "Ya existe un usuario con este correo electrónico.";
    }
  }

  return message;
}

/**
 * Limpia un mensaje de error removiendo prefijos comunes del backend
 * Ejemplo: "non_field_errors: Credenciales inválidas" -> "Credenciales inválidas"
 */
export function cleanErrorMessage(message: string): string {
  if (!message) return "";

  let cleaned = message.trim();

  // Primero traducir (antes de remover prefijos, para capturar mejor el mensaje completo)
  cleaned = translateErrorMessage(cleaned);

  // Remover prefijos comunes como "non_field_errors:", "username:", etc.
  // Remover prefijos de campo seguidos de dos puntos
  cleaned = cleaned.replace(/^[a-z_]+:\s*/i, "");

  // Remover múltiples espacios
  cleaned = cleaned.replace(/\s+/g, " ");

  // Si después de remover prefijos el mensaje cambió, intentar traducir de nuevo
  const afterPrefixRemoval = cleaned.trim();
  if (afterPrefixRemoval !== message.trim() && afterPrefixRemoval.length > 0) {
    const retranslated = translateErrorMessage(afterPrefixRemoval);
    if (retranslated !== afterPrefixRemoval) {
      cleaned = retranslated;
    }
  }

  // Capitalizar la primera letra si es necesario
  if (cleaned.length > 0 && cleaned[0] === cleaned[0].toLowerCase()) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Extrae y limpia mensajes de error de un objeto de error del backend
 */
export function extractErrorMessage(errorData: unknown): string {
  if (typeof errorData === "string") {
    return cleanErrorMessage(errorData);
  }

  if (typeof errorData === "object" && errorData !== null) {
    const data = errorData as Record<string, unknown>;

    // Prioridad 1: detail o message
    if (data.detail && typeof data.detail === "string") {
      return cleanErrorMessage(data.detail);
    }
    if (data.message && typeof data.message === "string") {
      return cleanErrorMessage(data.message);
    }

    // Prioridad 2: non_field_errors
    if (data.non_field_errors) {
      if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return cleanErrorMessage(String(data.non_field_errors[0]));
      }
      if (typeof data.non_field_errors === "string") {
        return cleanErrorMessage(data.non_field_errors);
      }
    }

    // Prioridad 3: Primer error de campo disponible
    // Priorizar campos comunes como username y email
    const priorityFields = ["username", "email", "password", "password_confirm"];
    const fieldErrors: string[] = [];
    const otherFieldErrors: string[] = [];

    Object.keys(data).forEach((key) => {
      if (key !== "detail" && key !== "message" && key !== "non_field_errors") {
        const value = data[key];
        let errorMessage = "";

        if (Array.isArray(value) && value.length > 0) {
          errorMessage = cleanErrorMessage(String(value[0]));
        } else if (typeof value === "string") {
          errorMessage = cleanErrorMessage(value);
        }

        if (errorMessage) {
          if (priorityFields.includes(key)) {
            fieldErrors.push(errorMessage);
          } else {
            otherFieldErrors.push(errorMessage);
          }
        }
      }
    });

    // Retornar primero los errores de campos prioritarios
    if (fieldErrors.length > 0) {
      return fieldErrors[0];
    }

    if (otherFieldErrors.length > 0) {
      return otherFieldErrors[0];
    }
  }

  return "Ha ocurrido un error. Por favor, intenta nuevamente.";
}
