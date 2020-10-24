import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import store from "../states/store";
import { TodoActions } from '../models/todo';
import { useStream } from "../states/useStream";
import { addEnd$ } from '../services/todoService';

function submit(form: any) {
    store.dispatch(TodoActions.addTodo, { completed: false, ...form });
}
export default () => {
    const { register, handleSubmit, setValue } = useForm();
    const addEnd = useStream(addEnd$, { type: '' });

    useEffect(() => {
        setValue('description', '');
    }, [addEnd]);

    return <form onSubmit={handleSubmit(submit)} className="mb-4">
        <h1 className="text-grey-darkest">Todo List</h1>
        <div className="flex mt-4">
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                type="text"
                ref={register}
                name="description"
                placeholder="What needs to be done?"
            />
        </div>
    </form>
}