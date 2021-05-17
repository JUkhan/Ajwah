import { StateController } from "ajwah-store";

export class CounterState extends StateController<number> {
  constructor() {
    super(0);
  }
  inc() {
    this.emit(this.state + 1);
  }
  dec() {
    this.emit(this.state - 1);
  }
}
