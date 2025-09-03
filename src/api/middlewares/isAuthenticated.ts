import ErrorService from "../../services/error";
import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../../enums/error";
import ERROR_MESSAGES from "../../constants/error-messages";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user === null || req.user === undefined) {
    next(new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.AUTHENTICATION));
  } else {
    next();
  }
};

export default isAuthenticated;
