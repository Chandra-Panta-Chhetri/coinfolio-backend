import { Router } from "express";
import { celebrate } from "celebrate";
import * as authController from "./controller";
import * as authReqSchemas from "./req-schemas";
import middlewares from "../../middlewares";

const authRouter = Router();
export default (app: Router) => {
  app.use("/auth", authRouter);

  authRouter.post("/login", middlewares.isNotAuthenticated, celebrate(authReqSchemas.LOGIN), authController.login);
  authRouter.post(
    "/register",
    celebrate(authReqSchemas.REGISTER),
    middlewares.isNotAuthenticated,
    authController.register
  );
  authRouter.get("/user", middlewares.isAuthenticated, authController.getCurrentUser);
};
