import { Request as ExpressRequest } from "express";
import { User } from "./user.interfaces";

export interface Request extends ExpressRequest {
  user?: User;
}
