import React from 'react';
import { getStore } from "ajwah-react-store";
import { ADD_TODO } from '../states/actions'

function addItem(e) {
  e.preventDefault();
  const newTodo = {
    title: e.target.elements.title.value,
    completed: false
  }
  getStore().dispatch({ type: ADD_TODO, payload: newTodo });
  e.target.elements.title.value = '';
}

function addTodo(props) {
  return <div>
    <form onSubmit={addItem}>
      <input type="text" v-model="title" name="title" placeholder="Add Todo..." />
      <input type="submit" value="Submit" className="btn" />
    </form>
  </div>

}
export default addTodo;
