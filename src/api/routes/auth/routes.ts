import { Router } from "express";
import { celebrate } from "celebrate";
import * as authController from "./controller";
import * as reqSchemas from "./req-schemas";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post("/login", celebrate(reqSchemas.LOGIN), authController.login);

  route.post("/register", celebrate(reqSchemas.REGISTER), authController.register);

  // route.get("/currentUser", async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const test = await postgres.pool.query("SELECT * FROM users WHERE userid = $1", [1]);
  //     res.status(200).send(test.rows);
  //   } catch (err) {
  //     return next(err);
  //   }
  // });
};
