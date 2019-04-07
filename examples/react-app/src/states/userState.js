
import { State, Action, Effect } from 'ajwah-store';
import { LOAD_USER, INCREMENT } from './actions';
import { updateObject } from '../utli';
import { mapTo } from 'rxjs/operators';

@State({
    name: 'user',
    initialState: { data: [] }
})
class UserState {

    @Action(LOAD_USER)
    loadUser(state, { payload }) {
        return updateObject(state, { data: payload })
    }

    @Effect()
    loadEffect(action$) {
        return action$.ofType(LOAD_USER).pipe(
            mapTo({ type: INCREMENT })
        )
    }
}
export default UserState;