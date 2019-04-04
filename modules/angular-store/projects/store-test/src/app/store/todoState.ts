
import { State, Action, Effect, ofType, Actions, Store } from 'ajwah-angular-store';
import { TODOS_DATA, ADD_TODO, UPDATE_TODO, REMOVE_TODO, LOAD_TODOS } from './actions';
import { updateObject } from './util';
import { map, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { of } from 'rxjs'
import { TodoService } from '../services/todoService';


@State({
    name: 'todo',
    initialState: { message: '', data: [] }
})
export class TodoState {

    constructor(private todoService: TodoService) { }

    @Action(TODOS_DATA)
    todosData(state, { payload }) {
        return updateObject(state, payload)
    }

    @Action(LOAD_TODOS)
    loadTodos(state) {
        return updateObject(state, { message: ' - loading todos....', data: [] })
    }

    @Effect()
    dataLoadingEffect(actions: Actions) {
        return actions.pipe(
            ofType(LOAD_TODOS),
            mergeMap(() => this.todoService.getTodos()
                .pipe(
                    map(data => ({ type: TODOS_DATA, payload: { message: '', data } }))
                )),
        );
    }


    @Action(ADD_TODO)
    addTodo(state) {
        return updateObject(state, { message: ' - Adding a new todo...' })
    }

    @Effect()
    addTodoEffect(actions: Actions, store: Store) {
        return actions.pipe(
            ofType(ADD_TODO),
            withLatestFrom(store.select('todo')),
            mergeMap(([action, todo]) => this.todoService.addTodo(action.payload)
                .pipe(
                    map((newTodo: any) => {
                        newTodo.completed = false;
                        const payload = { message: '', data: [newTodo, ...todo.data] };
                        return { type: TODOS_DATA, payload };
                    })
                )
            )
        );
    }


    @Action(UPDATE_TODO)
    updateTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is updaeing...` })
    }

    @Effect()
    updateTodoEffect(actions: Actions, store: Store) {
        return actions.pipe(
            ofType(UPDATE_TODO),
            withLatestFrom(store.select('todo')),
            mergeMap(([action, todo]) => this.todoService.updateTodo(action.payload)
                .pipe(
                    map((res: any) => {
                        const index = todo.data.findIndex(item => item.id === action.payload.id);
                        todo.data.splice(index, 1, res);
                        const payload = { message: '', data: [...todo.data] }
                        return { type: TODOS_DATA, payload }
                    }),
                    catchError(err => of({ type: TODOS_DATA, payload: { message: err.message } }))
                )
            )
        );
    }


    @Action(REMOVE_TODO)
    removeTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is removing...` })
    }

    @Effect()
    removeTodoEffect(actions: Actions, store: Store) {
        return actions.pipe(
            ofType(REMOVE_TODO),
            withLatestFrom(store.select('todo')),
            mergeMap(([action, todo]) => this.todoService.deleteTodo(action.payload.id)
                .pipe(
                    map(res => {
                        const payload = { message: '', data: todo.data.filter(item => item.id !== action.payload.id) }
                        return { type: TODOS_DATA, payload }
                    })
                )
            )
        );
    }


}
