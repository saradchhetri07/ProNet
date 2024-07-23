import HTTPStatusCodes from "http-status-codes";
import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth.interfaces";
import * as ConnectServices from "../services/connection.services";
import { BadRequestError } from "../errors/BadRequest.errors";

export const connectRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const connectUserId = req.params;

  await ConnectServices.createConnection(
    userId,
    connectUserId.userId.toString()
  );
  return res
    .status(HTTPStatusCodes.CREATED)
    .send({ message: "Connect request sent" });
};
