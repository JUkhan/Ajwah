import { updateObject } from "./utils";
import { mapTo, debounce, debounceTime } from "rxjs/operators";


export class Counter {
    name = 'counter'
    initialState = { count: 0, isLoading: false }

    actionInc(state) {
        return { count: state.count + 1, isLoading: false }
    }
    actionDec(state) {
        return { count: state.count - 1, isLoading: false }
    }
    actionAsyncInc(state) {
        return updateObject(state, { isLoading: true })
    }
    effectForAsyncInc(action$) {
        return action$.pipe(
            debounceTime(1),
            mapTo({ type: 'Inc' })
        )
    }
}