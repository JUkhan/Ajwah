## Ajwah Store

Reactive state management library. Manage your application's states, effects, and actions easy way. Make apps more scalable with a unidirectional data-flow.

`counter` : [Angular Demo](https://stackblitz.com/edit/angular-ajwah-counter?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ajwah-counter?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-counter?file=src%2FApp.vue)

`todos` : [Angular Demo](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ts-cb9zfa?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-store?file=src%2FApp.vue)

### Counter State

```ts
import { StateController, Get } from "ajwah-store";

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
  async asyncInc() {
    this.dispatch("asyncInc");
    await new Promise((resolve) => setTimeout(resolve, 10));
    this.inc();
  }
  get count$() {
    return merge(
      this.action$.whereType("asyncInc").pipe(mapTo("loading...")),
      this.stream$.pipe(map((count) => `${count}`))
    );
  }
}

const csCtrl = Get(CounterState);
csCtrl.count$.subscribe(console.log);
csCtrl.inc();
csCtrl.dec();
csCtrl.asyncInc();
```

### Testing

```ts
import { Get } from "ajwah-store";
import { ajwahTest } from "ajwah-test";
import { CounterController } from "./counterController";

describe("Counter state controller: ", () => {
  let csCtrl: CounterState;
  beforeEach(() => {
    csCtrl = Get(CounterState);
  });
  afterEach(() => {
    RemoveController(CounterState);
  });

  it("initial state", async () => {
    await ajwahTest({
      build: () => csCtrl.stream$,
      verify: (states) => {
        expect(states[0]).toEqual(0);
      },
    });
  });
  it("increment", async () => {
    await ajwahTest({
      build: () => csCtrl.stream$,
      act: () => {
        csCtrl.inc();
      },
      skip: 1,
      verify: (states) => {
        expect(states[0]).toEqual(1);
      },
    });
  });

  it("decrement", async () => {
    await ajwahTest({
      build: () => csCtrl.stream$,
      act: () => {
        csCtrl.dec();
      },
      skip: 1,
      verify: (states) => {
        expect(states[0]).toEqual(-1);
      },
    });
  });

  it("async increment", async () => {
    await ajwahTest({
      build: () => csCtrl.stream$,
      act: () => {
        csCtrl.asyncInc();
      },
      skip: 1,
      wait: 10,
      verify: (states) => {
        expect(states[0]).toEqual(1);
      },
    });
  });

  it("async increment", async () => {
    await ajwahTest({
      build: () => csCtrl.count$,
      act: () => {
        csCtrl.asyncInc();
      },

      skip: 2,
      wait: 10,
      verify: (states) => {
        expect(states[0]).toEqual("loading...");
        expect(states[1]).toEqual("1");
      },
    });
  });
});
```
