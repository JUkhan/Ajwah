
import { ASYNC_INCREMENT, INCREMENT, DYNAMIC_EFFECTS_KEY } from "./actions";
import { map, debounceTime } from "rxjs/operators";
import { ofType, Effect, EffectKey } from 'ajwah-react-store';

@EffectKey(DYNAMIC_EFFECTS_KEY)
class CounterEffect {

    @Effect()
    asyncInc(action$) {
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            map(() => ({ type: INCREMENT }))
        );

    }

}
export default CounterEffect