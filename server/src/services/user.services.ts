import { User } from "./../interfaces/user.interfaces";
import * as UserModel from "../models/user.models";

export const signUp = (body: Omit<User, "id">) => {
  try {
    return UserModel.UserModel.signUp(body);
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = (email: string) => {
  try {
    return UserModel.UserModel.getUserByEmail(email);
  } catch (error) {
    throw error;
  }
};
