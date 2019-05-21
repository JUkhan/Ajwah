import { debounceTime, mapTo, map } from 'rxjs/operators';
import { ASYNC_INCREMENT, INCREMENT, DYNAMIC_EFFECTS_KEY } from './actions';

import { Actions, ofType, Store } from 'ajwah-angular-store';
import { Injectable } from '@angular/core';

import { AppState, ICounterState } from './model';


@Injectable({ providedIn: 'root' })
//@EffectKey(DYNAMIC_EFFECTS_KEY)
export class DynamicEffect {

    constructor(private store: Store, private action$: Actions) {
        console.log(this.store);
        console.log(this.action$);
    }

    effectKey = DYNAMIC_EFFECTS_KEY;
    //@Effect()
    effectAsyncInc(action$: Actions) {

        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )
    }


}