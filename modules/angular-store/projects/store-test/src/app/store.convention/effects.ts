import { debounceTime, mapTo } from 'rxjs/operators';
import { ASYNC_INCREMENT, INCREMENT, DYNAMIC_EFFECTS_KEY } from './actions';
import { Actions, ofType } from 'ajwah-angular-store';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })

export class DynamicEffect {

    effectKey = DYNAMIC_EFFECTS_KEY;

    effectAsyncInc(action$: Actions) {
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )
    }

}