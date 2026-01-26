import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parsea una fecha en formato YYYY-MM-DD sin problemas de zona horaria
 * Evita que JavaScript interprete la fecha como UTC medianoche
 * @param fechaStr - Fecha en formato "YYYY-MM-DD"
 * @returns Date object en la zona horaria local
 */
export function parseLocalDate(fechaStr: string): Date {
  const [year, month, day] = fechaStr.split('-').map(Number)
  // month es 0-indexed en JavaScript (0 = enero, 11 = diciembre)
  return new Date(year, month - 1, day)
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD en la zona horaria local
 * @returns String en formato "YYYY-MM-DD"
 */
export function getTodayLocalDate(): string {
  const hoy = new Date()
  const year = hoy.getFullYear()
  const month = String(hoy.getMonth() + 1).padStart(2, '0')
  const day = String(hoy.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Compara dos fechas en formato YYYY-MM-DD
 * @param fecha1 - Fecha en formato "YYYY-MM-DD"
 * @param fecha2 - Fecha en formato "YYYY-MM-DD"
 * @returns -1 si fecha1 < fecha2, 0 si son iguales, 1 si fecha1 > fecha2
 */
export function compareDates(fecha1: string, fecha2: string): number {
  if (fecha1 < fecha2) return -1
  if (fecha1 > fecha2) return 1
  return 0
}

/**
 * Normaliza una fecha a formato YYYY-MM-DD para usar en input type="date"
 * Asegura que la fecha se maneje como string sin conversión de zona horaria
 * @param fecha - Puede ser string YYYY-MM-DD, Date object, o string ISO
 * @returns String en formato "YYYY-MM-DD" o string vacío si no es válida
 */
export function normalizeDateForInput(fecha: string | Date | null | undefined): string {
  if (!fecha) return ""
  
  // Si ya es un string en formato YYYY-MM-DD, devolverlo directamente
  if (typeof fecha === "string") {
    // Verificar si es formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha
    }
    // Si es un string ISO, extraer solo la parte de la fecha
    const dateMatch = fecha.match(/^(\d{4}-\d{2}-\d{2})/)
    if (dateMatch) {
      return dateMatch[1]
    }
    // Intentar parsear como fecha
    try {
      const date = new Date(fecha)
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    } catch {
      return ""
    }
  }
  
  // Si es un Date object, convertir a string YYYY-MM-DD
  if (fecha instanceof Date) {
    if (isNaN(fecha.getTime())) return ""
    const year = fecha.getFullYear()
    const month = String(fecha.getMonth() + 1).padStart(2, '0')
    const day = String(fecha.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  return ""
}
