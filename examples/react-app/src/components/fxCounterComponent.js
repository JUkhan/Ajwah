import React from 'react';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../states/actions";

import { dispatch } from 'ajwah-store';

function increment() {
    dispatch(INCREMENT);
}
function decrement() {
    dispatch(DECREMENT);
}
function asyncIncrement() {
    dispatch(ASYNC_INCREMENT);
}

function counter(props) {

    const { counter } = props;
    console.log('fx-counter-component');
    return <span>
        <button className="btn" onClick={increment}>+</button>
        <button className="btn" onClick={decrement}>-</button>
        <button className="btn" onClick={asyncIncrement}>Async (+)</button> <b>count {counter.msg || counter.count}</b>
    </span>

}
export default counter;
