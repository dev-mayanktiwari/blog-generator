import { Request, Response } from "express";
import { THTTPResponse } from "@workspace/types";
import { ApplicationEnvironment } from "@workspace/constants";
import { TApplicationEnvironment } from "@workspace/constants";
import { logger } from "./logger";

const httpResponse = (
  req: Request,
  res: Response,
  responseStatusCode: number,
  responseMessage: string,
  data: unknown = null,
  env: TApplicationEnvironment = "development"
) => {
  const response: THTTPResponse = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
    },
    message: responseMessage,
    data: data,
  };

  logger.info(`Controller Response`, {
    meta: response,
  });

  //Production env check
  if (env === ApplicationEnvironment.PRODUCTION) {
    delete response.request.ip;
  }

  res.status(responseStatusCode).json(response);
};

export { httpResponse };
