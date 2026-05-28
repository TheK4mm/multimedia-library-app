require("dotenv").config();

const required = (name, fallback) => {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === null || value === "") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return fallback;
  }
  return value;
};

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001", 10),

  databaseUrl: process.env.DATABASE_URL || null,
  pg: {
    host:     String(process.env.PGHOST     || "localhost"),
    port:     parseInt(process.env.PGPORT   || "5432", 10),
    user:     String(process.env.PGUSER     || "postgres"),
    password: String(process.env.PGPASSWORD ?? ""),
    database: String(process.env.PGDATABASE || "biblioteca_personal"),
  },

  jwt: {
    secret:    required("JWT_SECRET", "dev-insecure-secret-change-me"),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  corsOrigins: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean),
};

env.isProd = env.nodeEnv === "production";

module.exports = env;
