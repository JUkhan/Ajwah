# ajwah-devtools

### Ajwah devTools for react, angular, vue, preact

### React, Preact
```js
import { devTools } from 'ajwah-react-devtools';
setStoreContext({
    states: [CounterSate, TutorialState],
    effects: [CounterEffect],
    devTools: devTools({ maxAge: 8 })
});

```

### Angular
```js
import { devTools } from 'ajwah-react-devtools';

AjwahStoreModule.bootstrap({
      states: [counterState],
      effects: [CounterEffect],
      devTools: devTools({maxAge: 8})
    })

```


### Vue
```js
import { devTools } from 'ajwah-react-devtools';

Vue.use(AjwahStore, {
  states: [counterState, tutorialState, todoState],
  effects: [CounterEffect],
  devTools: devTools({ name: 'vue devTools' })
})

```

