# todo_list_v2

## Todo API (Backend contract)

Base path: `http://localhost:3000`

No auth.

### Todo shape

```json
{
  "id": "ck...",
  "title": "Buy milk",
  "completed": false,
  "createdAt": "2026-02-19T12:34:56.789Z",
  "updatedAt": "2026-02-19T12:34:56.789Z"
}
```

### GET `/api/todos`

Response `200`:

```json
{ "data": [/* Todo[] */] }
```

### POST `/api/todos`

Request body:

```json
{ "title": "Buy milk" }
```

- `title`: required, trimmed, 1..200 chars

Response `201`:

```json
{ "data": {/* Todo */} }
```

### PATCH `/api/todos/[id]`

Request body (at least one field required):

```json
{ "title": "New title", "completed": true }
```

Response `200`:

```json
{ "data": {/* Todo */} }
```

### DELETE `/api/todos/[id]`

Response `204` (no body)

### Errors

- `400` validation:

```json
{
  "error": "VALIDATION_ERROR",
  "details": [{"path":"title","message":"..."}]
}
```

- `404` not found:

```json
{ "error": "NOT_FOUND" }
```

Scaffolded Next.js (App Router + TypeScript) project with Prisma + SQLite.

## Prereqs

- Node.js 18+ (works on Node 20/22)

## Setup

```bash
npm install
cp .env.example .env
```

### Database (Prisma + SQLite)

This project uses SQLite with Prisma.

- Connection string is in `.env` under `DATABASE_URL`
- Default SQLite file path: `./dev.db` (project root)
- The SQLite db file is gitignored; it will be created on first migrate.

Run migrations + generate client (creates `dev.db` if missing):

```bash
npm run prisma:migrate:dev
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Run the app

```bash
npm run dev
```

Then open http://localhost:3000

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - eslint
- `npm run typecheck` - TypeScript noEmit check
- `npm run test` - placeholder (no tests yet)

### Prisma

- `npm run prisma:generate`
- `npm run prisma:migrate:dev`
- `npm run prisma:migrate:deploy`
- `npm run prisma:studio`

## Data contract

See `prisma/schema.prisma` for the canonical contract.

```prisma
model Todo {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
