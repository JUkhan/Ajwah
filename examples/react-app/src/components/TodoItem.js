import React from 'react';
import { dispatch } from "ajwah-store";
import { REMOVE_TODO, UPDATE_TODO } from '../states/actions'

function updateTodo(todo, e) {
  todo.completed = e.target.checked;
  dispatch({ type: UPDATE_TODO, payload: todo })
}

function removeTodo(todo) {

  dispatch(REMOVE_TODO, todo)
}

function todoItem(props) {
  const { todo } = props;
  return <div className={`todo-item ${todo.completed || 'is-complete'}`} >
    <p>
      <input checked={todo.completed} type="checkbox" onChange={(e) => updateTodo(todo, e)} />
      <span className="item-text">{todo.title}</span>
      <button onClick={() => removeTodo(todo)} className="del">x</button>
    </p>
  </div>
}

export default todoItem;