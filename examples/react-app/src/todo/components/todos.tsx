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
        render={({ data }) => <Toolbar {...data} />} />

      <StreamBuilder
        //filter={data => data && data.length > 0}
        initialData={[]}
        stream={Get(TodoStateController).todos$}
        render={({ data }) => {

          return data.map(todo => (
            //<div key={todo.id}>{todo.description}</div>
            <TodoItem controller={Get(TodoStateController)} todo={todo} key={todo.id} />
          ))
        }} />

      <ErrorMessage />

    </div>

  );
};
