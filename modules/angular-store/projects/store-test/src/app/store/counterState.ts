import { debounceTime, mapTo } from 'rxjs/operators';

import { Actions, ofType, Effect } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { updateObject } from './util';


class CounterState {

    name = 'counter';
    initialState = { count: 15, msg: '' };

    actionInc(state) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    actionDec(state) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    actionAsyncInc(state) {
        return updateObject(state, { msg: 'loading...' })
    }

    //@Effect()
    effectForAsyncIncOrDec(action$: Actions) {
        return action$.pipe(
            //ofType(ASYNC_INCREMENT),
            debounceTime(450),
            mapTo({ type: INCREMENT })
        )
    }


}

export default CounterState;