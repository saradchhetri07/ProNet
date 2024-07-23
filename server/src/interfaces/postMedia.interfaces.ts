export interface PostMedia {
  postId: number;
  mediaUrl: string;
  mediaType: "image" | "video";
  uploaded_at: Date;
  created_at: Date;
  updated_at: Date;
  userId: string;
  updated_by?: number | null;
}
