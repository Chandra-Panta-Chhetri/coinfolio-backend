import { NextFunction, Request, Response } from "express";
import UserService from "../../../services/user";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const us = new UserService();
    const user = await us.login(req.body);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const us = new UserService();
    const user = await us.register(req.body);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const us = new UserService();
    const user = await us.getUserById(req.user?.id!);
    res.send(user);
  } catch (err) {
    return next(err);
  }
};
