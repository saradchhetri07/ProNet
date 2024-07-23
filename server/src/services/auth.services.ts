import { NotFoundError } from "../errors/NotFound.errors";
import { User } from "../interfaces/user.interfaces";
import * as UserServices from "./user.services";

export const signUp = async (body: Omit<User, "id">) => {
  const userExists = await UserServices.signUp(body);

  if (userExists) {
    throw new NotFoundError("user with that email already exists");
  }
  return userExists;
};

export const getUserByEmail = async (email: string) => {
  const existingUser = await UserServices.getUserByEmail(email);

  if (!existingUser) {
    throw new NotFoundError("user with that email doesn't exist");
  }
  return existingUser;
};
