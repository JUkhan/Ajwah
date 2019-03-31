import React from 'react';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "../states/actions";

import { getStore } from 'ajwah-react-store';

function increment() {
    getStore().dispatch({ type: INCREMENT });
}
function decrement() {
    getStore().dispatch({ type: DECREMENT });
}
function asyncIncrement() {
    getStore().dispatch({ type: ASYNC_INCREMENT });
}

function counter(props) {

    const { counter } = props;
    console.log('fx-counter-component');
    return <span>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={asyncIncrement}>Asunc (+)</button> <b>count {counter.msg || counter.count}</b>
    </span>

}
export default counter;
