import React from 'react';
import { RxState, StreamBuilder, dispatch } from 'ajwah-reactive-form';
import { CounterStateController } from './counterStateController';

export const NewCounter = () => {
    return <RxState cleanState stateController={CounterStateController} render={(controller) =>{
        console.log('stateController - render')
        return <p>
            <button onClick={e => dispatch('increse')}>Increse</button>
            <button onClick={e => dispatch('asyncIncrese')}>Async(+)</button>
            <button onClick={e => dispatch('decrese')}>Decrese</button>
            <StreamBuilder
                initialData={controller.state}
                stream={controller.stream$}
                render={(data) => {
                    console.log(data);
                    return <b>{data.loading ? 'loading...' : data.count}</b>
                }} />
        </p>}
    } />
}