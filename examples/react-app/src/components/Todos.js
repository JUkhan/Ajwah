import React from 'react';
import TodoItem from './TodoItem'

function todos(props) {
  const { todos = [] } = props;
  return <div>
    {todos.map(todo => <TodoItem key={todo.title + todo.id} todo={todo} />)}
  </div>
}

export default todos;