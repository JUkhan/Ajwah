## ajwah-test

```sh
>> npm i ajwah-test

```

testing counterState

```ts
import { ajwahTest } from "ajwah-test";
import { StateController } from "ajwah-store";

export class CounterState extends StateController<number> {
  constructor() {
    super({initialState:2});
  }
  increment() {
    this.update((state) => state + 1);
  }
  decrement() {
    this.update((state) => state - 1);
  }
}

describe("counterState", () => {
  let cs: CounterState;

  beforeEach(() => {
    cs = new CounterState();
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
});
```
