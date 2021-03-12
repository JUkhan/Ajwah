import React, { FC } from "react";
import { RxForm, Field, dispatch, FormStateController, Get } from "ajwah-reactive-form";

import { take } from "rxjs/operators";
import { TodoStateController } from "../services/todoStateController";

const addItem = () => {

  function submit(form: any, observer?: FormStateController) {
    dispatch('addTodo', { completed: false, ...form });
    Get(TodoStateController).added$.pipe(take(1)).subscribe(res => {
      observer?.reset()
    })
  }

  return (
    <RxForm onSubmit={submit} render={({ observer, handleSubmit }) =>
      <form onSubmit={handleSubmit} className="mb-4">
        <h1 className="text-grey-darkest">Todo List</h1>
        <div className="flex mt-4">
          <Field name="description"
            onChange={(arg) => console.log(arg)}
            autoFocus
            observer={observer}
            render={({ value, setValue, setRef }) =>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                type="text"
                ref={setRef}
                value={value}
                onChange={e => setValue(e.currentTarget.value)}
                placeholder="What needs to be done?"
              />} />
        </div>
      </form>

    } />)
}

export default addItem;