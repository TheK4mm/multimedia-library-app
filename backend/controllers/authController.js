const db = require("../config/db");

exports.login = async (req, res) => {

  const { username, password } = req.body;

  const result = await db.query(
    "SELECT * FROM usuarios WHERE username=$1 AND password=$2",
    [username, password]
  );

  if (result.rows.length > 0) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }

};

exports.register = async (req, res) => {

  const { username, password } = req.body;

  try {

    await db.query(
      "INSERT INTO usuarios (username, password) VALUES ($1,$2)",
      [username, password]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error al registrar usuario"
    });

  }


};
