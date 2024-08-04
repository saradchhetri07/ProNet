import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth.interfaces";

/**
 * Handles any errors which may occurs during the execution of a fucntion
 *
 * Catches and forwards error ti next error-handling middleware {@linkcode genericErrorHandler}
 *
 * @param callback {Function} - Callback to handle error for
 */
export function requestWrapper(callback: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await callback(req, res, next);
    } catch (e) {
      console.error("Error caught in requestWrapper:", e);
      next(e);
    }
  };
}
