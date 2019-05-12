# Ajwah
Rx based store library for React, Vue, Angular, Preact. Manage your application's states, effects, and actions easy way. It's easy to use in functional components with React hooks.

### Installation

```sh
>> npm install ajwah-store
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
        return action$.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    // Convention: function name starts with `effect` followed by anything - [effect][any](...){...}

    effectAsyncInc(action$:Actions, store$:Store){
        return action$.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }
    //@Effect(...) decoretor: you may pass `dispatch:flase` -  by default it's true. if you pass `false`, you effect should be disabled.

    @Effect({dispatch:flase})
    asyncIncrement(action$:Actions, store$:Store){
        return action$.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    //Convention: for `dispatch:false` - just function name ends with `_ndispatch`

    effectAsyncInc_ndispatch(action$:Actions, store$:Store){
        return action$.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    // you may use `For` for getting rid of `ofType('...')` - [effect][For][actionName](...){...}. 
    // Use 'Or' for multiple actions name. ex: effectForAsyncIncOrDec(...) 
    // - [effect][For][actionName][Or][actionName][Or][actionName][...](){}
    effectForAsyncInc(action$:Actions, store$:Store){
        return action$.pipe(
            //ofType('AsyncInc'), now it's not necessary
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }
    // '_ndispatch' with `For` ex: effectForAsyncInc_ndispatch()
    effectForAsyncInc_ndispatch(action$:Actions, store$:Store){
        return action$.pipe(
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


[Please go throw this test file for more details. You may run the test and having some practical examples on it](https://github.com/JUkhan/Ajwah/blob/master/modules/ajwah-store/test/ajwah.test.js)

`Note: Please remember the starts with 'action' and 'effect'. This is by default. You may change whatever you want into the 'bootstrap'` 

```js
    bootstrap({
        states: [CounterSate, TodoState],
        effects: [TodoEffects],
        devTools: devTools({ maxAge: 10 }),
        actionsMethodStartsWith: 'myAction', // default 'action'
        effectsMethodStartsWith:'myEffect'  // default 'effect'
    })
    
    //Now your actions and  effects should be

    myActionInc(state, action){
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    myEffectAsyncInc(action$:Actions, store$:Store){
        return action$.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

```

### To enable decoretors if you want: For Vue Cli if you choose Typescript, everything is ok. Otherwise you need to enable decorators supprot in `babel.config.js` file.

```js
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true
      }
    ]
  ]
}
```

### need to install the following plugin

```sh
>> npm install --save-dev @babel/plugin-proposal-decorators
```

### Now let's install Ajwah store and others helping lib
```sh
>> npm install rxjs
>> npm install vue-rx
>> npm install ajwah-store
>> npm install ajwah-devtools //optional
>> npm run serve
```

### Let's start with the hello world `counterState`

### `counterState using decoretors`

```js
import { State, Action, Effect, ofType, Actions } from 'ajwah-react-store';
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
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )

    }
}

export default CounterState;
```

### `counterState using convention`

```js
import { Actions } from 'ajwah-store';
import { Inc } from "./actions";
import { updateObject } from "../utli";
import { debounceTime, mapTo } from 'rxjs/operators';

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
        return action$.pipe(
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
<template>
  <p>
    <button class="btn" @click="inc()">+</button>
    <button class="btn" @click="dec()">-</button>
    <button class="btn" @click="async_inc()">async(+)</button>
    {{counter.msg||counter.count}}
  </p>
</template>

<script>
import { dispatch, store } from "ajwah-store";
import { Inc, Dec, AsyncInc } from "../states/actions";
export default {
  name: "Counter",
  subscriptions() {
    return {
      counter: store().select('counter')
    };
  },

  methods: {
    inc() {
      dispatch({ type: Inc });
    },
    dec() {
      dispatch({ type: Dec });
    },
    asyncInc() {
      dispatch({ type: AsyncInc });
    }
  }
};
</script>


```


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

### using `bootstrap` in main file

```js
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import vueRx from 'vue-rx';
import { bootstrap } from 'ajwah-store';
import { devTools } from 'ajwah-devtools';
import counterState from './states/counterState'

Vue.use(vueRx);

bootstrap({
  states: [counterState],
  devTools: devTools()
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

```
[Counter app - Live](https://codesandbox.io/s/42ql8y5x)

### Effects

There are several of ways to add effects in Ajwah. You can add effects in your state class that has been shown above in `counterState`. Also you can define separate effect classes and set them into `main` file like bellow:

```js
bootstrap({
    states: [CounterState, SearchState],
    effects: [SearchEffects]
});

```
### `searchState`
```js

import {State, Action} from 'ajwah-vue-store';
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

import { Effect, Actions, ofType, Actions } from 'ajwah-vue-store';
import {
    debounceTime,
    switchMap,
    distinctUntilChanged,
    map, catchError,
    tap
} from 'rxjs/operators';
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
methods{
    addEffect() {
        store().addEffects(DynamicEffect);
    }
    removeEffect() {
        store().removeEffectsByKey(DYNAMIC_EFFECTS_KEY);
    }
    addState() {
        store().addState(TutorialState);
    }
    removeState() {
        store().removeState('tutorials')
    }
}
```
[Dynamic states and effects App - Live](https://codesandbox.io/s/5z5o6n7lqx)
