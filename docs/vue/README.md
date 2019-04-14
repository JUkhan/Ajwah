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
    asyncIncrement(actions:Actions, store:StoreContext){
        return actions.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    // Convention: function name starts with `effect` followed by anything - [effect][any](...){...}

    effectAsyncInc(actions:Actions, store:StoreContext){
        return actions.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }
    //@Effect(...) decoretor: you may mas `dispatch:flase` -  by default it's true. if you pass `false`, you effect should be disabled.

    @Effect({dispatch:flase})
    asyncIncrement(actions:Actions, store:StoreContext){
        return actions.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    //Convention: for `dispatch:false` - just function name ends with `_ndispatch`

    effectAsyncInc_ndispatch(actions:Actions, store:StoreContext){
        return actions.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

    // you may use `For` for getting rid of `ofType('...')` - [effect][For][actionName](...){...}. 
    // Use 'Or' for multiple actions name. ex: effectForAsyncIncOrDec(...) 
    // - [effect][For][actionName][Or][actionName][Or][actionName][...](){}
    effectForAsyncInc(actions:Actions, store:StoreContext){
        return actions.pipe(
            //ofType('AsyncInc'), now it's not necessary
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }
    // '_ndispatch' with `For` ex: effectForAsyncInc_ndispatch()
    effectForAsyncInc_ndispatch(actions:Actions, store:StoreContext){
        return actions.pipe(
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
        constructor(){
            this.name= 'counter';
            this.initialState={ count: 5, msg: '' };
        }
    }

```
### @Connect() 
```js
    @Connect({
        counter: state => state.counter
    })
    class CounterComponent extends PureComponent {


    }

    //Convention:

    class CounterComponent extends PureComponent {
        constructor(){
            super()
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
        constructor(){
            this.effectKey=DYNAMIC_EFFECTS_KEY;
        }
    }

```

`Note: Please remember the starts with 'action' and 'effect'. This is by default. You may change whatever you want into the 'setStoreContext'` 

```js
    Vue.use(AjwahStore, {
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

    myEffectAsyncInc(actions:Actions, store:StoreContext){
        return actions.pipe(
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
import { INCREMENT } from "./actions";
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

    effectForAsyncInc(actions:Actions) {
        return actions.pipe(
            debounceTime(450),
            mapTo({ type: INCREMENT })
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
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../states/actions";
export default {
  name: "Counter",
  subscriptions() {
    return {
      counter: this.store.select('counter')
    };
  },

  methods: {
    inc() {
      this.store.dispatch({ type: INCREMENT });
    },
    dec() {
      this.store.dispatch({ type: DECREMENT });
    },
    async_inc() {
      this.store.dispatch({ type: ASYNC_INCREMENT });
    }
  }
};
</script>


```


### Here is the `Store API`
```js
class StoreContext {
    dispatch(action: Action): StoreContext;
    addStates(...stateClassTypes: any[]): StoreContext;
    removeStates(...stateNames: string[]): StoreContext;
    removeEffectsByKey(key: string): StoreContext;
    importState(state: any): StoreContext;
    select<T=any>(pathOrMapFn: ((state: T) => any) | string, ): Observable<any>;
    addEffect<T extends Actions<Action>>(callback: (action$: Actions<Action>, store$?: StoreContext) => Observable<Action>, key?: string): StoreContext;
    addEffects(...effectClassTypes: any[]): StoreContext;
    dispose(): void;
}
```

### using `AjwahStore` in main file

```js
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import vueRx from 'vue-rx';
import { AjwahStore } from 'ajwah-vue-store';
import { devTools } from 'ajwah-devtools';
import counterState from './states/counterState'

Vue.use(vueRx);

Vue.use(AjwahStore, {
  states: [counterState],
  devTools: devTools()
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

```

### Effects

There are several of ways to add effects in Ajwah. You can add effects in your state class that has been shown above in `counterState`. Also you can define separate effect classes and set them into `main` file like bellow:

```js
Vue.use(AjwahStore, {
    states: [CounterState, SearchState],
    effects: [SearchEffects]
});

```
### `searchState`
```js

import {State, Action} from 'ajwah-vue-store';
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

import { Effect, Actions, ofType, Actions } from 'ajwah-vue-store';
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


### In Ajwah you can dynamically add/remove application's states/effects.

```js
methods{
    addEffect() {
        this.store.addEffects(DynamicEffect);
    }
    removeEffect() {
        this.store.removeEffectsByKey(DYNAMIC_EFFECTS_KEY);
    }
    addState() {
        this.store.addStates(TutorialState);
    }
    removeState() {
        this.store.removeStates('tutorials')
    }
}
```
### Please have a look at the [Ajwah React Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/react#ajwah) for live demo. And apply these in your vue app - Ajwah Api is same for all.