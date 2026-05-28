const jwt = require("jsonwebtoken");
const env = require("../config/env");
const AppError = require("../utils/AppError");

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice(7).trim();
};

const requireAuth = (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next(AppError.unauthorized("Token requerido."));

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch {
    next(AppError.unauthorized("Token inválido o expirado."));
  }
};

module.exports = { requireAuth };
