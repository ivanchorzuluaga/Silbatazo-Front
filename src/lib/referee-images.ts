/**
 * Utilidad para asignar imágenes de árbitros basándose en sus características
 * Usa las imágenes del marketplace cuando no hay foto de perfil
 */

// Lista de imágenes disponibles del marketplace
const REFEREE_IMAGES = [
  "/experienced-female-referee-sports-portrait.jpg",
  "/experienced-male-referee-portrait-stadium-backgrou.jpg",
  "/female-referee-professional-portrait-stadium.jpg",
  "/female-soccer-referee-portrait-professional.jpg",
  "/male-referee-in-black-uniform-portrait.jpg",
  "/male-soccer-referee-portrait-confident-pose.jpg",
  "/professional-male-referee-portrait-in-black-unifor.jpg",
  "/professional-soccer-referee-in-black-uniform-blowi.jpg",
  "/young-male-soccer-referee-portrait.jpg",
];

// Imágenes para árbitros femeninos
const FEMALE_IMAGES = [
  "/experienced-female-referee-sports-portrait.jpg",
  "/female-referee-professional-portrait-stadium.jpg",
  "/female-soccer-referee-portrait-professional.jpg",
];

// Imágenes para árbitros masculinos
const MALE_IMAGES = [
  "/experienced-male-referee-portrait-stadium-backgrou.jpg",
  "/male-referee-in-black-uniform-portrait.jpg",
  "/male-soccer-referee-portrait-confident-pose.jpg",
  "/professional-male-referee-portrait-in-black-unifor.jpg",
  "/professional-soccer-referee-in-black-uniform-blowi.jpg",
  "/young-male-soccer-referee-portrait.jpg",
];

// Imágenes para árbitros experimentados
const EXPERIENCED_IMAGES = [
  "/experienced-female-referee-sports-portrait.jpg",
  "/experienced-male-referee-portrait-stadium-backgrou.jpg",
  "/professional-male-referee-portrait-in-black-unifor.jpg",
  "/professional-soccer-referee-in-black-uniform-blowi.jpg",
];

// Imágenes para árbitros jóvenes
const YOUNG_IMAGES = [
  "/young-male-soccer-referee-portrait.jpg",
  "/female-soccer-referee-portrait-professional.jpg",
];

/**
 * Obtiene una imagen de árbitro basándose en las características proporcionadas
 */
export function getRefereeImage(
  fotoPerfil: string | null | undefined,
  arbitroId: number,
  experienciaAnos?: number,
  nombre?: string
): string {
  // Si hay foto de perfil válida, usarla
  if (fotoPerfil && fotoPerfil.trim() !== "" && !fotoPerfil.includes("placeholder")) {
    return fotoPerfil;
  }

  // Determinar género basándose en el nombre (si está disponible)
  const nombreLower = nombre?.toLowerCase() || "";
  const femaleNames = [
    "andrea", "lucía", "patricia", "maría", "ana", "sofía", 
    "carmen", "laura", "natalia", "diana", "carolina", "valentina",
    "juliana", "paula", "daniela", "mariana", "catalina"
  ];
  const isFemale = femaleNames.some(name => nombreLower.includes(name));

  // Seleccionar imagen basándose en características
  let imagePool: string[];

  if (isFemale) {
    // Para árbitros femeninos
    if (experienciaAnos && experienciaAnos >= 5) {
      imagePool = FEMALE_IMAGES.filter(img => 
        img.includes("experienced") || img.includes("professional")
      );
      if (imagePool.length === 0) imagePool = FEMALE_IMAGES;
    } else {
      imagePool = FEMALE_IMAGES;
    }
  } else {
    // Para árbitros masculinos (por defecto)
    if (experienciaAnos && experienciaAnos >= 10) {
      imagePool = EXPERIENCED_IMAGES.filter(img => 
        img.includes("experienced") || img.includes("professional")
      );
      if (imagePool.length === 0) imagePool = MALE_IMAGES;
    } else if (experienciaAnos && experienciaAnos < 3) {
      imagePool = YOUNG_IMAGES.filter(img => img.includes("young"));
      if (imagePool.length === 0) imagePool = MALE_IMAGES;
    } else {
      imagePool = MALE_IMAGES;
    }
  }

  // Si no hay imágenes en el pool, usar todas las disponibles
  if (imagePool.length === 0) {
    imagePool = REFEREE_IMAGES;
  }

  // Seleccionar imagen basándose en el ID del árbitro (para consistencia)
  // Esto asegura que el mismo árbitro siempre tenga la misma imagen
  const imageIndex = arbitroId % imagePool.length;
  return imagePool[imageIndex] || "/placeholder.jpg";
}

/**
 * Obtiene una imagen aleatoria de árbitro (útil para previews)
 */
export function getRandomRefereeImage(): string {
  const randomIndex = Math.floor(Math.random() * REFEREE_IMAGES.length);
  return REFEREE_IMAGES[randomIndex] || "/placeholder.jpg";
}
