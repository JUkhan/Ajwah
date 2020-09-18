import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { devTools } from "ajwah-devtools";
import { mapActionToState } from "./counterReducer";
//import { filter } from "rxjs/operators";
import { AjwahStore } from "ajwah-store";
import { useStreamBySelect } from "react-ajwah";
import { take } from "rxjs/operators";
//import { from } from "rxjs";
import CounterCom from "./counterCom";
//exportState().subscribe(console.log);
var store = new AjwahStore();
//exportState().subscribe(console.log);
store.registerState(
  "counter",
  { count: 10, msg: "" },
  async (state, action, emit) => {
    switch (action.type) {
      case "Inc":
        emit({ count: state.count + 1, msg: "" });
        break;
      case "Dec":
        emit({ count: state.count - 1, msg: "" });
        break;
      case "AsyncInc":
        emit({ count: state.count, msg: " loading..." });
        const count = await getData(state.count);
        emit({ msg: "", count });
        break;
    }
  }
);
store
  .select("counter")
  .pipe(take(2))
  .subscribe((d) => console.log("-----", d));
store.dispatch("Inc");
function getData(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num + Math.floor(Math.random() * 15));
    }, 1000);
  });
}
function App() {
  const { counter = { mag: "", count: 0 } } = useStreamBySelect({
    counter: store.select("counter"),
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <button onClick={() => {}}>Add State</button>
          <button onClick={() => store.unregisterState("counter")}>
            Remove State
          </button>
          <button
            onClick={() =>
              store.importState({ counter: { count: 999, msg: "" } })
            }
          >
            Import State
          </button>
        </div>
        <div>
          <button onClick={() => store.dispatch("Inc")}>+</button>
          <button onClick={() => store.dispatch("Dec")}>-</button>
          <button onClick={() => store.dispatch("AsyncInc")}>async(+)</button>
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
