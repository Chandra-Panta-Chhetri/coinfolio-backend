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

  private static async findUsersWhere(searchCriteria: Partial<IUser>) {
    if (searchCriteria.email !== undefined) {
      searchCriteria.email = searchCriteria.email.toLowerCase();
    }
    const users = await db.select<IUser[]>("*").from(TABLE_NAMES.USERS).where(searchCriteria);
    return users;
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
    const [userWithEmail] = await this.findUsersWhere({ email: authCredentials.email });
    if (userWithEmail === undefined) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.LOGIN);
    }
    const isPasswordValid = await bcrypt.compare(authCredentials.password, userWithEmail.password);
    if (!isPasswordValid) {
      throw new ErrorService(ErrorType.Unauthorized, ERROR_MESSAGES.LOGIN);
    }
    const token = this.createToken(userWithEmail);
    return this.toUserDTO(userWithEmail, token);
  }

  private static async createUsers(users: Partial<IUser> | Partial<IUser>[]) {
    const createdUsers = await db(TABLE_NAMES.USERS).insert(users).returning<IUser[]>("id");
    return createdUsers;
  }

  static async register(newUser: IRegisterReqBody) {
    //remove, just try to insert if unique email constrait broken -> return error
    const [userWithEmail] = await this.findUsersWhere({ email: newUser.email });
    if (userWithEmail !== undefined) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.DUPLICATE_EMAIL);
    }

    const hashedPassword = await this.hashPassword(newUser.password!);
    const [createdDBUser] = await this.createUsers({
      name: newUser.name,
      password: hashedPassword,
      email: newUser.email?.toLowerCase()
    });

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
      id: user.id,
      email: user.email
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return token;
  }

  private static async hashPassword(password = "") {
    if (!REGEXES.PASSWORD.test(password)) {
      throw new ErrorService(ErrorType.BadRequest, ERROR_MESSAGES.PASSWORD_FORMAT);
    }
    const salt = await bcrypt.genSalt(HASH_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  static async resetPassword() {}

  static async changePassword() {}

  static async getUserById(id: number): Promise<Partial<IUserDTO>> {
    const [userWithId] = await this.findUsersWhere({ id });
    if (userWithId === undefined) {
      throw new ErrorService(ErrorType.NotFound, `User with id ${id} was not found`);
    }
    return { email: userWithId?.email?.toLocaleLowerCase(), id: userWithId?.id, name: userWithId?.name };
  }
}
