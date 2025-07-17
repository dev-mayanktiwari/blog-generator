import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { httpError, logger } from "@workspace/utils";
import cookieParser from "cookie-parser";
import { AppConfig } from "./config";
import healthRouter from "./routes/healthRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import authRouter from "./routes/authRouter";
import { authMiddleware } from "@workspace/auth";
import userRouter from "./routes/userRouter";
import { ApplicationEnvironment, ResponseMessage } from "@workspace/constants";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const app: Application = express();
const PORT = Number(AppConfig.get("PORT")) || 8080;

app.use(
  cors({
    origin: (origin, callback) => {
      const isDevelopment = String(AppConfig.get("NODE_ENV")) === "development";

      if (isDevelopment) {
        // Allow any origin in development
        callback(null, true);
      } else {
        // Production whitelist
        const allowedOrigins = [
          "https://blogai.mayanktiwari.tech",
          "https://blogai-opal.vercel.app",
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authMiddleware, userRouter);

//404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    throw new Error(ResponseMessage.NOT_FOUND);
  } catch (error) {
    httpError(next, error, req, 404);
  }
});

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info("Server started successfully.", {
    meta: {
      PORT: PORT,
      SERVER_URL: `http://localhost:${PORT}`,
    },
  });
});
