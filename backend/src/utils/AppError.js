class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR", details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }

  static badRequest(message, details)   { return new AppError(message, 400, "BAD_REQUEST", details); }
  static unauthorized(message = "No autorizado") { return new AppError(message, 401, "UNAUTHORIZED"); }
  static forbidden(message = "Acceso denegado")  { return new AppError(message, 403, "FORBIDDEN"); }
  static notFound(message = "Recurso no encontrado") { return new AppError(message, 404, "NOT_FOUND"); }
  static conflict(message)               { return new AppError(message, 409, "CONFLICT"); }
}

module.exports = AppError;
