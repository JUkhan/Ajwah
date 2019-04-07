import React, { PureComponent } from 'react';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../states/actions";

import { Connect, getStore } from 'ajwah-store';


@Connect()
class Counter extends PureComponent {

    increment = () => {
        this.store.dispatch({ type: INCREMENT });
    }
    decrement = () => {
        this.store.dispatch({ type: DECREMENT });
    }
    asyncIncrement = () => {
        this.store.dispatch({ type: ASYNC_INCREMENT });
    }
    render() {
        const { counter } = this.props;
        console.log('counter-component');
        return <span>
            <button onClick={this.increment}>+</button>
            <button onClick={this.decrement}>-</button>
            <button onClick={this.asyncIncrement}>Asunc (+)</button> <b>count {counter.msg || counter.count}</b>
        </span>
    }
}
export default Counter;
