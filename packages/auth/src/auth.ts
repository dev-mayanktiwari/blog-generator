import { TokenPayload } from "@workspace/types";
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class AuthService {
  private static secret = String(process.env.JWT_SECRET);
  static encode(payload: TokenPayload, options?: SignOptions): string {
    return jwt.sign(payload, AuthService.secret, options);
  }

  static decode(token: string): TokenPayload {
    return jwt.verify(token, AuthService.secret) as TokenPayload;
  }
}

export const AuthInstance = new AuthService();
