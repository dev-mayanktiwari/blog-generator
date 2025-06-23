# DB Package

This package contains the Prisma schema, migrations, and database client for the Blog Generator monorepo.

## Features
- Prisma ORM for PostgreSQL
- User and Post models
- Migration scripts

## Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Set up your `.env` with `DATABASE_URL`.
3. Run migrations:
   ```bash
   pnpm --filter @workspace/db prisma migrate dev
   ```

## Usage
Import the Prisma client in your app:
```ts
import { prisma } from '@workspace/db';
```

## Schema
See `prisma/schema.prisma` for model definitions.

--- 