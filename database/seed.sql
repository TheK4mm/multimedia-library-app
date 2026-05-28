-- =====================================================================
-- Seed data for local development.
--
-- Creates a demo user (username: demo / password: demo1234) and a
-- handful of catalog entries across books, movies and music.
--
-- Password hash below corresponds to "demo1234" with bcrypt cost 10.
-- =====================================================================

INSERT INTO users (username, email, password_hash, display_name, bio)
VALUES (
    'demo',
    'demo@biblioteca.local',
    '$2b$10$wYqJ8eMQXvR0r3qVQKQy7e6f2Bf3WJ8e9GhYqJ8eMQXvR0r3qVQKO', -- placeholder, regenerate locally
    'Lectora Demo',
    'Cuenta de demostración para explorar la biblioteca multimedia.'
)
ON CONFLICT (username) DO NOTHING;

WITH u AS (SELECT id FROM users WHERE username = 'demo')
INSERT INTO items (user_id, title, media_type, year, creator_name, synopsis, rating, status, favorite)
SELECT u.id, title, media_type, year, creator_name, synopsis, rating, status, favorite
FROM   u, (VALUES
    ('Cien años de soledad', 'book',  1967, 'Gabriel García Márquez',
     'La saga de la familia Buendía en el mítico Macondo.', 5.0, 'completed', TRUE),
    ('El nombre del viento', 'book',  2007, 'Patrick Rothfuss',
     'La historia de Kvothe, contada por él mismo.', 4.5, 'in_progress', FALSE),
    ('Sapiens',              'book',  2011, 'Yuval Noah Harari',
     'Una breve historia de la humanidad.', 4.0, 'pending',     FALSE),
    ('Interstellar',         'movie', 2014, 'Christopher Nolan',
     'Un viaje a través del espacio y el tiempo.', 5.0, 'completed', TRUE),
    ('El Padrino',           'movie', 1972, 'Francis Ford Coppola',
     'La saga de la familia Corleone.',     5.0, 'completed', TRUE),
    ('Dune (2021)',          'movie', 2021, 'Denis Villeneuve',
     'Adaptación de la novela de Frank Herbert.', 4.5, 'pending', FALSE),
    ('Kind of Blue',         'music', 1959, 'Miles Davis',
     'Álbum cumbre del jazz modal.',        5.0, 'completed', TRUE),
    ('OK Computer',          'music', 1997, 'Radiohead',
     'Disco emblemático del rock alternativo.', 4.5, 'completed', FALSE),
    ('Random Access Memories','music', 2013, 'Daft Punk',
     'Homenaje a la música disco de los 70.', 4.0, 'in_progress', FALSE)
) AS data(title, media_type, year, creator_name, synopsis, rating, status, favorite)
ON CONFLICT DO NOTHING;
