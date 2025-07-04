import { Request, Response, NextFunction } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@workspace/utils";
import {
  ErrorStatusCodes,
  ResponseMessage,
  SuccessStatusCodes,
} from "@workspace/constants";
import {
  AuthenticatedRequest,
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
      const { password, ...newUser } = user;
      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "User Created Successfully",
        {
          user: newUser,
        }
      );
    }
  ),

  login: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
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

        if (user.registerType !== safeParse.data.registerType) {
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
          if (!user.password) {
            return httpError(
              next,
              new Error("User has no password set"),
              req,
              ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED,
              { password: "No password set for this user" }
            );
          }
          const isPasswordValid = await quicker.comparePassword(
            String(safeParse.data.password),
            user.password
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

        let token;
        try {
          token = await quicker.generateJWTToken(tokenPayload);
        } catch (err) {
          console.error("Error generating JWT token:", err);
          return httpError(
            next,
            new Error("Failed to generate token"),
            req,
            ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
          );
        }

        res.cookie("authToken", token, {
          httpOnly: true,
          secure: String(AppConfig.get("SAFE_COOKIE")) === "true",
          path: "/",
          sameSite:
            String(AppConfig.get("SAFE_COOKIE")) === "true" ? "none" : "lax",
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        });

        // Exclude sensitive fields from user object
        const { password, ...userSafe } = user;

        httpResponse(
          req,
          res,
          SuccessStatusCodes.OK,
          "User Logged In Successfully",
          {
            user: userSafe,
          }
        );
      } catch (error) {
        console.error("Error in login controller:", error);
        return httpError(
          next,
          new Error("Internal server error"),
          req,
          ErrorStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR
        );
      }
    }
  ),

  logout: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: String(AppConfig.get("SAFE_COOKIE")) === "true",
        sameSite:
          String(AppConfig.get("SAFE_COOKIE")) === "true" ? "none" : "lax",
      });

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        ResponseMessage.LOGOUT_SUCCESS,
        {}
      );
    }
  ),

  me: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userEmail = (req as AuthenticatedRequest).user.email; // Assuming auth middleware sets req.user

      const user = await dbServices.getUserByEmail(userEmail);
      // console.log("Fetched user from database:", user);
      if (!user) {
        return httpError(
          next,
          new Error("User not authenticated"),
          req,
          ErrorStatusCodes.CLIENT_ERROR.UNAUTHORIZED
        );
      }

      httpResponse(
        req,
        res,
        SuccessStatusCodes.OK,
        "User data fetched successfully",
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            registerType: user.registerType,
          },
        }
      );
    }
  ),
};
