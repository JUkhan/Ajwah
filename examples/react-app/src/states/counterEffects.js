
import { ASYNC_INCREMENT, INCREMENT } from "./actions";
import { map, debounceTime } from "rxjs/operators";
import { ofType, Effect } from 'ajwah-react-store';

class CounterEffect {
    @Effect()
    asyncInc() {
        return action$ => action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            map(() => ({ type: INCREMENT }))
        )

    }
}
export default CounterEffect