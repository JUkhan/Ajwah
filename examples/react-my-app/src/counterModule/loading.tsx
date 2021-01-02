import React from 'react';
import { useStream, Get } from './utils';
import { CounterController } from './counterController';

const controller = Get(CounterController);

export default () => {

    const isLoading = useStream(controller.loading$, false);

    return isLoading?<span>loading...</span>:null
}