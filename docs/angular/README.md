# Ajwah
Rx based store library for Angular. Manage your application's states, effects, and actions easy way.


### Installation

```sh
>> npm i ajwah-angular-store
>> npm i ajwah-devtools
```

### Let's start with hello world `counterState`

```js
import { State, Action, Effect, Actions, ofType } from 'ajwah-angular-store';
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
    asyncInc(action$: Actions) {
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )
    }

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
    
     AjwahStoreModule.bootstrap({
      states: [CounterState],
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
AjwahStoreModule.bootstrap({
    states: [CounterState, SearchState],
    effects: [SearchEffects]
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

import { Effect, Actions, ofType } from 'ajwah-angular-store';
import {
    debounceTime,
    switchMap,
    distinctUntilChanged,
    map, catchError,
    tap
} from 'rxjs/operators';
import { SEARCH_KEYSTROKE, SEARCH_RESULT } from './actions';
import { ajax } from 'rxjs/ajax';
import { EMPTY } from 'rxjs';


export class SearchEffects {

    @Effect()
    search(action$: Actions) {
        return action$.pipe(
            ofType(SEARCH_KEYSTROKE),
            debounceTime(700),
            distinctUntilChanged(),
            switchMap(action => {
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

### In Ajwah you can dynamically add/remove your states/effects.

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


[Dynamic states and effects - Live](https://stackblitz.com/edit/angular-ajwah-dynamicstates?file=src%2Fapp%2Fapp.component.ts)

### Here is the `Todo List` app consuming `JSONPlaceholder Rest API`
In this app all the todo effects has been defined into the `todoState` class. Its your choice whether you make a separete effects class like `todoEffects` 

[TodoList app - Live](https://stackblitz.com/edit/angular-ajwah-todolist?file=src/app/app.component.ts)

### todoService.ts
```js
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TodoService {
    constructor(private http: HttpClient) { }
    baseUrl = 'https://jsonplaceholder.typicode.com/todos';

    getTodos(limit: number = 5) {
        return this.http.get(this.baseUrl + `?_limit=${limit}`);
    }

    addTodo(todo: any) {
        return this.http.post(this.baseUrl, todo);
    }

    updateTodo(todo: any) {
        return this.http.put(this.baseUrl + `/${todo.id}`, todo);
    }

    deleteTodo(id) {
        return this.http.delete(this.baseUrl + `/${id}`);
    }

}
```

### todoState.ts
```js

import { State, Action, Effect, ofType, Actions, Store } from 'ajwah-angular-store';
import { TODOS_DATA, ADD_TODO, UPDATE_TODO, REMOVE_TODO, LOAD_TODOS } from './actions';
import { updateObject } from './util';
import { map, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { of } from 'rxjs'
import { TodoService } from '../services/todoService';


@State({
    name: 'todo',
    initialState: { message: '', data: [] }
})
export class TodoState {

    constructor(private todoService: TodoService) { }

    @Action(TODOS_DATA)
    todosData(state, { payload }) {
        return updateObject(state, payload)
    }

    @Action(LOAD_TODOS)
    loadTodos(state) {
        return updateObject(state, { message: ' - loading todos....', data: [] })
    }

    @Effect()
    dataLoadingEffect(actions: Actions) {
        return actions.pipe(
            ofType(LOAD_TODOS),
            mergeMap(() => this.todoService.getTodos()
                .pipe(
                    map(data => ({ type: TODOS_DATA, payload: { message: '', data } }))
                )),
        );
    }


    @Action(ADD_TODO)
    addTodo(state) {
        return updateObject(state, { message: ' - Adding a new todo...' })
    }

    @Effect()
    addTodoEffect(actions: Actions, store: Store) {
        return actions.pipe(
            ofType(ADD_TODO),
            withLatestFrom(store.select('todo')),
            mergeMap(([action, todo]) => this.todoService.addTodo(action.payload)
                .pipe(
                    map((newTodo: any) => {
                        newTodo.completed = false;
                        const payload = { message: '', data: [newTodo, ...todo.data] };
                        return { type: TODOS_DATA, payload };
                    })
                )
            )
        );
    }


    @Action(UPDATE_TODO)
    updateTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is updaeing...` })
    }

    @Effect()
    updateTodoEffect(actions: Actions, store: Store) {
        return actions.pipe(
            ofType(UPDATE_TODO),
            withLatestFrom(store.select('todo')),
            mergeMap(([action, todo]) => this.todoService.updateTodo(action.payload)
                .pipe(
                    map((res: any) => {
                        const index = todo.data.findIndex(item => item.id === action.payload.id);
                        todo.data.splice(index, 1, res);
                        const payload = { message: '', data: [...todo.data] }
                        return { type: TODOS_DATA, payload }
                    }),
                    catchError(err => of({ type: TODOS_DATA, payload: { message: err.message } }))
                )
            )
        );
    }


    @Action(REMOVE_TODO)
    removeTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is removing...` })
    }

    @Effect()
    removeTodoEffect(actions: Actions, store: Store) {
        return actions.pipe(
            ofType(REMOVE_TODO),
            withLatestFrom(store.select('todo')),
            mergeMap(([action, todo]) => this.todoService.deleteTodo(action.payload.id)
                .pipe(
                    map(res => {
                        const payload = { message: '', data: todo.data.filter(item => item.id !== action.payload.id) }
                        return { type: TODOS_DATA, payload }
                    })
                )
            )
        );
    }


}

```
### addTodo.ts
```js
import { ADD_TODO } from '../store/actions';
import { Store } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'addTodo',
    template: `
    <form (submit)="addTodo($event)">
        <input type="text" [(ngModel)]="title" name="title" placeholder="Add Todo..." />
        <input type="submit" value="Submit" class="btn" />
    </form>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTodoComponent {
    title: string;
    constructor(public store: Store) {

    }

    addTodo(e) {
        e.preventDefault();
        const newTodo = {
            title: this.title,
            completed: false
        }
        this.store.dispatch({ type: ADD_TODO, payload: newTodo });
        this.title = '';
    }
}
```
### todoItem.ts
```js
import { Store } from 'ajwah-angular-store';
import { REMOVE_TODO, UPDATE_TODO } from '../store/actions';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'todoItem',
    template: `
    <div class="todo-item" [ngClass]="{'is-complete':todo.completed}" >
    <p>
      <input [checked]="todo.completed" type="checkbox" (change)="updateTodo($event)" />
      <span class="item-text">{{todo.title}}</span>
      <button (click)="removeTodo()" class="del">x</button>
    </p>
  </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
    title: string;
    @Input() todo: any;
    constructor(public store: Store) {

    }

    updateTodo(e) {
        this.todo.completed = e.target.checked;
        this.store.dispatch({ type: UPDATE_TODO, payload: this.todo })
    }

    removeTodo() {
        this.store.dispatch({ type: REMOVE_TODO, payload: this.todo })
    }
}
```
### todos.ts
```js
import { Store } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'todos',
    template: `
    <div>
        <todoItem *ngFor="let todo of todos" [todo]="todo" ></todoItem>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosComponent {
    @Input() todos: any[];
    constructor(public store: Store) {
    }
}
```
