import { BehaviorSubject } from "rxjs";
import { Action } from "./utils";

export class Dispatcher extends BehaviorSubject<Action> {
  constructor() {
    super({ type: "@@INIT" });
  }

  dispatch(action: Action) {
    if (typeof action === "undefined") {
      throw new TypeError(`Actions must be objects`);
    } else if (typeof action.type === "undefined") {
      throw new TypeError(`Actions must have a type property`);
    }
    this.next(action);
  }
  complete() {}
}
