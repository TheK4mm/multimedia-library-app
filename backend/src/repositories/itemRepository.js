const db = require("../config/db");

const ITEM_COLUMNS = `
  i.id, i.user_id, i.title, i.media_type, i.year, i.cover_url, i.synopsis,
  i.rating, i.status, i.favorite, i.notes, i.creator_name,
  i.created_at, i.updated_at
`;

const mapRow = (row) => row && ({
  id:          row.id,
  userId:      row.user_id,
  title:       row.title,
  mediaType:   row.media_type,
  year:        row.year,
  coverUrl:    row.cover_url,
  synopsis:    row.synopsis,
  rating:      row.rating !== null ? parseFloat(row.rating) : null,
  status:      row.status,
  favorite:    row.favorite,
  notes:       row.notes,
  creatorName: row.creator_name,
  createdAt:   row.created_at,
  updatedAt:   row.updated_at,
  genres:      row.genres || [],
});

const list = async (userId, filters = {}) => {
  const params = [userId];
  const conditions = ["i.user_id = $1"];

  if (filters.mediaType) {
    params.push(filters.mediaType);
    conditions.push(`i.media_type = $${params.length}`);
  }
  if (filters.status) {
    params.push(filters.status);
    conditions.push(`i.status = $${params.length}`);
  }
  if (typeof filters.favorite === "boolean") {
    params.push(filters.favorite);
    conditions.push(`i.favorite = $${params.length}`);
  }
  if (filters.search) {
    params.push(`%${filters.search.toLowerCase()}%`);
    const idx = params.length;
    conditions.push(
      `(LOWER(i.title) LIKE $${idx} OR LOWER(COALESCE(i.creator_name,'')) LIKE $${idx})`
    );
  }

  const sortColumn = {
    recent: "i.updated_at DESC",
    title:  "LOWER(i.title) ASC",
    year:   "i.year DESC NULLS LAST",
    rating: "i.rating DESC NULLS LAST",
  }[filters.sort || "recent"];

  const page     = filters.page     || 1;
  const pageSize = filters.pageSize || 50;
  params.push(pageSize, (page - 1) * pageSize);

  const sql = `
    SELECT ${ITEM_COLUMNS},
           COALESCE(
             (SELECT json_agg(json_build_object('id', g.id, 'name', g.name, 'slug', g.slug))
                FROM item_genres ig
                JOIN genres g ON g.id = ig.genre_id
               WHERE ig.item_id = i.id),
             '[]'::json
           ) AS genres
      FROM items i
     WHERE ${conditions.join(" AND ")}
     ORDER BY ${sortColumn}
     LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const countSql = `SELECT COUNT(*)::int AS total FROM items i WHERE ${conditions.join(" AND ")}`;

  const [{ rows }, { rows: countRows }] = await Promise.all([
    db.query(sql, params),
    db.query(countSql, params.slice(0, -2)),
  ]);

  return {
    items: rows.map(mapRow),
    total: countRows[0].total,
    page,
    pageSize,
  };
};

const findById = async (userId, id) => {
  const { rows } = await db.query(
    `SELECT ${ITEM_COLUMNS},
            COALESCE(
              (SELECT json_agg(json_build_object('id', g.id, 'name', g.name, 'slug', g.slug))
                 FROM item_genres ig
                 JOIN genres g ON g.id = ig.genre_id
                WHERE ig.item_id = i.id),
              '[]'::json
            ) AS genres
       FROM items i
      WHERE i.id = $1 AND i.user_id = $2`,
    [id, userId]
  );
  return mapRow(rows[0]);
};

const create = async (userId, data) => {
  const { rows } = await db.query(
    `INSERT INTO items AS i (
        user_id, title, media_type, year, cover_url, synopsis,
        rating, status, favorite, notes, creator_name
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING ${ITEM_COLUMNS}`,
    [
      userId,
      data.title,
      data.mediaType,
      data.year ?? null,
      data.coverUrl ?? null,
      data.synopsis ?? null,
      data.rating ?? null,
      data.status ?? "pending",
      data.favorite ?? false,
      data.notes ?? null,
      data.creatorName ?? null,
    ]
  );
  return mapRow(rows[0]);
};

const update = async (userId, id, data) => {
  // COALESCE keeps existing values for any field that was not supplied.
  const { rows } = await db.query(
    `UPDATE items AS i SET
        title        = COALESCE($3,  i.title),
        media_type   = COALESCE($4,  i.media_type),
        year         = COALESCE($5,  i.year),
        cover_url    = COALESCE($6,  i.cover_url),
        synopsis     = COALESCE($7,  i.synopsis),
        rating       = COALESCE($8,  i.rating),
        status       = COALESCE($9,  i.status),
        favorite     = COALESCE($10, i.favorite),
        notes        = COALESCE($11, i.notes),
        creator_name = COALESCE($12, i.creator_name)
      WHERE i.id = $1 AND i.user_id = $2
      RETURNING ${ITEM_COLUMNS}`,
    [
      id,
      userId,
      data.title       ?? null,
      data.mediaType   ?? null,
      data.year        ?? null,
      data.coverUrl    ?? null,
      data.synopsis    ?? null,
      data.rating      ?? null,
      data.status      ?? null,
      data.favorite    ?? null,
      data.notes       ?? null,
      data.creatorName ?? null,
    ]
  );
  return mapRow(rows[0]);
};

const remove = async (userId, id) => {
  const { rowCount } = await db.query(
    "DELETE FROM items WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
  return rowCount > 0;
};

const replaceGenres = async (itemId, genreIds) => {
  await db.withTransaction(async (client) => {
    await client.query("DELETE FROM item_genres WHERE item_id = $1", [itemId]);
    if (genreIds && genreIds.length) {
      const values = genreIds.map((_, i) => `($1, $${i + 2})`).join(",");
      await client.query(
        `INSERT INTO item_genres (item_id, genre_id) VALUES ${values}
         ON CONFLICT DO NOTHING`,
        [itemId, ...genreIds]
      );
    }
  });
};

const stats = async (userId) => {
  const { rows: byType } = await db.query(
    `SELECT media_type, COUNT(*)::int AS count
       FROM items WHERE user_id = $1
       GROUP BY media_type`,
    [userId]
  );

  const { rows: byStatus } = await db.query(
    `SELECT status, COUNT(*)::int AS count
       FROM items WHERE user_id = $1
       GROUP BY status`,
    [userId]
  );

  const { rows: totals } = await db.query(
    `SELECT
        COUNT(*)::int                           AS total,
        COUNT(*) FILTER (WHERE favorite)::int   AS favorites,
        ROUND(AVG(rating)::numeric, 2)          AS avg_rating,
        COUNT(*) FILTER (WHERE status='completed')::int AS completed
       FROM items WHERE user_id = $1`,
    [userId]
  );

  const toMap = (rows, key) =>
    rows.reduce((acc, r) => ({ ...acc, [r[key]]: r.count }), {});

  return {
    total:      totals[0].total,
    favorites:  totals[0].favorites,
    completed:  totals[0].completed,
    avgRating:  totals[0].avg_rating !== null ? parseFloat(totals[0].avg_rating) : null,
    byType:     toMap(byType,   "media_type"),
    byStatus:   toMap(byStatus, "status"),
  };
};

module.exports = { list, findById, create, update, remove, replaceGenres, stats };
