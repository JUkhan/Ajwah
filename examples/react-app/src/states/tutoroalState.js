import { State, Action, Effect, ofType } from 'ajwah-react-store'
import { ADD_TUTORIAL, REMOVE_TUTORIAL } from './actions';
import { mapTo, debounceTime } from 'rxjs/operators';
import { ASYNC_INCREMENT, INCREMENT } from './actions';

@State({
    name: 'tutorials',
    initialState: [{ name: 'Learn Ajwah', url: 'www.ajwah.bd.com' }]
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

    @Effect()
    asyncIncEffect(action$) {
        return action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(1000),
            mapTo({ type: INCREMENT })
        )

    }
}
export default TutorialState;