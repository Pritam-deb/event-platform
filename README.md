# Event Platform

Simple event management app built with `Next.js` (App Router) + MySQL.

- UI: `Next.js` + React + Tailwind CSS + Framer Motion
- Data: MySQL (Docker) + Drizzle ORM
- Client data fetching: TanStack React Query

## Prerequisites

- `Node.js` 20+ and `npm`
- Docker Desktop (or Docker Engine) for MySQL

## Quickstart (clone → run)

### 1) Clone and install dependencies

```bash
git clone <YOUR_REPO_URL>
cd event-platform
npm ci
```

### 2) Start MySQL with Docker

This project expects a MySQL database called `events_db` with the `root` user.

```bash
docker run --name event-platform-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=events_db \
  -p 3306:3306 \
  -d mysql:8
```

If you need to stop/remove it later:

```bash
docker stop event-platform-mysql
docker rm event-platform-mysql
```

### 3) Configure environment variables

Create a file named `.env.local` in the project root:

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=events_db
```

### 4) Create the database schema (Drizzle)

Apply the existing migration:

```bash
npx drizzle-kit migrate
```

If you prefer pushing schema directly (no SQL migration files needed):

```bash
npx drizzle-kit push
```

If neither approach works for your setup, you can apply the included SQL manually:

```bash
docker exec -i event-platform-mysql mysql -uroot -proot events_db < drizzle/0000_familiar_namora.sql
```

### 5) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful commands

```bash
npm run lint
npm run build
npm run start
```

Drizzle helpers:

```bash
npx drizzle-kit studio
npx drizzle-kit generate
```

## API routes

- `GET /api/events` — list events
- `POST /api/events` — create event
- `GET /api/events/:id` — fetch event
- `PUT /api/events/:id` — update event
- `DELETE /api/events/:id` — delete event

## Troubleshooting

- `ECONNREFUSED` / can’t connect to MySQL: confirm the container is running with `docker ps` and that `.env.local` uses `DB_HOST=127.0.0.1`.
- Port `3306` already in use: change the host port (example `-p 3307:3306`) and update `DB_PORT`.
- Authentication errors: ensure `DB_USER=root` and `DB_PASSWORD=root` match the container environment.
