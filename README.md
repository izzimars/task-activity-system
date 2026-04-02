# Real-Time Task Management System

A backend service for team-based task management with real-time updates. The system supports user authentication, team collaboration, task privacy rules, and WebSocket delivery of task events backed by Redis Pub/Sub.

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Redis (Pub/Sub only)
- WebSocket (`ws`)

## Setup Instructions

### Run with Docker (recommended)

1. Clone repository:

```bash
git clone <your-repo-url>
cd task-home-assessment
```

2. Start everything (app + PostgreSQL + Redis):

```bash
docker-compose up --build
```

Notes:
- The app runs on `http://localhost:3000`
- Migrations are executed automatically before the app starts (`npm run migrate:up`)
- WebSocket uses the same exposed app port (`3000`)

### Run locally (without Docker)

3. Install dependencies:

```bash
npm install
```

4. Configure `.env` for local services and start PostgreSQL/Redis.

5. Run migrations:

```bash
npm run migrate:up
```

6. Start development server:

```bash
npm run dev
```

## API Documentation

OpenAPI specification is available at `swagger.yaml`.

Base URL: `http://localhost:3000/api/v1`

### Auth

**POST /auth/register**
```json
// Request Body
{ "email": "test@gmail.com", "password": "password123" }

// Response 201
{ "id": "uuid", "email": "test@gmail.com", "token": "jwt_token" }
```

**POST /auth/login**
```json
// Request Body
{ "email": "test@gmail.com", "password": "password123" }

// Response 200
{ "id": "uuid", "email": "test@gmail.com", "token": "jwt_token" }
```

### Tasks
> All task endpoints require `Authorization: Bearer <token>` header

**POST /tasks**
```json
// Request Body
{ "title": "Fix login bug", "description": "Optional", "status": "todo" }

// Response 201
{ "id": "uuid", "title": "Fix login bug", "description": "", "status": "todo", "created_by": "uuid", "created_at": "", "updated_at": "" }
```

**GET /tasks?page=1&limit=10&status=todo**
```json
// Response 200
{
  "tasks": [...],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

**PATCH /tasks/:id**
```json
// Request Body
{ "status": "in_progress" }

// Response 200
{ "id": "uuid", "title": "Fix login bug", "status": "in_progress", ... }
```


## WebSocket Usage Example

Connection URL:

```text
ws://localhost:3000/ws?token=<jwt>
```

Quick Docker connectivity check:

```text
ws://localhost:3000
```

Example client:

```js
const ws = new WebSocket("ws://localhost:3000/ws?token=<jwt>");

ws.onopen = () => {
  console.log("Connected");
};

ws.onmessage = (event) => {
  const payload = JSON.parse(event.data);
  // Example event: { event: "task.updated", data: { ...task } }
  console.log(payload);
};
```

Authorization behavior:
- Public task events are sent only to members of the task team.
- Private task events are sent only to the task creator and assignees.

## Trade-offs and Design Decisions

## Security

- `req.user?.id` check is repeated across controllers instead of being enforced at the middleware level via a non-nullable `RequestWithUser` type. Because of the project size
- This project does not use `helmet` or equivalent hardening middleware for assessment
- This project avoids embedding password hashes in JWT payloads (strength)
- No rate limiting on auth/task routes (both reference codebases also miss this, but it remains a production gap)
- WebSocket endpoint accepts unauthenticated clients and broadcasts task events globally, no complex authentication

## Architecture

- `bootstrap()` creates the Express app internally, making it harder to inject a test app — would use dependency injection in production
- No request ID tracking for tracing requests across logs
- Clear route -> controller -> service -> repository separation is more consistent than parts of both reference codebases (strength)
- Error handling via `AppError` + global catcher is more uniform than mixed patterns in the references (strength)

## Auth

- No refresh tokens — JWT expires in 1 day and user must re-login
- No token blacklisting — a logged out token is still valid until expiry
- `JwtSignOptions` (issuer, audience) added but not validated on incoming tokens — in production you'd verify these claims
- Compared with `monexar-backend`, there is no RBAC/permission guard layer for future admin-only actions
- Compared with `monexar-backend`, there is no second factor flow (TOTP/biometric challenge)

## Validation

- Zod's `.trim()` on email and the service's `.trim()` are redundant — Zod handles it before it reaches the service
- Request body validation is consistently applied and cleaner than partially applied validators in parts of the references (strength)
- Query params (`page`, `limit`, `status`) are parsed but not schema-validated (e.g., max bounds, negative values)

## Database

- No foreign key constraint between `tasks.created_by` and `users.id` — in production you'd add `REFERENCES users(id) ON DELETE CASCADE`
- No soft deletes — deleted tasks are gone permanently
- Test migration flow now uses an explicit `test` DB config in `database.json` and dedicated test migration scripts (strength)


## Real-time

- WebSocket broadcasts to all connected clients — in production with multiple server instances you'd use Redis Pub/Sub for cross-instance broadcasting
- No WebSocket authentication retry logic
- Compared with both reference codebases, this project has working Redis Pub/Sub + WebSocket event delivery (strength)
- Missing per-user channel scoping/filtering to prevent unrelated clients receiving task events

## Pagination

- Status filter and pagination added to `GET /tasks` but no filtering on date range or search by title
- No cursor-based pagination option for high-write workloads

## AI Usage Disclosure

AI usage details are documented in `AI_USAGE.md`, including prompt history and manual refinements.

## Production Considerations

If this system were to go to production, the following additions and changes would be made:

### Authentication & Authorization
- Add refresh tokens so users don't have to re-login every day
- Implement token blacklisting (via Redis) so logged out tokens are immediately invalidated
- Validate JWT claims (issuer, audience) on incoming tokens
- Enforce a non-nullable `RequestWithUser` type so controllers can assume an authenticated user always exists when auth middleware is applied — removing the repeated `req.user?.id` checks

### Team & Collaboration
- Add a teams/workspaces module so tasks belong to a team, not just a user
- Role-based access control (admin, member, viewer) per team
- Task assignment — assign tasks to multiple team members, not just the creator
- Task privacy (public/private) — private tasks visible only to creator and assignees
- Any assignee can update task status, not just the creator
- Team admins can override task status regardless of ownership

### Database
- Add foreign key constraint between `tasks.created_by` and `users.id` with `ON DELETE CASCADE`
- Add soft deletes (`deleted_at`) so tasks are never permanently lost
- Add full-text search index on `tasks.title` and `tasks.description`
- Database connection pooling tuning based on load
- Read replicas for heavy read workloads

### Real-Time
- Use Redis Pub/Sub across multiple WebSocket server instances so real-time updates work horizontally scaled deployments
- Authenticate WebSocket connections via JWT on the initial handshake
- Add reconnection logic on the client side with exponential backoff
- Filter real-time updates per user — private tasks should only be broadcast to the creator and assignees, not all connected clients

### API
- Rate limiting on auth endpoints to prevent brute force attacks
- Request ID middleware for tracing requests across logs
- API versioning strategy for breaking changes
- Cursor-based pagination instead of offset for large datasets

### Infrastructure
- CI/CD pipeline (GitHub Actions) for automated testing and deployment
- Environment-specific secrets management (AWS Secrets Manager or HashiCorp Vault)
- Centralized logging (Papertrail, Datadog, or Loki)
- Health check endpoint (`GET /health`) for load balancer probes
- Graceful shutdown handling — drain active connections before restarting

### Testing
- Unit tests for all service layer business logic
- Integration tests for all API endpoints
- WebSocket connection and broadcast tests
- Load testing for real-time broadcast performance under concurrent connections
