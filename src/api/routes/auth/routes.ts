import { Router, Request, Response, NextFunction } from "express";
import postgres from "../../../loaders/postgres";
import UserService from "../../../services/user";
import { celebrate, Joi, Segments } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.post(
    "/signup",
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        password: Joi.string().required().messages({
          "string.required": "Password is required"
        })
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userService = new UserService();
        await userService.SignUp();
        res.status(200).send("Sign up Successfully");
      } catch (err) {
        next(err);
      }
    }
  );

  route.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const userService = new UserService();
      await userService.SignIn(email, password);
      res.status(200).send();
    } catch (err) {
      return next(err);
    }
  });

  route.get("/currentUser", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const test = await postgres.pool.query("SELECT * FROM users WHERE userid = $1", [1]);
      res.status(200).send(test.rows);
    } catch (err) {
      return next(err);
    }
  });
};
