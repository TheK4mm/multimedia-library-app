-- =====================================================================
-- Multimedia Library App - Database Schema (v2)
-- PostgreSQL 13+
--
-- This schema models a personal multimedia catalog with users, items
-- (books / movies / music), creators (authors / directors / artists),
-- genres, user-defined collections and an activity log.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50)  UNIQUE NOT NULL,
    email           VARCHAR(160) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(120),
    avatar_url      TEXT,
    bio             TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT username_min_length CHECK (char_length(username) >= 3)
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- media_types  (lookup: book / movie / music)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_types (
    code        VARCHAR(20) PRIMARY KEY,
    label_es    VARCHAR(40) NOT NULL,
    label_en    VARCHAR(40) NOT NULL,
    icon        VARCHAR(10)
);

INSERT INTO media_types (code, label_es, label_en, icon) VALUES
    ('book',  'Libro',    'Book',  'book'),
    ('movie', 'Película', 'Movie', 'film'),
    ('music', 'Música',   'Music', 'music')
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------
-- genres
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS genres (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(80) NOT NULL,
    slug        VARCHAR(80) NOT NULL UNIQUE,
    media_type  VARCHAR(20) REFERENCES media_types(code) ON DELETE SET NULL
);

INSERT INTO genres (name, slug, media_type) VALUES
    ('Ficción',          'ficcion',          'book'),
    ('No ficción',       'no-ficcion',       'book'),
    ('Fantasía',         'fantasia',         'book'),
    ('Misterio',         'misterio',         'book'),
    ('Ciencia ficción',  'ciencia-ficcion',  'book'),
    ('Drama',            'drama',            'movie'),
    ('Comedia',          'comedia',          'movie'),
    ('Acción',           'accion',           'movie'),
    ('Terror',           'terror',           'movie'),
    ('Documental',       'documental',       'movie'),
    ('Pop',              'pop',              'music'),
    ('Rock',             'rock',             'music'),
    ('Jazz',             'jazz',             'music'),
    ('Clásica',          'clasica',          'music'),
    ('Hip Hop',          'hip-hop',          'music')
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------
-- creators  (authors / directors / artists, unified)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS creators (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(160) NOT NULL,
    slug        VARCHAR(180) NOT NULL UNIQUE,
    bio         TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_creators_name_lower ON creators (LOWER(name));

-- ---------------------------------------------------------------------
-- items  (the central catalog entry)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS items (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    media_type      VARCHAR(20)  NOT NULL REFERENCES media_types(code),
    year            INTEGER CHECK (year IS NULL OR (year BETWEEN 0 AND 2999)),
    cover_url       TEXT,
    synopsis        TEXT,
    rating          NUMERIC(2,1) CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
    status          VARCHAR(20)  NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','in_progress','completed','abandoned')),
    favorite        BOOLEAN NOT NULL DEFAULT FALSE,
    notes           TEXT,
    creator_name    VARCHAR(160), -- denormalized primary creator for quick listing
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_items_updated_at ON items;
CREATE TRIGGER trg_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_items_user_id        ON items (user_id);
CREATE INDEX IF NOT EXISTS idx_items_media_type     ON items (media_type);
CREATE INDEX IF NOT EXISTS idx_items_status         ON items (status);
CREATE INDEX IF NOT EXISTS idx_items_title_lower    ON items (LOWER(title));

-- ---------------------------------------------------------------------
-- item_creators  (many-to-many: item ↔ creator with role)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS item_creators (
    item_id     INTEGER NOT NULL REFERENCES items(id)    ON DELETE CASCADE,
    creator_id  INTEGER NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    role        VARCHAR(40) NOT NULL DEFAULT 'primary',  -- author / director / artist / contributor / ...
    PRIMARY KEY (item_id, creator_id, role)
);

-- ---------------------------------------------------------------------
-- item_genres
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS item_genres (
    item_id   INTEGER NOT NULL REFERENCES items(id)  ON DELETE CASCADE,
    genre_id  INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, genre_id)
);

-- ---------------------------------------------------------------------
-- collections  (user-defined lists, e.g. "favorites", "watch later")
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS collections (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name         VARCHAR(120) NOT NULL,
    description  TEXT,
    color        VARCHAR(20),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, name)
);

DROP TRIGGER IF EXISTS trg_collections_updated_at ON collections;
CREATE TRIGGER trg_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS collection_items (
    collection_id  INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    item_id        INTEGER NOT NULL REFERENCES items(id)       ON DELETE CASCADE,
    added_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (collection_id, item_id)
);

-- ---------------------------------------------------------------------
-- activity_log
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_log (
    id          BIGSERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action      VARCHAR(40) NOT NULL,    -- created / updated / deleted / status_changed / rated / ...
    item_id     INTEGER REFERENCES items(id) ON DELETE SET NULL,
    detail      JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_user_time ON activity_log (user_id, created_at DESC);
