import { NextFunction, Request, Response } from "express";
import UserService from "../../../services/user";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDTO = await UserService.login(req.body);
    res.send(userDTO);
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUserDTO = await UserService.register(req.body);
    res.send(newUserDTO);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDTO = await UserService.getUserById(req.user?.id!);
    res.send(userDTO);
  } catch (err) {
    next(err);
  }
};
