import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { devTools } from "ajwah-devtools";
import { mapActionToState } from "./counterReducer";
//import { filter } from "rxjs/operators";
import {
  createStore,
  dispatch,
  addState,
  removeState,
  importState,
  exportState,
  select,
} from "ajwah-store";
import { useStreamByStateNames, useStreamBySelect } from "react-ajwah";
//import { from } from "rxjs";
import CounterCom from "./counterCom";
exportState().subscribe(console.log);
createStore({
  reducers: [["counter", mapActionToState]],
  devTools: devTools({ name: "jasim" }),
});
function App() {
  const { counter = { mag: "", count: 0 } } = useStreamBySelect({
    counter: select("counter"),
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
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
          <button onClick={() => dispatch("Inc")}>+</button>
          <button onClick={() => dispatch("Dec")}>-</button>
          <button onClick={() => dispatch("AsyncInc")}>async(+)</button>
          {counter.msg || counter.count}
        </div>
        <div>
          <CounterCom />
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
