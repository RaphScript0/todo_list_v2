# todo_list_v2

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
