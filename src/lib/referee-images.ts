/**
 * Utilidad para mostrar imagen de árbitro.
 * Si existe foto_perfil (subida por el usuario), se usa esa URL.
 * Mientras no haya foto, se muestra un placeholder por árbitro (inicial + color).
 * Cuando se implemente la subida de foto, no hará falta cambiar nada aquí.
 */

/** Colores para el placeholder (uno por árbitro, determinista) */
const PLACEHOLDER_COLORS = [
  "10b981", // emerald
  "6366f1", // indigo
  "f59e0b", // amber
  "ec4899", // pink
  "8b5cf6", // violet
  "06b6d4", // cyan
  "84cc16", // lime
  "ef4444", // red
];

/**
 * Genera un placeholder SVG como data URL (inicial + color por árbitro).
 * Se usa cuando el árbitro aún no tiene foto_perfil subida.
 */
function getPlaceholderDataUrl(arbitroId: number, nombre?: string): string {
  const initial = nombre?.trim().charAt(0)?.toUpperCase() || "A";
  const colorIndex = arbitroId % PLACEHOLDER_COLORS.length;
  const hex = PLACEHOLDER_COLORS[colorIndex];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#${hex}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,sans-serif" font-size="80" font-weight="600" fill="white">${initial}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Devuelve la URL de imagen a mostrar para un árbitro.
 * - Si tiene foto_perfil válida (URL subida), se devuelve esa URL.
 * - Si no, se devuelve un placeholder (inicial + color) hasta que suba foto.
 */
export function getRefereeImage(
  fotoPerfil: string | null | undefined,
  arbitroId: number,
  _experienciaAnos?: number,
  nombre?: string,
  fotoPerfilThumb?: string | null
): string {
  if (fotoPerfilThumb && fotoPerfilThumb.trim() !== "") {
    return fotoPerfilThumb;
  }
  if (fotoPerfil && fotoPerfil.trim() !== "" && !fotoPerfil.includes("placeholder")) {
    return fotoPerfil;
  }
  return getPlaceholderDataUrl(arbitroId, nombre);
}

/**
 * Placeholder aleatorio por árbitro (útil para previews donde no hay id).
 * Usa un índice numérico para variar el color.
 */
export function getRandomRefereeImage(seed?: number): string {
  const id = seed ?? Math.floor(Math.random() * 1000);
  return getPlaceholderDataUrl(id, "Á");
}
