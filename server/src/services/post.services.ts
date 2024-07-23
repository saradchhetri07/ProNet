import { NotFoundError } from "../errors/NotFound.errors";
import { Post } from "../interfaces/post.interface";
import { PostModel } from "../models/post.models";
import * as ConnectionServices from "../services/connection.services";

export const postPost = (body: Post, userId: string) => {
  try {
    return PostModel.postPost(body, userId);
  } catch (error) {
    throw error;
  }
};

export const getPostByDate = async (userId: string) => {
  const connectionsIds: string[] = await ConnectionServices.getConnections(
    userId
  );

  if (connectionsIds.length === 0) {
    return []; // No connections, returns an empty array
  }
  const posts = PostModel.getPostByDate(connectionsIds);
  if (!posts) {
    throw new NotFoundError("posts not found");
  }
  return posts;
};

export const postPostMedia = async (
  postId: string,
  medialUrl: string,
  mediaType: string,
  userId: string
) => {
  return PostModel.createPostMedia(postId, medialUrl, mediaType, userId);
};
