# Ajwah
Rx based store library for React, Vue, Angular, Preact. Manage your application's states, effects, and actions easy way. It's easy to use in functional components with React hooks.


### Installation

```sh
>> npm i ajwah-angular-store
>> npm i ajwah-devtools
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

`Note: Please remember the starts with 'on' and 'effect'. This is by default. You may change whatever you want into the 'createStore'` 

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
## State example:

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

Counter exaple:

### `actionTypes.ts`

```js
export const INCREMENT = 'Inc'
export const DECREMENT = 'Dec'
export const ASYNC_INCREMENT = 'AsyncInc'

```

### `counterState.ts`

```js
import { State, Action, Effect, Actions, ofType } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actionTypes';
import { updateObject } from '../util';
import {debounceTime, mapTo} from 'rxjs/operators';

@State({
    name: 'counter',
    initialState: { count: 0, msg: '' }
})
export class CounterState {

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
    asyncInc$=this.action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(450),
            mapTo({ type: INCREMENT })
        )
    
    constructor(private action$:Actions){}

}


```
### `counterComponent.ts`

```js
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {Select, Store} from 'ajwah-angular-store';
import {Observable} from 'rxjs';
import {INCREMENT, DECREMENT,ASYNC_INCREMENT} from './actionTypes';


@Component({
  selector: 'counter',
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`<p *ngIf="counter$|async as counter">
  <button (click)="inc()">+</button>
  <button (click)="dec()">-</button>
  <button (click)="asyncInc()">async(+)</button>
  {{counter.msg||counter.count}}
</p>`
})
export class CounterComponent {
 
  @Select('counter')counter$:Observable<any>;

  constructor(public store:Store){ }
  
  inc(){
    this.store.dispatch(INCREMENT);
  }
  dec(){
    this.store.dispatch(DECREMENT);
  }
  asyncInc(){
    this.store.dispatch(ASYNC_INCREMENT);
  }
  
}

```



###  `app.module`

```js
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import {AjwahStoreModule} from 'ajwah-angular-store';
import { devTools } from 'ajwah-devtools';

import {CounterState} from './counterState';
import {CounterComponent} from './counter.component';


@NgModule({
  imports:      [ 
    BrowserModule, FormsModule, 
    
     AjwahStoreModule.forRoot({
      rootStates: [CounterState],
      devTools: devTools()
    })

  ],
  declarations: [ AppComponent, CounterComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

```

[Counter App - Live](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2FcounterState.ts)

### Effects

There are several of ways to add effects in Ajwah. You can add effects in your state class that has been shown above in `counterState`. Also you can define separate effect classes and set them into `add.module` like bellow:

```js
AjwahStoreModule.forRoot({
    rootStates: [CounterState, SearchState],
    rootEffects: [SearchEffects]
})

```


[Dynamic states and effects - Live](https://stackblitz.com/edit/angular-ajwah-dynamicstates?file=src%2Fapp%2Fapp.component.ts)

### Here is the `TodoList` app consuming `JSONPlaceholder Rest API`
In this app all the todo effects has been defined into the `todoState` class. Its your choice whether you make a separete effects class like `todoEffects` 

[TodoList app - Live](https://stackblitz.com/edit/angular-ajwah-todolist?file=src/app/app.component.ts)

## For feature modules use `AjwahStoreModule.forFeature(...)`
Example:

```js
 AjwahStoreModule.forFeature({
            featureStates: [TutorialState],
            featureEffects: [TutorialEffects]
        })

```