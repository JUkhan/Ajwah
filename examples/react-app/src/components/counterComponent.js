import React, { PureComponent } from 'react';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../states/actions";

import { Connect } from 'ajwah-react-store';

@Connect({
    counter: state => state.counter,
})
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
    render(props) {
        const { counter } = this.state;
        console.log('counter-component');
        return <div>
            <button onClick={this.increment}>+</button>
            <button onClick={this.decrement}>-</button>
            <button onClick={this.asyncIncrement}>Asunc (+)</button> <b>count {counter.msg || counter.count}</b>
        </div>
    }
}
export default Counter;