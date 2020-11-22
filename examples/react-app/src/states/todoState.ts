import { map } from 'rxjs/operators';
import { Action } from 'ajwah-store';
import { Observable } from 'rxjs';
import store from "./store";
import { addTodo, getTodos, removeTodo, updateTodo } from '../api/todoApi';
import { SearchCategory, TodoActions, TodoState, Todo } from '../models/todo';


store.registerState<TodoState>({
    stateName: 'todos',
    initialState: { todos: [], searchCategory: SearchCategory.all },
    mapActionToState: (state, action, emit) => {
        switch (action.type) {
            case TodoActions.loadEnd:
                emit({ ...state, todos: action.payload });
                break;
            case TodoActions.loadtodos:
                callApi<Todo[]>(getTodos(), apiRes => ({ type: TodoActions.loadEnd, payload: apiRes }));
                break;
            case TodoActions.addEnd:
                emit({ ...state, todos: [action.payload, ...state.todos] });
                break;
            case TodoActions.addTodo:
                callApi<Todo>(addTodo(action.payload), apiRes => ({ type: TodoActions.addEnd, payload: apiRes }));
                break;
            case TodoActions.updateEnd:
                emit({
                    ...state, todos: state.todos.reduce((acc: Todo[], todo) => {
                        acc.push(todo.id === action.payload.id ? action.payload : todo);
                        return acc;
                    }, [])
                });
                break;
            case TodoActions.updateTodo:
                callApi<Todo>(updateTodo(action.payload), apiRes => ({ type: TodoActions.updateEnd, payload: apiRes }));
                break;
            case TodoActions.removeEnd:
                emit({ ...state, todos: state.todos.filter(todo => todo.id !== action.payload) });
                break;
            case TodoActions.removeTodo:
                callApi<number>(removeTodo(action.payload), apiRes => ({ type: TodoActions.removeEnd, payload: apiRes }));
                break;
            case TodoActions.searchCategory:
                emit({ ...state, searchCategory: action.payload });
                break;
            case TodoActions.refresh: console.log('refresh...');
                emit({ ...state, todos: [...state.todos] });
                break;
        }
    }
});

function callApi<T>(stream: Observable<T>, mapCallback: (data: T) => Action): void {
    stream.pipe(map(mapCallback)).subscribe(
        action => store.dispatch(action),
        err => store.dispatch({ type: TodoActions.error, payload: err }),
        () => console.info('done')
    );
}

