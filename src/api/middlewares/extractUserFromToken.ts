import ErrorService from "../../services/error";
import { NextFunction, Request, Response } from "express";
import { IRequestUser } from "../../interfaces/IUser";
import jwt from "jsonwebtoken";
import config from "../../config";
import { ErrorType } from "../../enums/error";

const convertTokenToUser = (token: string): IRequestUser => {
  try {
    const reqUser = jwt.verify(token, config.jwtSecret) as IRequestUser;
    return reqUser;
  } catch (err) {
    throw new ErrorService(ErrorType.Unauthorized, "Token is invalid or has expired");
  }
};

const extractUserFromToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.get("X-Auth-Token");
    if (!token) {
      return next();
    }
    const user = convertTokenToUser(token);
    req.user = user;
    next();
  } catch (err) {
    next(new ErrorService(ErrorType.Unauthorized, "Token is invalid or has expired"));
  }
};

export default extractUserFromToken;
