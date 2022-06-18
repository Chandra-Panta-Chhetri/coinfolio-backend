import { EventSubscriber, On } from "event-dispatch";
import events from "./events";
import Logger from "../loaders/logger";

@EventSubscriber()
export default class UserSubscriber {
  @On(events.user.login)
  public onUserLogin() {
    Logger.info("User Signing in");
  }

  @On(events.user.register)
  public onUserRegister() {
    Logger.info("User Signing up");
  }
}
