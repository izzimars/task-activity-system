# Real-Time Task Management System Plan

## 1) Target Folder Structure

```text
.
├── migrations
│   ├── sqls
│   │   ├── 20260402110000-create-tasks-up.sql
│   │   └── 20260402110000-create-tasks-down.sql
│   └── seed
│       └── sqls
│           └── 20260402111000-seed-tasks.sql
├── src
│   ├── config
│   │   ├── cors.ts
│   │   ├── database.ts
│   │   ├── env
│   │   │   ├── development.ts
│   │   │   ├── index.ts
│   │   │   └── production.ts
│   │   ├── express.ts
│   │   └── logger.ts
│   ├── index.ts
│   ├── modules
│   │   └── tasks
│   │       ├── const.ts
│   │       ├── controller.ts
│   │       ├── dto.ts
│   │       ├── entities.ts
│   │       ├── queries.ts
│   │       ├── repositories.ts
│   │       ├── routes.ts
│   │       ├── services.ts
│   │       └── validator.ts
│   ├── routes
│   │   ├── index.ts
│   │   └── v1
│   │       └── index.ts
│   ├── shared
│   │   ├── errors
│   │   │   └── index.ts
│   │   ├── middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   ├── global-error-catcher.middleware.ts
│   │   │   ├── request-body-validator.middleware.ts
│   │   │   ├── request-logger.middleware.ts
│   │   │   └── response-logger.middleware.ts
│   │   ├── services
│   │   │   └── redis
│   │   │       └── redis.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   └── utils
│   │       ├── base-entity.ts
│   │       └── env.ts
│   └── websocket
│       └── server.ts
├── tests
│   ├── integration
│   └── unit
├── index.html
├── package.json
├── tsconfig.json
└── .env
```

## 2) Implementation Order (4-6 hours)

### Phase 1 (0:00 - 0:45) - Bootstrapping
1. Initialize TypeScript Node project and install runtime/dev dependencies.
2. Create folder structure exactly as defined.
3. Add environment config (`src/config/env/*`, `.env`) and utility parser.
4. Add console logger, CORS config, and database/Redis connection setup.

### Phase 2 (0:45 - 2:15) - Core API and Domain
1. Define task domain types/entities and constants.
2. Add SQL query constants and repository methods for create/update/list.
3. Implement service layer:
   - Persist to PostgreSQL
   - Publish `task:updated` event to Redis channel after successful write
4. Add controller handlers and request validation.
5. Register `/tasks` routes and versioned router (`/api/v1`).

### Phase 3 (2:15 - 3:15) - WebSocket and Event Fan-out
1. Create WebSocket server (`ws` library) attached to HTTP server.
2. Subscribe WebSocket layer to Redis Pub/Sub channel.
3. Broadcast received task events to all connected clients.
4. Add connect/disconnect logging and basic heartbeat-safe handling.

### Phase 4 (3:15 - 4:30) - Resilience and Middleware
1. Add request/response logger middlewares.
2. Add global error catcher and standard `AppError` model.
3. Ensure validation errors and database errors are normalized.
4. Add health endpoint for quick readiness checks.

### Phase 5 (4:30 - 5:15) - Frontend Demo + Migrations
1. Add `index.html` demo page.
2. Implement initial `GET /tasks` load.
3. Wire WebSocket updates so UI refreshes instantly on events.
4. Add migration SQL and seed SQL example.

### Phase 6 (5:15 - 6:00) - Final Verification
1. Run build and type-check.
2. Smoke test API endpoints (create/update/list).
3. Verify Pub/Sub to WebSocket broadcasting works with multiple browser tabs.
4. Final polish of README-like setup instructions (in this plan).

## 3) Why Redis Pub/Sub Here

- **Decoupling**: API write path and WebSocket push path stay loosely coupled. API only publishes events; WebSocket layer handles fan-out.
- **Horizontal scalability**: With multiple API or WS instances, Redis acts as shared event bus so all WS nodes see updates.
- **Low latency**: Pub/Sub is fast enough for real-time UI updates.
- **Simple operational model**: No caching complexity, only event relay.
- **Clear source of truth**: PostgreSQL remains authoritative; Redis carries transient notifications only.

## 4) Setup Instructions

### Install dependencies

```bash
npm install
```

### Required environment variables (`.env`)

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskdb

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Run PostgreSQL + Redis via Docker

```bash
docker run --name task-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=taskdb -p 5432:5432 -d postgres:16
docker run --name task-redis -p 6379:6379 -d redis:7
```

### Apply SQL schema

```bash
psql -h localhost -U postgres -d taskdb -f migrations/sqls/20260402110000-create-tasks-up.sql
```

### Optional seed

```bash
psql -h localhost -U postgres -d taskdb -f migrations/seed/sqls/20260402111000-seed-tasks.sql
```

### Run app

```bash
npm run dev
```

- API base: `http://localhost:3000/api/v1`
- WebSocket: `ws://localhost:3000/ws`
- Demo page: open `index.html` in browser

## 5) Required API

- `POST /api/v1/tasks` - create task, store in PostgreSQL, publish `task:updated`.
- `PATCH /api/v1/tasks/:id` - update task, store in PostgreSQL, publish `task:updated`.
- `GET /api/v1/tasks` - list tasks for initial page load.

## 6) SQL Schema

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'todo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at DESC);
```
