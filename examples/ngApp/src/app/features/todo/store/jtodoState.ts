import {
  //State,
  BaseState,
  Action,
  Store,
} from "ajwah-angular-store";
import {
  TODOS_DATA,
  ADD_TODO,
  UPDATE_TODO,
  REMOVE_TODO,
  LOAD_TODOS,
} from "../../../store/actions";
import { updateObject } from "../../../store/util";
import { map, mergeMap, withLatestFrom, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { JTodoService } from "../services/jtodoService";
import { ITodoState } from "../../../store/model";
import { Injectable } from "@angular/core";
import { TodoModule } from "../todo.module";

interface Todo {
  message: string;
  data: any[];
}

@Injectable()
export class JTodoState implements BaseState<Todo> {
  constructor(private todoService: JTodoService, private store$: Store) {
    // console.log('DDD', todoService, action, store);
  }

  stateName: string = "jtodo";
  initState: Todo = { message: "", data: [] };
  async *mapActionToState(
    state: Todo,
    action: Action<any>
  ): AsyncGenerator<Todo> {
    console.log(action.type + ".........");

    switch (action.type) {
      case LOAD_TODOS:
        yield { message: " - loading todos....", data: [] };
        var data: any = await this.todoService.getTodos().toPromise();
        yield {
          message: "",
          data,
        };

        break;

      default:
        yield state;
        break;
    }
  }
  /*
  //@Action(ADD_TODO)
  addTodo(state) {
    return updateObject(state, { message: " - Adding a new todo..." });
  }
  //effectForAddTodo(action$: Actions) {
  // return mapState(action$, this.store$.select('jtodo'), this.addHandler.bind(this));
  //}
  // @Action(ADD_TODO)
  *addHandler(state: any, action) {
    yield mapState({ ...state, message: " - Adding a new todo..." });
    const newTodo: any = yield this.todoService
      .addTodo(action.payload)
      .toPromise();
    state.completed = false;
    //const payload = { message: '', data: [newTodo, ...state.data] };
    yield mapState(
      { ...state, message: "", data: [newTodo, ...state.data] },
      "addTodoSuccess"
    );
  }

  //@Action(UPDATE_TODO)
  updateTodo(state, { payload }) {
    return updateObject(state, {
      message: `- '${payload.title}' todo is updaeing...`,
    });
  }

  @Effect()
  updateTodoEffect() {
    return this.action$.pipe(
      ofType(UPDATE_TODO),
      withLatestFrom(this.store$.select<ITodoState>("jtodo")),
      mergeMap(([action, todo]) =>
        this.todoService.updateTodo(action.payload).pipe(
          map((res: any) => {
            const index = todo.data.findIndex(
              (item) => item.id === action.payload.id
            );
            todo.data.splice(index, 1, res);
            const payload = { message: "", data: [...todo.data] };
            return { type: TODOS_DATA, payload };
          }),
          catchError((err) =>
            of({ type: TODOS_DATA, payload: { message: err.message } })
          )
        )
      )
    );
  }

  //@Action(REMOVE_TODO)
  removeTodo(state, { payload }) {
    return updateObject(state, {
      message: `- '${payload.title}' todo is removing...`,
    });
  }

  @Effect()
  removeTodoEffect() {
    return this.action$.pipe(
      ofType(REMOVE_TODO),
      withLatestFrom(this.store$.select<ITodoState>("jtodo")),
      mergeMap(([action, todo]) =>
        this.todoService.deleteTodo(action.payload.id).pipe(
          map((res) => {
            const payload = {
              message: "",
              data: todo.data.filter((item) => item.id !== action.payload.id),
            };
            return { type: TODOS_DATA, payload };
          })
        )
      )
    );
  }
  */
}
