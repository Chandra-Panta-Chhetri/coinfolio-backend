import { IRequestUser } from "../interfaces/IUser";
import ErrorService from "./error";

export default class GlobalService {
  public hasPermission(
    createdByUserId: number,
    reqUser: IRequestUser,
    errMsg: string
  ) {
    if (reqUser.userId !== createdByUserId) {
      throw new ErrorService("UnauthorizedError", errMsg);
    }
  }
}
