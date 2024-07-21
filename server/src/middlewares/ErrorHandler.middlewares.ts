import { Request, Response, NextFunction } from "express";
import HTTPStatusCodes from "http-status-codes";
import { ForbiddenError } from "../errors/Forbidden.errors";
import { NotFoundError } from "../errors/NotFound.errors";
import { BadRequestError } from "../errors/BadRequest.errors";
import { UnauthorizedError } from "../errors/Unauthorized.errors";

const genericHandler = (
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
    return res.status(HTTPStatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};
