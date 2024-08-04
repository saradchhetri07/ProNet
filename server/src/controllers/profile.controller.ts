import HTTPStatusCodes from "http-status-codes";

import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth.interfaces";
import * as ProfileServices from "../services/profile.services";
export const getProfileDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const getProfileDetails = await ProfileServices.getProfileDetails(userId);
  return res.status(HTTPStatusCodes.OK).send(getProfileDetails);
};

export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const { body } = req;
  await ProfileServices.createProfile(body, userId);
  return res.status(HTTPStatusCodes.OK).send("profile created");
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.id;
  const { body } = req;

  console.log(`body is`, body.headline);

  await ProfileServices.updateProfile(body, userId);
  return res.status(HTTPStatusCodes.OK).send("profile updated");
};
