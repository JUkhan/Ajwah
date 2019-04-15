import React, { PureComponent } from 'react';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../states/actions";

import { Connect } from 'ajwah-store';


@Connect()
class Counter extends PureComponent {

    constructor() {
        super();
        //Connect(null, this)
    }

    increment = () => {
        this.storeCtx.dispatch({ type: INCREMENT });
    }
    decrement = () => {
        this.storeCtx.dispatch({ type: DECREMENT });
    }
    asyncIncrement = () => {
        this.storeCtx.dispatch({ type: ASYNC_INCREMENT });
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
