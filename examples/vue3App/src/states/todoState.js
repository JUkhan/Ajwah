import store from "./store";
import { addTodo, getTodos, removeTodo, updateTodo } from '../api/todoApi';
import { SearchCategory, TodoActions } from '../services/todoService';

store.registerState({
    stateName: 'todos',
    initialState: { todos: [], searchCategory: SearchCategory.all },
    mapActionToState: (state, action, emit) => {
        switch (action.type) {
            case TodoActions.loadEnd:
                emit({ ...state, todos: action.payload });
                break;
            case TodoActions.loadtodos:
                getTodos().subscribe(res => store.dispatch(TodoActions.loadEnd, res));
                break;
            case TodoActions.addEnd:
                emit({ ...state, todos: [action.payload, ...state.todos] });
                break;
            case TodoActions.addTodo:
                addTodo(action.payload).subscribe(res => store.dispatch(TodoActions.addEnd, res));
                break;
            case TodoActions.updateEnd:
                emit({
                    ...state, todos: state.todos.reduce((acc, todo) => {
                        acc.push(todo.id === action.payload.id ? action.payload : todo);
                        return acc;
                    }, [])
                });
                break;
            case TodoActions.updateTodo:
                updateTodo(action.payload).subscribe(res => store.dispatch(TodoActions.updateEnd, res));
                break;
            case TodoActions.removeEnd:
                emit({ ...state, todos: state.todos.filter(todo => todo.id !== action.payload) });
                break;
            case TodoActions.removeTodo:
                removeTodo(action.payload).subscribe(res => store.dispatch(TodoActions.removeEnd, res));
                break;
            case TodoActions.searchCategory:
                emit({ ...state, searchCategory: action.payload });
                break;
        }
    }
});