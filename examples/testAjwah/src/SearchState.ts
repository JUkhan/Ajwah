

import { State, Action } from 'ajwah-store';
import { SEARCH_KEYSTROKE, SEARCH_RESULT } from './actions';
import { updateObject } from './util';

@State({
    name: 'search',
    initialState: { loading: false, error: '', res: [] }
})
class SearchState {

    @Action(SEARCH_KEYSTROKE)
    searchStart(state) {
        return updateObject(state, { loading: true })
    }

    @Action(SEARCH_RESULT)
    searchResult(state, { payload }) {
        return updateObject(state, { loading: false, res: payload })
    }

}
export default SearchState;
