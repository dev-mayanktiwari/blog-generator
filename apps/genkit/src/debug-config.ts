import { AppConfig } from "./config";
import { logger } from "@workspace/utils";

export function debugConfiguration() {
  logger.info("Debugging configuration", {
    meta: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "SET" : "NOT SET",
      GENKIT_API_KEY: process.env.GENKIT_API_KEY ? "SET" : "NOT SET",
      GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
      VERTEX_AI_LOCATION: process.env.VERTEX_AI_LOCATION,
      GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS
        ? "SET"
        : "NOT SET",
      GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
    },
  });

  // Check if required config values are available
  try {
    const configChecks = {
      GEMINI_API_KEY: AppConfig.get("GEMINI_API_KEY"),
      GENKIT_API_KEY: AppConfig.get("GENKIT_API_KEY"),
      GOOGLE_CLOUD_PROJECT_ID: AppConfig.get("GOOGLE_CLOUD_PROJECT_ID"),
      VERTEX_AI_LOCATION: AppConfig.get("VERTEX_AI_LOCATION"),
      GCS_BUCKET_NAME: AppConfig.get("GCS_BUCKET_NAME"),
    };

    logger.info("Configuration validation passed", {
      meta: configChecks,
    });
  } catch (error: any) {
    logger.error("Configuration validation failed", {
      meta: {
        error: error.message,
      },
    });
  }
}
