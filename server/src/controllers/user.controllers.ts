import HTTPStatusCodes from "http-status-codes";
import { BadRequestError } from "../errors/BadRequest.errors";
import { Request } from "../interfaces/auth.interfaces";
import { Response, NextFunction } from "express";
import * as UserServices from "../services/user.services";
import { profile } from "console";
import { cloudinaryUpload } from "../utils/cloudinary.utils";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await UserServices.getUsers();
  return res.status(HTTPStatusCodes.OK).send(users);
};
export const createUsersProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;

  await UserServices.createUserProfile(body, req.user!.id);
  return res
    .status(HTTPStatusCodes.CREATED)
    .send({ message: "profile created" });
};

export const getLoggedInUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const loggedInUser = await UserServices.getUserDetails(userId);
  return res.status(HTTPStatusCodes.OK).json(loggedInUser);
};

export const updateProfileImage = async (req: Request, res: Response) => {
  const files: any = req.files;

  let profilePhotoLocalPath: string = "";
  let uploadedProfilePhotoUrl: any;
  if (files !== undefined) {
    profilePhotoLocalPath = files.ProfilePhoto[0].path;
  }

  if (profilePhotoLocalPath !== undefined) {
    uploadedProfilePhotoUrl = await cloudinaryUpload(profilePhotoLocalPath);
  }
  const userId = req.user!.id;
  const profileUrl = await UserServices.updateUserProfileImage(
    userId,
    uploadedProfilePhotoUrl.url
  );
  return res.status(HTTPStatusCodes.OK).send(profileUrl);
};

export const updateCoverImage = async (req: Request, res: Response) => {
  const files: any = req.files;
  `inside update cover Image`;
  let coverPhotoLocalPath: string = "";
  let uploadedCoverPhotoUrl: any;
  if (files !== undefined) {
    coverPhotoLocalPath = files.CoverPhoto[0].path;
  }

  if (coverPhotoLocalPath !== undefined) {
    uploadedCoverPhotoUrl = await cloudinaryUpload(coverPhotoLocalPath);
  }
  const userId = req.user!.id;
  const updatedCoverImage = await UserServices.updateUserCoverImage(
    userId,
    uploadedCoverPhotoUrl.url
  );
  return res.status(HTTPStatusCodes.OK).send(updatedCoverImage);
};
