import { State, Action } from 'ajwah-react-store'
import { ADD_TUTORIAL, REMOVE_TUTORIAL } from './actions';

@State({
    name: 'tutorials',
    initialState: [{ name: 'Dagger js -> djs' }]
})
class TutorialState {

    @Action(ADD_TUTORIAL)
    addTutorial(state, { payload }) {

        return [...state, payload]
    }

    @Action(REMOVE_TUTORIAL)
    removeTutorial(state, { payload }) {
        return state.filter(tutorial => tutorial.name !== payload)
    }
}
export default TutorialState;