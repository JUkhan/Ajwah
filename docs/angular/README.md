# Ajwah
Rx based store library for React, Vue, Angular, Preact. Manage your application's states, effects, and actions easy way. It's easy to use in functional components with React hooks.


### Installation

```sh
>> npm i ajwah-angular-store
>> npm i ajwah-devtools
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