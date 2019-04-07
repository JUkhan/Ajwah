
import { State } from 'ajwah-angular-store';
import { updateObject } from './util';
import { Injectable } from '@angular/core';

@Injectable()
@State({
    name: 'search',
    initialState: { loading: false, error: '', res: [] }
})
export class SearchState {

    name = 'search'
    initialState = { loading: false, error: '', res: [] }

    actionSearch(state) {
        return updateObject(state, { loading: true })
    }

    actionSearchResult(state, { payload }) {
        return updateObject(state, { loading: false, res: payload })
    }

}
