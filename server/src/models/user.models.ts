import { getUserByEmail } from "./../services/auth.services";
import { User } from "../interfaces/user.interfaces";
import { BaseModel } from "./base.models";
import { BadRequestError } from "../errors/BadRequest.errors";
import { ServerError } from "../errors/ServerError.errors";
import { ProfileInterface } from "../interfaces/profile.interface";
import { NotFoundError } from "../errors/NotFound.errors";

export class UserModel extends BaseModel {
  static async signUp(body: Partial<User>) {
    try {
      const userToCreate = {
        email: body.email,
        password: body.password,
        name: body.name,
        profile_photo_url: body.profile_photo_url,
      };
      `user to create is`, userToCreate;

      const user = await this.queryBuilder()
        .insert(userToCreate)
        .table("users");
      `created user is`, user;

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new ServerError("Internal server error");
      }
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const user = await this.queryBuilder()
        .table("users")
        .select("users.id", "users.email", "users.name", "users.password")
        .where({ "users.email": email })
        .first();

      return user;
    } catch (error) {
      throw Error("Interval server error");
    }
  }

  static async getUsers() {
    try {
      const users = await this.queryBuilder()
        .select(
          "users.email",
          "users.name",
          "users.profile_photo_url",
          "users.cover_photo_url"
        )
        .table("users");
      return users;
    } catch (error) {
      throw Error("Interval server error");
    }
  }

  static async createUserProfiles(profile: ProfileInterface, userId: number) {
    try {
      const profileToInsert = {
        ...profile,
        userId: userId,
      };
      const userProfileExists = await this.queryBuilder()
        .table("profiles")
        .returning("profile_id")
        .where({ user_id: userId })
        .returning("profile_id");

      if (userProfileExists.length !== 0) {
        // If a profile already exists, throw a custom error
        throw new Error("Profile already exists for this user");
      }
      const [createdProfileId] = await this.queryBuilder()
        .table("profiles")
        .insert(profileToInsert)
        .returning("profile_id");

      return createdProfileId;
    } catch (error: any) {
      // Handle errors, including the custom error for existing profile
      if (error.message === "Profile already exists for this user") {
        // Handle specific case for existing profile
        throw new BadRequestError(error.message);
      } else {
        // Handle general errors
        throw new BadRequestError("Internal Server Error");
      }
    }
  }

  static async getUserDetails(userId: string) {
    try {
      const user = await this.queryBuilder()
        .table("users")
        .select(
          "users.id",
          "users.email",
          "users.name",
          "users.profile_photo_url",
          "users.cover_photo_url"
        )
        .where({ id: userId });

      return user;
    } catch (error: any) {
      throw new BadRequestError(error);
    }
  }

  static async updateUserProfileImage(userId: string, imageUrl: string) {
    try {
      if (typeof imageUrl !== "string") {
        throw new BadRequestError("Invalid image url");
      }

      const profileUrl = await this.queryBuilder()
        .table("users")
        .update({ profilePhotoUrl: imageUrl })
        .where({ id: userId })
        .returning("profilePhotoUrl");
      return profileUrl;
    } catch (error: any) {
      // if (error instanceof Error) {
      throw new ServerError(error);
      // }
    }
  }

  static async updateUserCoverImage(userId: string, imageUrl: string) {
    try {
      if (typeof imageUrl !== "string") {
        throw new BadRequestError("Invalid image url");
      }
      `inside models to update user cover Image`;

      const coverPhotoUrl = await this.queryBuilder()
        .table("users")
        .update({ coverPhotoUrl: imageUrl })
        .where({ id: userId })
        .returning("coverPhotoUrl");
      `inside models to update user cover Image`, coverPhotoUrl;
      return coverPhotoUrl;
    } catch (error: any) {
      // if (error instanceof Error) {
      throw new ServerError(error);
      // }
    }
  }
}
