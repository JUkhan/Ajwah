import { Actions, Effect, ofType, Action } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { debounceTime, mapTo } from 'rxjs/operators';
import { updateObject } from './util';
import { Injectable } from '@angular/core';


@Injectable()
// @State({
//     name: 'counter',
//     initialState: { count: 101, msg: '' }
// })
class CounterState {
    name = 'counter'
    initialState = { count: 12, msg: '' }

    constructor(private action$: Actions) {

    }
    //@Action(INCREMENT)
    onInc(state) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }
    //@Action(DECREMENT)
    onDec(state) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }
    //@Action(ASYNC_INCREMENT)
    onAsyncInc(state) {
        return updateObject(state, { msg: 'loading...' })
    }


    effectForAsyncIncOrDec(action$: Actions) {
        return action$.pipe(
            //ofType(ASYNC_INCREMENT, DECREMENT),
            debounceTime(450),
            mapTo({ type: INCREMENT }))
    }



}

export default CounterState;