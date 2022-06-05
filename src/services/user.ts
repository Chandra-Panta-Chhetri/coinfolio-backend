import bcrypt from "bcryptjs";
import { EventDispatcher } from "event-dispatch";
import ErrorService from "./error";
import events from "../subscribers/events";
import { ILoginReqBody, IRegisterReqBody, IUserDTO, IUserSchema } from "../interfaces/IUser";
import postgres from "../loaders/postgres";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorType } from "../enums/error";

export default class UserService {
  private _eventDispatcher: EventDispatcher;

  constructor() {
    this._eventDispatcher = new EventDispatcher();
  }

  private toUserDTO(userSchema: IUserSchema, token: string): IUserDTO {
    return {
      name: userSchema.name,
      email: userSchema.email,
      id: userSchema.id,
      token
    };
  }

  public async login(authCredentials: ILoginReqBody): Promise<IUserDTO> {
    const usersWithEmail = await postgres<IUserSchema[]>`SELECT * FROM users WHERE email = ${authCredentials.email!}`;
    const user = usersWithEmail[0];
    if (!user) {
      throw new ErrorService(ErrorType.Unauthorized, "Email or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(authCredentials.password!, user.password);
    if (!isPasswordValid) {
      throw new ErrorService(ErrorType.Unauthorized, "Email or password is wrong");
    }

    const payload = {
      id: user.id,
      email: user.email
    };
    const token = jwt.sign(payload, config.jwtSecret);
    this._eventDispatcher.dispatch(events.user.login);
    return this.toUserDTO(user, token);
  }

  public async register(newUser: IRegisterReqBody): Promise<IUserDTO> {
    //this._eventDispatcher.dispatch(events.user.register);
    const user = await postgres<IUserDTO[]>`SELECT * FROM users WHERE email=${newUser.email!}`;
    return user[0];
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
