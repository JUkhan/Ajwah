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
    //@Effect(...) decoretor: you may pass `dispatch:flase` -  by default it's true. if you pass `false`, you effect should be disabled.

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

    myEffectAsyncInc(actions:Actions, store:StoreContext){
        return actions.pipe(
            ofType('AsyncInc'),
            debounceTime(500),
            mapTo({type:'Inc'})
        )
    }

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

    effectForAsyncInc(actions:Actions) {
        return actions.pipe(
            debounceTime(450),
            mapTo({ type: Inc })
        )
    }
}
export default CounterSate;

```
`You can choose any style you like or any combination - ajwah support both together`

[Please go throw this test file for more details. You may run the test and having some practical examples on it](https://github.com/JUkhan/Ajwah/blob/master/modules/ajwah-store/test/ajwah.test.js)

[React Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/react#ajwah)

[Vue Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/vue#ajwah)

[Angular Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/angular#ajwah)

