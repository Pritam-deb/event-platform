# Event Platform

## Project overview

Event management app with an events dashboard, event details view, and CRUD flows (create/update/delete).
The app uses a MySQL database and exposes a small REST-like API via `Next.js` route handlers.

## Tech stack

- Framework: `Next.js` (App Router) + React
- Styling: Tailwind CSS
- Animations: Framer Motion
- Data layer: MySQL + Drizzle ORM
- Client caching: TanStack React Query
- Tooling: TypeScript + ESLint

## Setup instructions

### 1) Prerequisites

- `Node.js` 20+ and `npm`
- Docker Desktop (or Docker Engine) to run MySQL locally

### 2) Clone and install dependencies

```bash
git clone <YOUR_REPO_URL>
cd event-platform
npm ci
```

### 3) Start MySQL (Docker)

This project assumes a local MySQL instance with:

- database: `events_db`
- user: `root`
- password: `root`

```bash
docker run --name event-platform-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=events_db \
  -p 3306:3306 \
  -d mysql:8
```

To stop/remove the container:

```bash
docker stop event-platform-mysql
docker rm event-platform-mysql
```

### 4) Create `.env.local`

Create a `.env.local` file at the project root:

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=events_db
```

### 5) Apply the database schema

This repo includes Drizzle migration files in `drizzle/`.

```bash
npx drizzle-kit migrate
```

If you prefer pushing schema directly instead of migrations:

```bash
npx drizzle-kit push
```

If neither works for your local setup, you can apply the included SQL manually:

```bash
docker exec -i event-platform-mysql mysql -uroot -proot events_db < drizzle/0000_familiar_namora.sql
```

### 6) Seed mock data (optional)

This repo includes a starter dataset in `drizzle/seed.sql`.

```bash
docker exec -i event-platform-mysql mysql -uroot -proot events_db < drizzle/seed.sql
```

### 7) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## API reference

### `GET /api/events`

Returns a list of events. Supports offset-based pagination and optional date filtering.

Query parameters:

- `limit` (number, optional): Max items to return. When provided (or when `offset` is provided), enables pagination. Max `200`.
- `offset` (number, optional): Number of items to skip before returning results.
- `start_date` (string, optional): Filter events where `startAt >= start_date`. Accepts `YYYY-MM-DD` or an ISO date-time string.
- `end_date` (string, optional): Filter events where `startAt <= end_date`. Accepts `YYYY-MM-DD` or an ISO date-time string.

Response shape:

- `data`: Array of events (backward compatible with previous consumers reading `data`).
- `meta`: Pagination metadata `{ totalCount, currentPage, itemsPerPage, limit, offset }`.
- `error`: Error message string when request fails.

Errors:

- `400` when query parameters are invalid (example: non-integer `limit`, invalid `start_date`, or `start_date > end_date`).

## Environment variables

All DB configuration is read from environment variables:

- `DB_HOST` (example: `127.0.0.1`)
- `DB_PORT` (example: `3306`)
- `DB_USER` (example: `root`)
- `DB_PASSWORD` (example: `root`)
- `DB_NAME` (example: `events_db`)

## Assumptions or notes

- The MySQL container uses the default credentials shown above; change them if needed and update `.env.local`.
- If port `3306` is already in use, map a different host port (example `-p 3307:3306`) and set `DB_PORT=3307`.
- Some UI elements use placeholder values when optional data is missing.
- Drizzle config reads DB values from the environment (`drizzle.config.ts`).
- Helpful commands:
  - `npm run lint`
  - `npm run build`
  - `npm run start`
  - `npx drizzle-kit studio`
