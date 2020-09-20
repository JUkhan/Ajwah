import React, { Component } from "react";
import Counter from "./components/Counter";
import Export from "./components/Export";
import StateOnDemand from "./components/StateOnDemand";
import "./index.css";
import { devTools } from "ajwah-devtools";
import store from "./states/storeService";
import registerCounterState from "./states/counterState";
registerCounterState();
devTools({ store, name: "Hi devtools" });
function App() {
  return (
    <div>
      <StateOnDemand />
      <Counter />
      <p>Export State</p>
      <Export />
    </div>
  );
}

export default App;
