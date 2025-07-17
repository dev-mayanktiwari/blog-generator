import { AuthenticatedRequest } from "@workspace/types";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { NextFunction, Request, Response } from "express";
import { httpError } from "@workspace/utils";
import { AppConfig } from "../config";
import { ErrorStatusCodes, ResponseMessage } from "@workspace/constants";

const USER_RATE_LIMIT = Number(AppConfig.get("USER_RATE_LIMIT"));
const IP_RATE_LIMIT = Number(AppConfig.get("IP_RATE_LIMIT"));

export const userRateLimitter = rateLimit({ 
    windowMs: 60 * 60 * 1000,
    max: USER_RATE_LIMIT,
    keyGenerator: (req: Request) => {
        const authReq = req as AuthenticatedRequest;
        return authReq.user?.id || ipKeyGenerator(req.ip!);
    },
    handler: (req: Request, res: Response, next: NextFunction) => {
        return httpError(next, new Error(ResponseMessage.TOO_MANY_REQUESTS), req, ErrorStatusCodes.CLIENT_ERROR.TOO_MANY_REQUESTS, {
            message: "Too many requests from this user",
        })
    },
})

export const ipRateLimitter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: IP_RATE_LIMIT,
    keyGenerator: (req: Request) => ipKeyGenerator(req.ip!),
    handler: (req: Request, res: Response, next: NextFunction) => {
        return httpError(next, new Error(ResponseMessage.TOO_MANY_REQUESTS), req, ErrorStatusCodes.CLIENT_ERROR.TOO_MANY_REQUESTS, {
            message: "Too many requests from this IP",
        })
    },
})