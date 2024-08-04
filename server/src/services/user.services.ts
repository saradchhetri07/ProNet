import { User } from "./../interfaces/user.interfaces";
import * as UserModel from "../models/user.models";
import { ProfileInterface } from "../interfaces/profile.interface";
import { ServerError } from "../errors/ServerError.errors";
import { NotFoundError } from "../errors/NotFound.errors";

export const signUp = (body: Omit<User, "id">) => {
  return UserModel.UserModel.signUp(body);
};

export const getUserByEmail = (email: string) => {
  return UserModel.UserModel.getUserByEmail(email);
};

export const getUsers = () => {
  return UserModel.UserModel.getUsers();
};

export const createUserProfile = async (
  profile: ProfileInterface,
  userId: string
) => {
  const createdProfileSummary = await UserModel.UserModel.createUserProfiles(
    profile,
    parseInt(userId)
  );
  if (!createUserProfile) {
    throw new ServerError("profile creation failed");
  }
  return createdProfileSummary;
};

export const getUserDetails = async (userId: string) => {
  const user = await UserModel.UserModel.getUserDetails(userId);
  return user;
};

export const updateUserProfileImage = async (
  userId: string,
  imageUrl: string
) => {
  const updatedProfileImageUrl =
    await UserModel.UserModel.updateUserProfileImage(userId, imageUrl);
  if (!updatedProfileImageUrl || updateUserProfileImage.length === 0) {
    throw new ServerError(`User profile image update failed`);
  }
  return updatedProfileImageUrl;
};

export const updateUserCoverImage = async (
  userId: string,
  imageUrl: string
) => {
  const updatedCoverImage = await UserModel.UserModel.updateUserCoverImage(
    userId,
    imageUrl
  );
  if (!updatedCoverImage || updatedCoverImage.length === 0) {
    throw new ServerError(`User cover image update failed`);
  }
  return updatedCoverImage;
};
