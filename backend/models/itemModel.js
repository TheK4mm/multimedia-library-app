const db = require("../config/db");

exports.getAllItems = async () => {
  const result = await db.query("SELECT * FROM items");
  return result.rows;
};

exports.createItem = async (item) => {
  const { titulo, tipo, autor, anio, genero } = item;

  const result = await db.query(
    "INSERT INTO items (titulo,tipo,autor,anio,genero) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [titulo, tipo, autor, anio, genero]
  );

  return result.rows[0];
};

exports.updateItem = async (id, item) => {
  const { titulo, tipo, autor, anio, genero } = item;

  const result = await db.query(
    "UPDATE items SET titulo=$1, tipo=$2, autor=$3, anio=$4, genero=$5 WHERE id=$6 RETURNING *",
    [titulo, tipo, autor, anio, genero, id]
  );

  return result.rows[0];
};

exports.deleteItem = async (id) => {
  await db.query("DELETE FROM items WHERE id=$1", [id]);
};