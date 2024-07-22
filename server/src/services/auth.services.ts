import { User } from "../interfaces/user.interfaces";
import * as UserServices from "./user.services";

export const signUp = (body: Omit<User, "id">) => {
  try {
    return UserServices.signUp(body);
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = (email: string) => {
  try {
    return UserServices.getUserByEmail(email);
  } catch (error) {
    throw error;
  }
};
