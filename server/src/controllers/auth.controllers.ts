import { NotFoundError } from "./../errors/NotFound.errors";
import { Request } from "../interfaces/auth.interfaces";
import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import HTTPStatusCodes from "http-status-codes";
import * as AuthServices from "../services/auth.services";
import { BadRequestError } from "../errors/BadRequest.errors";
import { JwtPayload, verify, sign } from "jsonwebtoken";
import { config } from "../config";
import { cloudinaryUpload } from "../utils/cloudinary.utils";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const existingUser = await AuthServices.getUserByEmail(body.email, "login");

  const isValidUser = await bcrypt.compare(
    body.password,
    existingUser!.password
  );
  if (!isValidUser) {
    throw new BadRequestError("Invalid credentials");
  }
  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
  };

  const accessToken = sign(payload, config.jwt.secret!, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });

  const refreshToken = sign(payload, config.jwt.secret!, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });

  return res
    .status(HTTPStatusCodes.OK)
    .json({ accessToken: accessToken, refreshToken: refreshToken });
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  console.log(`inside controlller`);

  //check if the user exist
  await AuthServices.getUserByEmail(body.email, "signUp");

  const files: any = req.files;
  let profilePhotoLocalPath: string = "";
  let uploadedProfilePhotoUrl: any;
  if (files !== undefined) {
    profilePhotoLocalPath = files.profilePhoto[0].path;
  }

  if (profilePhotoLocalPath !== undefined) {
    uploadedProfilePhotoUrl = await cloudinaryUpload(profilePhotoLocalPath);
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  console.log(`user is`, body);

  const users = await AuthServices.signUp({
    ...body,
    profile_photo_url:
      uploadedProfilePhotoUrl !== null ? uploadedProfilePhotoUrl.url : "",
    password: hashedPassword,
  });

  if (users === undefined) {
    throw new Error("SignUp failed");
  }

  return res.status(HTTPStatusCodes.OK).json({ message: "Sign Up successful" });
};
