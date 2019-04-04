
import { State, Action, Effect, ofType } from 'ajwah-react-store';
import { TODOS_DATA, ADD_TODO, UPDATE_TODO, REMOVE_TODO, LOAD_TODOS } from './actions';
import { updateObject } from '../utli';
import { map, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { ajax } from "rxjs/ajax";
import { of } from 'rxjs'


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
        return updateObject(state, { message: ' - loading todos....', data: [] })
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
        );
    }

    @Action(ADD_TODO)
    addTodo(state) {
        return updateObject(state, { message: ' - Adding a new todo...' })
    }

    @Effect()
    addTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(ADD_TODO),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.post('https://jsonplaceholder.typicode.com/todos', action.payload)
                .pipe(
                    map(data => data.response),
                    map(newTodo => {
                        newTodo.completed = false;
                        const payload = { message: '', data: [newTodo, ...todo.data] };
                        return { type: TODOS_DATA, payload };
                    })
                )
            )
        )
    }

    @Action(UPDATE_TODO)
    updateTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is updaeing...` })
    }

    @Effect()
    updateTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(UPDATE_TODO),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.put(`https://jsonplaceholder.typicode.com/todos/${action.payload.id}`, action.payload)
                .pipe(
                    map(data => data.response),
                    map(res => {
                        res.completed = res.completed === 'true' ? true : false
                        const index = todo.data.findIndex(item => item.id === action.payload.id);
                        todo.data.splice(index, 1, res);
                        const payload = { message: '', data: [...todo.data] }
                        return { type: TODOS_DATA, payload }
                    }),
                    catchError(err => of({ type: TODOS_DATA, payload: { message: err.message } }))
                )
            )
        )
    }

    @Action(REMOVE_TODO)
    removeTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is removing...` })
    }

    @Effect()
    removeTodoEffect(action$, store$) {
        return action$.pipe(
            ofType(REMOVE_TODO),
            withLatestFrom(store$.select('todo')),
            mergeMap(([action, todo]) => ajax.delete(`https://jsonplaceholder.typicode.com/todos/${action.payload.id}`)
                .pipe(
                    map(data => data.response),
                    map(res => {
                        const payload = { message: '', data: todo.data.filter(item => item.id !== action.payload.id) }
                        return { type: TODOS_DATA, payload }
                    })
                )
            )
        )
    }

}
export default TodoState;