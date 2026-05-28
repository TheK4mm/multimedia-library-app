-- =====================================================================
-- Copy data from the parked legacy tables into schema v2.
--
-- Prerequisites: migration.sql + schema.sql have already run.
-- Safe to re-run: uses NOT EXISTS guards.
-- =====================================================================

BEGIN;

-- 1) Legacy users -> users.
--    Old `password` column was plain text; we copy it verbatim into
--    password_hash but prefix it with "legacy$" so the auth layer can
--    detect and force a password reset on first login.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'usuarios_legacy'
    ) THEN
        INSERT INTO users (id, username, password_hash, display_name)
        SELECT  u.id,
                u.username,
                'legacy$' || u.password,
                u.username
        FROM    usuarios_legacy u
        WHERE   NOT EXISTS (SELECT 1 FROM users WHERE users.id = u.id);

        PERFORM setval(
            pg_get_serial_sequence('users','id'),
            COALESCE((SELECT MAX(id) FROM users), 1)
        );
    END IF;
END$$;

-- 2) Legacy items -> items.
DO $$
DECLARE
    v_default_user INTEGER;
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'items_legacy'
    ) THEN
        SELECT id INTO v_default_user FROM users ORDER BY id LIMIT 1;

        INSERT INTO items (
            id, user_id, title, media_type, year, creator_name,
            status, created_at, updated_at
        )
        SELECT
            i.id,
            COALESCE(i.usuario_id, v_default_user),
            i.titulo,
            CASE LOWER(COALESCE(i.tipo, ''))
                WHEN 'libro'    THEN 'book'
                WHEN 'película' THEN 'movie'
                WHEN 'pelicula' THEN 'movie'
                WHEN 'musica'   THEN 'music'
                WHEN 'música'   THEN 'music'
                ELSE 'book'
            END,
            i.anio,
            i.autor,
            'pending',
            NOW(),
            NOW()
        FROM items_legacy i
        WHERE COALESCE(i.usuario_id, v_default_user) IS NOT NULL
          AND NOT EXISTS (SELECT 1 FROM items WHERE items.id = i.id);

        PERFORM setval(
            pg_get_serial_sequence('items','id'),
            COALESCE((SELECT MAX(id) FROM items), 1)
        );
    END IF;
END$$;

COMMIT;

-- After verifying data is intact you can drop the legacy tables:
--     DROP TABLE IF EXISTS items_legacy    CASCADE;
--     DROP TABLE IF EXISTS usuarios_legacy CASCADE;
