import { NotFoundError } from "../errors/NotFound.errors";
import { ServerError } from "../errors/ServerError.errors";
import { ProfileInterface } from "../interfaces/profile.interface";
import { ProfileModal } from "../models/profile.model";

export const getProfileDetails = async (userId: string) => {
  const updatedProfile = await ProfileModal.getProfileDetails(userId);
  if (!updatedProfile || updatedProfile.length == 0) {
    throw new NotFoundError("profile not found");
  }
  return updatedProfile;
};

export const createProfile = async (
  profile: ProfileInterface,
  userId: string
) => {
  const createdProfile = await ProfileModal.createprofile(profile, userId);
  if (!createdProfile) {
    throw new ServerError("Profile creation failed");
  }
  return createdProfile;
};

export const updateProfile = async (
  profile: ProfileInterface,
  userId: string
) => {
  const updatedProfile = await ProfileModal.updateProfile(profile, userId);
  if (!updatedProfile) {
    throw new ServerError("profile updation failed");
  }
  return updatedProfile;
};
