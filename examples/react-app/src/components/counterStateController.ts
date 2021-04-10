import { StateController, Action, action$ } from "ajwah-reactive-form";
import { delay, map, mapTo, tap } from "rxjs/operators";

export interface CounterState {
  count: number;
  loading: boolean;
}
export class CounterStateController extends StateController<CounterState> {
  constructor() {
    super("counter", { count: 0, loading: false });
  }
  increse(state: CounterState, action: Action) {
    this.emit({ count: state.count + 1, loading: false });
  }

  decrese(state: CounterState, action: Action) {
    this.emit({ count: state.count - 1 });
  }
  async asyncIncresex(state: CounterState, action: Action) {
    this.emit({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.emit({ count: this.state.count + 1, loading: false });
  }
  onInit() {
    console.log("onInit...");
    this.registerEffect(
      action$.whereType("asyncIncrese").pipe(
        tap(() => this.emit({ loading: true })),
        delay(1000),
        tap(() => console.log("incresing...")),
        mapTo({ type: "increse" })
      )
    );
  }
}