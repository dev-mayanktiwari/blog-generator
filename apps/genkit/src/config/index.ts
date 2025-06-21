import dotenv from "dotenv";
dotenv.config();

type ConfigKeys =
  | "NODE_ENV"
  | "AGENT_URL"
  | "AGENT_APP_NAME"
  | "PORT"
  | "GEMINI_API_KEY"
  | "GENKIT_API_KEY"
  | "CORS_ORIGIN";

const _config: Record<ConfigKeys, string | undefined> = {
  NODE_ENV: process.env.NODE_ENV,
  AGENT_URL: process.env.AGENT_URL,
  AGENT_APP_NAME: process.env.AGENT_APP_NAME,
  PORT: process.env.PORT || "3000",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GENKIT_API_KEY: process.env.GENKIT_API_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:6969",
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
