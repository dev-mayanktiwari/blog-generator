import dotenv from "dotenv";
dotenv.config();

type ConfigKeys =
  | "NODE_ENV"
  | "AGENT_URL"
  | "AGENT_APP_NAME"
  | "PORT"
  | "GEMINI_API_KEY"
  | "GENKIT_API_KEY"
  | "CORS_ORIGIN"
  | "GCS_BUCKET_NAME"
  | "GOOGLE_CLOUD_PROJECT_ID"
  | "GOOGLE_APPLICATION_CREDENTIALS"
  | "VERTEX_AI_LOCATION"
  | "GEMINI_MODEL";

const _config: Record<ConfigKeys, string | undefined> = {
  NODE_ENV: process.env.NODE_ENV,
  AGENT_URL: process.env.AGENT_URL,
  AGENT_APP_NAME: process.env.AGENT_APP_NAME,
  PORT: process.env.PORT || "8080",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GENKIT_API_KEY: process.env.GENKIT_API_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:6969",
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME || "genkit-bucket",
  GOOGLE_CLOUD_PROJECT_ID:
    process.env.GOOGLE_CLOUD_PROJECT_ID || "genkit-project",
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  VERTEX_AI_LOCATION: process.env.VERTEX_AI_LOCATION || "us-central1",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.0-flash-lite",
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      console.error(`Configuration key "${key}" is not set.`);
      process.exit(1);
    }

    return value;
  },
};
