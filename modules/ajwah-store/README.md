# Ajwah Store

A reactive state management library. Manage your application's states, effects, and actions easy way. Make apps more scalable with a unidirectional data-flow.

 [Angular Demo](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ts-cb9zfa?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-store?file=src%2FApp.vue) 

### Installation for (angular/react/vue/others)

```sh
>> npm i ajwah-store
>> npm i ajwah-devtools [optional]
```

Declare your store as a global variable.

```dart
const store = new AjwahStore();
```

Now register states as much as you want and consume them where ever you want in your app.

```ts
//register [counter] state
store.registerState<number>({
    stateName: 'counter',
    initialState: 0,
    mapActionToState: (state, action, emit)=> {
      switch (action.type) {
        case 'inc':
          emit(state + 1);
          break;
        case 'dec':
          emit(state - 1);
          break;
        default:
      }
    },
});

  //consuming
  store.select('counter').subscribe(console.log); // 0,1,0,1

  //dispatching actions
  store.dispatch('inc');
  store.dispatch('dec');
  store.dispatch('inc');
```

You can easily filter out actions using the optional `filterActions:(action)=>bool` param of `registerState` method.

For filtering out the `dec` action from the `counter` state:

```ts
//register [counter] state
store.registerState<number>({
    stateName: 'counter',
    initialState: 0,
    filterActions: (action) => action.type != 'dec',
    mapActionToState: (state, action, emit)=> {
      switch (action.type) {
        case 'inc':
          emit(state + 1);
          break;
        case 'dec':
          emit(state - 1);
          break;
        default:
      }
    },
});

  //consuming
  store.select('counter').subscribe(console.log); // 0,1,2

  //dispatching actions
  store.dispatch('inc');
  store.dispatch('dec');
  store.dispatch('inc');

```

Now `dec` action is useless. Let's add an `effect` on `dec` action:

```ts
store.registerEffect('effect-key',
      (action$, store) =>
          action$.whereType('dec')
          .map((event) => ({type: 'inc'}))
      );

```

Here we are capturing the `dec` action using `whereType` and then map the action as an `inc` action

```ts
//register [counter] state
store.registerState<number>({
    stateName: 'counter',
    initialState: 0,
    filterActions: (action) => action.type != 'dec',
    mapActionToState: (state, action, emit)=> {
      switch (action.type) {
        case 'inc':
          emit(state + 1);
          break;
        case 'dec':
          emit(state - 1);
          break;
        default:
      }
    },
});

  //consuming
  store.select('counter').subscribe(console.log); // 0,1,2,3

  //effect on dec action - so that it works as inc
  store.registerEffect('effect-key',
      (action$, store) =>
          action$.whereType('dec').map((event) => ({type: 'inc'}))
  );

  //dispatching actions
  store.dispatch('inc');
  store.dispatch('dec');
  store.dispatch('inc');

```

If you want to log all the action and state changed - just use the `exportState()` function. Call this function just after your `createStore()` function.

```ts
const store = new AjwahStore();
store.exportState().subscribe(console.log);
```

output looks like:

```sh
[{type: '@@INIT'}, {counter: 0}]
[{type: 'registerState(counter)'}, {counter: 0}]
0
[{type: 'registerEffect(test)'}, {counter: 0}]
[{type: 'inc'}, {counter: 1}]
1
[{type: 'dec'}, {counter: 1}]
[{type: 'inc'}, {counter: 2}]
2
[{type: 'inc'}, {counter: 3}]
3
```

You can import state also:

```ts
store.importState({ counter: 100 });
```

We have covered the basic of ajwah_bloc. Now we see:

- how to combine multiple states and make a single stream?

Using `select(callback)` function we can easily combine multiple states and retuen single stream data.

Suppose we have two states:

- `todo`
- `search-category`

Now we want to consume these two states together. So that we get the latest filtered result on `todo` as well as `search-category` states.

```ts
function getFilteredTodos(): Observable<Todo[]> {
  return store.select((state) => {
    const todos = state.todo as Todo[];
    switch (state["search-category"]) {
      case TodoActionTypes.active:
        return todos.filter((todo) => !todo.completed);
      case TodoActionTypes.completed:
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  });
}
```
