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
  return res.status(HTTPStatusCodes.OK).json(postId);
};

export const getPostByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  return PostServices.getPostByDate(userId!);
};
