import { NotFoundError } from "../errors/NotFound.errors";
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
    // Step 1: Retrieve connections where the user is either the initiator or the recipient
    const connectionInitiator = await this.queryBuilder()
      .select("connection_user_id")
      .from("connections")
      .where({ user_id: userId, status: "accepted" });

    const connectionRecipient = await this.queryBuilder()
      .select("user_id as connection_user_id")
      .table("connections")
      .where({ connection_user_id: userId, status: "accepted" });

    const connections = [...connectionInitiator, ...connectionRecipient];

    if (!connections) {
      throw new NotFoundError("No connections were found");
    }
    return connections;
  }
}
