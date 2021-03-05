import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RxForm, Field, Submit, required, email, dispatch } from "ajwah-reactive-form";
import { actionType } from "../models";



function submitForm(values: any) {
  dispatch(actionType.Login, values);
}

export function Login() {
  return (
    <RxForm
      onSubmit={submitForm}
      render={({ handleSubmit, observer }) => (
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            <Field
              name="email"
              autoFocus
              observer={observer}
              validators={[
                required("Email is required"),
                email("Not a valid email")
              ]}
              render={({ setRef, setValue, error }) => (
                <div className="p-field">
                  <InputText
                    ref={setRef}
                    onChange={(e: any) => setValue(e.target.value)}
                    placeholder="Email"
                    type="text"
                  />
                  <small className="p-error">{error}</small>
                </div>
              )}
            />
            <Field
              name="password"
              observer={observer}
              validators={[required("Password is required")]}
              render={({ value, setValue, error }) => (
                <div className="p-field">
                  <InputText
                    type="password"
                    placeholder="Password"
                    onChange={(e: any) => setValue(e.target.value)}
                  />
                  <small className="p-error">{error}</small>
                </div>
              )}
            />
            <Submit
              observer={observer}
              render={valid => (
                <Button disabled={!valid} label="Submt" type="submit" />
              )}
            />
          </div>
        </form>
      )}
    />
  );
}
