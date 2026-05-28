const { ZodError } = require("zod");
const AppError = require("../utils/AppError");
const logger = require("../config/logger");
const env = require("../config/env");

// 404 fallback for unmatched routes.
const notFoundHandler = (req, res, next) => {
  next(AppError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

// Centralized error handler.  Maps Zod / AppError / unknown errors to
// a consistent JSON envelope.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Los datos enviados no son válidos.",
        details: err.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? undefined,
      },
    });
  }

  logger.error("Unhandled error:", err.message, err.stack);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: env.isProd ? "Error interno del servidor." : err.message,
    },
  });
};

module.exports = { notFoundHandler, errorHandler };
