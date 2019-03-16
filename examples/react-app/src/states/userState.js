
import { State, Action } from 'ajwah-react-store';
import { LOAD_USER } from './actions';
import { updateObject } from '../utli';

@State({
    name: 'user',
    initialState: { data: [] }
})
class UserState {

    @Action(LOAD_USER)
    loadUser(state, { payload }) {
        return updateObject(state, { data: payload })
    }
}
export default UserState;