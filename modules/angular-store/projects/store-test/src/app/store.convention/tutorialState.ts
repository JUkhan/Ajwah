

import { ADD_TUTORIAL, REMOVE_TUTORIAL, ASYNC_INCREMENT, INCREMENT } from './actions';
import { State, Action, Actions, Effect, ofType } from 'ajwah-angular-store';
import { updateObject } from './util';
import { Injectable } from '@angular/core';
import { debounceTime, mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
/*@State({
    name: 'tutorial',
    initialState: { data: [{ name: 'Ajwah', url: '' }] }
})*/
export class TutorialState {
    name = 'tutorial'
    initialState = { data: [{ name: 'Learn Ajwah', url: '' }] }

    //@Action(ADD_TUTORIAL)
    actionAddTutorial(state, action) {
        state.data = [...state.data, action.payload];
        return updateObject(state);
    }

    //@Action(REMOVE_TUTORIAL)
    actionRemoveTutorial(state, action) {
        const data = state.data.filter(_ => _.name !== action.payload)
        return updateObject(state, { data });
    }

    //@Effect()
    effectAsyncInc(action$: Actions) {
        console.log('ffffffffff')
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        );
    }

}
