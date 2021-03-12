import React from "react";
import {
  RxForm,
  Field,
  required,
  email,
  pattern,
  Validator
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
          render={({ setRef, setValue, error, hasError }) => (
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
          validators={[
            required("Please input your password"),
            pattern(
              /[a-z]{3}/,
              "Password should be English alphbet a-z and min three charecters."
            )
          ]}
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

        <Field
          name="cpassword"
          observer={observer}
          validators={[
            required("Please input your confirm password"),
            passwordEquality("Two passwords that you enter is inconsistent!")
          ]}
          render={({ setValue, error }) => (
            <div>
              <input
                placeholder="confirm password"
                type="password"
                onChange={e => setValue(e.target.value)}
              />
              <div className="error">{error}</div>
            </div>
          )}
        />

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    )}
  />
);

function passwordEquality(message: string): Validator {
  return ({ value, values, emitError }) => {
    if (value !== values.password) emitError(message);
    else emitError("");
  };
}
