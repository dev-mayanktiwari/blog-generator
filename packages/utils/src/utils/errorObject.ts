import { ApplicationEnvironment, ResponseMessage } from "@workspace/constants";
import { logger } from "./logger";
import { THTTPError } from "@workspace/types";
import { Request } from "express";

export const errorObject = (
  error: Error | unknown,
  req: Request,
  errorStatusCode: number = 500,
  data: unknown = null
): THTTPError => {
  const env = process.env.NODE_ENV || ApplicationEnvironment.DEVELOPMENT;

  const errorObj: THTTPError = {
    success: false,
    statusCode: errorStatusCode,
    request: {
      method: req.method,
      ip: req.ip,
      url: req.originalUrl,
    },
    message:
      error instanceof Error
        ? error.message || ResponseMessage.INTERNAL_SERVER_ERROR
        : ResponseMessage.INTERNAL_SERVER_ERROR,
    data: data,
    trace: error instanceof Error ? { error: error.stack } : null,
  };

  logger.error(`Controller Error`, {
    meta: errorObj,
  });

  if (env === "production") {
    delete errorObj.request.ip;
    delete errorObj.trace;
  }

  return errorObj;
};
