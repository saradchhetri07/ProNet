import { BadRequestError } from "./../errors/BadRequest.errors";
import { ConnectionModel } from "../models/connection.models";
import { NotFoundError } from "../errors/NotFound.errors";
import { ServerError } from "../errors/ServerError.errors";

export const createConnection = async (
  loggedInUserId: string,
  connectUserId: string
) => {
  const connect = await ConnectionModel.createConnection(
    loggedInUserId,
    connectUserId
  );
  if (!connect) {
    throw new BadRequestError("Connect request failed");
  }
  return connect;
};

export const acceptConnections = (userId: string, status: string) => {
  const connections = ConnectionModel.acceptConnections(userId, status);

  if (!connections) {
    throw new NotFoundError("No connections were found");
  }
};

export const getConnections = (userId: string) => {
  return ConnectionModel.getConnections(userId);
};

export const getRequestedUserInfo = async (userId: string) => {
  const userInfo = await ConnectionModel.getRequestedUserInfo(userId);
  if (!userInfo) {
    throw new NotFoundError("No Request Yet");
  }
  return userInfo;
};

export const deleteConnectionRequest = async (
  userId: string,
  connectuserId: string
) => {
  const isDeleted = await ConnectionModel.rejectConnectRequest(
    userId,
    connectuserId
  );
  if (!isDeleted) {
    throw new NotFoundError("Connection request not found");
  }
};

export const getUserRecommendation = async (userId: string) => {
  const recommendedUsers = await ConnectionModel.getJobRecommendationsByBFS(
    userId
  );
  if (!recommendedUsers) {
    throw new NotFoundError("No users found for recommendations");
  }
  return recommendedUsers;
};

export const getUserInfoBySearch = async (name: any, userId: string) => {
  const userInfo = await ConnectionModel.getUserInfoBySearch(name, userId);
  if (!userInfo) {
    throw new NotFoundError("No user info retrieval failed");
  }
  return userInfo;
};

export const getConnectionsCount = async (userId: string) => {
  const connectionCount = await ConnectionModel.getConnectionsCount(userId);
  if (!connectionCount) {
    throw new NotFoundError("No connections found");
  }
  return connectionCount;
};

export const coldStartRecommendation = async (userId: string) => {
  const recommendationUserInfo = await ConnectionModel.coldStartRecommendation(
    userId
  );
  if (!recommendationUserInfo) {
    throw new ServerError(`Couldnt fetch user information`);
  }
  return recommendationUserInfo;
};
