import dotenv from "dotenv";
dotenv.config();

type ConfigKeys = "PORT" | "NODE_ENV" | "JWT_SECRET";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      process.exit(1);
    }

    return key === "PORT" ? Number(value) : value;
  },
};
