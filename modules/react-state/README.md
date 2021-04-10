## react-mono-state

[counterApp](https://stackblitz.com/edit/react-mono-state?file=index.tsx)

### counterState

```tsx
import { RegisterState } from "react-mono-state";

export const counterState: RegisterState = {
  stateName: "counter",
  initialState: { loading: false, count: 0 },
  async mapActionToState(state, action, emit) {
    switch (action.type) {
      case "inc":
        emit({ loading: false, count: state.count + 1 });
        break;
      case "dec":
        emit({ loading: false, count: state.count - 1 });
        break;
      case "asyncInc":
        emit({ loading: true, count: state.count });
        await delay(1000);
        emit({ loading: false, count: state.count + 1 });
        break;
    }
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

### counterComponent

```tsx
import { useStore, dispatch } from "react-mono-state";

export default () => {
  const counter = useStore((s) => s.counter);
  return (
    <div>
      <button onClick={(e) => dispatch("inc")}>+</button>
      <button onClick={(e) => dispatch("asyncInc")}>Async(+)</button>
      <button onClick={(e) => dispatch("dec")}>-</button>
      <span>{counter.loading ? "loading..." : counter.count}</span>
    </div>
  );
};
```

### app.ts

```tsx
import React from "react";
import { Provider, createStore } from "react-mono-state";
import { counterState } from "../states/counterState";

import "../styles/globals.css";

export const store = createStore([counterState]);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
```
