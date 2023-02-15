import bcrypt from "bcryptjs";
import ErrorService from "./error";
import { IUserDTO, IUser } from "../interfaces/IUser";
import db from "../loaders/db";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorType } from "../enums/error";
import ERROR_MESSAGES from "../constants/error-messages";
import REGEXES from "../constants/regex";
import { ILoginReqBody, IRegisterReqBody } from "../api/routes/auth/req-schemas";
import TABLE_NAMES from "../constants/db-table-names";

const HASH_SALT_ROUNDS = 10;

export default class UserService {
  constructor() {}

  private static async findWhere(criteria: Partial<IUser>) {
    try {
      if (criteria?.email !== undefined) {
        criteria.email = criteria?.email?.toLowerCase();
      }
      const users = await db.select<IUser[]>("*").from(TABLE_NAMES.USERS).where(criteria);
      return users;
    } catch (err) {
      return [];
    }
  }

  static toUserDTO(user: IUser, token: string): IUserDTO {
    return {
      name: user?.name,
      email: user?.email?.toLowerCase(),
      id: user?.id,
      token
    };
  }

  static async login(authCredentials: ILoginReqBody) {
    const [userWithEmail] = await this.findWhere({ email: authCredentials.email });
    if (userWithEmail === undefined) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.LOGIN);
    }
    const isPasswordValid = await bcrypt.compare(authCredentials?.password, userWithEmail?.password);
    if (!isPasswordValid) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.LOGIN);
    }
    const token = this.createToken(userWithEmail);
    return this.toUserDTO(userWithEmail, token);
  }

  private static async createUsers(users: Partial<IUser> | Partial<IUser>[]) {
    try {
      const createdUsers = await db(TABLE_NAMES.USERS).insert(users).returning<IUser[]>("id");
      return createdUsers;
    } catch (err) {
      return [];
    }
  }

  static async register(newUser: IRegisterReqBody) {
    const hashedPassword = await this.hashPassword(newUser.password!);
    if (hashedPassword === undefined) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PASSWORD_FORMAT);
    }
    const [createdDBUser] = await this.createUsers({
      name: newUser?.name,
      password: hashedPassword,
      email: newUser?.email?.toLowerCase()
    });
    if (createdDBUser === undefined) {
      throw new ErrorService(ErrorType.Failed, ERROR_MESSAGES.GENERIC);
    }

    const userSchema = {
      email: newUser?.email,
      id: createdDBUser?.id,
      name: newUser.name,
      password: newUser.password
    };
    const token = this.createToken(userSchema);
    return this.toUserDTO(userSchema, token);
  }

  private static createToken(user: IUser) {
    const payload = {
      id: user?.id,
      email: user?.email
    };
    const token = jwt.sign(payload, config?.jwtSecret);
    return token;
  }

  private static async hashPassword(password = "") {
    if (!REGEXES.PASSWORD.test(password)) {
      return undefined;
    }
    const salt = await bcrypt.genSalt(HASH_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  static async resetPassword() {}

  static async changePassword() {}

  static async getUserById(id: number): Promise<Partial<IUserDTO>> {
    const [userWithId] = await this.findWhere({ id });
    if (userWithId === undefined) {
      throw new ErrorService(ErrorType.NotFound, `User with id ${id} was not found`);
    }
    return { email: userWithId?.email?.toLocaleLowerCase(), id: userWithId?.id, name: userWithId?.name };
  }
}
