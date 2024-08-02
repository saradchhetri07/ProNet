import { BadRequestError } from "../errors/BadRequest.errors";
import { NotFoundError } from "../errors/NotFound.errors";
import { User } from "../interfaces/user.interfaces";
import * as UserServices from "./user.services";

export const signUp = (body: Omit<User, "id">) => {
  `inside auth services sign up`;

  return UserServices.signUp(body);
};

export const getUserByEmail = async (email: string, routes: string) => {
  const existingUser = await UserServices.getUserByEmail(email);

  if (!existingUser && routes === "login") {
    throw new NotFoundError("user with that email doesn't exist");
  }
  if (existingUser && routes === "signUp") {
    throw new BadRequestError("user with that email already exists");
  }

  return existingUser;
};
