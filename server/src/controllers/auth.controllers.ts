import { Request } from "../interfaces/auth.interfaces";
import { Response } from "express";
export const login = async (req: Request, res: Response) => {};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { body } = req;

    //check if the user exist
    const userExists = AuthServices.getUserByEmail(body.email);
  } catch (error) {}
};
