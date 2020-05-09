# React-Ajwah

React bindings for ajwah

### Installation

```sh
>> npm install react-ajwah

```

### API

```javascript
Connect(
  mapState: { [key: string]: Observable<any> },
  component?: any
)

useStreamByStateNames(...states: string[])

useStreamBySelect(states: { [key: string]: Observable<any> })

```

### Connect() for class component( you can use as a decoretor/normal function ). Here `counter` key should be set as a state prop and component should be updated automatecally whenever corrresponding store updated.

```js
import { select } from "ajwah-store";

@Connect({
  counter: select("counter"),
})
class CounterComponent extends PureComponent {}

class CounterComponent extends PureComponent {
  constructor() {
    //either like a normal function - do not forget to pass the second param this
    Connect({ counter: select((state) => state.counter) }, this);
  }
}
```

### `CounterComponent - Example using connect as a decoretor`

```js
import React, { PureComponent } from "react";
import { dispatch, select } from "ajwah-store";
import { Connect } from "react-ajwah";
import { Inc, AsyncInc, Dec } from "./actions";

@Connect({
  counter: select((state) => state.counter),
})
class CounterComponent extends PureComponent {
  render() {
    const { counter } = this.state;

    return (
      <div>
        <button onClick={() => dispatch(Inc)}>+</button>
        <button onClick={() => dispatch(Dec)}>-</button>
        <button onClick={() => dispatch(AsyncInc)}>async(+)</button>
        <span>{counter.msg || counter.count}</span>
      </div>
    );
  }
}

export default CounterComponent;
```

### `CounterComponent - Example using connect as a normal function

```js
import React, { PureComponent } from "react";
import { dispatch, select } from "test-store";
import { Connect } from "test-react-ajwah";
import { Inc, AsyncInc, Dec } from "./actions";

class CounterComponent extends PureComponent {
  constructor() {
    super();
    Connect({ counter: select((state) => state.counter) }, this);
  }
  render() {
    const { counter } = this.state;

    return (
      <div>
        <button onClick={() => dispatch(Inc)}>+</button>
        <button onClick={() => dispatch(Dec)}>-</button>
        <button onClick={() => dispatch(AsyncInc)}>async(+)</button>
        <span>{counter?.msg || counter?.count}</span>
      </div>
    );
  }
}

export default CounterComponent;
```

### `Connect decorator/function` takes a single object literal type param (key value pairs). Key should be any name and value should be an Observable<state> type that is part of your application's state. You can define as many pairs as you want. All keys and its corresponding states should be available in your component state. Your component should be re-render if any key corresponding state is updated from anywhere in the application.

### useStreamByStateNames() / useStreamBySelect() for functional component

```js
import React from "react";
import { dispatch } from "ajwah-store";
import { useStreamByStateNames } from "react-ajwah";
import { Inc, Dec, AsyncInc } from "./actions";

function fxCounterComponent() {
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

export default fxCounterComponent;
```

[React Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/react#ajwah)

[Vue Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/vue#ajwah)

[Angular Doc](https://github.com/JUkhan/Ajwah/tree/master/docs/angular#ajwah)
