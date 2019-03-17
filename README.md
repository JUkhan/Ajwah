# Ajwah
Rx based store lib for react, preact, angular, and vue

### Installation

```sh
>> npm install ajwah-react-store
>> npm install ajwah-react-devtools
```

### For `create-react-app`
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
>> npm install ajwah-react-devtools //optional
>> npm start
```

* Now let's go make some files into `src` directory and dispatch copy-paste action :)

### `util.js`
```js
export function updateObject(state, params) {
    return { ...state, ...params };
}
```

### `CounterState.js`
```js
import { State, Action } from 'ajwah-react-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { updateObject } from './util';

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
}

export default CounterState;


```
### `CounterComponent.js`
```js

import React, { PureComponent } from 'react';
import { Connect } from 'ajwah-react-store';
import { INCREMENT, ASYNC_INCREMENT, DECREMENT } from './actions';
import { debounceTime, mapTo } from 'rxjs/operators';
import { ofType, StoreContext } from 'ajwah-react-store'
@Connect({
    counter: state => state.counter
})
class CounterComponent extends PureComponent {
    store:StoreContext;
    componentWillMount() {
        this.store.addEffect(action$ => action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        ))
    }
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
### And finally copy-paste the following code into `index.js` file.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { setStoreContext } from 'ajwah-react-store';
import CounterState from './CounterState';
import { devTools } from 'ajwah-react-devtools';

setStoreContext({
    states: [CounterState],
    devTools: devTools({})
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


```

### One more thing - Place your `CounterComponent` into `app.js` file like bellow:

```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from './CounterComponent';

class App extends Component {
  render() {
    return (
      <div >
        <Counter />
      </div>
    );
  }
}

export default App;


```

### hope your app up-and-running

[Here is the Demo App](https://stackblitz.com/edit/ajwah-react1?file=index.tsx)

## State Management
Imagine we are developing a big app over 100 of splited states(reducers) that should make a giant state. Although our app should be separeted by modules and every user should not have access to every modules or a user might not visit all the modules/pages at a single time. So, what are you thinking ? Are you going to combine all the ui states in a single point or something else. 


Obviously we will combine some states that are necessary and others sholuld be add/remove on demand

In Ajwah you might be able to add/remove states at any moment. Please have a look at the following example:

```js
import React, { PureComponent } from 'react';
import { Connect } from 'ajwah-react-store';
import UserState from '../states/userState';
import { ajax } from 'rxjs/ajax';
import { take, map, catchError } from 'rxjs/operators';
import { LOAD_USER } from '../states/actions';


@Connect({
    data: state => state.user.data
})
class Page2 extends PureComponent {

    componentWillMount() {
        // adding State
        this.store.addState(UserState);

        ajax.getJSON('https://jsonplaceholder.typicode.com/users').pipe(
            map(data => ({ type: LOAD_USER, payload: data })),
            catchError(console.log),
            take(1),
        ).subscribe(action => this.store.dispatch(action));
    }
    componentWillUnmount() {
        //removing state
        this.store.removeState('user')
    }
    render() {
        console.log('page-2', this.state)
        const { data } = this.state;
        return (
            <div>{data.map(user => <div key={user.id}>{user.name}</div>)}</div>
        )
    }
}

export default Page2;

```

[Here is the Demo App](https://stackblitz.com/edit/ajwah-state-manage?file=pages%2Fpage2.tsx)

## Effects

continue...