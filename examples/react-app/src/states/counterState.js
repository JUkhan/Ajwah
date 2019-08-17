
import { INCREMENT } from "./actions";
import { updateObject } from "../utli";
import { debounceTime, mapTo } from 'rxjs/operators';
import { timer } from 'rxjs'

class CounterSate {

    name = 'counter'
    initialState = { count: 10, msg: '' }


    actionInc(state) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    actionDec(state) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    *actionAsyncInc(state) {

        yield updateObject(state, { msg: 'loading...xxxx....' })

        yield timer(450).pipe(mapTo({ count: state.count + 1, msg: '' })).toPromise()
    }

    effectForAsyncIncOrDec_ndispatch(actions) {
        return actions.pipe(
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )
    }
}
export default CounterSate;