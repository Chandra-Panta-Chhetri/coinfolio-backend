import ErrorService from "../../services/error";
import { NextFunction, Request, Response } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export default isAuthenticated;
