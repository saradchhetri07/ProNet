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

  if (userId === connectUserId.userId) {
    throw new BadRequestError("you can't connect to yourself");
  }

  await ConnectServices.createConnection(
    userId,
    connectUserId.userId.toString()
  );
  return res
    .status(HTTPStatusCodes.CREATED)
    .send({ message: "Connect request sent" });
};

export const acceptRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { status } = req.body;

  await ConnectServices.acceptConnections(userId, status);

  return res
    .status(HTTPStatusCodes.ACCEPTED)
    .send({ message: "request accepted" });
};

export const getConnections = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const connections = await ConnectServices.getConnections(req.user!.id);

  return res.status(HTTPStatusCodes.OK).send(connections);
};

export const getRequestedUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const userInfo = await ConnectServices.getRequestedUserInfo(userId);
  return res.status(HTTPStatusCodes.OK).send(userInfo);
};

export const deleteConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const { connectUserId } = req.params;
  await ConnectServices.deleteConnectionRequest(userId, connectUserId);
  return res
    .status(HTTPStatusCodes.OK)
    .send({ message: "connection request deleted" });
};

export const getUserRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const recommendedUsers = await ConnectServices.getUserRecommendation(userId);
  return res.status(HTTPStatusCodes.OK).send(recommendedUsers);
};
