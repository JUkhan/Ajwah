# Ajwah
Rx based store library for React, Vue, Angular, Preact. Manage your application's states, effects, and actions easy way. It's easy to use in functional components with React hooks.


### Installation

```sh
>> npm install ajwah-store
>> npm install react-ajwah
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

    // Convention: function name starts with `action` followed by  action name - [action][actionName](...){...}

    actionInc(state, action){
        return updateObject(state, { count: state.count + 1, msg: '' })
    }
```

### `@Effect()`
```js
    @Effect()
    asyncIncrement(action$:Actions, store$:Store){
        return action$:pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

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
### @Connect() - from react-ajwah
```js
    @Connect({
        counter: state => state.counter
    })
    class CounterComponent extends PureComponent {


    }

    //Convention:

    class CounterComponent extends PureComponent {
        constructor(){
            //do not forget to pass the second param
            Connect({counter: state => state.counter}, this);
        }
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

`Note: Please remember the starts with 'action' and 'effect'. This is by default. You may change whatever you want into the 'bootstrap'` 

```js
    bootstrap({
        states: [CounterSate, TodoState],
        effects: [TodoEffects],
        devTools: devTools({ maxAge: 10 }),
        actionsMethodStartsWith: 'myAction', // default 'action'
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

### To enable decorators in create-react-app javascript(if you are interested to use decoretors)

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
>> npm install ajwah-store
>> npm install ajwah-devtools //optional
>> npm start
```

### Let's start with the hello world `counterState`

### `counterState using decoretors`

```js
import { State, Action, Effect, ofType, Actions } from 'ajwah-store';
import { Inc, Dec, AsyncInc } from './actions';
import { updateObject } from './util';
import { mapTo, debounceTime } from "rxjs/operators";

@State({
    name: 'counter',
    initialState: { count: 5, msg: '' }
})
class CounterState {

    @Action(Inc)
    increment(state, action) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    @Action(Dec)
    decrement(state, action) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    @Action(AsyncInc)
    asyncIncrement(state, action) {
        return updateObject(state, { msg: 'loading...' })
    }

    @Effect()
    ofAsyncInc(action$: Actions) {
        return action$.pipe(
            ofType(AsyncInc),
            debounceTime(1000),
            mapTo({ type: Inc })
        )

    }
}

export default CounterState;
```
### `counterState using convention`
```js
import { Actions } from 'ajwah-store';
import { updateObject } from "../utli";
import { debounceTime, mapTo } from 'rxjs/operators';
import { Inc } from "./actions";

class CounterSate {

    name = 'counter'
    initialState = { count: 10, msg: '' }


    actionInc(state) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    actionDec(state) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    actionAsyncInc(state) {
        return updateObject(state, { msg: 'loading...' })
    }

    effectForAsyncInc(action$:Actions) {
        return action$:pipe(
            debounceTime(450),
            mapTo({ type: Inc })
        )
    }
}
export default CounterSate;

```
`You can choose any style you like or any combination - ajwah support both together`

### `CounterComponent`
```js

import React, { PureComponent } from 'react';
import { Connect, Store } from 'ajwah-store';
import { Inc, AsyncInc, Dec } from './actions';

@Connect({
    counter: state => state.counter
})
class CounterComponent extends PureComponent {

    store$:Store;

    inc = () => {
        this.store.dispatch({ type: Inc })
    }
    dec = () => {
        this.store.dispatch({ type: Dec })
    }
    asyncInc = () => {
        this.store.dispatch({ type: AsyncInc })
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
### `Connect decorator` takes a single object literal type param (key value pairs). Key should be any name and value should be a function that must return a part of your application's states. You can define as many pairs as you want. All keys and its corresponding states should be available as component state. Your component should be re-render if any key corresponding state is updated from anywhere in the application. And your component should have a `Store` reference by a property named `store`. You can find as this.store inside your component.

### Here is the `Store API`
```js
export declare class Store<S = any> {
    dispatch(actionName: IAction): Store;
    dispatch(actionName: string): Store;
    dispatch(actionName: string, payload?: any): Store;
    addState(stateClassType: any): Store;
    removeState(stateName: string): Store;
    removeEffectsByKey(key: string): Store;
    importState(state: any): Store;
    exportState(): Observable<[IAction, S]>;
    select<R = any>(pathOrMapFn: ((state: S) => any) | string, ): Observable<R>;
    addEffect<T extends Actions<IAction>>(callback: (action$: Actions<IAction>, store$?: Store) => Observable<IAction>, key?: string): Store;
    addEffects(effectClassType: any): Store;
    dispose(): void;
}
```

### And finally call the `bootstrap` function into the `index` file like bellow:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { bootstrap } from 'ajwah-store';

import CounterState from './CounterState';
import Counter from './CounterComponent';
import { devTools } from 'ajwah-devtools';


bootstrap({
    states: [CounterState],
    devTools: devTools()
});

ReactDOM.render(<Counter />, document.getElementById('root'));

```

[Counter App - Live](https://stackblitz.com/edit/ajwah-react1?file=index.tsx)


### Here is the same `counterComponent` using HOOKS:

```js
import React from 'react'
import { dispatch} from 'ajwah-store'
import {useSubscriptions} from 'react-ajwah';
import { Inc, Dec, AsyncInc } from './actions';


function fxCounterComponent(props) {
    
    const {counter} = useSubscriptions(['counter'])

    return (
        <div>
            <button onClick={() => dispatch(Inc)}>+</button>
            <button onClick={() => dispatch(Dec)}>-</button>
            <button onClick={() => dispatch(AsyncInc)}>async(+)</button>
            {counter.msg || counter.count}
        </div>
    );

}

export default fxCounterComponent;

```


### Effects

There are several of ways to add effects in Ajwah. You can add effects in your state class that has been shown above in `counterState`. Also you can define separate effect classes and set them into `bootstrap` function like bellow:

```js
bootstrap({
    states: [CounterState, SearchState],
    effects: [SearchEffects]
});

```
### `searchState`
```js

import {State, Action} from 'ajwah-store';
import {SearchKey, SearchResult} from './actions';
import {updateObject} from './util';

@State({
  name:'search',
  initialState:{loading:false, error:'',res:[]}
})
class SearchState{

  @Action(SearchKey)
  searchStart(state){
   return updateObject(state, {loading:true})
  }

  @Action(SearchResult)
  searchResult(state, {payload}){
   return updateObject(state, {loading:false, res:payload})
  }
  
}
export default SearchState;
```

### `searchEffects`
```js

import { Effect, Actions, ofType, Actions } from 'ajwah-store';
import {debounceTime,switchMap,distinctUntilChanged,map, catchError,tap} from 'rxjs/operators';
import { SearchKey, SearchResult } from './actions';
import { ajax } from 'rxjs/ajax';
import { EMPTY } from 'rxjs';


class SearchEffects {

    @Effect()
    search(action$: Actions) {
        return action$.pipe(
            ofType(SearchKey),
            debounceTime(700),
            distinctUntilChanged(),
            switchMap(action => {
                return ajax.getJSON(`https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${action.payload}&limit=5`).pipe(
                    tap(res => console.log(res)),
                    map(data => ({ type: SearchResult, payload: data[1] })),
                    catchError(err => EMPTY)
                )
            })
        )
    }
}
export default SearchEffects;
```


### In Ajwah you can dynamically add/remove application's states/effects.

```js
addEffect() {
    this.store.addEffects(DynamicEffect);
}
removeEffect() {
    this.store.removeEffectsByKey(DYNAMIC_EFFECTS_KEY);
}
addState() {
    this.store.addState(TutorialState);
}
removeState() {
    this.store.removeState('tutorials')
}
```
 [Dynamic states and effects - Live](https://stackblitz.com/edit/ajwah-effect?file=Effects.ts)


### Here is the `TodoList` app consuming `JSONPlaceholder Rest API`
In this app all the todo effects has been defined into the `todoState` class. Its your choice whether you make a separete effects class like `todoEffects` 

[TodoList app - Live](https://stackblitz.com/edit/ajwah-state-manage?file=pages%2Fpage2.tsx)


[Please go throw this test file for more details. You may run the test and having some practical examples on it](https://github.com/JUkhan/Ajwah/blob/master/modules/ajwah-store/test/ajwah.test.js)


### todoPage
```js
import React, { useState, useEffect } from 'react';
import Todos from "../components/Todos";
import AddTodo from "../components/AddTodo";
import { store } from 'ajwah-store';
import { LoadTodos } from '../states/actions'

function todoPage() {

    const {todo}= useSubscriptions(['todo'])
    
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

import { State, Action, Effect, ofType } from 'ajwah-store';
import { TodosData, AddTodo, UpdateTodo, RemoveTodo, LoadTodos } from './actions';
import { updateObject } from '../utli';
import { map, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ajax } from "rxjs/ajax";
import { of } from 'rxjs'


@State({
    name: 'todo',
    initialState: { message: '', data: [] }
})
class TodoState {

    @Action(TodosData)
    todosData(state, { payload }) {
        return updateObject(state, payload)
    }

    @Action(LoadTodos)
    loadTodos(state) {
        return updateObject(state, { message: ' - loading todos....', data: [] })
    }

    @Effect()
    dataLoadingEffect(action$) {
        return action$.pipe(
            ofType(LoadTodos),
            mergeMap(() => ajax
                .get('https://jsonplaceholder.typicode.com/todos?_limit=5')
                .pipe(
                    map(data => {
                        return { type: TodosData, payload: { message: '', data: data.response } };
                    })
                )),
        );
    }

    @Action(AddTodo)
    addTodo(state) {
        return updateObject(state, { message: ' - Adding a new todo...' })
    }

    @Effect()
    addTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(AddTodo),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.post('https://jsonplaceholder.typicode.com/todos', action.payload)
                .pipe(
                    map(data => data.response),
                    map(newTodo => {
                        newTodo.completed = false;
                        const payload = { message: '', data: [newTodo, ...todo.data] };
                        return { type: TodosData, payload };
                    })
                )
            )
        )
    }

    @Action(UpdateTodo)
    updateTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is updaeing...` })
    }

    @Effect()
    updateTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(UpdateTodo),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.put(`https://jsonplaceholder.typicode.com/todos/${action.payload.id}`, action.payload)
                .pipe(
                    map(data => data.response),
                    map(res => {
                        res.completed = res.completed === 'true' ? true : false
                        const index = todo.data.findIndex(item => item.id === action.payload.id);
                        todo.data.splice(index, 1, res);
                        const payload = { message: '', data: [...todo.data] }
                        return { type: TodosData, payload }
                    }),
                    catchError(err => of({ type: TodosData, payload: { message: err.message } }))
                )
            )
        )
    }

    @Action(RemoveTodo)
    removeTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is removing...` })
    }

    @Effect()
    removeTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(RemoveTodo),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.delete(`https://jsonplaceholder.typicode.com/todos/${action.payload.id}`)
                .pipe(
                    map(data => data.response),
                    map(res => {
                        const payload = { message: '', data: todo.data.filter(item => item.id !== action.payload.id) }
                        return { type: TodosData, payload }
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
import { dispatch } from 'ajwah-store';
import { AddTodo } from '../states/actions'

function addItem(e) {
  e.preventDefault();
  const newTodo = {
    title: e.target.elements.title.value,
    completed: false
  }
  dispatch({ type: AddTodo, payload: newTodo });
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
import { dispatch } from 'ajwah-store';
import { RemoveTodo, UpdateTodo } from '../states/actions'

function updateTodo(todo, e) {
  todo.completed = e.target.checked;
  dispatch({ type: UpdateTodo, payload: todo })
}

function removeTodo(todo) {
  dispatch({ type: RemoveTodo, payload: todo })
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