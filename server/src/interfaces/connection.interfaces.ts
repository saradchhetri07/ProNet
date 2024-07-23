export interface Connection {
  connectionId: number;
  userId: number;
  connectionUserId: number;
  status: "pending" | "accepted" | "rejected";
}
