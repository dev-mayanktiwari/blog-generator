import { Request } from "express";
import { TokenPayload } from "../jwt";

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}
