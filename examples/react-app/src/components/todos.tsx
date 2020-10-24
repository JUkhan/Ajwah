import React from 'react';
import Loading from './loading';
import AddTodo from './addTodo';
import Toolbar from './toolbar';
import TodoItem from './todoItem';
import '../states/todoState';
import { useStream } from '../states/useStream';
import { todos$ } from '../services/todoService';
import store from '../states/store';
import { TodoActions } from '../models/todo';

store.dispatch(TodoActions.loadtodos);

export default () => {
    const todos = useStream(todos$, []);
    return <div className="bg-white rounded shadow p-6 m-4">
        <Loading></Loading>
        <AddTodo></AddTodo>
        <Toolbar></Toolbar>
        {todos.map(todo => <TodoItem todo={todo} key={todo.id}></TodoItem>)}
    </div>
}