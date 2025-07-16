import { NextFunction, Request, Response } from "express";
import { AppConfig } from "../config";
import { logger } from "@workspace/utils";
import { ContextProvider, RequestData } from "genkit/context";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const API_KEY = req.headers.authorization?.split(" ")[1];

    if (!API_KEY || API_KEY !== AppConfig.get("GENKIT_API_KEY")) {
      res.status(401).json({ error: "Unauthorized" });
    }

    // const request = req as AuthenticatedGenkitRequest;
    // request.userId = req.headers["x-user-id"] as string;

    next();
  } catch (error) {
    logger.error("Error in authMiddleware", {
      meta: {
        error,
      },
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const authContext: ContextProvider<any> = (req: RequestData) => {
  return {
    auth: {
      userId: req.headers["x-user-id"],
    },
  };
};
