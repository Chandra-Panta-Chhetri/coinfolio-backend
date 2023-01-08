import { Router } from "express";
import { celebrate } from "celebrate";
import * as authController from "./controller";
import * as reqSchemas from "./req-schemas";
import middlewares from "../../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post("/login", middlewares.isNotAuthenticated, celebrate(reqSchemas.LOGIN), authController.login);

  route.post("/register", middlewares.isNotAuthenticated, celebrate(reqSchemas.REGISTER), authController.register);

  route.get("/user", middlewares.isAuthenticated, authController.getCurrentUser);
};
