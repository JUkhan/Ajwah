import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { StreamBuilder, dispatch, Get, StateController, useStream } from 'ajwah-reactive-form';
import { CounterStateController } from './counterStateController';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';


export const NewCounter = () => {


    const [{ loading, data }] = useStream(CounterStateController, con => con.stream$);
    console.log(data, loading);
    return <p>
        <button onClick={e => dispatch('increse')}>Increse</button>
        <button onClick={e => dispatch('asyncIncrese')}>Async(+)</button>
        <button onClick={e => dispatch('decrese')}>Decrese</button>
        <b>{data?.loading || loading ? 'loading...' : data?.count}</b>
        {/* <StreamBuilder
            stream={Get(CounterStateController).stream$}
            render={data => <b>{data.loading ? 'loading...' : data.count}</b>
            } /> */}
    </p>
}
