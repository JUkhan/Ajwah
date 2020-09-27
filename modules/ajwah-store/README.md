# Ajwah Store

A reactive state management library. Manage your application's states, effects, and actions easy way. Make apps more scalable with a unidirectional data-flow.

[React Demo](https://stackblitz.com/edit/react-ts-cb9zfa?file=index.tsx) | [Vue Demo](https://codesandbox.io/s/42ql8y5x) | [Angular Demo](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2FcounterState.ts)

### Installation for (angular/react/vue/others)

```sh
>> npm i ajwah-store
>> npm i react-ajwah  [optiona]
>> npm i ajwah-devtools [optional]
```

Declare your store as a global variable.

```js
const store = new AjwahStore();
```

Now register states as much as you want and consume them where ever you want in your app.

```ts
const store = new AjwahStore();

store.registerState<number>({
  stateName: "counter",
  initialState: 0,
  mapActionToState: (state, action, emit) => {
    if (action.type === "inc") {
      emit(state + 1);
    }
  },
});

store.select("counter").subscribe(console.log); // 0, 1
store.dispatch({ type: "inc" });
```
