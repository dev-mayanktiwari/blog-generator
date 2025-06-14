import dotenv from "dotenv";
dotenv.config();

type ConfigKeys = "GEMINI_API_KEY" | "NODE_ENV";
const _config: Record<ConfigKeys, string | undefined> = {
  //   PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  //JWT_SECRET: process.env.JWT_SECRET,
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      process.exit(1);
    }

    return value;
  },
};
