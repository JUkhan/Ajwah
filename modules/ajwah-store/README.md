## Ajwah Store

A reactive state management library. Manage your application's states, effects, and actions easy way. Make apps more scalable with a unidirectional data-flow.

counter : [Angular Demo](https://stackblitz.com/edit/angular-ajwah-counter?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ajwah-counter?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-counter?file=src%2FApp.vue)

todos : [Angular Demo](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ts-cb9zfa?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-store?file=src%2FApp.vue)

### Installation for (angular/react/vue/others)

```sh
>> npm i ajwah-store
>> npm i ajwah-devtools [optional]
>> npm i ajwah-test  [optional]
```

Define a state controller class

```ts
import { mapTo } from "rxjs/operators";
import { StateController } from "ajwah-store";
import { Injectable } from "@angular/core";
import { merge, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CounterService extends StateController<number> {
  constructor() {
    super("counter", 2);
  }

  increment() {
    this.update((state) => state + 1);
  }

  decrement() {
    this.update((state) => state - 1);
  }

  async asyncInc() {
    this.dispatch("async-inc");
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 1000);
    });
    this.dispatch("async-inc-done");
    this.increment();
  }

  get loading$(): Observable<boolean> {
    const start = this.actions.whereType("async-inc");
    const done = this.actions.whereType("async-inc-done");
    return merge(start.pipe(mapTo(true)), done.pipe(mapTo(false)));
  }
}
```

Consuming state:

`counterComponent`

```ts
import { CounterService } from "../../services/counter.service";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-counter",
  template: `
    <p>
      <button class="btn" (click)="service.increment()">+</button>
      <button class="btn" (click)="service.decrement()">-</button>
      <button class="btn" (click)="service.asyncInc()">async(+)</button>
      {{ service.stream$ | async }} <app-loading></app-loading>
    </p>
  `,
  styleUrls: ["./counter.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements OnInit {
  constructor(public service: CounterService) {}

  ngOnInit(): void {}
}
```

`loadingComponent`

```ts
import { CounterService } from "../../services/counter.service";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-loading",
  template: ` <span *ngIf="service.loading$ | async"> loading... </span> `,
  styleUrls: ["./loading.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent implements OnInit {
  constructor(public service: CounterService) {}

  ngOnInit(): void {}
}
```

Testing `CounterState`

```ts
import { ajwahTest } from "ajwah-test";
import { CounterController } from "./counterController";

describe("counterState", () => {
  let cs: CounterController;

  beforeEach(() => {
    cs = new CounterController();
  });
  afterEach(() => {
    cs.dispose();
  });

  it("initial state", async () => {
    await ajwahTest({
      build: () => cs.stream$,
      verify: (states) => {
        expect(states[0]).toBe(2);
      },
    });
  });

  it("increment", async () => {
    await ajwahTest({
      build: () => cs.stream$,
      act: () => {
        cs.increment();
      },
      skip: 1,
      verify: (states) => {
        expect(states[0]).toBe(3);
      },
    });
  });

  it("decrement", async () => {
    await ajwahTest({
      build: () => cs.stream$,
      act: () => {
        cs.decrement();
      },
      skip: 1,
      verify: (states) => {
        expect(states[0]).toBe(1);
      },
    });
  });

  it("async increment", async () => {
    await ajwahTest({
      build: () => cs.stream$,
      act: () => {
        cs.asyncInc();
      },
      skip: 1,
      wait: 1000,
      verify: (states) => {
        expect(states[0]).toBe(3);
      },
    });
  });
});
```
