import { Router, Request, Response, NextFunction } from "express";
import postgres from "../../loaders/postgres";
import UserService from "../../services/user";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  /**
   * path: /api/auth/signup
   * method: POST
   * header: None
   * body:
   *  {
   *    ...
   *  }
   * params: None
   * description: registers a new user
   */
  route.post(
    "/signup",
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

  /**
   * path: /api/auth/signin
   * method: POST
   * header: None
   * body:
   *  {
   *    email: string,
   *    password: string
   *  }
   * params: None
   * description: signs in a user
   */
  route.post(
    "/signin",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const userService = new UserService();
        await userService.SignIn(email, password);
        res.status(200).send();
      } catch (err) {
        return next(err);
      }
    }
  );

  /**
   * path: /api/auth/currentUser
   * method: GET
   * header: None
   * body: None
   * params: None
   * description: get information for current user logged in
   */
  route.get(
    "/currentUser",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const test = await postgres.pool.query(
          "SELECT * FROM users WHERE userid = $1",
          [1]
        );
        res.status(200).send(test.rows);
      } catch (err) {
        return next(err);
      }
    }
  );
};
