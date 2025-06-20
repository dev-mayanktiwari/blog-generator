import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import { ErrorStatusCodes, SuccessStatusCodes } from "@workspace/constants";
import {
  TokenPayload,
  UserLoginInput,
  UserRegistrationInput,
} from "@workspace/types";
import dbServices from "../services/dbServices";
import quicker from "../utils/quicker";
import { AppConfig } from "../config";

export default {
  register: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = UserRegistrationInput.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }
      const existingUser = await dbServices.getUserByEmail(
        safeParse.data.email
      );

      if (existingUser) {
        return httpError(
          next,
          new Error("User already exists"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.CONFLICT,
          { email: "User with this email already exists" }
        );
      }

      if (safeParse.data.registerType === "EMAIL") {
        const passwordHash = await quicker.hashPassword(
          String(safeParse.data.password)
        );
        safeParse.data.password = passwordHash;
      }

      const user = await dbServices.createUser(safeParse.data);

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "User Created Successfully",
        {
          user,
        }
      );
    }
  ),

  login: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const body = req.body;
      const safeParse = UserLoginInput.safeParse(body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error("Invalid input"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.flatten()
        );
      }

      const user = await dbServices.getUserByEmail(safeParse.data.email);

      if (!user) {
        return httpError(
          next,
          new Error("User not found"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.NOT_FOUND,
          { email: "No user found with this email" }
        );
      }

      if (user.registerType != safeParse.data.registerType) {
        return httpError(
          next,
          new Error("Invalid login method"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.BAD_REQUEST,
          {
            registerType: "User registered with a different method",
          }
        );
      }

      if (safeParse.data.registerType === "EMAIL") {
        const isPasswordValid = await quicker.comparePassword(
          String(safeParse.data.password),
          user.password!
        );

        if (!isPasswordValid) {
          return httpError(
            next,
            new Error("Invalid credentials"),
            req,
            ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED,
            { password: "Incorrect password" }
          );
        }
      }

      const tokenPayload: TokenPayload = {
        email: user.email,
        id: String(user.id),
        name: String(user.name),
      };

      const token = quicker.generateJWTToken(tokenPayload);

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: String(AppConfig.get("SAFE_COOKIE")) === "true",
        sameSite:
          String(AppConfig.get("SAFE_COOKIE")) === "true" ? "none" : "lax",
        path: "/api/v1",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "User Logged In Successfully",
        {
          user: safeParse.data,
        }
      );
    }
  ),
};
