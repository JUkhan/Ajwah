
import { ASYNC_INCREMENT, INCREMENT, DECREMENT } from "./actions";
import { map, debounceTime } from "rxjs/operators";
import { ofType, Effect, EffectKey } from 'ajwah-react-store';

//@EffectKey('CounterEffect')
class CounterEffect {

    @Effect()
    asyncInc() {
        return action$ => action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            map(() => ({ type: INCREMENT }))
        )

    }

    @Effect()
    dec() {
        return action$ => action$.pipe(
            ofType(DECREMENT),
            debounceTime(1000),
            map(() => ({ type: INCREMENT }))
        )
    }
}
export default CounterEffect