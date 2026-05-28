const { z } = require("zod");

const usernameSchema = z
  .string()
  .trim()
  .min(3, "El usuario debe tener al menos 3 caracteres.")
  .max(50)
  .regex(/^[a-zA-Z0-9_.-]+$/, "Solo se permiten letras, números, '.', '_' y '-'.");

const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres.")
  .max(128);

const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: z.string().email("Email inválido.").optional(),
  displayName: z.string().trim().min(1).max(120).optional(),
});

const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1),
});

module.exports = { registerSchema, loginSchema };
