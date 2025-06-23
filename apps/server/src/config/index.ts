import dotenv from "dotenv";
dotenv.config();

type ConfigKeys =
  | "PORT"
  | "NODE_ENV"
  | "JWT_SECRET"
  | "SAFE_COOKIE"
  | "GENKIT_API_KEY"
  | "GENKIT_FLOW_URL";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  SAFE_COOKIE: process.env.SAFE_COOKIE,
  GENKIT_API_KEY: process.env.GENKIT_API_KEY,
  GENKIT_FLOW_URL: process.env.GENKIT_FLOW_URL,
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
