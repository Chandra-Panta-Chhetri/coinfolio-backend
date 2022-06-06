import bcrypt from "bcryptjs";
import { EventDispatcher } from "event-dispatch";
import ErrorService from "./error";
import events from "../subscribers/events";
import { ILoginReqBody, IRegisterReqBody, IUserDTO, IUserSchema } from "../interfaces/IUser";
import postgres from "../loaders/postgres";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorType } from "../enums/error";
import ERROR_MESSAGES from "../constants/error-messages";
import REGEXES from "../constants/regex";

const HASH_SALT_ROUNDS = 10;

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
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.LOGIN);
    }

    const isPasswordValid = await bcrypt.compare(authCredentials.password!, user.password);
    if (!isPasswordValid) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.LOGIN);
    }

    const token = this.createToken(user);
    this._eventDispatcher.dispatch(events.user.login);
    return this.toUserDTO(user, token);
  }

  public async register(newUser: IRegisterReqBody): Promise<IUserDTO> {
    const usersWithEmail = await postgres<IUserSchema[]>`SELECT * FROM users WHERE email = ${newUser.email!}`;
    const user = usersWithEmail[0];
    if (user) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.DUPLICATE_EMAIL);
    }

    const hashedPassword = await this.hashPassword(newUser.password!);
    const insertedUsers = await postgres<
      IUserSchema[]
    >`INSERT INTO users (name, password, email) VALUES(${newUser.name!}, ${hashedPassword!}, ${newUser.email!}) RETURNING id`;
    const userSchema = {
      email: newUser.email!,
      id: insertedUsers[0].id,
      name: newUser.name!,
      password: newUser.password!
    };
    const token = this.createToken(userSchema);
    this._eventDispatcher.dispatch(events.user.register);
    return this.toUserDTO(userSchema, token);
  }

  private createToken(userSchema: IUserSchema): string {
    const payload = {
      id: userSchema.id,
      email: userSchema.email
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return token;
  }

  private async hashPassword(password = "") {
    if (!REGEXES.PASSWORD.test(password)) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PASSWORD_FORMAT);
    }
    const salt = await bcrypt.genSalt(HASH_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  public async resetPassword() {}

  public async changePassword() {}
}
