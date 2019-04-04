import { debounceTime, mapTo } from 'rxjs/operators';
import { ASYNC_INCREMENT, INCREMENT, DYNAMIC_EFFECTS_KEY } from './actions';

import { Actions, Effect, ofType, EffectKey } from 'ajwah-angular-store';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
@EffectKey(DYNAMIC_EFFECTS_KEY)
export class DynamicEffect {


    @Effect()
    asyncInc(action$: Actions) {
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )
    }


}