import { AppConfig } from "./config";
import express, { Application } from "express";
import { Request, Response } from "express";
import { expressHandler } from "@genkit-ai/express";
import cors from "cors";
import { logger } from "@workspace/utils";
import { debugConfiguration } from "./debug-config";
import { authContext, authMiddleware } from "./services/authMiddlewares";
import { generateBlogFlow } from "./flows/06generateBlogFlow";

// Create Express app
const app: Application = express();
const PORT = Number(AppConfig.get("PORT")) || 8080;

app.use(express.json());
app.use(
  cors({
    origin: String(AppConfig.get("CORS_ORIGIN")),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Genkit server is running",
    availableEndpoints: ["/health", "/flows", "/generate-blog"],
    flows: [
      "summariseYoutubeVideoFlow",
      "generateSearchTermsFlow",
      "getSearchTermsResult",
      "generateFinalSummaryFlow",
      "imageGenerationFlow",
      "generateBlogFlow",
    ],
  });
});

// List available flows
app.get("/flows", (req: Request, res: Response) => {
  res.status(200).json({
    flows: [
      {
        name: "summariseYoutubeVideoFlow",
        endpoint: "/flows/summariseYoutubeVideoFlow",
        description: "Summarize YouTube video content",
      },
      {
        name: "generateSearchTermsFlow",
        endpoint: "/flows/generateSearchTermsFlow",
        description: "Generate search terms for research",
      },
      {
        name: "getSearchTermsResult",
        endpoint: "/flows/getSearchTermsResult",
        description: "Get search results for terms",
      },
      {
        name: "generateFinalSummaryFlow",
        endpoint: "/flows/generateFinalSummaryFlow",
        description: "Generate final summary",
      },
      {
        name: "imageGenerationFlow",
        endpoint: "/flows/imageGenerationFlow",
        description: "Generate images from content",
      },
      {
        name: "generateBlogFlow",
        endpoint: "/flows/generateBlogFlow",
        description: "Generate complete blog post",
      },
    ],
  });
});

//@ts-ignore
// app.post("/generate-blog", authMiddleware, generateBlogController);
app.post(
  "/generate-blog",
  authMiddleware,
  expressHandler(generateBlogFlow, { contextProvider: authContext })
);

// Start the server
app.listen(PORT, () => {
  logger.info("Genkit server started successfully.", {
    meta: {
      PORT: PORT,
      SERVER_URL: `http://localhost:${PORT}`,
      HEALTH_CHECK: `http://localhost:${PORT}/health`,
      FLOWS_ENDPOINT: `http://localhost:${PORT}/flows`,
    },
  });

  // Debug configuration on startup
  debugConfiguration();
});
