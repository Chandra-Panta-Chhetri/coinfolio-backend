import bcrypt from "bcryptjs";
import ErrorService from "./error";

export default class UserService {
  public async SignUp() {}

  public async SignIn(email = "", password = "") {}

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
