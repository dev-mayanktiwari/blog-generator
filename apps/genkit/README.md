# Genkit (AI Flows)

This app orchestrates AI flows for the Blog Generator platform, including summarizing YouTube videos, generating search terms, and producing final blog content.

## Features
- Modular AI flows for content generation
- Prompt management and service integration
- Type-safe flow definitions

## Tech Stack
- Node.js, TypeScript

## Directory Structure
- `src/flows/`: Main AI flows (summarization, search terms, blog generation)
- `src/services/`: Service integrations
- `src/prompts/`: Prompt templates

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run the development server:
   ```bash
   pnpm --filter @workspace/genkit dev
   ```

## Docker
To run with Docker:
```bash
docker-compose up --build
```

--- 