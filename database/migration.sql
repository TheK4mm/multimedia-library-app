-- =====================================================================
-- Migration: legacy schema (usuarios, items v1)  ->  schema v2
--
-- Run this script BEFORE schema.sql if the database already contains
-- the old `usuarios` and `items` tables. It renames them out of the
-- way (to usuarios_legacy / items_legacy) so that schema.sql can
-- create the new structures cleanly.
--
-- Usage:
--     psql -d biblioteca_personal -f database/migration.sql   -- 1) park legacy
--     psql -d biblioteca_personal -f database/schema.sql      -- 2) create v2
--     psql -d biblioteca_personal -f database/migration_copy.sql -- 3) copy data
-- =====================================================================

BEGIN;

DO $$
BEGIN
    -- Rename legacy items table if it has the old "titulo" column.
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'items' AND column_name = 'titulo'
    ) THEN
        EXECUTE 'ALTER TABLE items RENAME TO items_legacy';
    END IF;

    -- Rename legacy users table.
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'usuarios'
    ) THEN
        EXECUTE 'ALTER TABLE usuarios RENAME TO usuarios_legacy';
    END IF;
END$$;

COMMIT;
