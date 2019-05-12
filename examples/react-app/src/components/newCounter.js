import React, { useState, useEffect } from 'react'
import { store } from 'ajwah-store'
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from '../states/actions';

function cc(props) {

    const [counter, setState] = useState({});

    useEffect(() => {
        const subs = store().select(state => state.counter).subscribe(res => setState(res));
        return () => subs.unsubscribe();
    }, []);

    return (
        <div>
            <button onClick={() => store.dispatch({ type: INCREMENT })}>+</button>
            <button onClick={() => store.dispatch({ type: DECREMENT })}>-</button>
            <button onClick={() => store.dispatch({ type: ASYNC_INCREMENT })}>async(+)</button>
            {counter.msg || counter.count}
        </div>
    );

}

export default cc;