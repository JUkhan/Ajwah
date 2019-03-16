import { State, Action } from "ajwah-react-store";
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from "./actions";
import { updateObject } from "../utli";

@State({
    name: 'counter',
    initialState: { count: 10, msg: '' }
})
class CounterSate {

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
}
export default CounterSate;