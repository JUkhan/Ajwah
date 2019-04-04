# Ajwah
Rx based store library for React, Preact. Manage your application's states, effects, and actions easy way. Easy to use in functional components with React hooks.


### Installation

```sh
>> npm install ajwah-react-store
>> npm install ajwah-devtools
```


### For typescript
```sh
>> npx create-react-app my-app --scripts-version=react-scripts-ts
```

### For javascript
Ajwah based on decorators - this is the way enable decorators in create-react-app:

```sh
>> npx create-react-app my-app
>> cd my-app
>> npm run eject
>> npm install --save-dev @babel/plugin-proposal-decorators

```
#### add the following Babel configuration to your `package.json`

```js
"babel": {
    "plugins": [
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ]
    ],
    .......
  },

```
```sh
>> npm install rxjs
>> npm install ajwah-react-store
>> npm install ajwah-devtools //optional
>> npm start
```

### Let's start with hello world `counterState`

### `counterState`

```js
import { State, Action, Effect, ofType,IAction, ActionsObservable } from 'ajwah-react-store';
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
    asyncIncrementEffect(action$: ActionsObservable<IAction>) {
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )

    }
}

export default CounterState;


```
### `CounterComponent`
```js

import React, { PureComponent } from 'react';
import { Connect, StoreContext } from 'ajwah-react-store';
import { INCREMENT, ASYNC_INCREMENT, DECREMENT } from './actions';

@Connect({
    counter: state => state.counter
})
class CounterComponent extends PureComponent {

    store:StoreContext;

    inc = () => {
        this.store.dispatch({ type: INCREMENT })
    }
    dec = () => {
        this.store.dispatch({ type: DECREMENT })
    }
    asyncInc = () => {
        this.store.dispatch({ type: ASYNC_INCREMENT })
    }
    render() {
        const { counter } = this.state;
        console.log(counter)
        return <div>
            <button onClick={this.inc}>+</button>
            <button onClick={this.dec}>-</button>
            <button onClick={this.asyncInc}>async(+)</button>
            <span>{counter.msg || counter.count}</span>
        </div>
    }
}

export default CounterComponent;

```
### `Connect decorator` takes a single object literal type param (key value pairs). Key should be any name and value should be a function that must return a part of your application's states. You can define as many pairs as you want. All keys and its corresponding states should be available as component state. Your component should be re-render if any key corresponding state is updated from anywhere in the application. And your component should have a `StoreContext` property as the name of `store`.

### Here is the `StoreContext API`
```js
class StoreContext {
    dispatch(action: IAction): StoreContext;
    addStates(...stateClassTypes: any[]): StoreContext;
    removeStates(...stateNames: string[]): StoreContext;
    removeEffectsByKey(key: string): StoreContext;
    importState(state: any): StoreContext;
    select<T=any>(pathOrMapFn: ((state: T) => any) | string, ): Observable<any>;
    addEffect<T extends ActionsObservable<IAction>>(callback: (action$: ActionsObservable<IAction>, store$?: StoreContext) => Observable<IAction>, key?: string): StoreContext;
    addEffects(...effectClassTypes: any[]): StoreContext;
    dispose(): void;
}
```

### And finally call the `setStoreContext` function into the `index` file like bellow:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { setStoreContext } from 'ajwah-react-store';

import CounterState from './CounterState';
import Counter from './CounterComponent';
import { devTools } from 'ajwah-devtools';


setStoreContext({
    states: [CounterState],
    devTools: devTools()
});

ReactDOM.render(<Counter />, document.getElementById('root'));

```

[Counter App - Live](https://stackblitz.com/edit/ajwah-react1?file=index.tsx)


### Here is the same `counterComponent` using HOOKS:

```js
import React, { useState, useEffect } from 'react'
import { getStore} from 'ajwah-react-store'
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';


function fxCounterComponent(props) {
    const store = getStore();
    const [counter, setState] = useState({});

    useEffect(() => {
        const subs = getStore().select('counter').subscribe(res => setState(res));
        return () => subs.unsubscribe();
    }, []);

    return (
        <div>
            <button onClick={() => store.dispatch({ type: INCREMENT })}>+</button>
            <button onClick={() => store.dispatch({ type: DECREMENT })}>-</button>
            <button onClick={() => store.dispatch({ type: ASYNC_INCREMENT })}>async(+)</button>
            {counter.msg || counter.count}
        </div>
    );

}

export default fxCounterComponent;

```
### Hi, what you thinking about `Ajwah` its cool or hot &hearts;

### Effects

There are several of ways to add effects in Ajwah. You can add effects in your state class that has been shown above in `counterState`. Also you can define separate effect classes and set them into `setStoreContext` function like bellow:

```js
setStoreContext({
    states: [CounterState, SearchState],
    effects: [SearchEffects]
});

```
### `searchState`
```js

import {State, Action} from 'ajwah-react-store';
import {SEARCH_KEYSTROKE, SEARCH_RESULT} from './actions';
import {updateObject} from './util';

@State({
  name:'search',
  initialState:{loading:false, error:'',res:[]}
})
class SearchState{

  @Action(SEARCH_KEYSTROKE)
  searchStart(state){
   return updateObject(state, {loading:true})
  }

  @Action(SEARCH_RESULT)
  searchResult(state, {payload}){
   return updateObject(state, {loading:false, res:payload})
  }
  
}
export default SearchState;
```

### `searchEffects`
```js

import { Effect, Actions, ofType } from 'ajwah-react-store';
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


class SearchEffects {

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
export default SearchEffects;
```


### In Ajwah you can dynamically add/remove your states/effects.

```js
function addEffect() {
    getStore().addEffects(CounterEffect);
}
function removeEffect() {
    getStore().removeEffectsByKey(DYNAMIC_EFFECTS_KEY);
}
function addState() {
    getStore().addStates(TutorialState);
}
function removeState() {
    getStore().removeStates('tutorials')
}
```
### [Dynamic states and effects - Live](https://stackblitz.com/edit/ajwah-effect?file=Effects.ts)


### Here is the `Todo List` app consuming `JSONPlaceholder Rest API`
In this app all the todo effects has been defined into the `todoState` class. Its your choice whether you make a separete effects class like `todoEffects` 

[TodoList app - Live](https://stackblitz.com/edit/ajwah-state-manage?file=pages%2Fpage2.tsx)

### todoPage
```js
import React, { useState, useEffect } from 'react';
import Todos from "../components/Todos";
import AddTodo from "../components/AddTodo";
import { getStore } from 'ajwah-react-store';
import { LOAD_TODOS } from '../states/actions'

function todoPage() {
    const store = getStore();
    const [todo, setTodo] = useState({});

    useEffect(() => {
        const subscription = store.select('todo').subscribe(res => setTodo(res));
        store.dispatch({ type: LOAD_TODOS });
        return () => subscription.unsubscribe();
    }, []);


    return <div>
        <header className="header">Todo List <b>{todo.message}</b></header>
        <AddTodo />
        <Todos todos={todo.data} />
    </div>


}

export default todoPage;


```
### todoState
```js

import { State, Action, Effect, ofType } from 'ajwah-react-store';
import { TODOS_DATA, ADD_TODO, UPDATE_TODO, REMOVE_TODO, LOAD_TODOS } from './actions';
import { updateObject } from '../utli';
import { map, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ajax } from "rxjs/ajax";
import { of } from 'rxjs'


@State({
    name: 'todo',
    initialState: { message: '', data: [] }
})
class TodoState {

    @Action(TODOS_DATA)
    todosData(state, { payload }) {
        return updateObject(state, payload)
    }

    @Action(LOAD_TODOS)
    loadTodos(state) {
        return updateObject(state, { message: ' - loading todos....', data: [] })
    }

    @Effect()
    dataLoadingEffect(action$) {
        return action$.pipe(
            ofType(LOAD_TODOS),
            mergeMap(() => ajax
                .get('https://jsonplaceholder.typicode.com/todos?_limit=5')
                .pipe(
                    map(data => {
                        return { type: TODOS_DATA, payload: { message: '', data: data.response } };
                    })
                )),
        );
    }

    @Action(ADD_TODO)
    addTodo(state) {
        return updateObject(state, { message: ' - Adding a new todo...' })
    }

    @Effect()
    addTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(ADD_TODO),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.post('https://jsonplaceholder.typicode.com/todos', action.payload)
                .pipe(
                    map(data => data.response),
                    map(newTodo => {
                        newTodo.completed = false;
                        const payload = { message: '', data: [newTodo, ...todo.data] };
                        return { type: TODOS_DATA, payload };
                    })
                )
            )
        )
    }

    @Action(UPDATE_TODO)
    updateTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is updaeing...` })
    }

    @Effect()
    updateTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(UPDATE_TODO),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.put(`https://jsonplaceholder.typicode.com/todos/${action.payload.id}`, action.payload)
                .pipe(
                    map(data => data.response),
                    map(res => {
                        res.completed = res.completed === 'true' ? true : false
                        const index = todo.data.findIndex(item => item.id === action.payload.id);
                        todo.data.splice(index, 1, res);
                        const payload = { message: '', data: [...todo.data] }
                        return { type: TODOS_DATA, payload }
                    }),
                    catchError(err => of({ type: TODOS_DATA, payload: { message: err.message } }))
                )
            )
        )
    }

    @Action(REMOVE_TODO)
    removeTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is removing...` })
    }

    @Effect()
    removeTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(REMOVE_TODO),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.delete(`https://jsonplaceholder.typicode.com/todos/${action.payload.id}`)
                .pipe(
                    map(data => data.response),
                    map(res => {
                        const payload = { message: '', data: todo.data.filter(item => item.id !== action.payload.id) }
                        return { type: TODOS_DATA, payload }
                    })
                )
            )
        )
    }

}
export default TodoState;
```
### addTodoComponent
```js
import React from 'react';
import { getStore } from "ajwah-react-store";
import { ADD_TODO } from '../states/actions'

function addItem(e) {
  e.preventDefault();
  const newTodo = {
    title: e.target.elements.title.value,
    completed: false
  }
  getStore().dispatch({ type: ADD_TODO, payload: newTodo });
  e.target.elements.title.value = '';
}

function addTodo(props) {
  return <div>
    <form onSubmit={addItem}>
      <input type="text" name="title" placeholder="Add Todo..." />
      <input type="submit" value="Submit" className="btn" />
    </form>
  </div>

}
export default addTodo;


```
### todosComponent
```js
import React from 'react';
import TodoItem from './TodoItem'

function todos(props) {
  const { todos = [] } = props;
  return <div>
    {todos.map(todo => <TodoItem key={todo.title + todo.id} todo={todo} />)}
  </div>
}

export default todos;
```
### todoItemComponent
```js
import React from 'react';
import { getStore } from "ajwah-react-store";
import { REMOVE_TODO, UPDATE_TODO } from '../states/actions'

function updateTodo(todo, e) {
  todo.completed = e.target.checked;
  getStore().dispatch({ type: UPDATE_TODO, payload: todo })
}

function removeTodo(todo) {
  getStore().dispatch({ type: REMOVE_TODO, payload: todo })
}

function todoItem(props) {
  const { todo } = props;
  return <div className={`todo-item ${todo.completed || 'is-complete'}`} >
    <p>
      <input checked={todo.completed} type="checkbox" onChange={(e) => updateTodo(todo, e)} />
      <span className="item-text">{todo.title}</span>
      <button onClick={() => removeTodo(todo)} className="del">x</button>
    </p>
  </div>
}

export default todoItem;
```