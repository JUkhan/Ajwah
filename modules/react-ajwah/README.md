# React-Ajwah
React bindings for ajwah

### Installation

```sh
>> npm install react-ajwah

```
### API
```javascript
function Connect(splitedState?: { [key: string]: (state: any) => any }, componentInstance?: any): any;

function useSubscriptions(states: string[]): { [key: string]: any };
```

### Connect() for class component

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
### `CounterComponent - Coding by Decorators`
```js

import React, { PureComponent } from 'react';
import { StoreContext } from 'ajwah-store';
import { Connect} from 'react-ajwah';
import { Inc, AsyncInc, Dec } from './actions';

@Connect({
    counter: state => state.counter
})
class CounterComponent extends PureComponent {

    storeCtx:StoreContext;

    inc = () => {
        this.storeCtx.dispatch({ type: Inc })
    }
    dec = () => {
        this.storeCtx.dispatch({ type: Dec })
    }
    asyncInc = () => {
        this.storeCtx.dispatch({ type: AsyncInc })
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
### `CounterComponent - Coding by Convention
```js

import React, { PureComponent } from 'react';
import { StoreContext } from 'ajwah-store';
import { Connect} from 'react-ajwah';
import { Inc, AsyncInc, Dec } from './actions';


class CounterComponent extends PureComponent {
    constructor(){
        Connect({counter: state => state.counter}, this)
    }
    storeCtx:StoreContext;

    inc = () => {
        this.storeCtx.dispatch({ type: Inc })
    }
    dec = () => {
        this.storeCtx.dispatch({ type: Dec })
    }
    asyncInc = () => {
        this.storeCtx.dispatch({ type: AsyncInc })
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

### `Connect decorator` takes a single object literal type param (key value pairs). Key should be any name and value should be a function that must return a part of your application's states. You can define as many pairs as you want. All keys and its corresponding states should be available as component state. Your component should be re-render if any key corresponding state is updated from anywhere in the application. And your component should have a `StoreContext` property as the name of `storeCtx`.


### useSubscriptions() for functional component

```js
import React, { useState, useEffect } from 'react'
import { dispatch} from 'ajwah-store'
import {useSubscriptions} from 'react-ajwah'
import { Inc, Dec, AsyncInc } from './actions';


function fxCounterComponent() {
    
    const {counter} = useSubscriptions(['counter']);

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


[React Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/react#ajwah)

[Vue Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/vue#ajwah)

[Angular Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/angular#ajwah)

