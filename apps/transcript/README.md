# Transcript (Legacy)

This app is a legacy Python service for extracting YouTube video transcripts. It is not actively used in the current pipeline but is included for reference.

## Features
- Extracts transcripts from YouTube videos
- Flask-based API

## Tech Stack
- Python 3.11+
- Poetry
- Flask

## Setup

1. Install [Poetry](https://python-poetry.org/docs/#installation)
2. Install dependencies:
   ```bash
   poetry install
   ```
3. Run the service:
   ```bash
   poetry run python src/transcript/main.py
   ```

## Docker
To run with Docker:
```bash
docker-compose up --build
```

---
