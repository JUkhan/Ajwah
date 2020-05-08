import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../store/actions";
import { Store, dispatch } from "ajwah-angular-store";
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from "@angular/core";

import CounterState from "../store/counterState";
import { from } from "rxjs";

@Component({
  selector: "counter",
  template: `
    <button (click)="removeState()">Remove State</button>
    <button (click)="addState()">Add State</button>
    <p *ngIf="counter">
      <button class="btn" (click)="inc()">+</button>
      <button class="btn" (click)="dec()">-</button>
      <button class="btn" (click)="asyncInc()">async(+)</button>
      {{ counter.msg || counter.count }}
    </p>
    <button (click)="btnEvent()">Click me</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  @Input() counter: any;

  constructor(public store: Store) {}

  inc() {
    dispatch(INCREMENT);
  }
  dec() {
    dispatch(DECREMENT);
  }
  asyncInc() {
    dispatch(ASYNC_INCREMENT);
  }

  removeState() {
    this.store.removeState("counter");
  }
  addState() {
    this.store.addState(CounterState);
  }
  async btnEvent() {
    // from(this.doSmth()).subscribe(
    //   this.log,
    //   (err) => console.log(err),
    //   () => console.log("completed")
    // );
    for await (let val of this.doSmth()) {
      console.log(val);
    }
  }
  log(val) {
    console.log(val);
  }
  *doSmth() {
    yield 100;
    yield 101;
    yield Promise.resolve(3333);
    yield this.getData();
    yield Promise.resolve(123);
  }
  getData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(999);
      }, 2000);
    });
  }
}
