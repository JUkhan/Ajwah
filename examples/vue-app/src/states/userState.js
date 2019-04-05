
import { State, Action, Effect, ofType } from 'ajwah-vue-store';
import { INCREMENT, LOAD_USERS, USER_DATA } from './actions';
import { updateObject } from './util';
import { mapTo, map, flatMap } from 'rxjs/operators';
import { ajax } from "rxjs/ajax";


@State({
    name: 'user',
    initialState: { loading: true, data: [] }
})
class UserState {

    @Action(USER_DATA)
    loadUser(state, { payload }) {
        return updateObject(state, { data: payload, loading: false })
    }
    @Effect()
    dataLoadingEffect(action$) {
        return action$.pipe(
            ofType(LOAD_USERS),
            flatMap(() => ajax
                .get("https://jsonplaceholder.typicode.com/users")
                .pipe(
                    map(data => ({ type: USER_DATA, payload: data.response }))
                ))
        )
    }

    @Effect()
    loadedEffect(action$) {
        return action$.ofType(USER_DATA).pipe(
            mapTo({ type: INCREMENT })
        )
    }

}
export default UserState;