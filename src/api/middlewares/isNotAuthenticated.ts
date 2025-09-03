import ErrorService from "../../services/error";
import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../../enums/error";
import ERROR_MESSAGES from "../../constants/error-messages";

const isNotAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user === null || req.user === undefined) {
    next();
  } else {
    next(new ErrorService(ErrorType.Authorized, ERROR_MESSAGES.REQUIRES_NO_AUTHENTICATION));
  }
};

export default isNotAuthenticated;
