import React, { PureComponent } from "react";
import { dispatch, select } from "ajwah-store";
import { filter } from "rxjs/operators";
import { Connect } from "react-ajwah";

class CounterComponent extends PureComponent {
  constructor() {
    super();
    Connect(
      {
        counter: select((state) => state.counter).pipe(
          filter((it) => it?.count > 15)
        ),
      },
      this
    );
  }
  render() {
    console.log(this.state, "--------------");
    const { counter } = this.state;

    return (
      <div>
        <button onClick={() => dispatch("Inc")}>+</button>
        <button onClick={() => dispatch("Dec")}>-</button>
        <button onClick={() => dispatch("AsyncInc")}>async(+)</button>
        <span>{counter?.msg || counter?.count}</span>
      </div>
    );
  }
}

export default CounterComponent;
