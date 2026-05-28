const db = require("../config/db");

const PUBLIC_COLUMNS = `
  id, username, email, display_name, avatar_url, bio, created_at, updated_at
`;

const findByUsername = async (username) => {
  const { rows } = await db.query(
    `SELECT id, username, email, password_hash, display_name, avatar_url, bio
       FROM users
      WHERE LOWER(username) = LOWER($1)`,
    [username]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ username, passwordHash, email, displayName }) => {
  const { rows } = await db.query(
    `INSERT INTO users (username, password_hash, email, display_name)
     VALUES ($1, $2, $3, $4)
     RETURNING ${PUBLIC_COLUMNS}`,
    [username, passwordHash, email || null, displayName || username]
  );
  return rows[0];
};

const updateProfile = async (id, { displayName, avatarUrl, bio, email }) => {
  const { rows } = await db.query(
    `UPDATE users
        SET display_name = COALESCE($2, display_name),
            avatar_url   = COALESCE($3, avatar_url),
            bio          = COALESCE($4, bio),
            email        = COALESCE($5, email)
      WHERE id = $1
      RETURNING ${PUBLIC_COLUMNS}`,
    [id, displayName ?? null, avatarUrl ?? null, bio ?? null, email ?? null]
  );
  return rows[0] || null;
};

module.exports = { findByUsername, findById, create, updateProfile };
