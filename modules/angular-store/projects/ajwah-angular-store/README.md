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

### Effects

There are several of ways to add effects in Ajwah. You can add effects in your state class that has been shown above in `counterState`. Also you can define separate effect classes and set them into `add.module` like bellow:

```js
AjwahStoreModule.forRoot({
      rootStates: [CounterState, SearchState],
      rootEffects: [SearchEffects]
    })

```

### `SearchState.ts`
```js

import { State, Action } from 'ajwah-angular-store';
import { SEARCH_KEYSTROKE, SEARCH_RESULT } from './actions';
import { updateObject } from './util';

@State({
    name: 'search',
    initialState: { loading: false, error: '', res: [] }
})
export class SearchState {

    @Action(SEARCH_KEYSTROKE)
    searchStart(state) {
        return updateObject(state, { loading: true })
    }

    @Action(SEARCH_RESULT)
    searchResult(state, { payload }) {
        return updateObject(state, { loading: false, res: payload })
    }

}

```
### `SearchEffects.ts`
```js

import { Effect, Actions, IAction } from 'ajwah-angular-store';
import {
    debounceTime,
    switchMap,
    distinctUntilChanged,
    map, catchError,
    tap
} from 'rxjs/operators';
import { SEARCH_KEYSTROKE, SEARCH_RESULT } from './actions';
import { ajax } from 'rxjs/ajax';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';

@Injectable()
export class SearchEffects {

    constructor(public action$: Actions) { }

    @Effect()
    search() {
        return this.action$.ofType(SEARCH_KEYSTROKE)
            .pipe(
                debounceTime(700),
                distinctUntilChanged(),
                switchMap((action: IAction) => {
                    return ajax.getJSON(`https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${action.payload}&limit=5`).pipe(
                        tap(res => console.log(res)),
                        map(data => ({ type: SEARCH_RESULT, payload: data[1] })),
                        catchError(err => EMPTY)
                    )
                })
            )
    }
}


```
### `SearchComponent.ts`
```js
import { SEARCH_KEYSTROKE } from './actions';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from 'ajwah-angular-store';
import { Observable } from 'rxjs';

@Component({
    selector: 'search',
    template: `<div *ngIf="search$ | async as search">
  <input (input)="inputHandler($event)" type="text" placeholder="wiki search...">
    <b>{{search.loading ? 'loading...':''}}</b>
    <div *ngFor="let data of search.res">{{data}}</div>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {

    search$: Observable<any>;

    constructor(public store: Store) {
        this.search$ = this.store.select('search');
    }

    inputHandler(event) {
        this.store.dispatch({ type: SEARCH_KEYSTROKE, payload: event.target.value });
    }

}

```

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