
import { State, Action } from 'ajwah-vue-store'
import { ADD_TUTORIAL, REMOVE_TUTORIAL } from './actions';
import { updateObject } from "./util";

@State({
    name: 'tutorial',
    initialState: { data: [{ name: 'Ajwah' }] }
})
class TutorialState {

    @Action(ADD_TUTORIAL)
    addTutorial(state, { payload }) {
        state.data = [...state.data, payload]
        return updateObject(state);
    }

    @Action(REMOVE_TUTORIAL)
    removeTutorial(state, { payload }) {
        state.data = state.data.filter(tutorial => tutorial.name !== payload);
        return updateObject(state);
    }
}
export default TutorialState;