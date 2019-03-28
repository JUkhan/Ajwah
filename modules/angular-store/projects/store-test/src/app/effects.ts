import { debounceTime, mapTo } from 'rxjs/operators';
import { ASYNC_INCREMENT, INCREMENT } from './actions';

import { Actions, Effect, ofType, EffectKey } from 'ajwah-angular-store';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
@EffectKey('test')
export class MyEffect {
    constructor(public action$: Actions) {

    }

    @Effect()
    asyncInc = this.action$.pipe(
        ofType(ASYNC_INCREMENT),
        debounceTime(1000),
        mapTo({ type: INCREMENT })
    )


}