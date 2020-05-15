import { BaseState, Action } from "ajwah-angular-store";

import { Injectable } from "@angular/core";
interface Counter {
  msg: string;
  count: number;
}
@Injectable()
class CounterState implements BaseState<Counter> {
  stateName: string = "counter";
  initState: Counter = { count: 12, msg: "" };

  async *mapActionToState(
    state: Counter,
    action: Action
  ): AsyncIterableIterator<Counter> {
    switch (action.type) {
      case "Inc":
        yield { count: state.count + 1, msg: "" };
        break;
      case "Dec":
        yield { count: state.count - 1, msg: "" };
        break;
      case "AsyncInc":
        yield { count: state.count, msg: " loading..." };
        yield { msg: "", count: await this.getData(state.count) };
        break;
      default:
        yield state;
    }
  }

  getData(num: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(num + 1);
      }, 1000);
    });
  }
}

export default CounterState;
