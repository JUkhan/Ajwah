import { debounceTime, mapTo } from 'rxjs/operators';

import { State, Action, Effect, Actions } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { updateObject } from './util';

@State({
    name: 'counter',
    initialState: { count: 5, msg: '' }
})
class CounterState {
    constructor(public action$: Actions) {

    }

    @Action(INCREMENT)
    increment(state, action) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    @Action(DECREMENT)
    decrement(state, action) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    @Action(ASYNC_INCREMENT)
    asyncIncrement(state, action) {
        return updateObject(state, { msg: 'loading...' })
    }

    /*@Effect()
    asyncInc = this.action$.ofType(ASYNC_INCREMENT).pipe(
        debounceTime(1000),
        mapTo({ type: INCREMENT })
    )*/
}

export default CounterState;