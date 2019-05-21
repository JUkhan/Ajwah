import { Effect, Actions, ofType, EffectKey } from 'ajwah-angular-store';
import { Injectable } from '@angular/core';
import { ADD_TUTORIAL, INCREMENT } from '../../store/actions';
import { mapTo } from 'rxjs/operators';


@Injectable()
@EffectKey('labalab')
export class TutorialEffects {
    constructor(private action$: Actions) { }
    @Effect()
    incre$ = this.action$.pipe(
        ofType(ADD_TUTORIAL),
        mapTo({ type: INCREMENT })
    )
}