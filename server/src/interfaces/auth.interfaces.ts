import { Request as ExpressRequest } from "express";
import { User } from "./user.interfaces";
import multer from "multer";

export interface Request extends ExpressRequest {
  user?: User;
}
