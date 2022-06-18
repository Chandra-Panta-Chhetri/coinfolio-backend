import { Router } from "express";
import { celebrate } from "celebrate";
import * as authController from "./controller";
import * as reqSchemas from "./req-schemas";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post("/login", celebrate(reqSchemas.LOGIN), authController.login);

  route.post("/register", celebrate(reqSchemas.REGISTER), authController.register);

  route.get("/user", authController.getCurrentUser);
};
