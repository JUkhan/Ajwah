
import { INCREMENT } from "./actions";
import { updateObject } from "../utli";
import { debounceTime, mapTo } from 'rxjs/operators';
import { timer } from 'rxjs'
import { mapState } from 'ajwah-store'
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

        yield mapState(updateObject(state, { msg: 'loading...xxxx....' }))

        const nstate = yield timer(450).pipe(mapTo({ count: state.count + 1, msg: '' })).toPromise();
        yield mapState(nstate)
    }

    effectForAsyncIncOrDec_ndispatch(actions) {
        return actions.pipe(
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )
    }
}
export default CounterSate;