const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "biblioteca_personal",
  password: "kampost09",
  port: 5432
});

pool.connect()
  .then(() => {
    console.log("Conectado a PostgreSQL");
  })
  .catch(err => {
    console.error("Error de conexión a PostgreSQL", err);
  });

module.exports = pool;