## Ajwah Store

A reactive state management library. Manage your application's states, effects, and actions easy way. Make apps more scalable with a unidirectional data-flow.

counter : [Angular Demo](https://stackblitz.com/edit/angular-ajwah-counter?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ajwah-counter?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-counter?file=src%2FApp.vue)

todos : [Angular Demo](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ts-cb9zfa?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-store?file=src%2FApp.vue)

ecommerce :  [Angular Demo](https://stackblitz.com/edit/angular-ivy-ecom?file=src/app/app.component.ts) | [React Demo](https://stackblitz.com/edit/react-ts-ecom?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ecom?file=src/App.vue)

### Installation

```sh
npm i ajwah-store
```

Define a state controller class

```ts
import { StateController, dispatch } from "ajwah-store";

interface CounterState{
  count:number,
  loading?:boolean
}

export class CounterController extends StateController<CounterState> {
  
  constructor() {
    super('counter', {count:0, loading:false});
  }

  increment() {
    this.emit({count:this.state.count + 1});
  }

  decrement() {
    this.emit({count:this.state.count - 1});
  }

  async asyncInc(){
    this.emit({loading:true});
    await this.delay(1000);
    this.emit({count:this.state.count + 1, loading:false});
  }

  incrementNext(state: number, action:Action){
     this.emit({count:state.count+100});
  }

  delay(ms:number){
    return new Promise(resolve=>setTimeout(resolve, ms))
  }
}

const controller = new CounterController();
controller.stream$.subscribe(console.log);
controller.increment();
controller.decrement();
controller.asyncInc();
dispatch('incrementNext');
```



Testing `CounterController`

```ts
import { ajwahTest } from "ajwah-test";
import { CounterController } from "./counterController";

describe("counterState", () => {
  let controller: CounterController;

  beforeEach(() => {
    controller = new CounterController();
  });

  afterEach(()=>{
        controller.dispose();
  });

  it("initial state", async () => {
    await ajwahTest({
      build: () => controller.stream$,
      verify: (states) => {
        expect(states[0]).toMatchObject({count:0, loading:false})
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
        expect(states[0]).toMatchObject({count:1, loading:false})
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
        expect(states[0]).toMatchObject({count:0, loading:false})
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
      wait: 1000,
      verify: (states) => {
        expect(states[0]).toMatchObject({count:0, loading:true})
        expect(states[1]).toMatchObject({count:1, loading:false})
      },
    });
  });
});
```
