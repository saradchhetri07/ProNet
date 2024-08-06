export interface PostInterface {
  userId: string;
  commentCount?: string;
  content?: string;
  createdAt?: string;
  likeCount?: string;
  mediaUrl?: string;
  name: string;
  postId: string;
  profilePhotoUrl?: string;
  likedByCurrentUser: boolean;
}
