import {
  pluck,
  map,
  exhaustMap,
  repeat,
  takeUntil,
  endWith,
  delay,
  mapTo,
} from "rxjs/operators";
import {
  StateController,
  Action,
  action$,
  dispatch,
} from "ajwah-reactive-form";
import { addTodo, getTodos, removeTodo, updateTodo } from "../api/todoApi";
import { merge, Observable } from "rxjs";
import { tween } from "./rxAnimationService";
import { TodoState, SearchCategory, Todo, TodoActions } from "../models/todo";

export class TodoStateController extends StateController<TodoState> {
  constructor() {
    super(" todo", { todos: [], searchCategory: SearchCategory.all });
  }

  onInit() {
    this.loadTodos();
  }
  get todos$() {
    return this.stream$.pipe(
      map((state) => {
        switch (state.searchCategory) {
          case SearchCategory.active:
            return state.todos.filter((todo) => !todo.completed);
          case SearchCategory.completed:
            return state.todos.filter((todo) => todo.completed);
          default:
            return state.todos;
        }
      })
    );
  }
  get searchCategory$() {
    return this.stream$.pipe(pluck("searchCategory"));
  }
  get activeItem$() {
    return this.stream$.pipe(
      pluck("todos"),
      map((arr) => arr.filter((todo) => !todo.completed)),
      map((arr) => `${arr.length} items left`)
    );
  }

  get rotate$() {
    const start$ = action$.whereType(TodoActions.SPINNING_START);
    const end$ = action$.whereType(TodoActions.SPINNING_END);
    const error$ = action$.whereType(TodoActions.TODOS_ERROR);
    return start$.pipe(
      exhaustMap(() =>
        tween(0, 365, 500).pipe(
          repeat(),
          takeUntil(merge(end$, error$)),
          endWith(0)
        )
      )
    );
  }

  get error$(): Observable<string> {
    const error$ = action$.whereType(TodoActions.TODOS_ERROR);
    return merge(
      error$.pipe(pluck("payload")),
      error$.pipe(delay(2000), mapTo(""))
    );
  }
  get updated$() {
    const updated$ = action$.whereType(TodoActions.TODOS_UPDATED);
    return updated$.pipe(mapTo(true));
  }
  get added$() {
    const added$ = action$.whereType(TodoActions.TODOS_ADDED);
    return added$.pipe(mapTo(true));
  }
  searchCategory(state: TodoState, action: Action<SearchCategory>) {
    this.emit({ searchCategory: action.payload });
  }

  loadTodos() {
    this.callApi(getTodos(), (todos) => {
      this.emit({ todos });
    });
  }

  addTodo(state: TodoState, action: Action<Todo>) {
    this.callApi(addTodo(action.payload), (todo) => {
      this.emit({ todos: [...this.state.todos, todo] });
      dispatch(TodoActions.TODOS_ADDED);
    });
  }

  updateTodo(state: TodoState, action: Action<Todo>) {
    this.callApi(updateTodo(action.payload), (updatedtodo) => {
      this.emit({
        todos: this.state.todos.reduce((acc: Todo[], todo) => {
          acc.push(todo.id === updatedtodo.id ? updatedtodo : todo);
          return acc;
        }, []),
      });
      dispatch(TodoActions.TODOS_UPDATED);
    });
  }
  removeTodo(state: TodoState, action: Action<Todo>) {
    this.callApi(removeTodo(action.payload?.id ?? 0), (id) => {
      this.emit({
        todos: this.state.todos.filter((t) => t.id !== id),
      });
    });
  }

  private callApi<T>(
    stream: Observable<T>,
    resCallback: (data: T) => void
  ): void {
    dispatch(TodoActions.SPINNING_START);
    stream.subscribe(
      (res) => {
        resCallback(res);
        dispatch(TodoActions.SPINNING_END);
      },
      (errors) => dispatch(TodoActions.TODOS_ERROR, errors.message),
      () => console.info("done")
    );
  }
}
