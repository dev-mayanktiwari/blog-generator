import dotenv from "dotenv";
dotenv.config();

type ConfigKeys = "NODE_ENV" | "AGENT_URL" | "AGENT_APP_NAME";

const _config: Record<ConfigKeys, string | undefined> = {
  NODE_ENV: process.env.NODE_ENV,
  AGENT_URL: process.env.AGENT_URL,
  AGENT_APP_NAME: process.env.AGENT_APP_NAME,
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
