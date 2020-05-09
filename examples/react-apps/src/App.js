import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { devTools } from "ajwah-devtools";
import { mapActionToState } from "./counterReducer";
import { createStore, dispatch, select } from "test-store";
import { useSubscription, useSubscription2 } from "./useSubscription";

createStore({
  reducers: [["counter", mapActionToState]],
  devTools: devTools({ name: "jasim" }),
});
function App() {
  const { counter = { mag: "", count: 0 } } = useSubscription2({
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
          <button onClick={() => dispatch("Inc")}>+</button>
          <button onClick={() => dispatch("Dec")}>-</button>
          <button onClick={() => dispatch("AsyncInc")}>async(+)</button>
          {counter.msg || counter.count}
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
