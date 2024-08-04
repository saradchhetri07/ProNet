import { ProfileInterface } from "../interfaces/profile.interface";
import { ServerError } from "./../errors/ServerError.errors";
import { BaseModel } from "./base.models";

export class ProfileModal extends BaseModel {
  static async createprofile(profile: ProfileInterface, userId: string) {
    try {
      const profileToCreate = {
        ...profile,
        userId: userId,
      };

      const createdProfile = await this.queryBuilder()
        .table("profiles")
        .insert(profileToCreate)
        .where({ userId: userId })
        .returning("profile_id");

      return createdProfile;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }
  static async updateProfile(profileData: ProfileInterface, userId: string) {
    try {
      const updateData: Partial<ProfileInterface> = {};

      if (profileData.headline !== undefined) {
        updateData.headline = profileData.headline;
      }
      if (profileData.summary !== undefined) {
        updateData.summary = profileData.summary;
      }
      if (profileData.industry !== undefined) {
        updateData.industry = profileData.industry;
      }
      if (profileData.currentPosition !== undefined) {
        updateData.currentPosition = profileData.currentPosition;
      }
      if (profileData.currentCompany !== undefined) {
        updateData.currentCompany = profileData.currentCompany;
      }
      if (profileData.experience !== undefined) {
        updateData.experience = profileData.experience;
      }

      console.log(`updateData is`, updateData);

      const updatedProfile = await this.queryBuilder()
        .table("profiles")
        .update(updateData)
        .where({ userId: userId })
        .returning("profile_id");

      return updatedProfile;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }

  static async getProfileDetails(userId: string) {
    try {
      console.log(`user id iis`, userId);

      const profile = await this.queryBuilder()
        .table("profiles as p")
        .select("p.*")
        .where({ userId: userId });

      console.log(profile);

      return profile;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError(error.message);
      }
    }
  }
}
