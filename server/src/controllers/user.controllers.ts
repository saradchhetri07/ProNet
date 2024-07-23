import { BadRequestError } from "../errors/BadRequest.errors";
import { Request } from "../interfaces/auth.interfaces";
import { Response, NextFunction } from "express";
import * as UserServices from "../services/user.services";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserServices.getUsers();
  } catch (error) {
    if (error instanceof Error) {
      next(new BadRequestError(error.message));
    }
  }
};
