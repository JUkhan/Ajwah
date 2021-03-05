import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RxForm, Field, required, email, Validator, dispatch } from "ajwah-reactive-form";
import { actionType } from "../models";



export function Register() {
  function handleSubmit(values: any) {
    dispatch(actionType.Register, values);
  }

  return (
    <RxForm
      onSubmit={handleSubmit}
      render={({ handleSubmit, observer }) => (
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <Field
              name="name"
              autoFocus
              observer={observer}
              validators={[required("User name is required")]}
              render={({ setRef, setValue, error }) => (
                <div className="p-field">
                  <InputText
                    ref={setRef}
                    onChange={(e: any) => setValue(e.target.value)}
                    placeholder="User Name"
                    type="text"
                  />
                  <small className="p-error">{error}</small>
                </div>
              )}
            />
            <Field
              name="email"
              observer={observer}
              validators={[
                required("email is required"),
                email("Not a valid email")
              ]}
              render={({ setValue, error }) => (
                <div className="p-field">
                  <InputText
                    onChange={(e: any) => setValue(e.target.value)}
                    placeholder="Email"
                    name="email"
                    type="text"
                  />
                  <small className="p-error">{error}</small>
                </div>
              )}
            />
            <Field
              name="password"
              observer={observer}
              validators={[required("password is required")]}
              render={({ setValue, error }) => (
                <div className="p-field">
                  <InputText
                    onChange={(e: any) => setValue(e.target.value)}
                    placeholder="Password"
                    type="password"
                  />
                  <small className="p-error">{error}</small>
                </div>
              )}
            />
            <Field
              name="cpassword"
              observer={observer}
              validators={[
                required("Confirm password is required"),
                passwordEquality(
                  "Two passwords that you enter is inconsistent!"
                )
              ]}
              render={({ setValue, error }) => (
                <div className="p-field">
                  <InputText
                    onChange={(e: any) => setValue(e.target.value)}
                    placeholder="Confirm Password"
                    type="password"
                  />
                  <small className="p-error">{error}</small>
                </div>
              )}
            />
            <Button label="Create New Account" type="submit" />
          </div>
        </form>
      )}
    />
  );
}
function passwordEquality(message: string): Validator {
  return ({ value, values, emitError }) => {
    if (value !== values.password) emitError(message);
    else emitError();
  };
}
