import bcrypt from "bcryptjs";
import { EventDispatcher } from "event-dispatch";
import ErrorService from "./error";
import events from "../subscribers/events";

export default class UserService {
  private _eventDispatcher: EventDispatcher;

  constructor() {
    this._eventDispatcher = new EventDispatcher();
  }

  public async SignUp() {
    this._eventDispatcher.dispatch(events.user.signUp);
  }

  public async SignIn(email = "", password = "") {
    this._eventDispatcher.dispatch(events.user.signIn);
  }

  private async hashPassword(password = "") {
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new ErrorService(
        "ValidationError",
        "Password should have minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number"
      );
    }
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public async resetPassword() {}

  public async changePassword() {}
}
