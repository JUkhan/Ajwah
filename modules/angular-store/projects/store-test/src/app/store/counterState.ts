import { Actions, Effect, ofType, Action } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { debounceTime, mapTo } from 'rxjs/operators';
import { updateObject } from './util';
import { Injectable } from '@angular/core';
import { State } from 'projects/ajwah-angular-store/src/public-api';

@Injectable()
@State({
    name: 'counter',
    initialState: { count: 101, msg: '' }
})
class CounterState {

    constructor(private action$: Actions) {

    }
    @Action(INCREMENT)
    actionInc(state) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }
    @Action(DECREMENT)
    actionDec(state) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }
    @Action(ASYNC_INCREMENT)
    actionAsyncInc(state) {
        return updateObject(state, { msg: 'loading...' })
    }

    @Effect()
    asd$ = this.action$.pipe(
        ofType(ASYNC_INCREMENT, DECREMENT),
        debounceTime(450),
        mapTo({ type: INCREMENT })
    )



}

export default CounterState;