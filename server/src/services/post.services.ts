import { BadRequestError } from "../errors/BadRequest.errors";
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
  const connectionsIds: string[] | undefined =
    await ConnectionServices.getConnections(userId);
  if (!connectionsIds || connectionsIds.length === 0) {
    return []; // No connections, returns an empty array
  }

  const posts = await PostModel.getPostByDate(connectionsIds, userId);
  if (!posts) {
    throw new NotFoundError("posts not found");
  }
  return posts;
};

export const postPostMedia = (
  postId: string,
  medialUrl: string,
  mediaType: string,
  userId: string
) => {
  return PostModel.createPostMedia(postId, medialUrl, mediaType, userId);
};

export const insertLikes = async (postId: string, userId: string) => {
  const isLiked = await PostModel.insertLikes(postId, userId);
  if (!isLiked) {
    throw new BadRequestError("Likes not created");
  }
};

export const insertComments = async (
  userId: string,
  postId: string,
  content: string
) => {
  const isCommented = await PostModel.insertComments(userId, postId, content);

  if (!isCommented) {
    throw new BadRequestError("comment not created");
  }
  return isCommented;
};

export const getComments = async (postIds: string[]) => {
  const postIdsArray = postIds.map((postId) => {
    return parseInt(postId, 10);
  });

  const comments = await PostModel.getComments(postIdsArray);
  if (!comments) {
    throw new NotFoundError("comments not found");
  }
  return comments;
};

export const getMyPosts = async (userId: string) => {
  const posts = await PostModel.getMyPosts(userId);
  if (!posts || posts.length === 0) {
    throw new NotFoundError("No Posts yet");
  }
  return posts;
};

export const deleteMyPost = async (userId: string, postId: string) => {
  const deletedPost = await PostModel.deleteMyPost(userId, postId);
  if (!deleteMyPost) {
    throw new BadRequestError("deletion failed");
  }
  return deletedPost;
};
