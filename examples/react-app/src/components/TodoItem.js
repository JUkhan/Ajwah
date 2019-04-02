import React from 'react';
import { getStore } from "ajwah-react-store";
import { REMOVE_TODO, UPDATE_TODO } from '../states/actions'

function updateTodo(todo, e) {
  todo.completed = e.target.checked;
  getStore().dispatch({ type: UPDATE_TODO, payload: todo })
}

function removeTodo(todo) {
  getStore().dispatch({ type: REMOVE_TODO, payload: todo })
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