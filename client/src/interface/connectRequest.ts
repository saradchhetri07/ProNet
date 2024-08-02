export interface ConnectRequest {
  userId: string;
  name: string;
  status: string | null;
  profilePhotoUrl: string;
  currentPosition: string;
}
