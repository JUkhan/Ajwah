import React, { PureComponent } from 'react';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../states/actions";

import { Connect } from 'ajwah-store';


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
            <button className="btn" onClick={this.increment}>+</button>
            <button className="btn" onClick={this.decrement}>-</button>
            <button className="btn" onClick={this.asyncIncrement}>Asunc (+)</button> <b>count {counter.msg || counter.count}</b>
        </span>
    }
}
export default Counter;
