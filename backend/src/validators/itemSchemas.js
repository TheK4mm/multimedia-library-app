const { z } = require("zod");

const MEDIA_TYPES = ["book", "movie", "music"];
const STATUSES   = ["pending", "in_progress", "completed", "abandoned"];

const yearSchema = z
  .union([z.number().int(), z.string().regex(/^\d{1,4}$/)])
  .transform((v) => (typeof v === "string" ? parseInt(v, 10) : v))
  .refine((v) => v >= 0 && v <= 2999, "Año fuera de rango.")
  .nullable()
  .optional();

const ratingSchema = z
  .union([z.number(), z.string().regex(/^\d(\.\d)?$/)])
  .transform((v) => (typeof v === "string" ? parseFloat(v) : v))
  .refine((v) => v >= 0 && v <= 5, "La valoración va de 0 a 5.")
  .nullable()
  .optional();

const itemBase = {
  title:       z.string().trim().min(1, "El título es obligatorio.").max(200),
  mediaType:   z.enum(MEDIA_TYPES, { errorMap: () => ({ message: "Tipo inválido." }) }),
  year:        yearSchema,
  creatorName: z.string().trim().max(160).nullable().optional(),
  coverUrl:    z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
  synopsis:    z.string().max(4000).nullable().optional(),
  rating:      ratingSchema,
  status:      z.enum(STATUSES).default("pending"),
  favorite:    z.boolean().default(false),
  notes:       z.string().max(4000).nullable().optional(),
  genreIds:    z.array(z.number().int().positive()).optional(),
};

const createItemSchema = z.object(itemBase);

const updateItemSchema = z.object({
  ...Object.fromEntries(Object.entries(itemBase).map(([k, v]) => [k, v.optional()])),
});

const listItemsQuerySchema = z.object({
  search:    z.string().trim().optional(),
  mediaType: z.enum(MEDIA_TYPES).optional(),
  status:    z.enum(STATUSES).optional(),
  favorite:  z.union([z.literal("true"), z.literal("false")]).transform((v) => v === "true").optional(),
  sort:      z.enum(["recent", "title", "year", "rating"]).default("recent"),
  page:      z.coerce.number().int().min(1).default(1),
  pageSize:  z.coerce.number().int().min(1).max(100).default(50),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = {
  MEDIA_TYPES,
  STATUSES,
  createItemSchema,
  updateItemSchema,
  listItemsQuerySchema,
  idParamSchema,
};
