import { StateController } from "ajwah-store";
import { delay, map } from "rxjs/operators";
export class CounterState extends StateController<number> {
  constructor() {
    super(0);
  }
  onInit() {
    this.mapActionToState(
      this.action$.whereType("asyncInc").pipe(
        delay(1000),
        map((action) => this.state + 1)
      )
    );
  }

  inc() {
    this.emit(this.state + 1);
  }
  dec() {
    this.emit(this.state - 1);
  }
}
