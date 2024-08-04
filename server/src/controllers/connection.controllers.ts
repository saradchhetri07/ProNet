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
  try {
    const userId = req.user!.id;
    const connectUserId = req.params.userId;

    if (userId === connectUserId) {
      throw new BadRequestError("You can't connect to yourself");
    }

    await ConnectServices.createConnection(userId, connectUserId);
    return res
      .status(HTTPStatusCodes.CREATED)
      .send({ message: "Connect request sent" });
  } catch (error) {
    next(error);
  }

  // try {
  //   const userId = req.user!.id;
  //   const connectUserId = req.params;

  //   if (userId === connectUserId.userId) {
  //     throw new BadRequestError("you can't connect to yourself");
  //   }

  //   await ConnectServices.createConnection(
  //     userId,
  //     connectUserId.userId.toString()
  //   );
  //   return res
  //     .status(HTTPStatusCodes.CREATED)
  //     .send({ message: "Connect request sent" });
  // } catch (error) {
  //   next(error);
  // }
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

export const getUserInfoBySearch = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { name } = req.query;
  const userInfo = await ConnectServices.getUserInfoBySearch(name, userId);
  return res.status(HTTPStatusCodes.OK).send(userInfo);
};

export const getConnectionsCount = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  console.log(`came to `, userId);

  const connectionCount = await ConnectServices.getConnectionsCount(userId);

  return res.status(HTTPStatusCodes.OK).send(connectionCount.toString());
};

export const coldStartRecommendation = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userInfo = await ConnectServices.coldStartRecommendation(userId);
  return res.status(HTTPStatusCodes.OK).send(userInfo);
};
