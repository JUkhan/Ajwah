import React from "react";
import Loading from "./loading";
import AddTodo from "./addTodo";
import Toolbar from "./toolbar";
import TodoItem from "./todoItem";
import Errors from "./error";
import { TodoStateController } from "../services/todoStateController";
import { RxState, StreamBuilder } from 'ajwah-reactive-form';
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import { merge, combineLatest } from "rxjs";
import { withLatestFrom } from "rxjs/operators";


export default () => {

  return (
    <RxState
      stateController={TodoStateController}
      render={(controller) => {
        console.log('RxState')
        return <div className="bg-white rounded shadow p-6 m-4">
          <Loading controller={controller} />
          <AddTodo controller={controller} />

          <StreamBuilder
            stream={combineLatest([controller.activeItem$, controller.searchCategory$], (activeItem, sc) => ({ activeItem, sc }))}
            render={data => <Toolbar {...data} />} />

          <StreamBuilder
            initialData={controller.state.todos}
            filter={(data) => data.length > 0}
            stream={controller.todos$}
            render={(todos) => {
              console.log('stream-builder', todos.length)
              return todos.map(todo => (
                <TodoItem controller={controller} todo={todo} key={todo.id} />
              ))
            }} />
          <Errors controller={controller} />

        </div>
      }} />
  );
};
