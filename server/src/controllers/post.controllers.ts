import HTTPStatusCodes from "http-status-codes";
import { Request } from "../interfaces/auth.interfaces";
import { Response, NextFunction } from "express";
import * as PostServices from "../services/post.services";
import { BadRequestError } from "../errors/BadRequest.errors";
import { cloudinaryUpload } from "../utils/cloudinary.utils";
import { UploadApiResponse } from "cloudinary";

export const postPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const userId = req.user?.id;
  const postId = await PostServices.postPost(body, userId!);

  if (!postId) {
    throw new Error("posts creation failed");
  }
  const files: any = req.files;
  let postMediaLocalPath: string = "";
  let postMediaRemoteUrl: string = "";
  let resourceType: string = "image";

  if (files !== undefined) {
    postMediaLocalPath = files.postMedia[0].path;
  }
  if (postMediaLocalPath !== undefined) {
    const cloudinaryResponse: UploadApiResponse | null = await cloudinaryUpload(
      postMediaLocalPath
    );

    postMediaRemoteUrl =
      cloudinaryResponse !== undefined ? cloudinaryResponse!.url : "";
    resourceType =
      cloudinaryResponse !== undefined
        ? cloudinaryResponse!.resource_type
        : "image";
  }

  if (postMediaRemoteUrl && postMediaRemoteUrl.length !== 0) {
    //upload media into post media tables

    const postMediaId = await PostServices.postPostMedia(
      postId.postId,
      postMediaRemoteUrl,
      resourceType,
      req.user!.id
    );

    if (!postMediaId) {
      throw new BadRequestError("failed to insert post");
    }
  }
  return res
    .status(HTTPStatusCodes.OK)
    .json({ message: "post Created successfully" });
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sortPref } = req.query;
  `came to fetch the posts`, sortPref;
  let posts;
  const userId = req.user?.id;
  if (sortPref === "date") {
    posts = await PostServices.getPostByDate(userId!);
  }
  return res.status(HTTPStatusCodes.OK).send(posts);
};

export const insertLikes = async (req: Request, res: Response) => {
  const { postId } = req.params;

  await PostServices.insertLikes(postId, req.user!.id);

  return res
    .status(HTTPStatusCodes.CREATED)
    .send({ message: "liked successfully" });
};

export const insertComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;

  const { content } = req.body;

  `post id is`, postId;
  `content is`, content;

  await PostServices.insertComments(req.user!.id, postId, content);

  return res
    .status(HTTPStatusCodes.CREATED)
    .send({ message: "commented successfully" });
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postIdsParams = req.query.postIds as string;

  `gotten postIdsparams is`, typeof postIdsParams;

  const postIds: string[] = postIdsParams.split(",").map((item) => item.trim());
  `postIds now is`, postIds;

  const comments = await PostServices.getComments(postIds);
  return res.status(HTTPStatusCodes.OK).send({ comments });
};

export const getMyPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const posts = await PostServices.getMyPosts(userId);
  return res.status(HTTPStatusCodes.OK).send(posts);
};

export const deleteMyPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const { postId } = req.body;
  await PostServices.deleteMyPost(userId, postId);
  return res.status(HTTPStatusCodes.OK).send({ message: "post deleted" });
};
