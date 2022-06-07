import ErrorService from "../../services/error";
import { NextFunction, Request, Response } from "express";
import { IRequestUser } from "../../interfaces/IUser";
import jwt from "jsonwebtoken";
import config from "../../config";

const convertTokenToUser = (token: string): IRequestUser | null => {
  try {
    const reqUser = jwt.verify(token, config.jwtSecret) as IRequestUser;
    return reqUser;
  } catch (err) {
    return null;
  }
};

const getUserFromToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("in custom middleware");
  const token = req.get("Auth-Token");
  if (!token) {
    return next();
  }
  const user = convertTokenToUser(token);
  if (user) {
    req.user = user;
  }
  next();
};

export default getUserFromToken;
