# ADK (Agent Development Kit)

This app provides a Python-based agent for web search and output structuring, used as part of the blog generation pipeline.

## Features
- Web search agent for retrieving relevant information
- Output structure agent for formatting and structuring data
- Modular subagent architecture

## Tech Stack
- Python 3.11+
- Poetry for dependency management

## Directory Structure
- `root_agent/agent.py`: Main entrypoint for the agent
- `root_agent/subagents/`: Contains subagents for output structure and web search

## Setup

1. Install [Poetry](https://python-poetry.org/docs/#installation)
2. Install dependencies:
   ```bash
   poetry install
   ```
3. Run the agent:
   ```bash
   poetry run python root_agent/agent.py
   ```

## Usage
Integrate this agent as part of the blog generation pipeline to perform web search and structure outputs for downstream AI flows.

--- 