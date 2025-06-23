# Build stage
FROM python:3.11-slim AS builder

# Set working directory
WORKDIR /app

# Install poetry
RUN pip install poetry==2.0.0

# Copy poetry files
COPY pyproject.toml poetry.lock ./
RUN touch README.md

# Configure poetry to not use a virtual environment
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-ansi --no-root

# Final stage
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY src/transcript ./transcript

# Set environment variables
ENV PYTHONPATH=/app
ENV FLASK_APP=transcript.main
ENV FLASK_ENV=production

# Expose port
EXPOSE 8080

# Run the application
CMD ["python", "-m", "transcript.main"]
