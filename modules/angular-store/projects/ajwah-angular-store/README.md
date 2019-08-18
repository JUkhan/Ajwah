# Ajwah
Rx based state managements library for React, Vue, Angular, Preact, Flutter. Manage your application's states, effects, and actions easy way.


### Installation

```sh
>> npm install ajwah-angular-store
>> npm install ajwah-devtools
```
In Ajwah there are two different coding styles
* Coding by Decorators
* Coding by Convention

Here are the samples of all the decorators and it's corresponding coding by convention

### `@Action()`
```js
    @Action('Inc')
    increment(state, action){
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    // Convention: function name starts with `on` followed by  action name - [on][actionName](...){...}

    onInc(state, action){
        return updateObject(state, { count: state.count + 1, msg: '' })
    }
```

### `@Effect()`
```js
    @Effect()
    asyncIncrement(action$:Actions){
        return action$:pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    @Effect() asyncIncrement$=this.action$:pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        );

    // Convention: function name starts with `effect` followed by anything - [effect][any](...){...}

    effectAsyncInc(action$:Actions, store$:Store){
        return action$:pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }
    //@Effect(...) decoretor: you may pass `dispatch:flase` -  by default it's true. if you pass `false`, you effect should be disabled.

    @Effect({dispatch:flase})
    asyncIncrement(action$:Actions, store$:Store){
        return action$:pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    //Convention: for `dispatch:false` - just function name ends with `_ndispatch`

    effectAsyncInc_ndispatch(action$:Actions, store$:Store){
        return action$:pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    // you may use `For` for getting rid of `ofType('...')` - [effect][For][actionName](...){...}. 
    // Use 'Or' for multiple actions name. ex: effectForAsyncIncOrDec(...) 
    // - [effect][For][actionName][Or][actionName][Or][actionName][...](){}
    effectForAsyncInc(action$:Actions, store$:Store){
        return action$:pipe(
            //ofType('AsyncInc'), now it's not necessary
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }
    // '_ndispatch' with `For` ex: effectForAsyncInc_ndispatch()
    effectForAsyncInc_ndispatch(action$:Actions, store$:Store){
        return action$:pipe(
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

```
### @State() 
```js
    @State({
        name: 'counter',
        initialState: { count: 5, msg: '' }
    })
    class CounterState{

    }

    //Convention:

    class CounterState{
        
        name= 'counter';
        initialState={ count: 5, msg: '' };
        
    }

```

### @EffectKey() 
```js
    @EffectKey(DYNAMIC_EFFECTS_KEY)
    class DynamicEffect{

    }

    //Convention:

    class DynamicEffect{
        effectKey=DYNAMIC_EFFECTS_KEY;
    }

```

`Note: Please remember the starts with 'on' and 'effect'. This is by default. You may change whatever you want into the 'forRoot'` method.

```js
    AjwahStoreModule.forRoot({
        rootStates: [CounterSate, TodoState],
        rootEffects: [TodoEffects],
        devTools: devTools({ maxAge: 10 }),
        actionsMethodStartsWith: 'myAction', // default 'on'
        effectsMethodStartsWith:'myEffect'  // default 'effect'
    });

    //Now your actions and  effects should be

    myActionInc(state, action){
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    myEffectAsyncInc(action$:Actions, store$:Store){
        return action$:pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

```


### Let's start with the hello world `counterState`

### `counterState.ts` (decorators)

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
### `counterState.ts` (convention) 

```js
import { State, Action, Effect, ofType, Actions } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { updateObject } from './util';
import { mapTo, debounceTime } from "rxjs/operators";

class CounterState {

    name= 'counter',
    initialState= { count: 5, msg: '' }

    onInc(state, action) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    onDec(state, action) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    onAsyncInc(state, action) {
        return updateObject(state, { msg: 'loading...' })
    }
    effectForAsyncInc(action$:Actions){
        return action$.pipe(
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        );
    }

}
export default CounterState;
```
### Also `onXXX(state, action)` or `@Action(XXX)` decorated methods allow to make async operations.

## Example
```js
class CounterState {
    name = 'counter'
    initialState = { count: 12, msg: '' }

    constructor(private store: Store) {

    }
    
    onInc(state) {
        return { count: state.count + 1, msg: '' }
    }
    
    onDec(state) {
        return { count: state.count - 1, msg: '' }
    }
    onLoading(state){
        return { count: state.count , msg: 'loading...' }
    }
    onAsyncInc(state) {
        this.store.dispatch({type:'loading'});
        return this.getData(state.count);
    }

    getData(num) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ count: num+1, msg: '' })
            }, 1000);
        });
    }

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