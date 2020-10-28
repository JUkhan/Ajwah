import { Observable } from 'rxjs';
import { pluck, map, exhaustMap, repeat, takeUntil, endWith, delay, startWith, mergeAll, tap } from 'rxjs/operators';
import store from '../states/store';
import { tween } from './rxAnimationService';
import { TodoState, SearchCategory, TodoActions } from '../models/todo';
import { merge } from 'rxjs';


const todos$ = store.select<TodoState>('todos').pipe(
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
const searchCategory$ = store.select<TodoState>('todos').pipe(pluck('searchCategory'));
const activeItem$ = store.select<TodoState>('todos').pipe(
    pluck('todos'),
    map(arr => arr.filter(todo => !todo.completed)),
    map(arr => `${arr.length} items left`),
);


const start$ = store.actions.whereTypes([
    TodoActions.loadtodos, TodoActions.addTodo,
    TodoActions.updateTodo, TodoActions.removeTodo]);
const end$ = store.actions.whereTypes([
    TodoActions.loadEnd, TodoActions.addEnd,
    TodoActions.updateEnd, TodoActions.removeEnd]);

const _error$ = store.actions.whereType(TodoActions.error);

const errorEnd$ = _error$.pipe(
    delay(5 * 1000)
);

const stopLoading$ = merge(end$, _error$);

const rotate$ = start$.pipe(
    exhaustMap(() => tween(0, 365, 500).pipe(
        repeat(),
        takeUntil(stopLoading$),
        endWith(0)
    ))
);


const error$ = merge([
    _error$.pipe(
        map((action) => action.payload.toString())
    ),
    errorEnd$.pipe(
        map(_ => '')
    )
]).pipe(
    mergeAll()
);

const addEnd$ = store.actions.whereType(TodoActions.addEnd);
export { todos$, searchCategory$, activeItem$, rotate$, TodoActions, SearchCategory, addEnd$, error$ };