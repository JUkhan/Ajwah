## Ajwah Store

A reactive state management library. Manage your application's states, effects, and actions easy way. Make apps more scalable with a unidirectional data-flow.

[Counter](https://stackblitz.com/edit/angular-ajwah-counter?file=src%2Fapp%2Fapp.component.ts) | [Todos](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2Fapp.component.ts)

### Installation

```sh
npm i ajwah-store
```

### Counter State Controller

```ts
import { StateController } from "ajwah-store";

interface CounterState {
  count: number;
  loading?: boolean;
}

export class CounterController extends StateController<CounterState> {
  constructor() {
    super({ count: 0, loading: false });
  }

  increment() {
    this.emit({ count: this.state.count + 1 });
  }

  decrement() {
    this.emit({ count: this.state.count - 1 });
  }

  async asyncInc() {
    this.emit({ loading: true });
    await this.delay(10);
    this.emit({ count: this.state.count + 1, loading: false });
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const controller = new CounterController();
controller.stream$.subscribe(console.log);
controller.increment();
controller.decrement();
controller.asyncInc();
```

### Testing

```ts
import { ajwahTest } from "ajwah-test";
import { CounterController } from "./counterController";

describe("Controller: ", () => {
  let controller: CounterController;
  beforeEach(() => {
    controller = new CounterController();
  });
  afterEach(() => {
    controller.dispose();
  });

  it("initial state", async () => {
    await ajwahTest({
      build: () => controller.stream$,
      verify: (states) => {
        expect(states[0]).toEqual({ count: 0, loading: false });
      },
    });
  });
  it("increment", async () => {
    await ajwahTest({
      build: () => controller.stream$,
      act: () => {
        controller.increment();
      },
      skip: 1,
      verify: (states) => {
        expect(states[0]).toEqual({ count: 1, loading: false });
      },
    });
  });

  it("decrement", async () => {
    await ajwahTest({
      build: () => controller.stream$,
      act: () => {
        controller.decrement();
      },
      skip: 1,
      verify: (states) => {
        expect(states[0]).toEqual({ count: -1, loading: false });
      },
    });
  });

  it("async increment", async () => {
    await ajwahTest({
      build: () => controller.stream$,
      act: () => {
        controller.asyncInc();
      },
      skip: 1,
      wait: 10,
      verify: (states) => {
        expect(states[0]).toEqual({ count: 0, loading: true });
        expect(states[1]).toEqual({ count: 1, loading: false });
      },
    });
  });
  it("select", async () => {
    await ajwahTest({
      build: () => controller.select((state) => state.count),
      act: () => {
        controller.increment();
      },
      skip: 1,
      verify: (states) => {
        expect(states[0]).toEqual(1);
      },
    });
  });
  it("import state", async () => {
    await ajwahTest({
      build: () => controller.stream$,
      act: () => {
        controller.importState({ count: 101, loading: false });
      },
      skip: 1,
      verify: (states) => {
        expect(states[0]).toEqual({ count: 101, loading: false });
      },
    });
  });
  it("action hanler whereType", async () => {
    await ajwahTest({
      build: () => controller.action$.whereType("awesome"),
      act: () => {
        controller.dispatch("awesome");
      },

      verify: (states) => {
        expect(states[0]).toEqual({ type: "awesome" });
      },
    });
  });
  it("action hanler whereTypes", async () => {
    await ajwahTest({
      build: () => controller.action$.whereTypes("awesomeX", "awesome"),
      act: () => {
        controller.dispatch("awesome");
      },

      verify: (states) => {
        expect(states[0]).toEqual({ type: "awesome" });
      },
    });
  });
  it("action hanler where", async () => {
    await ajwahTest({
      build: () =>
        controller.action$.where((action) => action.type === "awesome"),
      act: () => {
        controller.dispatch("awesome");
      },

      verify: (states) => {
        expect(states[0]).toEqual({ type: "awesome" });
      },
    });
  });
  it("dispose", async () => {
    await ajwahTest({
      build: () => controller.stream$,
      act: () => {
        controller.dispose();
        controller.dispatch("inc");
      },

      verify: (states) => {
        expect(states.length).toBe(1);
        expect(states[0]).toEqual({ count: 0, loading: false });
      },
    });
  });
});
```
