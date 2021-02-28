import React from 'react';
import { useStream } from '../utils';
import { CounterController } from './counterController';
import {Get} from 'ajwah-store';

const controller = Get(CounterController);

export default () => {

    const isLoading = useStream(controller.loading$, false);

    return isLoading?<span>loading...</span>:null
}