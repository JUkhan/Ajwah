import { pluck, map, exhaustMap, repeat, takeUntil, endWith } from 'rxjs/operators';
import store from '../states/store';
import { tween } from './rxAnimationService';

const TodoActions = {
    loadtodos: 'todos-loadtodo',
    loadEnd: 'todos-loaded',
    addTodo: 'todos-add',
    addEnd: 'todos-added',
    updateTodo: 'todos-update',
    updateEnd: 'todos-update-end',
    removeTodo: 'todos-remove',
    removeEnd: 'todos-remove-end',
    searchCategory: 'todos-search-category'
};

const SearchCategory = {
    all: 1, active: 2, completed: 3
}

const todos$ = store.select('todos').pipe(
    map(state => {
        switch (state.searchCategory) {
            case SearchCategory.active:
                return state.todos.filter(todo => !todo.completed);
            case SearchCategory.completed:
                return state.todos.filter(todo => todo.completed);
            default:
                return state.todos;
        }
    })
);
const searchCategory$ = store.select('todos').pipe(pluck('searchCategory'));
const activeItem$ = store.select('todos').pipe(
    pluck('todos'),
    map(arr => arr.filter(todo => !todo.completed)),
    map(arr => `${arr.length} items left`),
);


const start$ = store.actions.whereTypes(
    TodoActions.loadtodos, TodoActions.addTodo,
    TodoActions.updateTodo, TodoActions.removeTodo);
const end$ = store.actions.whereTypes(
    TodoActions.loadEnd, TodoActions.addEnd,
    TodoActions.updateEnd, TodoActions.removeEnd);

const rotate$ = start$.pipe(
    exhaustMap(() => tween(0, 365, 500).pipe(
        repeat(),
        takeUntil(end$),
        endWith(0)
    )),
);
const addEnd$ = store.actions.whereType(TodoActions.addEnd);
export { todos$, searchCategory$, activeItem$, rotate$, TodoActions, SearchCategory, addEnd$ };