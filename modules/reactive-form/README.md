## Ajwah Reactive Form

You can also see [Ajwah-store](https://www.npmjs.com/package/ajwah-store) - A reactive state management library. Manage your application's states, effects, and actions easy way. Make apps more scalable with a unidirectional data-flow.

[Demo](https://stackblitz.com/edit/react-reactive-form?file=index.tsx)

**Install**

```sh
npm i ajwah-reactive-form
```

**React**

```tsx
import React from "react";
import {
  RxForm,
  Field,
  required,
  email,
  pattern,
  Validator,
} from "ajwah-reactive-form";

function submitForm(data) {
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
            required("Please input your email address"),
            email("Not a valid email address"),
          ]}
          render={({ setRef, setValue, error, hasError }) => (
            <div>
              <input
                placeholder="email"
                type="text"
                ref={setRef}
                onChange={(e) => setValue(e.target.value)}
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
            ),
          ]}
          render={({ setValue, error }) => (
            <div>
              <input
                placeholder="password"
                type="password"
                onChange={(e) => setValue(e.target.value)}
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
            passwordEquality("Two passwords that you enter is inconsistent!"),
          ]}
          render={({ setValue, error }) => (
            <div>
              <input
                placeholder="confirm password"
                type="password"
                onChange={(e) => setValue(e.target.value)}
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
```

**React Native**

```ts
import React from "react";
import { Text, View, TextInput, Button } from "react-native";
import { RxForm, Field, Submit, required, email } from "ajwah-reactive-form";

function login(values) {
  alert(JSON.stringify(values));
}

const YourApp = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <RxForm
        render={({ observer, handleSubmit }) => (
          <View>
            <Field
              name="email"
              debounce
              autoFocus
              validators={[
                required("Email is required!"),
                email("Not a valid email address"),
              ]}
              observer={observer}
              render={({ setRef, setValue, value, error }) => (
                <View>
                  <TextInput
                    ref={setRef}
                    defaultValue={value}
                    onChangeText={(text) => setValue(text)}
                    style={{ height: 40, padding: 4 }}
                    placeholder="Email"
                  />
                  <Text style={{ color: "red" }}>{error}</Text>
                </View>
              )}
            />
            <Field
              name="password"
              debounce
              validators={[required("Password name is required!")]}
              observer={observer}
              render={({ setRef, setValue, value, error }) => (
                <View>
                  <TextInput
                    defaultValue={value}
                    onChangeText={(text) => setValue(text)}
                    style={{ height: 40, padding: 4 }}
                    placeholder="Password"
                  />
                  <Text style={{ color: "red" }}>{error}</Text>
                </View>
              )}
            />
            <View style={{ marginTop: 12 }}>
              <Submit
                observer={observer}
                render={(valid, state) => (
                  <Button
                    disabled={!valid}
                    onPress={() => login(observer.state)}
                    title="Login"
                  />
                )}
              />
            </View>
          </View>
        )}
      />

      <Text>Awesome! 🎉</Text>
    </View>
  );
};

export default YourApp;
```

**Cascading `Field`**

#### Example of a cascading DropdownList. Selecting department loading categories.

```tsx
import React from "react";
import { RxForm, Field, required, FiledChange } from "ajwah-reactive-form";

const departments = [
  { name: "Regional", id: 1 },
  { name: "Nature", id: 2 },
  { name: "Seasonal", id: 3 },
];

function departmentChange(args: FiledChange) {
  const { observer, value } = args;
  observer.notify("cat", { loading: true });
  getCategories(value).then((data) => {
    console.log(data);
    observer.notify("cat", { loading: false, value: "", data });
  });
}

function onSubmit(values: any) {
  console.log(values);
}

export default () => {
  return (
    <RxForm
      onSubmit={onSubmit}
      consumeState={(state) => console.log("state: ", state)}
      consumeErrors={(errors) => console.log("errors: ", errors)}
      initialValues={{ dept: "1" }}
      render={({ handleSubmit, observer }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="dept"
            onChange={departmentChange}
            observer={observer}
            validators={[required("Select department")]}
            render={({ value, setValue, error, flag, setFlag }) => (
              <div onBlur={() => setFlag(true)}>
                <select
                  value={value}
                  onChange={(e) => setValue(e.currentTarget.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.name}
                    </option>
                  ))}
                </select>
                <div className="error">{flag && error}</div>
              </div>
            )}
          />
          <Field
            name="cat"
            observer={observer}
            validators={[required("Select Category")]}
            render={({
              value,
              setValue,
              error,
              loading,
              data,
              flag,
              setFlag,
            }) => (
              <div onBlur={() => setFlag(true)}>
                <select
                  value={value}
                  onChange={(e) => setValue(e.currentTarget.value)}
                >
                  <option value="">Select Category</option>
                  {data.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.name}
                    </option>
                  ))}
                </select>
                <div className="error">{flag && error}</div>
                {loading && <span className="error">loading...</span>}
              </div>
            )}
          />

          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={(e) => observer.reset()}>
              Reset
            </button>
          </div>
        </form>
      )}
    />
  );
};

function getCategories(deptid: any): Promise<any[]> {
  let data: any[] = [];
  switch (+deptid) {
    case 1:
      data = [
        { name: "French", id: 1 },
        { name: "Italian", id: 2 },
        { name: "Irish", id: 3 },
      ];
      break;

    case 2:
      data = [
        { name: "Animal", id: 3 },
        { name: "Flower", id: 4 },
      ];
      break;
    case 3:
      data = [
        { name: "Eid ul Fitr ", id: 5 },
        { name: "Eid ul Adha", id: 6 },
      ];
      break;
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 1000);
  });
}
```

**Grouping Form**

```tsx
import React from "react";
import {
  RxForm,
  Field,
  required,
  email,
  Submit,
  Group,
} from "ajwah-reactive-form";

function submitForm(data: any) {
  console.log(data);
}

export const GroupingForm = () => (
  <RxForm
    consumeState={(e) => console.log(e)}
    consumeErrors={(e) => console.log(e)}
    onSubmit={submitForm}
    render={({ observer, handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Field
          name="email"
          debounce
          observer={observer}
          validators={[
            required("Please input you email address"),
            email("Not a valid email address"),
          ]}
          render={({ setRef, setValue, error }) => (
            <div>
              <input
                placeholder="email"
                type="text"
                ref={setRef}
                onChange={(e) => setValue(e.target.value)}
              />
              <div className="error">{error}</div>
            </div>
          )}
        />
        <fieldset>
          <legend>Billing Address:</legend>
          <Group name="billingAddress">
            <Field
              name="firstName"
              debounce
              observer={observer}
              validators={[required("Please input your first name")]}
              render={({ setValue, error }) => (
                <div>
                  <input
                    placeholder="First Name"
                    type="text"
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <div className="error">{error}</div>
                </div>
              )}
            />
            <Field
              name="lastName"
              observer={observer}
              validators={[required("Please input your last name")]}
              render={({ setValue, error }) => (
                <div>
                  <input
                    placeholder="Last Name"
                    type="text"
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <div className="error">{error}</div>
                </div>
              )}
            />
            <Field
              name="phoneNumber"
              observer={observer}
              validators={[required("Please input your phone number")]}
              render={({ setValue, error }) => (
                <div>
                  <input
                    placeholder="Phone Number"
                    type="text"
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <div className="error">{error}</div>
                </div>
              )}
            />
          </Group>
        </fieldset>
        <Field
          name="isBillingAsDelivery"
          onChange={({ value }) =>
            typeof value === "boolean" && observer.validate()
          }
          observer={observer}
          render={({ value, setValue }) => (
            <React.Fragment>
              <label>
                <input
                  onChange={(e) => setValue(e.currentTarget.checked)}
                  type="checkbox"
                />
                My billing information is the same as my delivery information
              </label>

              <fieldset disabled={value}>
                <legend>Delivery Address:</legend>
                <Group name="deliveryAddress">
                  <Field
                    name="firstName"
                    observer={observer}
                    validators={(state) =>
                      value ? [] : [required("Please input your first name")]
                    }
                    render={({ setValue, error }) => (
                      <div>
                        <input
                          placeholder="First Name"
                          type="text"
                          onChange={(e) => setValue(e.target.value)}
                        />
                        <div className="error">{error}</div>
                      </div>
                    )}
                  />
                  <Field
                    name="lastName"
                    observer={observer}
                    validators={(state) =>
                      value ? [] : [required("Please input your last name")]
                    }
                    render={({ setValue, error }) => (
                      <div>
                        <input
                          placeholder="Last Name"
                          type="text"
                          onChange={(e) => setValue(e.target.value)}
                        />
                        <div className="error">{error}</div>
                      </div>
                    )}
                  />
                  <Field
                    name="phoneNumber"
                    observer={observer}
                    validators={(state) =>
                      value ? [] : [required("Please input your phone number")]
                    }
                    render={({ setValue, error }) => (
                      <div>
                        <input
                          placeholder="Phone Number"
                          type="text"
                          onChange={(e) => setValue(e.target.value)}
                        />
                        <div className="error">{error}</div>
                      </div>
                    )}
                  />
                </Group>
              </fieldset>
            </React.Fragment>
          )}
        />
        <div>
          <Submit
            observer={observer}
            render={(valid) => (
              <button disabled={!valid} type="submit">
                Submit
              </button>
            )}
          />
        </div>
      </form>
    )}
  />
);
```

**Action Dispatching**

```tsx
import React from "react";
import { RxForm, Field } from "ajwah-reactive-form";
import { PubSub } from "./pubsub";

export const Msn = () => (
  <RxForm
    render={({ observer, handleSubmit }) => (
      <div className="msg-send">
        <Field
          name="msn1"
          observer={observer}
          render={({ setRef, setValue, hasError }) => (
            <PubSub userName="Abdulla" controller={observer} />
          )}
        />
        <Field
          name="msn2"
          observer={observer}
          render={({ setRef, setValue, hasError }) => (
            <PubSub userName="Abdur Rahman" controller={observer} />
          )}
        />
      </div>
    )}
  />
);
```

```tsx
import React, { FC, useEffect, useState } from "react";
import { pluck } from "rxjs/operators";

import {
  FormStateController,
  RxForm,
  Field,
  required,
} from "ajwah-reactive-form";

export interface Message {
  name: string;
  message: string;
}
export interface Props {
  userName: string;
  controller: FormStateController;
}
export const PubSub: FC<Props> = ({ userName, controller }) => {
  const [messages, setMessage] = useState<Message[]>([]);
  useEffect(() => {
    const sub = controller.action$
      .whereType("message")
      .pipe(pluck("payload"))
      .subscribe((msg) => {
        setMessage((arr) => [msg, ...arr]);
      });
    return () => sub.unsubscribe();
  }, []);

  function sendMessage(state: Message, observer?: FormStateController) {
    controller.dispatch("message", { name: userName, message: state.message });
    observer?.reset();
  }

  return (
    <div className="msn">
      <div className="content">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="message"
          >{`${msg.name}: ${msg.message}`}</div>
        ))}
      </div>
      <RxForm
        onSubmit={sendMessage}
        render={({ observer, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="msg-send">
              <Field
                name="message"
                validators={[required("Please input your message")]}
                autoFocus
                observer={observer}
                render={({ value, setValue, hasError }) => (
                  <input
                    className={hasError ? "hasError" : ""}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.currentTarget.value)}
                  />
                )}
              />
              <button type="submit">Send</button>
            </div>
          </form>
        )}
      />
    </div>
  );
};
```

**Api**

```ts
export type RxFormProps = {
  initialValues?: any;
  onSubmit?: (values: any) => void;
  render: (args: FormRender) => any;
  consumeErrors?: (errors: any) => void;
  consumeState?: (errors: any) => void;
};
type FieldRender = {
  value: any;
  hasError: boolean;
  error: string;
  flag: boolean;
  setFlag: (value: boolean) => void;
  setValue: (value: any) => void;
  loading: boolean;
  setRef: (element: any) => void;
  data: any;
};

export interface FieldProps {
  name: string;
  observer: FormStateController;
  render: (args: FieldRender) => any;
  validators?: Validator[];
  debounce?: boolean;
  autoFocus?: boolean;
  onChange?: (args: FiledChange) => void;
}

export class RxForm {
  hasError(callback: (hasError: boolean, error?: any) => void): void;
  get isValid(): boolean;
  validate(): void;
  setState(state: any): void;
}
export class FormStateController {
  get state(): any;
  get errorState(): any;
  get state$(): Observable<any>;
  select(fieldName: string): Observable<any>;
  emit(fieldName: string, value: any): void;
  emitError(key: string, value: any): void;
  selectError(fieldName: string): Observable<any>;
  get hasError$(): Observable<boolean>;
  isUndefined(fieldName: string): boolean;
  setState(state: ObserverState): void;
  errorMap: Map<string, boolean>;
  get isValid(): boolean;
  notify(
    fieldName: string,
    args?: {
      value?: any;
      error?: string;
      hasError?: boolean;
      flag?: boolean;
      loading?: boolean;
      data?: any;
    }
  ): void;
  reset(): void;
  validate(): void;
  dispatch<V extends Action = Action>(actionName: V): void;
  dispatch(actionName: string): void;
  dispatch(actionName: symbol): void;
  dispatch(actionName: string, payload?: any): void;
  complete(): void;
}
```
