import { Actions } from 'ajwah-angular-store';
import { INCREMENT } from './actions';
import { debounceTime, mapTo } from 'rxjs/operators';
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

    effectForAsyncIncOrDec(action$: Actions) {
        return action$.pipe(
            debounceTime(450),
            mapTo({ type: INCREMENT })
        )
    }


}

export default CounterState;