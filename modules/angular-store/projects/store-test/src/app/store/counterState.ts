import { BaseState, Action, Store } from "ajwah-angular-store";

import { Injectable } from "@angular/core";

@Injectable()
// @State({
//     name: 'counter',
//     initialState: { count: 101, msg: '' }
// })
class CounterState implements BaseState {
  constructor(private store: Store) {}
  stateName: string = "counter";
  initState: any = { count: 12, msg: "" };
  *mapActionToState(state: any, action: Action): IterableIterator<any> {
    switch (action.type) {
      case "Inc":
        yield { count: state.count + 1, msg: "" };
        break;
      case "Dec":
        yield { count: state.count - 1, msg: "" };
        break;
      case "AsyncInc":
        yield { count: state.count, msg: "loading by generator function..." };
        //state = yield this.getData(state.count);
        yield this.getData(state.count);
        break;
      default:
        yield state;
    }
  }

  getData(num: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ count: num + Math.floor(Math.random() * 15), msg: "" });
      }, 1000);
    });
  }
}

export default CounterState;
