
import { State, Action } from 'ajwah-angular-store';
import { SEARCH_KEYSTROKE, SEARCH_RESULT } from './actions';
import { updateObject } from './util';
import { Injectable } from '@angular/core';

@Injectable()
@State({
    name: 'search',
    initialState: { loading: false, error: '', res: [] }
})
export class SearchState {

    @Action(SEARCH_KEYSTROKE)
    searchStart(state) {
        return updateObject(state, { loading: true })
    }

    @Action(SEARCH_RESULT)
    searchResult(state, { payload }) {
        return updateObject(state, { loading: false, res: payload })
    }

}