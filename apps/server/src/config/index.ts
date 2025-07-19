import dotenv from "dotenv";
dotenv.config();

type ConfigKeys =
  | "PORT"
  | "NODE_ENV"
  | "JWT_SECRET"
  | "SAFE_COOKIE"
  | "GENKIT_API_KEY"
  | "GENKIT_FLOW_URL"
  | "CORS_ORIGIN"
  | "USER_RATE_LIMIT"
  | "IP_RATE_LIMIT";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  SAFE_COOKIE: process.env.SAFE_COOKIE,
  GENKIT_API_KEY: process.env.GENKIT_API_KEY,
  GENKIT_FLOW_URL: process.env.GENKIT_FLOW_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  USER_RATE_LIMIT: process.env.USER_RATE_LIMIT || "2",
  IP_RATE_LIMIT: process.env.IP_RATE_LIMIT || "4",
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      console.error(`Configuration key "${key}" is not set.`);
      process.exit(1);
    }

    return key === "PORT" ? Number(value) : value;
  },
};
