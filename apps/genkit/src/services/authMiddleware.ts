// import { Request, Response, NextFunction } from "express";
import { JwtAuth } from "@workspace/auth";
// import { AuthenticatedRequest } from "@workspace/types";
import { UserFacingError } from "genkit";
import { ContextProvider, RequestData } from "genkit/context";
import { ActionContext as Context } from "genkit";

// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ error: "Authorization header is missing" });
//   }

//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Token is missing" });
//   }

//   try {
//     const decodedToken = JwtAuth.decode(token);

//     // Attach the decoded token to the request object
//     (req as AuthenticatedRequest).user = decodedToken;

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

export const context: ContextProvider<Context> = (req: RequestData) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UserFacingError("PERMISSION_DENIED", "No token provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UserFacingError("PERMISSION_DENIED", "Token is missing");
  }

  try {
    const decodedToken = JwtAuth.decode(token);
    return {
      auth: {
        user: decodedToken,
      },
    };
  } catch (error) {
    throw new UserFacingError("PERMISSION_DENIED", "Invalid or expired token");
  }
};
