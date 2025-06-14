import { Request, Response, NextFunction } from "express";
import { httpError } from "./httpError";



export function asyncErrorHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) =>
      httpError(next, err, req)
    );
  };
}
