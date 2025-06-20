import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { TokenPayload } from "@workspace/types";
dotenv.config();

export class JwtAuth {
  private static secret = process.env.JWT_SECRET || "your_default_secret";

  static encode(payload: TokenPayload): string {
    return sign(payload, this.secret, {
      expiresIn: "30d",
    });
  }

  static decode(token: string): TokenPayload {
    return verify(token, String(JwtAuth.secret)) as TokenPayload;
  }
}

export const AuthService = new JwtAuth();
