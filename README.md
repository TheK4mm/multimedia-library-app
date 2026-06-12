# Biblioteca Multimedia

Aplicación web para gestionar una **biblioteca multimedia personal**: libros, películas y música organizados en un único catálogo digital, con búsqueda, filtros, estados de progreso, favoritos, valoraciones y un panel de estadísticas.

Versión **2.0** — refactor completo a una arquitectura por capas (backend), un sistema de diseño con tokens y CSS modular (frontend), y un modelo de datos enriquecido (base de datos).

## Tabla de contenido
- [Arquitectura](#arquitectura)
- [Stack](#stack)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Modelo de datos](#modelo-de-datos)
- [API REST](#api-rest)
- [Puesta en marcha local](#puesta-en-marcha-local)
- [Variables de entorno](#variables-de-entorno)
- [Despliegue](#despliegue)

---

## Arquitectura

```
┌────────────────────────┐      HTTPS/JSON       ┌──────────────────────────────┐      SQL     ┌──────────────────┐
│        Frontend        │  ───────────────────► │           Backend            │ ───────────► │     PostgreSQL   │
│ React 19 + React Router│ ◄───────────────────  │ Express 5 (capas)            │ ◄─────────── │  schema v2       │
│ Axios + JWT en storage │      Bearer JWT       │ JWT + bcrypt + Zod           │              │  multi-tenant    │
└────────────────────────┘                       └──────────────────────────────┘              └──────────────────┘
```

**Backend por capas:**

```
routes → middlewares (auth, validate) → controllers → services → repositories → PostgreSQL
                                       ↘ errorHandler ↙
```

**Frontend modular:** providers globales (auth, toasts) → router → páginas → componentes de dominio (catálogo) → primitivos UI → tokens de diseño.

## Stack

| Capa            | Tecnología                                                                 |
| --------------- | -------------------------------------------------------------------------- |
| Frontend        | React 19, React Router v6, Axios, CSS Modules, design tokens en CSS vars   |
| Backend         | Node.js, Express 5, bcrypt, jsonwebtoken, Zod, dotenv                      |
| Base de datos   | PostgreSQL 13+ (con `pgcrypto`)                                            |
| Despliegue      | Vercel (frontend) · Render (backend) · cualquier Postgres administrado     |

## Estructura del repositorio

```
multimedia-library-app/
├── backend/
│   ├── server.js                # entrypoint (lee env, conecta DB, levanta app)
│   ├── src/
│   │   ├── app.js               # construcción de Express (cors, json, router)
│   │   ├── config/              # env, db, logger
│   │   ├── routes/              # auth, items, genres, index
│   │   ├── controllers/         # capa HTTP (delgada)
│   │   ├── services/            # reglas de negocio
│   │   ├── repositories/        # acceso a DB
│   │   ├── middleware/          # auth (JWT), validate (Zod), errorHandler, logger
│   │   ├── validators/          # esquemas Zod (auth, items)
│   │   └── utils/               # AppError, asyncHandler
│   └── .env.example
│
├── database/
│   ├── schema.sql               # schema v2 completo
│   ├── migration.sql            # renombra tablas legacy ➜ *_legacy
│   ├── migration_copy.sql       # copia datos legacy ➜ schema v2
│   └── seed.sql                 # datos de demostración
│
└── frontend/
    ├── public/
    └── src/
        ├── App.js               # router + providers
        ├── index.js             # entrypoint, carga estilos globales
        ├── styles/              # tokens, reset, global, utilities
        ├── context/             # AuthContext
        ├── services/            # api (axios + interceptor JWT), authApi, itemsApi, genresApi
        ├── hooks/               # useItems, useStats
        ├── constants/           # media types, statuses, sort options
        ├── components/
        │   ├── ui/              # primitivos: Button, Input, Card, Badge, Modal, Toast, ...
        │   ├── layout/          # AppShell, Sidebar, Topbar, AuthLayout
        │   ├── catalog/         # ItemCard, ItemFilters, ItemForm, StatBox, MediaCover
        │   └── common/          # ProtectedRoute, PublicOnlyRoute
        └── pages/               # LoginPage, RegisterPage, DashboardPage, CatalogPage,
                                 # ItemDetailPage, ItemFormPage, StatsPage, ProfilePage
```

## Modelo de datos

El schema v2 (`database/schema.sql`) reemplaza al modelo plano original (2 tablas) por uno relacional:

| Tabla              | Propósito                                                                 |
| ------------------ | ------------------------------------------------------------------------- |
| `users`            | Usuarios con `username`, `email`, `password_hash`, `display_name`, etc.   |
| `media_types`      | Catálogo: `book` / `movie` / `music` (con etiquetas localizadas)          |
| `genres`           | Géneros normalizados, con `media_type` opcional                           |
| `creators`         | Autores / directores / artistas, unificados                               |
| `items`            | Entrada de catálogo: título, tipo, año, portada, sinopsis, rating, estado, favorito, notas |
| `item_creators`    | Relación N:M item ↔ creador, con `role` (author / director / artist…)     |
| `item_genres`      | Relación N:M item ↔ género                                                |
| `collections`      | Listas personales del usuario (p. ej. *Leídos 2025*)                      |
| `collection_items` | Relación N:M colección ↔ item                                             |
| `activity_log`     | Historial de acciones (created / updated / status_changed…)               |

**Características destacadas del schema:**
- Trigger `set_updated_at()` actualiza `updated_at` automáticamente.
- `items` está particionado por usuario (`user_id` con `ON DELETE CASCADE`).
- Índices en `LOWER(title)`, `media_type`, `status` y `user_id` para listas y búsquedas rápidas.
- `rating` validado entre 0 y 5 mediante `CHECK`.
- `status` validado con `CHECK` (`pending` / `in_progress` / `completed` / `abandoned`).

## API REST

Todas las rutas viven bajo `/api`. Las que requieren sesión esperan `Authorization: Bearer <jwt>`.

### Auth
| Método | Ruta              | Body                                  | Auth | Descripción                  |
| ------ | ----------------- | ------------------------------------- | :--: | ---------------------------- |
| POST   | `/auth/register`  | `{ username, password, email?, displayName? }` |  ✗   | Registra y devuelve JWT      |
| POST   | `/auth/login`     | `{ username, password }`              |  ✗   | Devuelve JWT                 |
| GET    | `/auth/me`        | —                                     |  ✓   | Datos del usuario en sesión  |

### Items
| Método | Ruta              | Query / Body                                                                 | Auth | Descripción                              |
| ------ | ----------------- | ---------------------------------------------------------------------------- | :--: | ---------------------------------------- |
| GET    | `/items`          | `?search&mediaType&status&favorite&sort&page&pageSize`                       |  ✓   | Lista paginada y filtrada del usuario          |
| GET    | `/items/stats`    | —                                                                            |  ✓   | Totales por tipo, estado, favoritos, avg |
| GET    | `/items/:id`      | —                                                                            |  ✓   | Detalle de un item                         |
| POST   | `/items`          | `{ title, mediaType, year?, creatorName?, coverUrl?, synopsis?, rating?, status?, favorite?, notes? }` |  ✓   | Crea un item|
| PUT    | `/items/:id`      | Cualquier subconjunto del body de POST                                       |  ✓   | Actualiza (sólo campos presentes)        |
| DELETE | `/items/:id`      | —                                                                            |  ✓   | Elimina                                  |

### Géneros
| Método | Ruta             | Query              | Auth | Descripción                         |
| ------ | ---------------- | ------------------ | :--: | ----------------------------------- |
| GET    | `/genres`        | `?mediaType=book`  |  ✓   | Lista géneros, opcionalmente por tipo |

### Sistema
| Método | Ruta            | Auth | Descripción         |
| ------ | --------------- | :--: | ------------------- |
| GET    | `/api/health`   |  ✗   | Liveness probe      |

Todos los errores se devuelven con la forma:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos.",
    "details": [ ... ]
  }
}
```

## Puesta en marcha local

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- npm

### 1) Base de datos
```bash
# Crea la base
createdb biblioteca_personal

# (opcional) si ya tienes datos del schema v1, primero renombra las tablas legacy:
psql -d biblioteca_personal -f database/migration.sql

# Crea el schema v2:
psql -d biblioteca_personal -f database/schema.sql

# (opcional) copia los datos legacy al nuevo schema:
psql -d biblioteca_personal -f database/migration_copy.sql

# (opcional) inserta datos de demostración:
psql -d biblioteca_personal -f database/seed.sql
```

### 2) Backend
```bash
cd backend
cp .env.example .env
# edita .env con tus credenciales y un JWT_SECRET propio
npm install
npm run dev      # o npm start
# API disponible en http://localhost:3001
```

### 3) Frontend
```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:3001/api
npm install
npm start
# UI disponible en http://localhost:3000
```

### Tests
```bash
cd frontend && npm test
```

## Variables de entorno

### Backend (`backend/.env`)
| Variable          | Por defecto                         | Descripción                                                    |
| ----------------- | ----------------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`    | (vacío)                             | Cadena de conexión PostgreSQL — tiene prioridad sobre `PG*`    |
| `PGHOST`          | `localhost`                         | Host de Postgres (modo local)                                  |
| `PGPORT`          | `5432`                              | Puerto                                                         |
| `PGUSER`          | `postgres`                          | Usuario                                                        |
| `PGPASSWORD`      | (vacío)                             | Contraseña                                                     |
| `PGDATABASE`      | `biblioteca_personal`               | Nombre de la base                                              |
| `JWT_SECRET`      | (obligatorio en producción)         | Secreto para firmar JWT (`openssl rand -hex 64`)               |
| `JWT_EXPIRES_IN`  | `7d`                                | Caducidad del token                                            |
| `PORT`            | `3001`                              | Puerto HTTP                                                    |
| `NODE_ENV`        | `development`                       | `development` o `production`                                   |
| `CORS_ORIGINS`    | `*`                                 | Lista separada por comas con los orígenes permitidos           |

### Frontend (`frontend/.env`)
| Variable             | Por defecto                                              | Descripción                  |
| -------------------- | -------------------------------------------------------- | ---------------------------- |
| `REACT_APP_API_URL`  | ``                        | URL base de la API           |

## Despliegue

Importante: Deploy actualmente en pausa

- **Frontend (Vercel):** 
- **Backend (Render):** 

> Render: el `start` script ejecuta `node server.js`. Recuerda definir las variables de entorno del backend (especialmente `DATABASE_URL`, `JWT_SECRET` y `CORS_ORIGINS` con el dominio de Vercel).

## Funcionalidades

- Registro e inicio de sesión con JWT y bcrypt.
- CRUD completo de items multimedia con campos enriquecidos (rating, status, sinopsis, notas, favorito, portada).
- Búsqueda global desde la barra superior.
- Filtros por tipo, estado y favoritos; orden por recientes / título / año / valoración.
- Panel de estadísticas: totales, distribución por tipo y estado, valoración media, favoritos, completados.
- Dashboard con bienvenida personalizada, recientes y favoritos.
- Vista de detalle con cambios rápidos de estado y favoritos.
- Sistema de notificaciones (toasts) reemplazando los `alert()`.
- Diseño responsive con sidebar colapsable en móviles.
- Estados vacíos, de carga y de error en todas las vistas.

