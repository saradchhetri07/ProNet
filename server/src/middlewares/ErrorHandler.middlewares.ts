import { Request, Response, NextFunction } from "express";
import HTTPStatusCodes from "http-status-codes";
import { ForbiddenError } from "../errors/Forbidden.errors";
import { NotFoundError } from "../errors/NotFound.errors";
import { BadRequestError } from "../errors/BadRequest.errors";
import { UnauthorizedError } from "../errors/Unauthorized.errors";
import { ServerError } from "../errors/ServerError.errors";

export const genericErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof UnauthorizedError) {
    return res.status(HTTPStatusCodes.UNAUTHORIZED).json({
      message: error.message,
    });
  }
  if (error instanceof ForbiddenError) {
    return res.status(HTTPStatusCodes.FORBIDDEN).json({
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(HTTPStatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }

  if (error instanceof BadRequestError) {
    `came to throw bad request error`;

    return res.status(HTTPStatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
  if (error instanceof ServerError) {
    return res.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
