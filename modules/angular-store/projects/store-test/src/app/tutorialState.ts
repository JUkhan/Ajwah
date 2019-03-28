

import { ADD_TUTORIAL, REMOVE_TUTORIAL, ASYNC_INCREMENT, INCREMENT } from './actions';
import { State, Action, IAction, Actions, Effect, ofType } from 'ajwah-angular-store';
import { updateObject } from './util';
import { Injectable } from '@angular/core';
import { debounceTime, mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
@State({
    name: 'tutorial',
    initialState: { data: [{ name: 'Ajwah', url: '' }] }
})
export class TutorialState {

    constructor(public action$: Actions) {

    }

    @Action(ADD_TUTORIAL)
    addTutorial(state, action: IAction) {
        state.data.push(action.payload);
        return updateObject(state, {});
    }

    @Action(REMOVE_TUTORIAL)
    removeTutorial(state, action: IAction) {
        const data = state.data.filter(_ => _.name !== action.payload)
        return updateObject(state, { data });
    }

    @Effect()
    asyncInc = this.action$.pipe(
        ofType(ASYNC_INCREMENT),
        debounceTime(1000),
        mapTo({ type: INCREMENT })
    )

}
