
import { ASYNC_INCREMENT, INCREMENT, DYNAMIC_EFFECTS_KEY } from "./actions";
import { map, debounceTime } from "rxjs/operators";
import { ofType, Effect, EffectKey } from 'ajwah-react-store';

//@EffectKey(DYNAMIC_EFFECTS_KEY)
class CounterEffect {
    effectKey = DYNAMIC_EFFECTS_KEY;
    //@Effect()
    effectAsyncInc(action$) {
        console.log('................')
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(450),
            map(() => ({ type: INCREMENT }))
        );

    }

}
export default CounterEffect