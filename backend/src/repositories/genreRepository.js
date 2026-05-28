const db = require("../config/db");

const list = async (mediaType) => {
  const sql = mediaType
    ? `SELECT id, name, slug, media_type FROM genres WHERE media_type = $1 ORDER BY name`
    : `SELECT id, name, slug, media_type FROM genres ORDER BY name`;
  const params = mediaType ? [mediaType] : [];
  const { rows } = await db.query(sql, params);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    mediaType: r.media_type,
  }));
};

module.exports = { list };
