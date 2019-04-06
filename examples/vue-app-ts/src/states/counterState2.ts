import { Actions } from "ajwah-vue-store";
import { INCREMENT, ASYNC_INCREMENT } from "./actions";
import { updateObject } from "./util";
import { mapTo, debounceTime } from 'rxjs/operators';


class CounterSate {

    name = 'counter'
    initialState = { count: 15, msg: '' }


    actionInc(state: any) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }


    actionDec(state: any) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }


    actionAsyncInc(state: any) {
        return updateObject(state, { msg: 'loading...' })
    }


    effectAsyncInc(action$: Actions) {
        return action$.ofType(ASYNC_INCREMENT).pipe(
            debounceTime(500),
            mapTo({ type: INCREMENT }),
        );
    }

}
export default CounterSate;
