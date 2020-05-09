# Ajwah

Rx based store library for React, Vue, Angular, Preact. Manage your application's states, effects, and actions easy way. It's easy to use in functional components with React hooks.

### Installation

```sh
>> npm i ajwah-store
>> npm i react-ajwah
>> npm i ajwah-devtools
```

### Example

### counterReducer

```javascript
export async function* mapActionToState(
  state = { count: 10, msg: "" },
  action
) {
  switch (action.type) {
    case "Inc":
      yield { count: state.count + 1, msg: "" };
      break;
    case "Dec":
      yield { count: state.count - 1, msg: "" };
      break;
    case "AsyncInc":
      yield { count: state.count, msg: " loading..." };
      const count = await getData(state.count);
      yield { msg: "", count };
      break;
    default:
      yield state;
  }
}

function getData(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num + Math.floor(Math.random() * 15));
    }, 1000);
  });
}
```

### counterComponent

```js
import Reacts from "react";
import { dispatch } from "ajwah-store";
import { useStreamByStateNames } from "react-ajwah";

function counterComponent() {
  const { counter } = useStreamByStateNames("counter");

  return (
    <div>
      <button onClick={() => dispatch(Inc)}>+</button>
      <button onClick={() => dispatch(Dec)}>-</button>
      <button onClick={() => dispatch(AsyncInc)}>async(+)</button>
      {counter?.msg || counter?.count}
    </div>
  );
}

export default counterComponent;
```

### APP.js

```js
import React from "react";
import "./App.css";
import { devTools } from "ajwah-devtools";
import { counterReducer } from "./counterReducer";

import {
  createStore,
  dispatch,
  addState,
  removeState,
  importState,
  exportState,
  select,
} from "ajwah-store";

import CounterCom from "./counterCom";

exportState().subscribe(console.log);

createStore({
  reducers: [["counter", counterReducer]],
  devTools: devTools({ name: "dev-tool" }),
});

function App() {
  return (
    <div className="App">
      <div>
        <button onClick={() => addState("counter", mapActionToState)}>
          Add State
        </button>
        <button onClick={() => removeState("counter")}>Remove State</button>
        <button
          onClick={() => importState({ counter: { msg: "", count: 555 } })}
        >
          Import State
        </button>
      </div>

      <div>
        <CounterCom />
      </div>
    </div>
  );
}

export default App;
```

[React Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/react#ajwah)

[Vue Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/vue#ajwah)

[Angular Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/angular#ajwah)
