import { Request } from "../interfaces/auth.interfaces";
import { Response, NextFunction } from "express";
import bcrypt from "bcrypt";
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
  try {
    const { body } = req;
    const existingUser = await AuthServices.getUserByEmail(body.email);

    if (!existingUser) {
      throw new Error("User with that email does not exist");
    }

    const isValidUser = await bcrypt.compare(
      body.password,
      existingUser!.password
    );
    if (!isValidUser) {
      throw new Error("Credentials invalid");
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
  } catch (error) {
    if (error instanceof Error) {
      next(new BadRequestError(error.message));
    }
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(`came to sign up`);

    const { body } = req;

    //check if the user exist
    const userExists = await AuthServices.getUserByEmail(body.email);

    if (userExists) {
      throw new Error("email exists");
    }
    const files: any = req.files;
    let profilePhotoLocalPath: string = "";
    let uploadedProfilePhotoUrl: any;
    if (files !== undefined) {
      profilePhotoLocalPath = files.profilePhoto[0].path;
      console.log(`profile photo local path is`, profilePhotoLocalPath);
    }

    if (profilePhotoLocalPath !== undefined) {
      uploadedProfilePhotoUrl = await cloudinaryUpload(profilePhotoLocalPath);
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const users = await AuthServices.signUp({
      ...body,
      profile_photo_url:
        uploadedProfilePhotoUrl !== null ? uploadedProfilePhotoUrl.url : "",
      password: hashedPassword,
    });

    if (users === undefined) {
      throw new Error("SignUp failed");
    }

    return res
      .status(HTTPStatusCodes.OK)
      .json({ message: "Sign Up successful" });
  } catch (error) {
    if (error instanceof Error) {
      next(new BadRequestError(error.message));
    }
  }
};
