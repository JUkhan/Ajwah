import React from "react";
import Loading from "./loading";
import AddTodo from "./addTodo";
import Toolbar from "./toolbar";
import TodoItem from "./todoItem";
import ErrorMessage from "./error";
import { TodoStateController } from "../services/todoStateController";
import { Get, StreamBuilder } from 'ajwah-reactive-form';
import { combineLatest } from "rxjs"



export default () => {

  return (
    <div className="bg-white rounded shadow p-6 m-4">
      <Loading />
      <AddTodo />

      <StreamBuilder

        //initialData={{ activeItem: '', sc: 0 }}
        stream={combineLatest(Get(TodoStateController).activeItem$, Get(TodoStateController).searchCategory$, (activeItem, sc) => ({ activeItem, sc }))}
        render={data => <Toolbar {...data} />} />

      <StreamBuilder
        stream={Get(TodoStateController).todos$}
        render={(todos) => {
          console.log('stream-builder', todos.length)
          return todos.map(todo => (
            <TodoItem controller={Get(TodoStateController)} todo={todo} key={todo.id} />
          ))
        }} />

      <ErrorMessage />

    </div>

  );
};
