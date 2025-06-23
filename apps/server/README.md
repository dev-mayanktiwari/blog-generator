# Server (Backend API)

This app is the backend API for the Blog Generator platform, built with Node.js, Express, and Prisma.

## Features
- User authentication (JWT, cookies)
- User and blog post management
- Integration with Genkit AI flows
- Prisma ORM for PostgreSQL
- Modular controllers, routes, and middlewares

## Tech Stack
- Node.js, Express
- TypeScript
- Prisma ORM

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create a `.env` file in `apps/server` (see `.env.example` for required variables)
3. Run the development server:
   ```bash
   pnpm --filter @workspace/server dev
   ```

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- Other API keys as needed

## Docker
To run with Docker:
```bash
docker-compose up --build
```

--- 