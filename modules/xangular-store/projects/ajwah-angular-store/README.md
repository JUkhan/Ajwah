# Ajwah

Rx based store library for React, Vue, Angular, Preact. Manage your application's states, effects, and actions easy way. It's easy to use in functional components with React hooks.

### Installation

```sh
>> npm i ajwah-angular-store
>> npm i ajwah-devtools
```

### Example

### counterState

```javascript
import { BaseState, Action } from "ajwah-angular-store";
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../store/actions";
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
      case INCREMENT:
        yield { count: state.count + 1, msg: "" };
        break;
      case DECREMENT:
        yield { count: state.count - 1, msg: "" };
        break;
      case ASYNC_INCREMENT:
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
```

### counterComponent

```js
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

```

### App.modules

```js
imports: [
  AjwahStoreModule.forRoot({
    rootStates: [counterState],
    devTools: devTools(),
  }),
];
```

[React Doc](https://github.com/JUkhan/Ajwah/tree/minandeasy/docs/react#ajwah)

[Vue Doc](https://github.com/JUkhan/Ajwah/tree/minandeasy/docs/vue#ajwah)

[Angular Doc](https://github.com/JUkhan/Ajwah/tree/minandeasy/docs/angular#ajwah)
