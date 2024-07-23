import { Request } from "../interfaces/auth.interfaces";
import { Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/Unauthorized.errors";
import { verify } from "jsonwebtoken";
import { config } from "../config";
import { User } from "../interfaces/user.interfaces";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new UnauthorizedError("token not found"));
    return;
  }

  const token = authorization.split(" ");

  if (token.length !== 2 || token[0] !== "Bearer") {
    next(new UnauthorizedError("Invalid token"));

    return;
  }
  try {
    const user = verify(token[1], config.jwt.secret!) as User;

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError("Unauthenticated"));
  }
}
