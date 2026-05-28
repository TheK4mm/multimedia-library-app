export const MEDIA_TYPES = [
  { code: "book",  label: "Libros",    singular: "Libro",    icon: "book",  badge: "book"  },
  { code: "movie", label: "Películas", singular: "Película", icon: "film",  badge: "movie" },
  { code: "music", label: "Música",    singular: "Música",   icon: "music", badge: "music" },
];

export const STATUSES = [
  { code: "pending",     label: "Pendiente",   variant: "neutral" },
  { code: "in_progress", label: "En curso",    variant: "info"    },
  { code: "completed",   label: "Completado",  variant: "success" },
  { code: "abandoned",   label: "Abandonado",  variant: "warning" },
];

export const SORT_OPTIONS = [
  { value: "recent", label: "Más recientes" },
  { value: "title",  label: "Título A–Z"    },
  { value: "year",   label: "Año (nuevos)"  },
  { value: "rating", label: "Mejor valorados" },
];

export const mediaByCode = (code) =>
  MEDIA_TYPES.find((m) => m.code === code) || MEDIA_TYPES[0];

export const statusByCode = (code) =>
  STATUSES.find((s) => s.code === code) || STATUSES[0];
