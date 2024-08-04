import { GraphRecommendation } from "./graphRecommendation.models";
import { Server } from "http";
import { NotFoundError } from "../errors/NotFound.errors";
import { ServerError } from "../errors/ServerError.errors";
import { BaseModel } from "./base.models";

export class ConnectionModel extends BaseModel {
  static async createConnection(userId: string, connectUserId: string) {
    const connectionRequest = {
      userId: userId,
      connectionUserId: connectUserId,
      status: "pending",
    };

    const [isConnected] = await this.queryBuilder()
      .insert(connectionRequest)
      .table("connections")
      .returning("status");

    return isConnected;
  }

  static async getConnections(userId: string) {
    try {
      // Step 1: Retrieve connections where the user is either the initiator or the recipient
      const connectionInitiator = await this.queryBuilder()
        .select("connection_user_id")
        .from("connections")
        .where({ user_id: userId, status: "confirmed" });

      const connectionRecipient = await this.queryBuilder()
        .select("user_id as connection_user_id")
        .table("connections")
        .where({ connection_user_id: userId, status: "confirmed" });

      const connections = [...connectionInitiator, ...connectionRecipient];

      const connectionsIds: string[] = connections.map(
        (connection) => connection.connectionUserId
      );

      if (!connections) {
        throw new NotFoundError("No connections were found");
      }
      return connectionsIds;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }

  static async getConnectionsCount(userId: string) {
    try {
      // Step 1: Retrieve connections where the user is either the initiator or the recipient
      const connectionInitiator = await this.queryBuilder()
        .select("connection_user_id")
        .from("connections")
        .where({ user_id: userId, status: "confirmed" });

      const connectionRecipient = await this.queryBuilder()
        .select("user_id as connection_user_id")
        .table("connections")
        .where({ connection_user_id: userId, status: "confirmed" });

      const connections = [...connectionInitiator, ...connectionRecipient];

      const connectionsIds: string[] = connections.map(
        (connection) => connection.connectionUserId
      );

      if (!connections) {
        throw new NotFoundError("No connections were found");
      }
      return connectionsIds.length;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }

  static async acceptConnections(userId: string, status: string) {
    try {
      const connections = await this.queryBuilder()
        .table("connections")
        .where({ user_id: userId, status: "pending" })
        .update({ status: status });

      return connections;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }

  static async rejectConnections(userId: string, status: string) {
    try {
    } catch (error) {}
  }

  static async getRequestedUserInfo(userId: string) {
    // try {
    const requestUserId = await this.queryBuilder()
      .select("c.userId")
      .table("connections as c")
      .where({ connectionUserId: userId, status: "pending" });

    const requestUserIdsArray = requestUserId.map((user) =>
      parseInt(user.userId, 10)
    );

    //get information about the request user
    try {
      const requestUserInfo = await this.queryBuilder()
        .select(
          "u.id as userId",
          "u.name",
          "u.profile_photo_url",
          "p.current_position"
        )
        .table("users as u")
        .join("profiles as p", "p.userId", "u.id")
        .whereIn("p.userId", requestUserIdsArray);

      return requestUserInfo;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError("Internal Server Error");
      }
    }
  }

  static async rejectConnectRequest(userId: string, connectUserId: string) {
    try {
      const deleteConnectionRequest = await this.queryBuilder()
        .table("connections")
        .where({
          user_id: connectUserId,
          connection_user_id: userId,
          status: "pending",
        })
        .del();
      return deleteConnectionRequest;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError("Internal server Error");
      }
    }
  }

  static async getJobRecommendationsByBFS(userId: string) {
    try {
      const mutualConnections = await this.queryBuilder()
        .select(
          "c.user_id as userId",
          "c.connection_user_id as connectionUserId"
        )
        .table("connections as c")
        .where({ status: "confirmed" });

      const connections: number[][] = mutualConnections.map((item) => [
        parseInt(item.userId),
        parseInt(item.connectionUserId),
      ]);

      const graphRecommendation = new GraphRecommendation(connections);
      graphRecommendation.setupAndUseRecommendationSystem();
      const recommendedUserIds = graphRecommendation.getRecommendationBFS(
        parseInt(userId)
      );

      const recommendedUserInfo = await this.queryBuilder()
        .select(
          "u.id as userId",
          "u.name",
          "u.profile_photo_url",
          "p.current_position"
        )
        .table("users as u")
        .join("profiles as p", "p.userId", "u.id")
        .whereIn("p.userId", recommendedUserIds);

      return recommendedUserInfo;
    } catch (error: any) {
      throw new ServerError(`error is ${error}`);
    }
  }

  static async getUserInfoBySearch(name: any, userId: string) {
    try {
      const userInfo = await this.queryBuilder()
        .select(
          "u.id as userId",
          "u.name",
          "u.profile_photo_url",
          "p.current_position"
        )
        .table("users as u")
        .join("profiles as p", "p.userId", "u.id")
        .where((builder) => {
          builder
            .andWhere("u.name", "ILIKE", `%${name}%`)
            .andWhere("u.id", "!=", userId);
        });
      return userInfo;
    } catch (error: any) {
      if (error instanceof error) {
        throw new ServerError(`Internal Server Error`);
      }
    }
  }
  static async coldStartRecommendation(userId: string) {
    try {
      const connectionUserIds = await this.queryBuilder()
        .table("connections as c")
        .select("c.connection_user_id")
        .distinct()
        .where((builder) => {
          builder
            .andWhere("c.user_id", "!=", userId)
            .orWhere("c.user_id", "=", userId)
            .andWhere("c.status", "pending");
        });

      const connectionUserIdsArray = connectionUserIds.map(
        (connectionUserId) => {
          return connectionUserId.connectionUserId;
        }
      );
      console.log(connectionUserIdsArray);

      // const nonFriendConnectionsUser = await this.queryBuilder()
      //   .table("users as u")
      //   .select("u.id")
      //   .where("u.");

      console.log(connectionUserIds);

      const UserIds = await this.queryBuilder()
        .select("u.id as userId")
        .table("users as u")
        .join("profiles as p", "p.userId", "u.id")
        .where((builder) => {
          builder.andWhere("u.id", "!=", userId);
        });

      const recommendedUserIds = UserIds.map((user) => user.userId);

      const recommendedUserInfo = await this.queryBuilder()
        .select(
          "u.id as userId",
          "u.name",
          "u.profile_photo_url",
          "p.current_position",
          "c.status"
        )
        .table("users as u")
        .join("profiles as p", "p.userId", "u.id")
        .join("connections as c", "u.id", "c.connection_user_id")
        .whereIn("p.userId", recommendedUserIds);

      return recommendedUserInfo;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }
}
