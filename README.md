# Blog Generator Monorepo

A full-stack, AI-powered blog generation platform. This monorepo contains all services, packages, and infrastructure needed to run the system locally or in production.

---

## Table of Contents
- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [Apps](#apps)
- [Packages](#packages)
- [Development Setup](#development-setup)
- [Running with Docker](#running-with-docker)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project enables users to generate high-quality blog posts from YouTube videos using advanced AI flows, with a modern web interface, robust backend, and modular architecture. It leverages microservices, a shared type system, and reusable UI components for rapid development and scalability.

## Architecture

![Blog Generator Architecture](https://ik.imagekit.io/xpswehril/diagram-export-6-24-2025-3_24_33-AM%20(1).png?updatedAt=1750715986536)

---

## Monorepo Structure

```
blog-generator/
  apps/
    adk/         # Google Agent Development Kit (web search agent for blog generation)
    client/      # Next.js web interface
    genkit/      # AI flows and orchestration for blog generation
    server/      # Node.js/Express backend API
    transcript/  # (Legacy) YouTube transcript extraction service
  packages/
    constants/   # Shared constants
    db/          # Prisma schema and DB client
    types/       # Shared TypeScript types
    ui/          # shadcn/ui React components
    utils/       # Shared utility functions
  infra/
    docker/      # Dockerfiles for all services
  docker-compose.yaml
  ...
```

---

## Apps

### `apps/adk` - Agent Development Kit
- **Purpose:** Python-based agent for web search and output structuring, used in the blog generation pipeline.
- **Tech:** Python, Poetry
- **Entrypoint:** `root_agent/agent.py`
- **Subagents:** Output structure agent, web search agent
- **Setup:** See [apps/adk/README.md](./apps/adk/README.md)

### `apps/client` - Web Interface
- **Purpose:** Next.js frontend for users to generate, view, and manage blog posts.
- **Tech:** React, Next.js, shadcn/ui, TypeScript
- **Entrypoint:** `app/`
- **Features:** Auth, dashboard, blog generation, theming, toast notifications
- **Setup:** See [apps/client/README.md](./apps/client/README.md)

### `apps/genkit` - AI Flows
- **Purpose:** Orchestrates AI flows for summarizing YouTube videos, generating search terms, and producing final blog content.
- **Tech:** Node.js, TypeScript
- **Entrypoint:** `src/flows/`
- **Features:** Modular flows, prompt management, service integration
- **Setup:** See [apps/genkit/README.md](./apps/genkit/README.md)

### `apps/server` - Backend API
- **Purpose:** Express.js backend for authentication, user management, blog post CRUD, and integration with Genkit and DB.
- **Tech:** Node.js, Express, Prisma, TypeScript
- **Entrypoint:** `src/index.ts`
- **Features:** Auth, user, post, and agent routes; error handling; JWT; Prisma ORM
- **Setup:** See [apps/server/README.md](./apps/server/README.md)

### `apps/transcript` - (Legacy) Transcript Service
- **Purpose:** Python service for extracting YouTube video transcripts (not actively used).
- **Tech:** Python, Poetry, Flask
- **Entrypoint:** `src/transcript/main.py`
- **Setup:** See [apps/transcript/README.md](./apps/transcript/README.md)

---

## Packages

### `packages/constants`
- Shared constants (status codes, messages, etc.)
- **Setup:** See [packages/constants/README.md](./packages/constants/README.md)

### `packages/db`
- Prisma schema (`prisma/schema.prisma`)
- DB client and migrations
- **Setup:** See [packages/db/README.md](./packages/db/README.md)

### `packages/types`
- Shared TypeScript types for API, models, and flows
- **Setup:** See [packages/types/README.md](./packages/types/README.md)

### `packages/ui`
- Reusable React components (shadcn/ui-based): Button, Card, Input, Select, etc.
- **Setup:** See [packages/ui/README.md](./packages/ui/README.md)

### `packages/utils`
- Shared utility functions (error handling, logging, etc.)
- **Setup:** See [packages/utils/README.md](./packages/utils/README.md)

---

## Development Setup

### Prerequisites
- Node.js (v20+)
- pnpm (recommended)
- Docker (for local DB and services)
- Python 3.11+ (for transcript/adk if running locally)

### Install dependencies
```bash
pnpm install
```

### Database
- Uses PostgreSQL (see `docker-compose.yaml` for default credentials)
- Prisma schema: `packages/db/prisma/schema.prisma`
- To migrate DB:
  ```bash
  pnpm --filter @workspace/db prisma migrate dev
  ```

### Running Apps Locally
- **Client:** `pnpm --filter @workspace/web dev`
- **Server:** `pnpm --filter @workspace/server dev`
- **Genkit:** `pnpm --filter @workspace/genkit dev`
- **ADK/Transcript:** See respective READMEs for Python/Poetry setup

---

## Running with Docker

The project is fully dockerized. To run all services:

```bash
docker-compose up --build
```

- **Client:** http://localhost:3000
- **Server:** http://localhost:6969
- **DB:** localhost:5432 (see credentials in `docker-compose.yaml`)
- **Genkit/Transcript:** Internal services, see logs for ports

Each service has its own Dockerfile in `infra/docker/`.

---

## Environment Variables

- Each app/package may require its own `.env` file (see `apps/*/.env.example`)
- Main variables:
  - `DATABASE_URL` (for server/db)
  - `NEXT_PUBLIC_API_URL` (for client)
  - AI/Genkit API keys as needed

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make changes and add tests
4. Open a PR

---

## License

MIT
