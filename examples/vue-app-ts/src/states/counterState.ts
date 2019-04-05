import { State, Action, Effect, Actions } from "ajwah-vue-store";
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "./actions";
import { updateObject } from "./util";
import { mapTo, debounceTime } from 'rxjs/operators';


@State({
    name: 'counter',
    initialState: { count: 5, msg: '' }
})
class CounterSate {

    @Action(INCREMENT)
    increment(state: any) {
        return updateObject(state, { count: state.count + 1, msg: '' })
    }

    @Action(DECREMENT)
    decrement(state: any) {
        return updateObject(state, { count: state.count - 1, msg: '' })
    }

    @Action(ASYNC_INCREMENT)
    asyncIncrement(state: any) {
        return updateObject(state, { msg: 'loading...' })
    }

    @Effect()
    asyncEffect(action$: Actions) {
        return action$.ofType(ASYNC_INCREMENT).pipe(
            debounceTime(500),
            mapTo({ type: INCREMENT }),
        );
    }

}
export default CounterSate;
