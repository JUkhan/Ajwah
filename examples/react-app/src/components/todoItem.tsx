import React, { useState, useEffect } from 'react';
import { Todo } from '../models/todo';
import { useForm } from 'react-hook-form';
import store from '../states/store';
import { TodoActions } from '../models/todo';
import { useStream } from "../states/useStream";

export interface Props {
    todo: Todo
}

function updateTodo(todo: Todo) {
    store.dispatch(TodoActions.updateTodo, todo);
}
function removeTodo(id: number) {
    store.dispatch(TodoActions.removeTodo, id);
}

const TodoItem: React.FC<Props> = ({ todo }) => {
    const { register, handleSubmit } = useForm();
    const [isDblclick, setState] = useState(false);
    const updated = useStream(store.actions.whereType(TodoActions.updateEnd), { type: '' });

    useEffect(() => {
        setState(false);
    }, [updated]);

    function submit(form: any) {
        updateTodo({ ...todo, ...form });
    }
    return <div className="flex bg-white border p-2 justify-between">
        <div>
            <input
                className="align-middle mr-1"
                type="checkbox"
                defaultChecked={todo.completed}
                onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })}
            />
            {isDblclick ?
                <form className="inline-block" onSubmit={handleSubmit(submit)}>
                    <input
                        className="ml-1 pl-2 border"
                        onBlur={() => setState(false)}
                        defaultValue={todo.description}
                        type="text"
                        name="description"
                        ref={register}
                        autoFocus
                    />
                </form> :
                <span
                    style={{ cursor: 'pointer' }}
                    onDoubleClick={() => setState(true)}
                >
                    {todo.description}
                </span>
            }
        </div>
        <div>
            <button
                className="text-red-200 hover:text-red-600"
                onClick={() => removeTodo(todo.id)}>
                Remove
      </button>
        </div>
    </div>
}
export default TodoItem;