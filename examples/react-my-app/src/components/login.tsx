import React from "react";
import { 
  RxForm, 
  Field, 
  required, 
  email, 
  Submit 
} from "ajwah-reactive-form";

function submitForm(data:any) {
  console.log(data);
}

export default () => (
  <RxForm
    onSubmit={submitForm}
    render={({ observer, handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Field
          name="email"
          autoFocus
          observer={observer}
          validators={[
            required("Please input you email address"),
            email("Not a valid email address")
          ]}
          render={({ setRef, setValue, error }) => (
            <div>
              <input
                placeholder="email"
                type="text"
                ref={setRef}
                onChange={e => setValue(e.target.value)}
              />
              <div className="error">{error}</div>
            </div>
          )}
        />

        <Field
          name="password"
          observer={observer}
          validators={[required("Please input your password")]}
          render={({ setValue, error }) => (
            <div>
              <input
                placeholder="password"
                type="password"
                onChange={e => setValue(e.target.value)}
              />
              <div className="error">{error}</div>
            </div>
          )}
        />

        <div>
          <Submit
            observer={observer}
            render={valid => <button disabled={!valid} type="submit">Submit</button>}
          />
        </div>
      </form>
    )}
  />
);
