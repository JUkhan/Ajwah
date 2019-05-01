
import { INCREMENT } from "./actions";
import { updateObject } from "../utli";
import { debounceTime, mapTo } from 'rxjs/operators';

class CounterSate {

    name = 'counter'
    initialState = { count: 10, msg: '' }


    actionInc(state) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    actionDec(state) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    actionAsyncInc(state) {
        return updateObject(state, { msg: 'loading...' })
    }

    effectForAsyncIncOrDec_ndispatch(actions) {
        return actions.pipe(
            debounceTime(450),
            mapTo({ type: INCREMENT })
        )
    }
}
export default CounterSate;