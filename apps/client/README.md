# Client (Web Interface)

This app is the main web interface for the Blog Generator platform, built with Next.js and shadcn/ui.

## Features
- User authentication (login, registration)
- Dashboard for managing blog posts
- Blog post generation from YouTube videos
- Light/dark theme switching
- Toast notifications and modern UI

## Tech Stack
- React, Next.js
- TypeScript
- shadcn/ui components
- Tailwind CSS

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create a `.env` file in `apps/client` (see `.env.example` for required variables)
3. Run the development server:
   ```bash
   pnpm --filter @workspace/web dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables
- `NEXT_PUBLIC_API_URL`: URL of the backend server

## Docker
To run with Docker:
```bash
docker-compose up --build
```

--- 