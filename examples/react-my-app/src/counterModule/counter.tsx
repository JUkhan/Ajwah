import React from 'react';
import { useStream,} from '../utils';
import { CounterController } from './counterController';
import Loading from './loading';
import {Get} from 'ajwah-store';

const controller = Get(CounterController);

export default () => {

    const state = useStream(controller.stream$, 0);

    return  <p>
    <button className="btn" onClick={()=>controller.increment()}>+</button>
    <button className="btn" onClick={()=>controller.asyncInc()}>async(+)</button>
    <button className="btn" onClick={()=>controller.decrement()}>-</button>
    {state} <Loading/>
  </p>
}