import { getUserByEmail } from "./../services/auth.services";
import { User } from "../interfaces/user.interfaces";
import { BaseModel } from "./base.models";

export class UserModel extends BaseModel {
  static async signUp(body: Partial<User>) {
    try {
      const userToCreate = {
        email: body.email,
        password: body.password,
        name: body.name,
        profile_photo_url: body.profile_photo_url,
        // cover_photo_url:
        //   body.cover_photo_url !== undefined ? body.cover_photo_url : "",
      };
      const user = await this.queryBuilder()
        .insert(userToCreate)
        .table("users");
      console.log(`created user is`, user);

      return user;
    } catch (error) {
      throw Error("Database insertion failed");
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
}
