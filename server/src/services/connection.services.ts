import { BadRequestError } from "./../errors/BadRequest.errors";
import { ConnectionModel } from "../models/connection.models";

export const createConnection = async (
  loggedInUserId: string,
  connectUserId: string
) => {
  const connect = ConnectionModel.createConnection(
    loggedInUserId,
    connectUserId
  );
  if (!connect) {
    throw new BadRequestError("Connect request failed");
  }
};

export const getConnections = (userId: string) => {
  return ConnectionModel.getConnections(userId);
};
