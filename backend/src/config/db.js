const { Pool } = require("pg");
const env = require("./env");
const logger = require("./logger");

const pool = env.databaseUrl
  ? new Pool({
      connectionString: env.databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host:     env.pg.host,
      port:     env.pg.port,
      user:     env.pg.user,
      password: env.pg.password,
      database: env.pg.database,
    });

pool.on("error", (err) => {
  logger.error("Unexpected error on idle PG client", err);
});

const query = (text, params) => pool.query(text, params);

const withTransaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const ping = async () => {
  await pool.query("SELECT 1");
};

module.exports = { pool, query, withTransaction, ping };
