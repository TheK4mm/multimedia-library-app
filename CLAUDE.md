# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal multimedia library (books, movies, music) — a three-part app in one repo with **no root `package.json`**: `backend/` (Express 5 + PostgreSQL REST API), `frontend/` (Create React App, React 19), and `database/` (raw SQL). Each of `backend/` and `frontend/` is installed and run independently.

> User-facing strings, error messages, and most comments are in **Spanish**. Match that when adding UI text or API error messages.

## Commands

```bash
# Backend (from backend/)
npm install
npm run dev        # node --watch server.js (auto-reload), serves http://localhost:3001
npm start          # node server.js (production entrypoint Render uses)

# Frontend (from frontend/)
npm install
npm start          # CRA dev server on :3000, proxies API to :3001 (see "proxy" in package.json)
npm run build
npm test           # react-scripts (jest) in watch mode
npm test -- --watchAll=false                 # single CI run
npm test -- --watchAll=false -t "renders"    # run tests matching a name
```

There is **no backend test suite or linter**, and no root-level scripts. Frontend lint runs through `react-scripts` (`eslint-config-react-app`); there is no standalone `lint` script.

### Database (PostgreSQL 13+, needs `pgcrypto`)
The `backend` `db:schema` / `db:seed` npm scripts use bash `$DATABASE_URL` interpolation and **won't work as-is in PowerShell/cmd** — run `psql` manually on Windows:
```bash
psql -d biblioteca_personal -f database/schema.sql   # required: schema v2
psql -d biblioteca_personal -f database/seed.sql      # optional demo data (user: demo / demo1234)
psql -d biblioteca_personal -f database/migration.sql        # only if migrating from schema v1
psql -d biblioteca_personal -f database/migration_copy.sql   # copies legacy rows into v2
```
The seeded `demo` password hash in `seed.sql` is a placeholder — regenerate locally if you need to log in as demo

## Backend architecture

Strict layered flow, one module per layer per resource (`auth`, `items`, `genres`):

```
routes → middleware (requireAuth, validate) → controllers → services → repositories → pg
                                            ↘ errorHandler (terminal) ↙
```

- **`server.js`** pings the DB then `app.listen`s; **`src/app.js`** builds the Express instance (CORS, `express.json`, requestLogger, `/api` router, then `notFoundHandler` + `errorHandler` last).
- **Controllers** are thin: unwrap `req`, call a service, send the JSON envelope. Every handler is wrapped in **`asyncHandler`** (`src/utils/asyncHandler.js`) so thrown/rejected errors reach the central error handler — don't write try/catch in controllers.
- **Services** hold business rules and throw **`AppError`** (`src/utils/AppError.js`, has static helpers `notFound`, `unauthorized`, `conflict`, …). Never `res.*` from a service.
- **Repositories** are the only layer touching `db` (`src/config/db.js`). They map snake_case DB columns → camelCase JS via a local `mapRow`. SQL is hand-written parameterized queries (no ORM).
- **`src/config/env.js`** is the single source for config; read env through it, never `process.env` directly elsewhere. `DATABASE_URL` (with `ssl.rejectUnauthorized:false`) takes priority over the `PG*` vars. In production, missing required vars throw.
- Multi-statement writes use `db.withTransaction(async (client) => …)` (see `replaceGenres`).

### Cross-cutting conventions (important)
- **Response envelope is universal.** Success: `res.json({ success: true, ...payload })` (e.g. `{ success, item }`, `{ success, items, total, page, pageSize }`). Errors (from `errorHandler`): `{ success: false, error: { code, message, details? } }`. Keep new endpoints consistent.
- **Validation** is the `validate({ body, query, params })` middleware (`src/middleware/validate.js`) running Zod schemas from `src/validators/`. It **reassigns the parsed result back onto `req`**, so downstream code gets coerced/defaulted values (e.g. query `page`/`pageSize` become numbers, `favorite` becomes boolean). `ZodError` is caught centrally and rendered as `VALIDATION_ERROR`.
- **Multi-tenancy / authorization.** `requireAuth` verifies the JWT and sets `req.user = { id, username }` (token payload is `{ sub, username }`). **Every item/genre query is scoped by `req.user.id`** — both the `WHERE user_id = $1` filter and ownership checks live in the repository/service. When adding queries on user-owned data, always thread `userId` through; don't trust `:id` alone.
- **Partial update gotcha:** `itemRepository.update` uses `COALESCE($n, existing)` per column. Passing `null` for a field **keeps the existing value** rather than clearing it — a PUT cannot null out a column with the current SQL.
- **Legacy users:** `authService.login` rejects accounts whose `password_hash` starts with `legacy$` (migrated v1 users must re-register).
- `MEDIA_TYPES` (`book`/`movie`/`music`) and `STATUSES` (`pending`/`in_progress`/`completed`/`abandoned`) are defined in `backend/src/validators/itemSchemas.js` **and** mirrored in `frontend/src/constants/media.js`. Changing the set means editing both, plus the `CHECK` constraints in `database/schema.sql`.

## Frontend architecture

Create React App (`react-scripts`), React 19, React Router v6, plain CSS Modules + design tokens (no UI framework).

- **`App.js`** wires the provider stack and router: `BrowserRouter > ToastProvider > AuthProvider > Routes`. Public routes (`/login`, `/register`) are wrapped in `PublicOnlyRoute`; everything under `/app/*` renders inside `AppShell` behind `ProtectedRoute`. `ItemFormPage` is reused for both create and edit via a `mode` prop.
- **Auth flow** (`context/AuthContext.js` + `services/api.js`): the JWT lives in `localStorage` under key `mml.token` (`tokenStorage` helper). On mount, `AuthProvider` rehydrates by calling `/auth/me`. The axios instance attaches `Authorization: Bearer` on every request; on any **401 it dispatches a `window` `mml:unauthorized` event**, which `AuthProvider` listens for to log out cleanly. Use `useAuth()` for `{ user, isAuthenticated, login, register, logout, loading }`.
- **API layer** (`services/*.js`): all calls go through the shared `api` axios instance and `.then(r => r.data)`, so service functions return the **already-unwrapped envelope** (e.g. `itemsApi.list()` resolves to `{ success, items, total, ... }`). The response interceptor normalizes errors into an `Error` carrying `.status`, `.code`, `.details`.
- **Data hooks** (`hooks/useItems.js`): `useItems(params)` and `useStats()` own loading/error state and expose `reload`. `useItems` serializes `params` with `JSON.stringify` to keep the `useCallback`/`useEffect` deps stable — pass plain serializable filter objects.
- **Components** are organized by role: `ui/` = generic primitives (re-exported from `components/ui/index.js` — import as `import { Button, Modal } from "components/ui"`), `layout/` = shell/nav, `catalog/` = domain widgets, `common/` = route guards. Each component is a folder with a `.js` + co-located `.module.css`.
- **Styling:** global design tokens (CSS custom properties) live in `src/styles/tokens.css`; `reset.css`/`global.css`/`utilities.css` are loaded once in `index.js`. Component styles use CSS Modules — reference tokens (`var(--…)`) rather than hardcoding colors/spacing.

## Environment

- Backend: copy `backend/.env.example` → `backend/.env`. Key vars: `DATABASE_URL` (or `PG*`), `JWT_SECRET`, `JWT_EXPIRES_IN` (default `7d`), `PORT` (3001), `CORS_ORIGINS` (comma-separated, default `*`).
- Frontend: `REACT_APP_API_URL` (defaults to the deployed Render URL — set to `http://localhost:3001/api` for local backend).
- Deploy targets: frontend on Vercel, backend on Render (`npm start` → `node server.js`).
