# Ajwah
Rx based store library for Angular. Manage your application's states, effects, and actions easy way.


### Installation

```sh
>> npm install ajwah-angular-store

```

### Let's start with hello world `counterState`

```js
import { State, Action, Effect, Actions } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { updateObject } from './util';
import {debounceTime, mapTo} from 'rxjs/operators';

@State({
    name: 'counter',
    initialState: { count: 5, msg: '' }
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
    asyncIncEffect=this.action$.ofType(ASYNC_INCREMENT).pipe(
      debounceTime(1000),
      mapTo({type:INCREMENT})
    )

    constructor(public action$:Actions){}
}



```

### `Counter` component

```js
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {Store} from 'ajwah-angular-store';
import {Observable} from 'rxjs';
import {INCREMENT, DECREMENT,ASYNC_INCREMENT} from './actions';


@Component({
  selector: 'counter',
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`<p *ngIf="counter$|async as counter">
  <button (click)="inc()">+</button>
  <button (click)="dec()">-</button>
  <button (click)="async_inc()">async(+)</button>
  {{counter.msg||counter.count}}
</p>`
})
export class CounterComponent implements OnInit  {
 
  counter$:Observable<any>;
  constructor(public store:Store){ }
  
  ngOnInit(){
    this.counter$=this.store.select('counter');
  }
  
  inc(){
    this.store.dispatch({type:INCREMENT});
  }
  dec(){
    this.store.dispatch({type:DECREMENT});
  }
  async_inc(){
    this.store.dispatch({type:ASYNC_INCREMENT});
  }
}


```

### and our `app.module`

```js
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import {AjwahStoreModule} from 'ajwah-angular-store';
import {CounterState} from './counterState';
import {CounterComponent} from './counter.component';

@NgModule({
  imports:      [ 
    BrowserModule, FormsModule, 
    AjwahStoreModule.forRoot({rootStates:[CounterState]}) 
  ],
  declarations: [ AppComponent, CounterComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

```

[Counter Demo App](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2FcounterState.ts)

In Ajwah you can dynamically add/remove your states/effects.

```js

import { Component } from '@angular/core';
import { Store } from 'ajwah-angular-store';
import {TutorialState} from './states.effects/tutorial.state';
import {DynamicEffects} from './states.effects/dynamic.effects';
import {DYNAMIC_EFFECTS_KEY} from './actions';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  constructor(public store:Store){}

  addEffect() {
    this.store.addEffects(DynamicEffects);
  }
  removeEffect() {
    this.store.removeEffectsByKey(DYNAMIC_EFFECTS_KEY);
  }
  addState() {
    this.store.addStates(TutorialState);
  }
  removeState() {
    this.store.removeState('tutorial')
  }
  
}

```

[Demo dynamic states and effects](https://stackblitz.com/edit/angular-ajwah-dynamicstates?file=src%2Fapp%2Fapp.component.ts)