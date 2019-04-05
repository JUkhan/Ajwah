
import { State, Action, Effect, ofType } from 'ajwah-vue-store';
import { TODOS_DATA, ADD_TODO, UPDATE_TODO, REMOVE_TODO, LOAD_TODOS } from './actions';
import { updateObject } from './util';
import { map, mergeMap } from 'rxjs/operators';
import { ajax } from "rxjs/ajax";


@State({
    name: 'todo',
    initialState: { message: '', data: [] }
})
class TodoState {

    @Action(TODOS_DATA)
    todosData(state, { payload }) {
        return updateObject(state, payload)
    }
    @Action(LOAD_TODOS)
    loadTodos(state) {
        return updateObject(state, { message: 'loading todos....', data: [] })
    }

    @Effect()
    dataLoadingEffect(action$) {
        return action$.pipe(
            ofType(LOAD_TODOS),
            mergeMap(() => ajax
                .get('https://jsonplaceholder.typicode.com/todos?_limit=5')
                .pipe(
                    map(data => {
                        return { type: TODOS_DATA, payload: { message: '', data: data.response } };
                    })
                )),
            //startWith({ type: TODOS_DATA, payload: { message: 'loading todos...', data: [] } })

        );
    }

}
export default TodoState;