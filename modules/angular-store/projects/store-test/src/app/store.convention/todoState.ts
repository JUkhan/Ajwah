
import { Actions, Store } from 'ajwah-angular-store';
import { TODOS_DATA } from './actions';
import { updateObject } from './util';
import { map, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { of } from 'rxjs'
import { TodoService } from '../services/todoService';
import { Injectable } from '@angular/core';

@Injectable()
export class TodoState {

    name = 'todo';
    initialState = { message: '', data: [] };

    constructor(private todoService: TodoService) { }

    actionTodosData(state, { payload }) {
        return updateObject(state, payload)
    }


    actionLoadTodos(state) {
        return updateObject(state, { message: ' - loading todos....', data: [] })
    }


    effectForLoadTodos(actions: Actions) {
        return actions.pipe(
            mergeMap(() => this.todoService.getTodos()
                .pipe(
                    map(data => ({ type: TODOS_DATA, payload: { message: '', data } }))
                )),
        );
    }


    actionAddTodo(state) {
        return updateObject(state, { message: ' - Adding a new todo...' })
    }

    effectForAddTodo(actions: Actions, store: Store) {
        return actions.pipe(
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

    actionUpdateTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is updaeing...` })
    }

    effectForUpdateTodo(actions: Actions, store: Store) {
        return actions.pipe(
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

    actionRemoveTodo(state, { payload }) {
        return updateObject(state, { message: `- '${payload.title}' todo is removing...` })
    }

    effectForRemoveTodo(actions: Actions, store: Store) {
        return actions.pipe(
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
