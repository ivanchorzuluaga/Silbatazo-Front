/**
 * Funciones de validación reutilizables
 */

export const validations = {
  /**
   * Valida que un campo no esté vacío
   */
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  /**
   * Valida formato de email
   */
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * Valida longitud mínima
   */
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  /**
   * Valida longitud máxima
   */
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  /**
   * Valida formato de username (solo letras, números, guiones y guiones bajos)
   */
  username: (value: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    return usernameRegex.test(value);
  },

  /**
   * Valida fortaleza de contraseña (mínimo 8 caracteres)
   */
  passwordStrength: (value: string): boolean => {
    return value.length >= 8;
  },
};
