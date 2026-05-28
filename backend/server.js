const app = require("./src/app");
const env = require("./src/config/env");
const db  = require("./src/config/db");
const logger = require("./src/config/logger");

const start = async () => {
  try {
    await db.ping();
    logger.info("Conectado a PostgreSQL");
  } catch (err) {
    logger.error("No se pudo conectar a PostgreSQL:", err.message);
    if (env.isProd) process.exit(1);
  }

  app.listen(env.port, () => {
    logger.info(`Servidor escuchando en http://localhost:${env.port}`);
  });
};

start();
