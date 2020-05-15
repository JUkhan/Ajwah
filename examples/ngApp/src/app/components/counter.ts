import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../store/actions";
import { Store, dispatch } from "ajwah-angular-store";
import { Component, ChangeDetectionStrategy, Input } from "@angular/core";

import CounterState from "../store/counterState";

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
}
