import { EventSubscriber, On } from "event-dispatch";
import events from "./events";
import Logger from "../loaders/logger";

@EventSubscriber()
export default class UserSubscriber {
  @On(events.user.signIn)
  public onUserSignIn() {
    Logger.info("User Signing in");
  }

  @On(events.user.signUp)
  public onUserSignUp() {
    Logger.info("User Signing up");
  }
}
