# Ajwah
Rx based store library for React, Vue, Angular, Preact. Manage your application's states, effects, and actions easy way. It's easy to use in functional components with React hooks.


### Installation

```sh
>> npm install ajwah-angular-store
>> npm install ajwah-devtools
```

### Let's start with the hello world `counterState`

### `counterState.ts`

```js
import { State, Action, Effect, ofType, Actions } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { updateObject } from './util';
import { mapTo, debounceTime } from "rxjs/operators";

@State({
    name: 'counter',
    initialState: { count: 5, msg: '' }
})
class CounterState {

    @Action(INCREMENT)
    increment(state, action) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    @Action(DECREMENT)
    decrement(state, action) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    @Action(ASYNC_INCREMENT)
    asyncIncrement(state, action) {
        return updateObject(state, { msg: 'loading...' })
    }

    @Effect()
    async$=this.action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        );

    
    constructor(private action$:Actions){}
}
export default CounterState;
```
## counterComponent.ts
```js
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from '../../store/actions';
import { Store,Select } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';


@Component({
    selector: 'counter',
    template: `
    <p *ngIf="counter$|async as counter">
        <button class="btn" (click)="inc()">+</button>
        <button class="btn" (click)="dec()">-</button>
        <button class="btn" (click)="asyncInc()">async(+)</button>
        {{counter.msg||counter.count}}
    </p>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Counter {

    @Select('counter') counter$

    constructor(private store: Store) {
    }

    inc() {
        this.store.dispatch({ type: INCREMENT });
    }
    dec() {
        this.store.dispatch({ type: DECREMENT });
    }
    asyncInc() {
        this.store.dispatch({ type: ASYNC_INCREMENT });
    }

}

```
## Now add `AjwahStoreModule` into the  app.module.ts
```js
AjwahStoreModule.forRoot({
    rootStates: [CounterState];
    //rootEffects?: Type<any>[];
    //devTools?: any;
})
//AjwahStoreModule.forFeature(...) //for feature module
```

[Counter App - Live](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2FcounterState.ts)


[React Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/react#ajwah)

[Vue Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/vue#ajwah)

[Angular Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/angular#ajwah)